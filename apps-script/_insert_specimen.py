# -*- coding: utf-8 -*-
import pathlib

root = pathlib.Path(__file__).resolve().parent
ui = root / "UI.html"
frag = (root / "_snippet_mc_specimen_rebuild.html").read_text(encoding="utf-8")
text = ui.read_text(encoding="utf-8")
needle = (
    "            </section>\n\n"
    "            <section\n"
    '              class="lp-section lp-sec-anim lp-fsection mc-welcome-fsection welcome-reveal"\n'
    '              id="welcomeFeatureGridSection"'
)
if needle not in text:
    raise SystemExit("needle not found (coverflow → workflow gap)")
text = text.replace(
    needle,
    "            </section>\n\n" + frag + "\n            <section\n"
    '              class="lp-section lp-sec-anim lp-fsection mc-welcome-fsection welcome-reveal"\n'
    '              id="welcomeFeatureGridSection"',
    1,
)
# nav spy: add museum target for specimen cabinet
old_map = "            'lp-media': 'lp-museum',\n            'welcomeGateSection': 'lp-start'"
new_map = "            'lp-media': 'lp-museum',\n            'mcSpecimenCabinet': 'lp-museum',\n            'welcomeGateSection': 'lp-start'"
if old_map not in text:
    raise SystemExit("navSpyMap chunk not found")
text = text.replace(old_map, new_map, 1)
ui.write_text(text, encoding="utf-8", newline="\n")
print("OK", ui.stat().st_size)
