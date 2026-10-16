#!/usr/bin/env python3
"""UI-01C character illustrations: Amir (full body) and the orange-and-white cat.

Original artwork for Misi Bijak, built with paintkit.py. Run from the repository root:
    python3 android/art/gen/characters.py
Writes android/art/svg/amir_full.svg, cat_peek.svg and cat_paws.svg (paws overlay for the menu).
"""
from pathlib import Path
from paintkit import Art, ellipse_d, circle_d

OUT = Path(__file__).resolve().parents[1] / "svg"


# ---- Amir ------------------------------------------------------------------------------------

SKIN, SKIN_S, SKIN_L = "#F7C59C", "#DB8F68", "#FFE8D2"
SHIRT, SHIRT_S, SHIRT_L = "#FFC933", "#E9862A", "#FFF3A6"
BLUE, BLUE_S, BLUE_L = "#2F7BE0", "#173D93", "#86BEFF"
STRAP, STRAP_S, STRAP_L = "#1F58BE", "#0F2E73", "#5E9BF0"
SHORTS, SHORTS_S, SHORTS_L = "#2C3B6B", "#151D3A", "#5470AE"
SHOE, SHOE_S, SHOE_L = "#E5483C", "#A1271F", "#FF9A86"
CAP, CAP_S, CAP_L = "#3A3C48", "#121218", "#7E8196"
HAIR, HAIR_S, HAIR_L = "#262222", "#0B0909", "#5C6480"


