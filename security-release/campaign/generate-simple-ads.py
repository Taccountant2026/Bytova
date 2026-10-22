"""Create simple Bytova awareness images using the existing brand assets."""
import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('brand_canvas', HERE / 'generate-assets.py')
brand = importlib.util.module_from_spec(spec)
spec.loader.exec_module(brand)
OUT = HERE.parents[2] / 'output' / 'Bytova-Social-Ads'
OUT.mkdir(parents=True, exist_ok=True)
brand.OUT = OUT
themes = [
    ('01', 'Does your\nwebsite\nuse PHP?', 'Free checker. Clear guidance.\nPractical next steps.', 'Free PHP resources'),
    ('02', 'Plan your\nwebsite\nupdate.', 'A clear guide and free checklists\nfor you and your website provider.', 'Get the free guide'),
    ('03', 'Free guidance.\nPractical\nchecklists.', 'Help for website owners\nand small businesses.', 'Explore the resources'),
]
records = []
for number, title, subtitle, action in themes:
    for shape, height in [('Square', 1080), ('Story', 1920)]:
        c = brand.Canvas(1080, height)
        top = 80 if shape == 'Square' else 240
        c.brand(80, top, 285)
        c.text(80, top + 145, 'PHP SECURITY • BYTOVA', 23, brand.CYAN, True)
        y = c.text(80, top + 220, title, 100, brand.WHITE, True, max_width=920, line_height=1.04)
        c.text(80, y + 55, subtitle, 31, brand.LIGHT, max_width=920, line_height=1.3)
        c.rect((80, height - (260 if shape == 'Story' else 205), 920, 83), brand.CYAN, 12)
        c.text(108, height - (245 if shape == 'Story' else 190), action, 36, brand.INK, True, max_width=860)
        c.text(80, height - (125 if shape == 'Story' else 78), 'Link in the post • No account needed', 24, brand.LIGHT, max_width=920)
        alt = f'Bytova. {title.replace(chr(10), " ")} {subtitle.replace(chr(10), " ")} {action}. Link in the post. No account needed.'
        records.append(c.save(f'Bytova-Ad-{number}-{shape}', alt))
(OUT / 'alt-text.json').write_text(json.dumps(records, indent=2) + '\n')
for number, title, subtitle, action in themes:
    c = brand.Canvas(1200, 675)
    c.brand(65, 55, 250)
    c.text(65, 170, title, 66, brand.WHITE, True, max_width=770, line_height=1.03)
    c.text(65, 402, subtitle, 27, brand.LIGHT, max_width=1050, line_height=1.3)
    c.rect((65, 520, 1070, 70), brand.CYAN, 10)
    c.text(88, 530, action, 31, brand.INK, True, max_width=1010)
    c.text(65, 618, 'PHP SECURITY • Link in the post • No account needed', 21, brand.LIGHT, max_width=1070)
    records.append(c.save(f'Bytova-Ad-{number}-Wide', f'Bytova. {title.replace(chr(10), " ")} {action}.'))
(OUT / 'alt-text.json').write_text(json.dumps(records, indent=2) + '\n')
sheet = brand.Image.new('RGB', (1080, 390), '#eaf0f8')
for i in range(3):
    im = brand.Image.open(OUT / f'Bytova-Ad-0{i+1}-Square.png')
    im.thumbnail((340, 340), brand.Image.Resampling.LANCZOS)
    sheet.paste(im, (10 + 360*i, 25))
sheet.save(OUT / 'Bytova-Social-Ads-Preview.png', optimize=True)
print(json.dumps({'images': len(records), 'text_boxes_checked': sum(r['text_boxes'] for r in records), 'output': str(OUT)}))
