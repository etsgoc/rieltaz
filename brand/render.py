import sys, os
from playwright.sync_api import sync_playwright

def house(fg, door, scale=1.0, cx=256, cy=270):
    s = scale
    return f'''<g transform="translate({cx} {cy}) scale({s}) translate(-256 -270)">
<path d="M112 266 L256 140 L400 266" fill="none" stroke="{fg}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M158 262 L256 176 L354 262 V388 a28 28 0 0 1 -28 28 H186 a28 28 0 0 1 -28 -28 Z" fill="{fg}"/>
<path d="M222 416 V350 a34 34 0 0 1 68 0 V416 Z" fill="{door}"/></g>'''

def svg(w, h, body): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'

DARK, LIGHT, BLUE, BLUE_L = '#1e1e1e', '#ededed', '#2c58d6', '#7ba3ff'

def tile(bg, fg, door, rx=112, scale=1.0):
    return svg(512, 512, f'<rect width="512" height="512" rx="{rx}" fill="{bg}"/>' + house(fg, door, scale))

jobs = {}  # path -> (svg, size, transparent)
def add(path, markup, size, transparent=False): jobs[path] = (markup, size, transparent)

def build(app, root):
    bg, door = (DARK, BLUE_L) if app != 'admin' else (BLUE, DARK)
    fg = LIGHT if app != 'admin' else '#ffffff'
    os.makedirs(root, exist_ok=True)
    open(f'{root}/favicon.svg', 'w').write(svg(512, 512, f'<style>rect.t{{fill:{bg}}}</style><rect class="t" width="512" height="512" rx="112"/>' + house(fg, door)))
    add(f'{root}/apple-touch-icon.png', tile(bg, fg, door, rx=0, scale=0.9), 180)
    add(f'{root}/icon-192.png', tile(bg, fg, door), 192)
    add(f'{root}/icon-512.png', tile(bg, fg, door), 512)
    add(f'{root}/icon-maskable-512.png', tile(bg, fg, door, rx=0, scale=0.72), 512)
    add(f'{root}/favicon-32.png', tile(bg, fg, door, rx=96), 32)
    add(f'{root}/favicon-48.png', tile(bg, fg, door, rx=96), 48)
    og = svg(1200, 630, f'<rect width="1200" height="630" fill="{DARK}"/><g transform="translate(90 190) scale(0.5)">' + tile(DARK, LIGHT, BLUE_L, rx=112).replace('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">', '').replace('</svg>', '') + f'</g><text x="90" y="520" font-family="Arial, Helvetica, sans-serif" font-size="46" fill="{LIGHT}" font-weight="700">Reeltaz</text><text x="90" y="575" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#a3a3a3">Residences in Phuket, with a clear path to reserve</text>')
    if app == 'web': add(f'{root}/og.png', og, 1200)

mobile = 'mobile/assets'
os.makedirs(mobile, exist_ok=True)
add(f'{mobile}/icon.png', tile(DARK, LIGHT, BLUE_L, rx=0, scale=0.9), 1024)
add(f'{mobile}/adaptive-icon.png', svg(512, 512, house(LIGHT, BLUE_L, 0.62)), 1024, True)
add(f'{mobile}/splash-icon.png', svg(512, 512, house(LIGHT, BLUE_L, 0.9)), 1024, True)
add(f'{mobile}/favicon.png', tile(DARK, LIGHT, BLUE_L, rx=96), 48)
build('web', 'web/public'); build('admin', 'admin/public')

with sync_playwright() as p:
    b = p.chromium.launch()
    for path, (markup, size, transparent) in jobs.items():
        import re
        m = re.search(r'viewBox="0 0 (\d+) (\d+)"', markup)
        vw, vh = int(m.group(1)), int(m.group(2))
        h = round(size * vh / vw)
        pg = b.new_page(viewport={'width': size, 'height': h})
        pg.set_content(f'<html><body style="margin:0;background:transparent"><div style="width:{size}px;height:{h}px">{markup.replace("<svg ", f"<svg style=\"width:{size}px;height:{h}px;display:block\" ", 1)}</div></body></html>')
        pg.screenshot(path=path, omit_background=transparent)
        pg.close()
    b.close()

from PIL import Image
for app in ('web', 'admin'):
    imgs = [Image.open(f'{app}/public/favicon-{s}.png') for s in (32, 48)]
    imgs[1].save(f'{app}/public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[imgs[0]])
print('ok')
