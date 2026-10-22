"""Reproduce the exact, code-native Bytova security campaign graphics.

Needs Pillow and fonttools with WOFF2 support. Reads only the existing logo,
fonts and reviewed advisory JSON. Writes only this campaign and the public OG.
"""
import base64
import html
import io
import json
from pathlib import Path
import shutil
import subprocess

from PIL import Image, ImageDraw, ImageFont, ImageChops
from fontTools.ttLib import TTFont
from fontTools.ttLib import woff2

# The bundled Node runtime supplies Brotli when the optional Python binding is
# absent. This keeps the exact original Inter fonts without downloading assets.
if not woff2.haveBrotli:
    class BrotliShim:
        @staticmethod
        def decompress(raw):
            return subprocess.run(['node','-e','const fs=require("fs"),z=require("zlib");process.stdout.write(z.brotliDecompressSync(fs.readFileSync(0)));'],input=raw,capture_output=True,check=True).stdout
    woff2.brotli=BrotliShim
    woff2.haveBrotli=True

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[1]
DATA = json.loads((ROOT / 'assets/security/advisories.json').read_text())
NAVY = '#0a1a5c'
CYAN = '#00d4ff'
LIGHT = '#e9f5ff'
INK = '#0a1a5c'
MUTED = '#465675'
WHITE = '#ffffff'
DATE = 'Sources checked 22 Oct 2026. Recheck before use.'

FONTS = {}
for weight in ['regular', 'bold']:
    font = TTFont(ROOT / f'assets/inter-{weight}.woff2')
    font.flavor = None
    stream = io.BytesIO()
    font.save(stream)
    FONTS[weight] = stream.getvalue()

logo = Image.open(ROOT / 'assets/Bytova_Logo.png').convert('RGB')
bounds = ImageChops.difference(logo, Image.new('RGB', logo.size, 'white')).convert('L').point(lambda p: 255 if p>45 else 0).getbbox()
logo = logo.crop((max(bounds[0]-2, 0), max(bounds[1]-2, 0), min(bounds[2]+2, logo.width), min(bounds[3]+2, logo.height)))
logo_buf = io.BytesIO()
logo.save(logo_buf, 'PNG')
LOGO_B64 = base64.b64encode(logo_buf.getvalue()).decode()