def amir():
    a = Art(1000, 1400)
    grain = a.grain(strength=0.12, freq=0.9, mottle=0.08, seed=11)
    B = []

    # contact shadow on the path
    B.append(a.soft(ellipse_d(500, 1306, 230, 30), "#5B3A12", 0.35, 14))

    # backpack, behind the body: visible at both sides and above the shoulders
    pack = "M296,800 C292,754 330,728 382,726 L618,726 C670,728 708,754 704,800 L716,980 C716,1012 690,1024 650,1024 L350,1024 C310,1024 284,1012 284,980 Z"
    B.append(a.shape(pack, BLUE, BLUE_S, BLUE_L, dx=30, dy=24, blur=16))
    B.append(a.shape("M440,730 C440,692 462,676 500,676 C538,676 560,692 560,730", "none", lw=14))
    B.append('<path d="M440,730 C440,692 462,676 500,676 C538,676 560,692 560,730" fill="none" stroke="#2F7BE0" stroke-width="6"/>')

    # legs, socks and shoes
    for x0, x1 in ((428, 420), (572, 580)):
        B.append(a.limb(f"M{x0},1070 L{x1},1206", 68, SKIN, SKIN_S, SKIN_L))
        B.append(a.limb(f"M{x1},1196 L{x1 - 2 if x1 < 500 else x1 + 2},1236", 74, "#FFFFFF", "#B9C5DB", None))
    shoe_l = "M318,1266 C316,1224 362,1212 418,1214 C466,1216 484,1238 484,1266 C484,1294 452,1304 404,1304 C352,1304 320,1294 318,1266 Z"
    for d in (shoe_l, _mirror_x(shoe_l)):
        B.append(a.shape(d, SHOE, SHOE_S, SHOE_L, dx=18, dy=16, blur=9))
    for sole in ("M322,1276 C340,1290 380,1296 410,1296 C446,1296 474,1290 482,1276 C484,1296 456,1306 404,1306 C352,1306 324,1298 322,1276 Z",):
        for d in (sole, _mirror_x(sole)):
            B.append(f'<path d="{d}" fill="#FFF7EE" stroke="{a.line}" stroke-width="5" stroke-linejoin="round"/>')
    B.append('<path d="M384,1232 L426,1240 M380,1248 L422,1254 M616,1232 L574,1240 M620,1248 L578,1254" '
             'stroke="#FFF7EE" stroke-width="7" stroke-linecap="round" fill="none"/>')

    # shorts
    shorts = ("M342,936 L658,936 L682,1086 C646,1104 590,1104 556,1092 L500,1018 L444,1092 "
              "C410,1104 354,1104 318,1086 Z")
    B.append(a.shape(shorts, SHORTS, SHORTS_S, SHORTS_L, dx=24, dy=20, blur=12))
    B.append(f'<path d="M500,960 L500,1016 M368,1060 C390,1070 418,1072 440,1066" stroke="{SHORTS_S}" stroke-width="5" fill="none" opacity="0.8"/>')

    # waving arm (viewer's left): sleeve, forearm, open hand
    B.append(a.limb("M372,790 C340,770 306,752 276,734", 100, SHIRT, SHIRT_S, SHIRT_L))
    B.append(a.limb("M284,738 L268,728", 104, BLUE, BLUE_S, BLUE_L))
    B.append(a.limb("M258,716 C238,684 222,650 206,608", 66, SKIN, SKIN_S, SKIN_L))
    for x0, y0, x1, y1 in ((150, 548, 124, 482), (176, 530, 166, 450), (206, 528, 216, 452), (234, 544, 258, 482)):
        B.append(a.limb(f"M{x0},{y0} L{x1},{y1}", 36, SKIN, SKIN_S, SKIN_L, lw=5, blur=5))
    B.append(a.limb("M240,600 L286,574", 38, SKIN, SKIN_S, SKIN_L, lw=5, blur=5))
    palm = "M136,560 C134,520 162,508 196,508 C232,508 252,522 252,560 C254,604 232,632 196,632 C160,632 138,604 136,560 Z"
    B.append(a.shape(palm, SKIN, SKIN_S, SKIN_L, lw=5, dx=14, dy=12, blur=8))
    B.append(f'<path d="M160,592 C180,606 210,606 228,592" stroke="{SKIN_S}" stroke-width="5" fill="none" opacity="0.7"/>')

    # torso
    torso = "M346,792 C348,752 410,738 500,738 C590,738 652,752 654,792 L680,966 C646,994 354,994 320,966 Z"
    B.append(a.shape(torso, SHIRT, SHIRT_S, SHIRT_L, dx=34, dy=26, blur=18))
    B.append(a.soft("M330,940 C400,980 600,980 670,940 L680,990 L320,990 Z", SHIRT_S, 0.45, 10, clip_d=torso))
    # collar
    collar = "M432,742 L500,812 L568,742 C548,736 452,736 432,742 Z"
    B.append(a.shape(collar, "#2C6AD0", BLUE_S, BLUE_L, lw=5, dx=10, dy=8, blur=6))
    # straps with buckles
    for d in ("M378,756 C366,830 360,900 358,978 L410,980 C412,900 420,820 432,752 Z",
              "M622,756 C634,830 640,900 642,978 L590,980 C588,900 580,820 568,752 Z"):
        B.append(a.shape(d, STRAP, STRAP_S, STRAP_L, lw=5, dx=10, dy=8, blur=6))
    for x in (362, 594):
        B.append(a.shape(f"M{x},880 h46 v30 h-46 Z", "#FFC23A", "#C77F12", "#FFF0A0", lw=5, dx=8, dy=6, blur=4))

    # pointing arm (viewer's right)
    B.append(a.limb("M628,790 C668,800 702,806 734,810", 98, SHIRT, SHIRT_S, SHIRT_L))
    B.append(a.limb("M722,808 L740,811", 102, BLUE, BLUE_S, BLUE_L))
    B.append(a.limb("M760,812 C792,800 818,786 842,770", 64, SKIN, SKIN_S, SKIN_L))
    B.append(a.limb("M890,734 L960,690", 34, SKIN, SKIN_S, SKIN_L, lw=5, blur=5))
    B.append(a.limb("M868,716 L896,700", 34, SKIN, SKIN_S, SKIN_L, lw=5, blur=5))
    fist = "M828,760 C820,724 846,704 880,706 C914,708 930,730 926,760 C922,790 896,806 868,804 C842,802 832,786 828,760 Z"
    B.append(a.shape(fist, SKIN, SKIN_S, SKIN_L, lw=5, dx=12, dy=10, blur=7))
    B.append(f'<path d="M852,766 C866,774 890,774 906,766 M850,784 C866,792 888,792 902,784" stroke="{SKIN_S}" stroke-width="5" fill="none" opacity="0.7"/>')

    # neck with the head's shadow
    neck = "M446,680 L554,680 L560,770 C536,786 464,786 440,770 Z"
    B.append(a.shape(neck, SKIN, None, None, lw=6))
    B.append(a.soft("M430,660 C460,720 540,720 570,660 L570,700 C540,740 460,740 430,700 Z", SKIN_S, 0.85, 8, clip_d=neck))

    # ears
    for cx, sign in ((284, 1), (716, -1)):
        e = ellipse_d(cx, 506, 36, 46)
        B.append(a.shape(e, SKIN, SKIN_S, SKIN_L, dx=10 * sign, dy=10, blur=6))
        B.append(f'<path d="M{cx - 8 * sign},484 C{cx + 8 * sign},494 {cx + 8 * sign},522 {cx - 8 * sign},532" stroke="{SKIN_S}" stroke-width="7" fill="none" stroke-linecap="round"/>')

    # head
    head = "M282,486 C282,336 380,264 500,264 C620,264 718,336 718,486 C718,626 628,706 500,706 C372,706 282,626 282,486 Z"
    B.append(a.shape(head, SKIN, SKIN_S, SKIN_L, dx=40, dy=30, blur=22, shade_op=0.5, light_op=0.6))

    # hair: fringe and side tufts, with a cool sheen
    hair = ("M284,508 C276,384 372,300 500,298 C628,300 724,384 716,508 C708,470 694,440 674,426 C662,452 640,460 620,446 "
            "C606,468 576,470 562,450 C548,470 516,472 502,452 C486,472 454,470 442,450 C428,468 396,466 386,446 "
            "C366,460 340,452 332,426 C312,438 294,470 284,508 Z")
    B.append(a.soft("M300,446 C360,486 640,486 700,446 L700,490 C640,524 360,524 300,490 Z", SKIN_S, 0.5, 12, clip_d=head))
    B.append(a.shape(hair, HAIR, HAIR_S, HAIR_L, lw=6, dx=16, dy=18, blur=12, light_op=0.4))
    for d in ("M286,500 C278,526 280,560 292,586 C300,560 304,536 312,520 Z", "M714,500 C722,526 720,560 708,586 C700,560 696,536 688,520 Z"):
        B.append(a.shape(d, HAIR, None, None, lw=5))
    B.append(a.soft_line("M360,420 C420,396 470,392 520,398", "#8A93B5", 10, 0.55, 5))

    # cap: crown, panels, button, brim; the cap shades the hair just under it
    B.append(a.soft("M330,396 C420,380 600,380 700,410 L700,446 C600,430 420,428 330,446 Z", "#000000", 0.4, 10, clip_d=head))
    crown = "M262,436 C258,292 368,206 500,206 C632,206 742,292 738,436 C692,406 602,390 500,390 C398,390 308,406 262,436 Z"
    B.append(a.shape(crown, CAP, CAP_S, CAP_L, dx=30, dy=26, blur=18, shade_op=0.7, light_op=0.45))
    B.append(f'<path d="M500,210 C468,270 458,336 470,394 M500,210 C532,270 542,336 530,394 M378,234 C398,294 404,350 398,400 '
             f'M622,234 C602,294 596,350 602,400" stroke="#0E0E12" stroke-width="5" fill="none" opacity="0.7"/>')
    B.append('<path d="M378,234 C398,294 404,350 398,400 M622,234 C602,294 596,350 602,400" stroke="#9A9DB0" '
             'stroke-width="3" stroke-dasharray="10 9" fill="none" opacity="0.6" transform="translate(9,0)"/>')
    B.append(a.soft_line("M318,322 C346,268 398,240 452,228", "#C8CBDA", 16, 0.55, 7))
    B.append(a.shape(circle_d(500, 210, 18), "#55576A", None, "#9EA1B6", lw=5, dx=6, dy=6, blur=3))
    brim = "M516,398 C620,380 764,384 826,444 C814,468 758,474 700,462 C642,450 582,432 516,426 Z"
    B.append(a.shape(brim, "#2A2B34", CAP_S, CAP_L, dx=14, dy=-14, blur=8, shade_op=0.6, light_op=0.5))
    B.append(a.soft_line("M584,400 C660,392 742,400 790,432", "#9EA1B6", 8, 0.6, 4))

    # brows
    B.append(f'<path d="M364,480 C386,456 432,454 456,470" stroke="#2A1A12" stroke-width="15" fill="none" stroke-linecap="round"/>')
    B.append(f'<path d="M544,470 C568,454 614,456 636,480" stroke="#2A1A12" stroke-width="15" fill="none" stroke-linecap="round"/>')

    # eyes: sclera hint, iris gradient, pupil, two highlights, heavy upper lid with a lash flick
    iris = a.grad([(0, "#2A160E"), (0.55, "#5A3420"), (1, "#A8703F")])
    for cx in (414, 586):
        flip = 1 if cx < 500 else -1
        B.append(f'<path d="{ellipse_d(cx, 540, 50, 60)}" fill="#FFFFFF" stroke="{a.line}" stroke-width="5"/>')
        B.append(f'<path d="{ellipse_d(cx + 2 * flip * -1, 546, 42, 52)}" fill="{iris}"/>')
        B.append(f'<path d="{ellipse_d(cx, 550, 22, 28)}" fill="#120806"/>')
        B.append(a.soft(ellipse_d(cx, 516, 46, 22), "#000", 0.35, 6, clip_d=ellipse_d(cx, 540, 50, 60)))
        B.append(f'<circle cx="{cx - 16}" cy="{522}" r="16" fill="#fff"/><circle cx="{cx + 18}" cy="{570}" r="8" fill="#fff" opacity="0.9"/>')
        B.append(f'<path d="M{cx - 52},{536} C{cx - 44},{478} {cx + 44},{478} {cx + 52},{536}" stroke="#1A0F0A" stroke-width="11" fill="none" stroke-linecap="round"/>')
        ox = cx + 52 * (-flip)
        B.append(f'<path d="M{ox},{534} L{ox - 16 * flip},{520}" stroke="#1A0F0A" stroke-width="8" stroke-linecap="round"/>')

    # blush, nose, mouth
    for cx in (340, 660):
        B.append(a.soft(ellipse_d(cx, 612, 48, 28), "#FF7A7A", 0.55, 10, clip_d=head))
    B.append(f'<path d="M488,592 C496,604 506,604 514,592" stroke="#C47A55" stroke-width="7" fill="none" stroke-linecap="round"/>')
    mouth = "M432,630 C456,648 544,648 568,630 C568,690 536,718 500,718 C464,718 432,690 432,630 Z"
    mclip = a.clip(mouth)
    B.append(f'<path d="{mouth}" fill="#8E1F30"/>'
             f'<g clip-path="url(#{mclip})"><ellipse cx="500" cy="708" rx="54" ry="30" fill="#F26D7D"/>'
             f'<path d="M432,630 C456,648 544,648 568,630 L568,662 C536,670 464,670 432,662 Z" fill="#fff"/></g>'
             f'<path d="{mouth}" fill="none" stroke="{a.line}" stroke-width="6" stroke-linejoin="round"/>')

    # warm rim light on the shadow side, as from the sunny sky
    B.append(a.soft_line("M714,560 C706,620 676,664 636,690", "#FFF1C9", 8, 0.45, 4, clip_d=head))

    return a.svg("".join(B), grain=grain)


