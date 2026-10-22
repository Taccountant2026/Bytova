"""Validate this campaign without any external requests or publication."""
from pathlib import Path
import json
import xml.etree.ElementTree as ET
from PIL import Image

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[1]
manifest = json.loads((OUT/'alt-text.json').read_text())
assert len(manifest['graphics']) == 13
for asset in manifest['graphics']:
    with Image.open(OUT/asset['png']) as image:
        assert image.size == (asset['width'], asset['height']), asset['name']
        image.verify()
    ET.parse(OUT/asset['svg'])
    assert asset['alt'], asset['name']
with Image.open(OUT/'contact-sheet.png') as image:
    image.verify()
with Image.open(ROOT/'assets/security/security-social.png') as image:
    assert image.size == (1200,630)
    image.verify()
ad = json.loads((OUT/'optional-search-ad.json').read_text())
assert ad['budget_gbp'] == 0 and ad['activated'] is False
assert max(map(len,ad['headlines'])) <= 30
assert max(map(len,ad['descriptions'])) <= 90
(OUT/'FONT-LICENSE.txt').write_text((ROOT/'assets/INTER-LICENSE.txt').read_text())
report = {
    'reviewed': '2026-10-22',
    'designs': 13,
    'campaign_pngs': 14,
    'editable_svgs': 13,
    'public_og_png': 'assets/security/security-social.png',
    'text_bounds_checked': sum(a['text_boxes'] for a in manifest['graphics']),
    'png_dimensions_and_decode': 'passed',
    'svg_xml_and_alt_text': 'passed',
    'headlines_max_characters': max(map(len,ad['headlines'])),
    'descriptions_max_characters': max(map(len,ad['descriptions'])),
    'publication': 'not activated; owner approval and live destinations required',
    'limits': [
        'Platform composer cropping must be reviewed before posting.',
        'No platform-policy eligibility claim.',
        'No reach, customer remediation, external review, indexing or conversion outcome is claimed.'
    ]
}
pending = OUT/'validation.json.pending'
pending.write_text(json.dumps(report,indent=2)+'\n')
pending.replace(OUT/'validation.json')
print(json.dumps(report,indent=2))