class Canvas:
    def __init__(self, width, height):
        self.width, self.height = width, height
        self.im = Image.new('RGB', (width, height), NAVY)
        self.draw = ImageDraw.Draw(self.im)
        self.svg = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img">', '<title>Bytova PHP security education</title>', f'<rect width="{width}" height="{height}" fill="{NAVY}"/>']
        regular = base64.b64encode((ROOT/'assets/inter-regular.woff2').read_bytes()).decode()
        bold = base64.b64encode((ROOT/'assets/inter-bold.woff2').read_bytes()).decode()
        self.svg.append(f'<style>@font-face{{font-family:Inter;src:url(data:font/woff2;base64,{regular}) format("woff2");font-weight:400}}@font-face{{font-family:Inter;src:url(data:font/woff2;base64,{bold}) format("woff2");font-weight:700}}text{{font-family:Inter,Arial,sans-serif}}</style>')
        self.boxes = []

    def rect(self, box, fill, radius=0):
        x, y, w, h = box
        self.draw.rounded_rectangle((x, y, x+w, y+h), radius, fill=fill)
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}"/>')

    def line(self, x1, y1, x2, y2, color, width=1):
        self.draw.line((x1, y1, x2, y2), color, width)
        self.svg.append(f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="{width}"/>')

    def text(self, x, y, value, size, color=WHITE, bold=False, max_width=None, line_height=1.18):
        weight = 'bold' if bold else 'regular'
        font = ImageFont.truetype(io.BytesIO(FONTS[weight]), round(size))
        ascent, descent = font.getmetrics()
        lines = []
        for paragraph in value.split('\n'):
            if max_width is None:
                lines.append(paragraph)
                continue
            current = ''
            for word in paragraph.split():
                attempt = f'{current} {word}'.strip()
                if self.draw.textlength(attempt, font=font) > max_width and current:
                    lines.append(current)
                    current = word
                else:
                    current = attempt
            lines.append(current)
        for i, text in enumerate(lines):
            ty = y + i * size * line_height
            baseline = ty + ascent
            width = self.draw.textlength(text, font=font)
            if max_width is not None and width > max_width + 1:
                raise ValueError(f'Unwrappable text: {text!r}')
            box = self.draw.textbbox((x, baseline), text, font=font, anchor='ls')
            if not (0 <= box[0] <= box[2] <= self.width and 0 <= box[1] <= box[3] <= self.height):
                raise ValueError(f'Out-of-canvas text: {text!r}, {box}')
            self.draw.text((x, baseline), text, fill=color, font=font, anchor='ls')
            self.svg.append(f'<text x="{x}" y="{baseline:.2f}" fill="{color}" font-size="{size}" font-weight="{700 if bold else 400}">{html.escape(text)}</text>')
            self.boxes.append((text, box))
        return y + size * line_height * len(lines)

    def brand(self, x, y, width=244):
        h = round(width * logo.height/logo.width)
        self.rect((x-14, y-13, width+28, h+26), WHITE, 7)
        resized = logo.resize((width,h),Image.Resampling.LANCZOS)
        self.im.paste(resized,(x,y))
        self.svg.append(f'<image x="{x}" y="{y}" width="{width}" height="{h}" xlink:href="data:image/png;base64,{LOGO_B64}"/>')

    def save(self, name, alt):
        png_buffer=io.BytesIO()
        self.im.save(png_buffer, format='PNG', optimize=True)
        pending=OUT/f'{name}.png.pending'
        pending.write_bytes(png_buffer.getvalue())
        pending.replace(OUT/f'{name}.png')
        self.svg.insert(2, f'<desc>{html.escape(alt)}</desc>')
        self.svg.append('</svg>')
        (OUT/f'{name}.svg').write_text('\n'.join(self.svg))
        return {'name':name,'png':f'{name}.png','svg':f'{name}.svg','width':self.width,'height':self.height,'alt':alt,'text_boxes':len(self.boxes)}


THEMES = {
 'check-php': {
  'title': 'Check PHP.\nPlan your update.',
  'sub': 'Free guidance for website owners\nand administrators.',
  'foot': 'A version check is not a security certificate.',
  'cta': 'Free version checker',
  'url': 'bytova.co.uk/php-version-checker.html',
  'alt': 'Bytova PHP security response. Check PHP and plan your update. Verified upstream fixes checked on 22 October 2026: PHP 8.2.35, 8.3.36, 8.4.27 and 8.5.12. A version check is not a security certificate. Free version checker at bytova.co.uk/php-version-checker.html.'
 },
 'backports-matter': {
  'title': 'Older number.\nNew security fix?',
  'sub': 'Check the vendor package revision,\nnot the PHP number alone.',
  'foot': 'Confirm the exact OS, package and running service.',
  'cta': 'Understand vendor backports',
  'url': 'bytova.co.uk/security.html',
  'alt': 'Bytova explains vendor backports. An older PHP number can have a new security fix. Example: Ubuntu 24.04 PHP 8.3 package 8.3.6-0ubuntu0.24.04.13 is recorded as fixed for both listed advisories. Confirm the exact OS, package and running service. Sources checked 22 October 2026.'
 },
 'safe-update-plan': {
  'title': 'Make the update.\nKeep the evidence.',
  'sub': 'A practical checklist for an\nauthorised PHP administrator.',
  'foot': 'Suspect compromise? Involve a qualified responder.',
  'cta': 'Free response checklists',
  'url': 'bytova.co.uk/security.html',
  'alt': 'Bytova safe PHP update plan. Identify the runtime; verify backups and test; apply the vendor-approved fix; replace running workers; validate and document. Suspected compromise needs a qualified responder. Free response checklists at bytova.co.uk/security.html. Sources checked 22 October 2026.'
 }
}


def panel(c, theme, x, y, w, h, compact=False):
    c.rect((x,y,w,h),WHITE,16)
    pad=28 if compact else 36
    tx=x+pad
    c.text(tx,y+pad,'THE VERIFIED BRIEF',16 if compact else 19,MUTED,True)
    yy=y+pad+(42 if compact else 50)
    if theme=='check-php':
        c.text(tx,yy,'Upstream fixes for both CVEs',19 if compact else 27,INK,True,max_width=w-2*pad)
        yy+=47 if compact else 65
        rowh=(h-(yy-y)-pad)/4
        for branch,b in DATA['upstream'].items():
            c.line(tx,yy-7,x+w-pad,yy-7,'#dce5f2')
            c.text(tx,yy,'PHP '+branch,20 if compact else 29,INK)
            c.text(x+w-pad-(138 if compact else 200),yy,b['fixed'],22 if compact else 32,INK,True)
            yy+=rowh
    elif theme=='backports-matter':
        c.text(tx,yy,'Ubuntu 24.04 example',22 if compact else 30,INK,True,max_width=w-2*pad)
        yy+=60 if compact else 90
        c.text(tx,yy,'PHP 8.3 package fix',18 if compact else 25,MUTED,max_width=w-2*pad)
        yy+=36 if compact else 55
        pkg='8.3.6-0ubuntu0.24.04.13'
        size=20 if compact else 34
        c.text(tx,yy,pkg,size,INK,True,max_width=w-2*pad)
        yy+=64 if compact else 95
        c.text(tx,yy,'Recorded as fixed for both\nlisted PHP advisories.',18 if compact else 25,MUTED,max_width=w-2*pad)
    else:
        items=['Identify every runtime','Verify backups and test','Apply the vendor-approved fix','Replace running workers','Validate and document']
        rowh=(h-(yy-y)-pad)/5
        for i,item in enumerate(items):
            c.text(tx,yy,f'{i+1:02}',18 if compact else 27,'#006b86',True)
            c.text(tx+(40 if compact else 55),yy,item,18 if compact else 27,INK,True,max_width=w-2*pad-(42 if compact else 60))
            yy+=rowh


def create(theme,fmt,width,height):
    t=THEMES[theme];c=Canvas(width,height)
    landscape=width>height
    if landscape:
        left=54;top=44
        c.brand(left,top,204)
        c.text(left,142,'PHP SECURITY RESPONSE 2026',14,CYAN,True)
        c.text(left,180,t['title'],48,WHITE,True,max_width=610,line_height=1.08)
        c.text(left,307,t['sub'],21,LIGHT,max_width=600)
        c.rect((left,387,430,51),CYAN,6)
        c.text(left+20,395,t['cta'],20,INK,True,max_width=390)
        c.text(left,462,t['url'],17,WHITE,max_width=610)
        c.text(left,507,t['foot'],15,LIGHT,max_width=600)
        c.text(left,556,DATE,12,LIGHT,max_width=1000)
        c.text(left,580,'CVE-2026-109618 / CVE-2026-109619',12,LIGHT,max_width=1000)
        panel(c,theme,720,66,426,453,True)
    else:
        m=65
        story=height>1500
        top=130 if story else 58
        c.brand(m,top,240)
        y=top+110
        c.text(m,y,'PHP SECURITY RESPONSE 2026',20,CYAN,True)
        y+=55
        y=c.text(m,y,t['title'],70,WHITE,True,max_width=width-2*m,line_height=1.08)
        y+=30
        y=c.text(m,y,t['sub'],28,LIGHT,max_width=width-2*m,line_height=1.28)
        y+=36
        cardh=410 if story else 340 if height>1100 else 280
        if theme=='backports-matter' and height<=1100: cardh=280
        panel(c,theme,m,y,width-2*m,cardh,not story)
        y+=cardh+27
        y=c.text(m,y,t['foot'],22 if story else 19,LIGHT,max_width=width-2*m,line_height=1.22)
        y+=26 if story else 20
        c.rect((m,y,width-2*m,60 if story else 52),CYAN,7)
        c.text(m+22,y+10,t['cta'],26 if story else 23,INK,True,max_width=width-2*m-44)
        y+=83 if story else 71
        y=c.text(m,y,t['url'],23 if story else 20,WHITE,max_width=width-2*m)
        footer_y=height-190 if story else height-85
        if y+25>footer_y: raise ValueError(f'Footer collision {theme}/{fmt}: {y}')
        c.line(m,footer_y-18,width-m,footer_y-18,'#526796')
        c.text(m,footer_y,DATE,17 if story else 14,LIGHT,max_width=width-2*m)
        c.text(m,footer_y+31,'CVE-2026-109618 / CVE-2026-109619',16 if story else 13,LIGHT,max_width=width-2*m)
    return c.save(f'{theme}-{fmt}',t['alt'])


def main():
    records=[]
    for theme in THEMES:
        for fmt,w,h in [('square',1080,1080),('portrait',1080,1350),('story',1080,1920),('landscape',1200,630)]:
            records.append(create(theme,fmt,w,h))
    c=Canvas(1600,320)
    c.brand(50,43,220)
    c.text(330,42,'PHP security. Clear next steps.',47,WHITE,True,max_width=1200)
    c.text(330,119,'Free advisory, private version checker and response checklists.',24,LIGHT,max_width=1200)
    c.rect((330,185,440,60),CYAN,7)
    c.text(350,198,'bytova.co.uk/security.html',24,INK,True,max_width=400)
    c.text(824,197,'Sources checked 22 Oct 2026',18,LIGHT,max_width=720)
    records.append(c.save('website-banner','Bytova PHP security: clear next steps. Free advisory, private version checker and response checklists at bytova.co.uk/security.html. Sources checked 22 October 2026.'))
    (OUT/'alt-text.json').write_text(json.dumps({'status':'DRAFT - owner approval and live destination required before release','sources_checked':'2026-10-22','review_due':'2026-10-29','graphics':records},indent=2)+'\n')
    thumbw,thumbh=240,360
    sheet=Image.new('RGB',(thumbw*4,thumbh*3),'#eaf0f8')
    dr=ImageDraw.Draw(sheet)
    font=ImageFont.truetype(io.BytesIO(FONTS['regular']),10)
    for i,r in enumerate(records[:12]):
        im=Image.open(OUT/r['png']);im.thumbnail((thumbw-16,thumbh-45),Image.Resampling.LANCZOS)
        x=(i%4)*thumbw+(thumbw-im.width)//2;y=(i//4)*thumbh+15
        sheet.paste(im,(x,y))
        dr.text(((i%4)*thumbw+12,(i//4)*thumbh+thumbh-24),r['name'],font=font,fill=INK)
    png_buffer=io.BytesIO()
    sheet.save(png_buffer,format='PNG',optimize=True)
    pending=OUT/'contact-sheet.png.pending'
    pending.write_bytes(png_buffer.getvalue())
    pending.replace(OUT/'contact-sheet.png')
    pending=ROOT/'assets/security/security-social.png.pending'
    pending.write_bytes((OUT/'check-php-landscape.png').read_bytes())
    pending.replace(ROOT/'assets/security/security-social.png')
    html_cards='\n'.join(f'<article><h2>{html.escape(r["name"])}</h2><img src="{r["png"]}" alt="{html.escape(r["alt"],quote=True)}" width="{r["width"]}" height="{r["height"]}" loading="lazy"><p>{r["width"]} × {r["height"]} · <a href="{r["png"]}" download>PNG</a> · <a href="{r["svg"]}" download>Editable SVG</a></p></article>' for r in records)
    (OUT/'graphics-gallery.html').write_text(f'<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Bytova security campaign review gallery</title><style>body{{font:16px/1.5 Arial,sans-serif;background:#eef3fb;color:#0a1a5c;margin:32px}}main{{max-width:1300px;margin:auto}}.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:25px}}article{{padding:20px;background:white;border-radius:8px}}h2{{font-size:18px}}img{{width:100%;height:auto}}a{{color:#0a1a5c}}.notice{{padding:20px;border:1px solid #0a1a5c}}</style><main><h1>Bytova PHP security campaign</h1><p class="notice">DRAFT FOR OWNER APPROVAL. No posts, advertisements, emails or budgets have been activated. Verify sources and the live destination before publishing. Sources checked 22 October 2026; review due 29 October 2026.</p><p>13 designs in editable SVG and PNG. Four platform shapes for each of three educational themes, plus a website banner. Social platforms may crop previews: check the final composer before posting.</p><div class="grid">{html_cards}</div></main></html>')
    print(json.dumps({'designs':len(records),'pngs':len(records)+1,'svgs':len(records),'text_bounds_checked':sum(r['text_boxes'] for r in records),'og':'assets/security/security-social.png'},indent=2))


if __name__=='__main__':
    main()