# ---- cat (peeking over the MULA button) ----------------------------------------------------------

FUR, FUR_S, FUR_L = "#FFAE45", "#D9671A", "#FFD99A"
WHITE, WHITE_S, WHITE_L = "#FFFDF8", "#E4C7A8", "#FFFFFF"
CLINE = "#5E2E12"


def cat(paws_only=False):
    a = Art(1000, 140, view="0 760 1000 140", line=CLINE) if paws_only else Art(1000, 900, line=CLINE)
    grain = a.grain(strength=0.12, freq=0.9, mottle=0.08, seed=23)
    B = []

    # tail curling up behind, with rings and a white tip
    tail = "M690,760 C820,770 880,690 872,580 C866,500 820,460 780,480"
    B.append(a.limb(tail, 78, FUR, FUR_S, FUR_L, lw=6))
    B.append(f'<path d="{tail}" fill="none" stroke="{FUR_S}" stroke-width="78" stroke-dasharray="22 60" stroke-dashoffset="-34" opacity="0.55"/>')
    B.append(a.limb("M812,476 C798,470 788,472 780,480", 78, WHITE, WHITE_S, None, lw=6))

    # body: rounded chest and shoulders; the button covers everything below y = 860
    body = "M330,440 C262,540 248,720 258,900 L742,900 C752,720 738,540 670,440 Z"
    B.append(a.shape(body, FUR, FUR_S, FUR_L, dx=34, dy=28, blur=20))
    chest = "M428,470 C394,600 392,760 410,900 L590,900 C608,760 606,600 572,470 Z"
    B.append(a.shape(chest, WHITE, WHITE_S, None, lw=0, dx=20, dy=16, blur=14))
    for d in ("M298,690 L346,708 M290,750 L342,764 M702,690 L654,708 M710,750 L658,764",):
        B.append(f'<path d="{d}" stroke="{FUR_S}" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.7"/>')

    # ears
    for d, inner in (("M266,268 C250,180 266,118 300,92 C344,104 400,138 432,166 C370,176 312,210 266,268 Z",
                      "M296,192 C296,152 310,126 326,118 C352,132 378,148 394,164 C352,168 320,178 296,192 Z"),):
        for dd, ii in ((d, inner), (_mirror_x(d), _mirror_x(inner))):
            B.append(a.shape(dd, FUR, FUR_S, FUR_L, dx=16, dy=14, blur=10))
            B.append(a.soft(ii, "#F59AA8", 0.95, 4))

    # head with white blaze and cheeks
    head = "M240,340 C240,200 356,136 500,136 C644,136 760,200 760,340 C760,456 654,532 500,532 C346,532 240,456 240,340 Z"
    B.append(a.shape(head, FUR, FUR_S, FUR_L, dx=40, dy=32, blur=24, shade_op=0.5, light_op=0.6))
    hc = head
    B.append(a.soft("M500,120 C462,200 452,290 468,370 C476,410 486,432 500,446 C514,432 524,410 532,370 C548,290 538,200 500,120 Z",
                    WHITE, 1.0, 3, clip_d=hc))
    for d in (ellipse_d(420, 452, 104, 74), ellipse_d(580, 452, 104, 74), ellipse_d(500, 494, 92, 52)):
        B.append(a.soft(d, WHITE, 1.0, 3, clip_d=hc))
    B.append(a.soft(ellipse_d(540, 470, 120, 60), WHITE_S, 0.55, 16, clip_d=hc))
    B.append(f'<path d="{head}" fill="none" stroke="{CLINE}" stroke-width="6"/>')
    # forehead stripes
    B.append(f'<path d="M450,168 C454,190 454,206 450,224 M414,186 C420,206 420,222 416,238 M550,168 C546,190 546,206 550,224 '
             f'M586,186 C580,206 580,222 584,238" stroke="{FUR_S}" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.85"/>')
    # cheek tufts
    B.append(f'<path d="M244,390 L214,414 L254,424 M756,390 L786,414 L746,424" stroke="{CLINE}" stroke-width="6" '
             f'stroke-linejoin="round" stroke-linecap="round" fill="none"/>')

    # eyes: open left eye with a large iris, winking right eye
    iris = a.grad([(0, "#1E120C"), (0.6, "#4A2C18"), (1, "#8C5A22")])
    B.append(f'<path d="{ellipse_d(394, 334, 46, 56)}" fill="{iris}" stroke="{CLINE}" stroke-width="5"/>')
    B.append(f'<path d="{ellipse_d(394, 342, 22, 30)}" fill="#0C0705"/>')
    B.append(f'<circle cx="378" cy="312" r="15" fill="#fff"/><circle cx="410" cy="364" r="7" fill="#fff" opacity="0.9"/>')
    B.append(f'<path d="M344,324 C356,274 434,272 446,322" stroke="#1B0F0A" stroke-width="10" fill="none" stroke-linecap="round"/>')
    B.append(f'<path d="M344,322 L326,306" stroke="#1B0F0A" stroke-width="8" stroke-linecap="round"/>')
    B.append(f'<path d="M560,340 C580,304 628,304 650,338" stroke="#1B0F0A" stroke-width="14" fill="none" stroke-linecap="round"/>')
    B.append(f'<path d="M648,334 L668,320 M640,322 L652,302" stroke="#1B0F0A" stroke-width="7" stroke-linecap="round"/>')

    # blush, nose, smiling open mouth
    for cx in (330, 670):
        B.append(a.soft(ellipse_d(cx, 404, 46, 26), "#FF6F7D", 0.5, 10, clip_d=head))
    nose = "M474,396 C488,386 512,386 526,396 C522,412 510,422 500,424 C490,422 478,412 474,396 Z"
    B.append(a.shape(nose, "#F48A9B", "#C2546A", "#FFC3CC", lw=5, dx=6, dy=6, blur=3))
    mouth = "M462,440 C476,470 494,466 500,442 C506,466 524,470 538,440 C536,486 520,506 500,506 C480,506 464,486 462,440 Z"
    B.append(f'<path d="{mouth}" fill="#9A2B3C" stroke="{CLINE}" stroke-width="5" stroke-linejoin="round"/>')
    B.append(f'<g clip-path="url(#{a.clip(mouth)})"><ellipse cx="500" cy="502" rx="30" ry="20" fill="#F46B7B"/></g>')
    B.append(f'<path d="M500,424 L500,442" stroke="{CLINE}" stroke-width="5"/>')

    # whiskers
    B.append(f'<g stroke="{CLINE}" stroke-width="4" stroke-linecap="round" opacity="0.6" fill="none">'
             '<path d="M330,420 L200,396 M330,438 L196,442 M338,456 L210,486 M670,420 L800,396 M670,438 L804,442 M662,456 L790,486"/></g>')

    # paws resting on the button edge. The menu draws the button over this image from y ~ 815 down and
    # then draws cat_paws.svg (this block alone) on top, so the paws sit on the button.
    if paws_only:
        B = []
    for cx in (392, 608):
        paw = f"M{cx - 72},846 C{cx - 74},800 {cx - 40},780 {cx},780 C{cx + 40},780 {cx + 74},800 {cx + 72},846 C{cx + 70},880 {cx + 40},892 {cx},892 C{cx - 40},892 {cx - 70},880 {cx - 72},846 Z"
        B.append(a.shape(paw, WHITE, WHITE_S, None, lw=6, dx=14, dy=12, blur=8))
        B.append(f'<path d="M{cx - 26},818 L{cx - 26},846 M{cx},814 L{cx},848 M{cx + 26},818 L{cx + 26},846" stroke="{CLINE}" '
                 f'stroke-width="5" stroke-linecap="round" opacity="0.45"/>')
    if paws_only:
        return a.svg("".join(B), grain=grain)
    B.append(a.soft_line("M700,250 C736,300 744,380 712,440", "#FFF2C8", 9, 0.5, 4, clip_d=head))

    return a.svg("".join(B), grain=grain)


def _mirror_x(d, axis=1000):
    import re
    res, xy = [], True
    for p in re.findall(r"[MLCZ]|-?\d+(?:\.\d+)?", d):
        if p in "MLCZ":
            res.append(p)
            xy = True
            continue
        v = float(p)
        res.append(f"{axis - v:g}" if xy else f"{v:g}")
        xy = not xy
    return " ".join(res)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "amir_full.svg").write_text(amir())
    (OUT / "cat_peek.svg").write_text(cat())
    (OUT / "cat_paws.svg").write_text(cat(paws_only=True))
    print("amir_full.svg, cat_peek.svg, cat_paws.svg ->", OUT)
