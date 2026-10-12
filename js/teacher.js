(function () {
  "use strict";
  const config = window.SUPABASE_CONFIG;
  const $ = (id) => document.getElementById(id);
  const missionNames = { vokal: "Huruf Vokal", kv: "Suku Kata KV", kvk: "Perkataan KVK", padan: "Padan Gambar", susun: "Susun Huruf", ayat: "Ayat Mudah" };
  let results = [];
  let classes = [];
  let refreshTimer;

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
      startRefreshing();
    } catch (error) { $("loginMessage").textContent = error.message; }
  }

  async function loadResults() {
    [results, classes] = await Promise.all([
      request("/rest/v1/results?select=student_name,class_name,mission_id,score,total,stars,created_at&order=created_at.desc&limit=1000"),
      request("/rest/v1/classes?select=name&order=name")
    ]);
    $("loginPanel").classList.add("hidden");
    $("dashboardPanel").classList.remove("hidden");
    renderClasses();
    render();
    $("refreshStatus").textContent = `✅ Markah dikemas kini pada ${new Date().toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" })}. Auto-segar setiap 15 saat.`;
  }

  function startRefreshing() {
    window.clearInterval(refreshTimer);
    refreshTimer = window.setInterval(() => loadResults().catch(() => { $("refreshStatus").textContent = "⚠️ Gagal menyegar. Semak sambungan internet."; }), 15000);
  }

  function renderClasses() {
    const names = classes.map(({ name }) => name);
    $("classList").innerHTML = names.length ? names.map((name) => `<span class="class-chip">🏫 ${escapeHtml(name)}</span>`).join("") : "<span>Belum ada kelas. Tambah kelas pertama di atas.</span>";
    const filterNames = [...new Set([...names, ...results.map((row) => row.class_name)])].sort((a, b) => a.localeCompare(b, "ms"));
    const selected = $("classFilter").value;
    $("classFilter").innerHTML = `<option value="">Semua kelas</option>${filterNames.map((name) => `<option>${escapeHtml(name)}</option>`).join("")}`;
    $("classFilter").value = selected;
  }

  async function addClass(event) {
    event.preventDefault();
    const name = $("newClass").value.trim().slice(0, 30);
    if (!name) {
      $("classMessage").textContent = "Masukkan nama kelas dahulu.";
      return;
    }
    if (classes.some((entry) => entry.name.toLowerCase() === name.toLowerCase())) {
      $("classMessage").textContent = "Kelas itu sudah ada.";
      return;
    }
    $("classMessage").textContent = "Menambah kelas…";
    try {
      const added = await request("/rest/v1/classes", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ name }) });
      classes.push(added[0]);
      classes.sort((a, b) => a.name.localeCompare(b.name, "ms"));
      $("newClass").value = "";
      $("classMessage").textContent = `✅ ${name} sudah tersedia untuk murid.`;
      renderClasses();
    } catch (error) { $("classMessage").textContent = error.message; }
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
  $("classForm").addEventListener("submit", addClass);
  $("classFilter").addEventListener("change", render);
  $("nameFilter").addEventListener("input", render);
  $("refreshResults").addEventListener("click", () => { $("refreshStatus").textContent = "Menyegarkan markah…"; loadResults().catch((error) => { $("refreshStatus").textContent = error.message; }); });
  $("logout").addEventListener("click", () => { sessionStorage.removeItem("teacherToken"); location.reload(); });
  if (sessionStorage.getItem("teacherToken")) loadResults().then(startRefreshing).catch(() => sessionStorage.removeItem("teacherToken"));
}());
