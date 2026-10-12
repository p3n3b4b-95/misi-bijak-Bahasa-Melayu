(function () {
  "use strict";
  const config = window.SUPABASE_CONFIG;
  const $ = (id) => document.getElementById(id);
  const missionNames = { vokal: "Huruf Vokal", kv: "Suku Kata KV", kvk: "Perkataan KVK", padan: "Padan Gambar", susun: "Susun Huruf", ayat: "Ayat Mudah" };
  let results = [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  }

  async function request(path, options = {}) {
    const token = sessionStorage.getItem("teacherToken");
    const response = await fetch(`${config.url}${path}`, { ...options, headers: { apikey: config.key, ...(token ? { Authorization: `Bearer ${token}` } : {}), "Content-Type": "application/json", ...options.headers } });
    const body = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(body?.msg || body?.message || "Permintaan gagal");
    return body;
  }

  async function login(event) {
    event.preventDefault();
    $("loginMessage").textContent = "Menyemak…";
    try {
      const session = await request("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: $("email").value, password: $("password").value }) });
      sessionStorage.setItem("teacherToken", session.access_token);
      await loadResults();
    } catch (error) { $("loginMessage").textContent = error.message; }
  }

  async function loadResults() {
    results = await request("/rest/v1/results?select=student_name,class_name,mission_id,score,total,stars,created_at&order=created_at.desc&limit=1000");
    $("loginPanel").classList.add("hidden");
    $("dashboardPanel").classList.remove("hidden");
    const classes = [...new Set(results.map((row) => row.class_name))].sort();
    $("classFilter").innerHTML = `<option value="">Semua kelas</option>${classes.map((name) => `<option>${escapeHtml(name)}</option>`).join("")}`;
    render();
  }

  function render() {
    const className = $("classFilter").value;
    const search = $("nameFilter").value.trim().toLowerCase();
    const filtered = results.filter((row) => (!className || row.class_name === className) && (!search || row.student_name.toLowerCase().includes(search)));
    $("studentCount").textContent = new Set(filtered.map((row) => `${row.class_name}\0${row.student_name}`)).size;
    $("attemptCount").textContent = filtered.length;
    $("averageScore").textContent = filtered.length ? `${Math.round(filtered.reduce((sum, row) => sum + row.score / row.total, 0) / filtered.length * 100)}%` : "0%";
    $("resultRows").innerHTML = filtered.map((row) => `<tr><td data-label="Tarikh">${new Date(row.created_at).toLocaleString("ms-MY")}</td><td data-label="Nama">${escapeHtml(row.student_name)}</td><td data-label="Kelas">${escapeHtml(row.class_name)}</td><td data-label="Misi"><span class="mission-tag">${missionNames[row.mission_id]}</span></td><td data-label="Markah"><strong>${row.score}/${row.total}</strong></td><td data-label="Bintang">${"⭐".repeat(row.stars)}${"☆".repeat(3-row.stars)}</td></tr>`).join("");
    $("emptyState").classList.toggle("hidden", Boolean(filtered.length));
  }

  $("loginForm").addEventListener("submit", login);
  $("classFilter").addEventListener("change", render);
  $("nameFilter").addEventListener("input", render);
  $("logout").addEventListener("click", () => { sessionStorage.removeItem("teacherToken"); location.reload(); });
  if (sessionStorage.getItem("teacherToken")) loadResults().catch(() => sessionStorage.removeItem("teacherToken"));
}());
