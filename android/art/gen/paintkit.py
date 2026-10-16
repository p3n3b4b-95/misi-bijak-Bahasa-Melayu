"""Painterly SVG toolkit for the UI-01C artwork (original work for Misi Bijak).

Every illustration is plain SVG built from these helpers, so it stays editable and renders the same
in any SVG engine (we use headless Chromium, see tools/art/render.cjs). Techniques:

* form shading: a shape's own outline, shifted toward the light and blurred, masks a shadow tone
  (core shadow on the side away from the light) and a light tone (lit edge), giving soft volume;
* soft(): blurred shapes clipped to a part, for ambient occlusion, cast shadows and blush;
* grain filter: low-contrast fractal noise multiplied into the paint, plus a large-scale colour
  mottle, so flat areas read as painted rather than vector-flat;
* coloured line art (warm dark brown, not black) with round joins.

Light comes from the upper left throughout, so all assets share one lighting direction.
"""

LINE = "#4A2A1C"


class Art:
    def __init__(self, w, h, view=None, line=LINE):
        self.w, self.h = w, h
        self.view = view or f"0 0 {w} {h}"
        vx, vy, self.vw, self.vh = (float(v) for v in self.view.split())
        self.vw += max(vx, 0) + 10
        self.vh += max(vy, 0) + 10
        self.line = line
        self.defs = []
        self._n = 0
        self._blurs = {}

    def uid(self, prefix):
        self._n += 1
        return f"{prefix}{self._n}"

    def blur(self, std):
        if std not in self._blurs:
            fid = f"blur{str(std).replace('.', '_')}"
            self.defs.append(f'<filter id="{fid}" filterUnits="userSpaceOnUse" x="-3000" y="-3000" width="8000" height="8000">'
                             f'<feGaussianBlur stdDeviation="{std}"/></filter>')
            self._blurs[std] = fid
        return self._blurs[std]

    def grad(self, stops, x1=0, y1=0, x2=0, y2=1):
        gid = self.uid("g")
        s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' if not isinstance(c, tuple)
                    else f'<stop offset="{o}" stop-color="{c[0]}" stop-opacity="{c[1]}"/>' for o, c in stops)
        self.defs.append(f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{s}</linearGradient>')
        return f"url(#{gid})"

    def rgrad(self, stops, cx=0.5, cy=0.5, r=0.5, fx=None, fy=None):
        gid = self.uid("r")
        f = f' fx="{fx}" fy="{fy}"' if fx is not None else ""
        s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' if not isinstance(c, tuple)
                    else f'<stop offset="{o}" stop-color="{c[0]}" stop-opacity="{c[1]}"/>' for o, c in stops)
        self.defs.append(f'<radialGradient id="{gid}" cx="{cx}" cy="{cy}" r="{r}"{f}>{s}</radialGradient>')
        return f"url(#{gid})"

    def clip(self, d, transform=""):
        cid = self.uid("c")
        t = f' transform="{transform}"' if transform else ""
        self.defs.append(f'<clipPath id="{cid}"><path d="{d}"{t}/></clipPath>')
        return cid

    def grain(self, strength=0.16, freq=0.85, mottle=0.10, seed=4):
        """Filter id: fine grain plus a broad colour mottle, alpha preserved."""
        fid = self.uid("grain")
        lo = 1 - strength
        self.defs.append(
            f'<filter id="{fid}" filterUnits="userSpaceOnUse" x="0" y="0" width="{self.vw}" height="{self.vh}" color-interpolation-filters="sRGB">'
            f'<feTurbulence type="fractalNoise" baseFrequency="{freq}" numOctaves="2" seed="{seed}" result="n"/>'
            f'<feColorMatrix in="n" type="saturate" values="0" result="ng"/>'
            f'<feComponentTransfer in="ng" result="fine"><feFuncR type="linear" slope="{strength * 1.6}" intercept="{lo}"/>'
            f'<feFuncG type="linear" slope="{strength * 1.6}" intercept="{lo}"/><feFuncB type="linear" slope="{strength * 1.6}" intercept="{lo}"/>'
            f'<feFuncA type="discrete" tableValues="1"/></feComponentTransfer>'
            f'<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="{seed + 9}" result="m"/>'
            f'<feColorMatrix in="m" type="matrix" values="0 0 0 0 1  0 0 0 0 0.96  0 0 0 0 0.86  0 0 0 {mottle * 2.2} -{mottle * 0.6}" result="warm"/>'
            f'<feBlend in="SourceGraphic" in2="fine" mode="multiply" result="b"/>'
            f'<feComposite in="warm" in2="b" operator="atop" result="b2"/>'
            f'<feComposite in="b2" in2="SourceGraphic" operator="in"/></filter>')
        return fid

    # ---- drawing helpers -------------------------------------------------------------------

    def form(self, d, shade, light, dx=26, dy=22, blur=12, shade_op=0.55, light_op=0.55, transform=""):
        """Soft core shadow (bottom right) and lit edge (top left) inside the shape [d]."""
        t = f' transform="{transform}"' if transform else ""
        out = []
        for col, op, sx, sy in ((shade, shade_op, -dx, -dy), (light, light_op, dx, dy)):
            if not col:
                continue
            mid = self.uid("m")
            b = self.blur(blur)
            self.defs.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000">'
                             f'<path d="{d}" fill="#fff"{t}/>'
                             f'<g filter="url(#{b})"><path d="{d}" fill="#000" transform="translate({sx},{sy}) {transform}"/></g></mask>')
            out.append(f'<path d="{d}" fill="{col}" opacity="{op}" mask="url(#{mid})"{t}/>')
        return "".join(out)

    def shape(self, d, fill, shade=None, light=None, lw=6, line=None, dx=26, dy=22, blur=12,
              shade_op=0.55, light_op=0.55, extra="", transform=""):
        t = f' transform="{transform}"' if transform else ""
        ln = line or self.line
        body = f'<path d="{d}" fill="{fill}"{t}/>'
        body += self.form(d, shade, light, dx, dy, blur, shade_op, light_op, transform)
        body += extra
        if lw:
            body += f'<path d="{d}" fill="none" stroke="{ln}" stroke-width="{lw}" stroke-linejoin="round"{t}/>'
        return body

    def soft(self, d, color, opacity=0.5, blur=10, clip_d=None, extra_attr=""):
        """Blurred paint stroke, optionally clipped to a part (ambient occlusion, blush, glow)."""
        b = self.blur(blur)
        s = f'<g filter="url(#{b})"><path d="{d}" fill="{color}" opacity="{opacity}" {extra_attr}/></g>'
        if clip_d:
            s = f'<g clip-path="url(#{self.clip(clip_d)})">{s}</g>'
        return s

    def soft_line(self, d, color, width, opacity=0.5, blur=6, clip_d=None):
        b = self.blur(blur)
        s = (f'<g filter="url(#{b})"><path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" '
             f'stroke-linecap="round" opacity="{opacity}"/></g>')
        if clip_d:
            s = f'<g clip-path="url(#{self.clip(clip_d)})">{s}</g>'
        return s

    def limb(self, d, width, fill, shade=None, light=None, lw=6, blur=9):
        """A tube (arm, leg, tail) drawn as a thick round-capped stroke with soft form shading."""
        ln = self.line
        out = (f'<path d="{d}" fill="none" stroke="{ln}" stroke-width="{width + 2 * lw}" stroke-linecap="round" stroke-linejoin="round"/>'
               f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')
        for col, op, sx, sy in ((shade, 0.5, -width * 0.32, -width * 0.26), (light, 0.5, width * 0.32, width * 0.26)):
            if not col:
                continue
            mid = self.uid("m")
            b = self.blur(blur)
            self.defs.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000">'
                             f'<path d="{d}" fill="none" stroke="#fff" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
                             f'<g filter="url(#{b})"><path d="{d}" fill="none" stroke="#000" stroke-width="{width}" stroke-linecap="round" '
                             f'stroke-linejoin="round" transform="translate({sx:.1f},{sy:.1f})"/></g></mask>')
            out += (f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{width}" stroke-linecap="round" '
                    f'stroke-linejoin="round" opacity="{op}" mask="url(#{mid})"/>')
        return out

    def svg(self, body, grain=None):
        g = f'<g filter="url(#{grain})">{body}</g>' if grain else body
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="{self.view}">'
                f'<defs>{"".join(self.defs)}</defs>{g}</svg>\n')


def ellipse_d(cx, cy, rx, ry):
    return (f"M{cx - rx},{cy} a{rx},{ry} 0 1,0 {2 * rx},0 a{rx},{ry} 0 1,0 {-2 * rx},0 Z")


def circle_d(cx, cy, r):
    return ellipse_d(cx, cy, r, r)
