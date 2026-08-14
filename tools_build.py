from pathlib import Path
import re, zipfile
R=Path(__file__).parent
parts=['data.js','input.js','audio.js','render.js','combat.js','game.js']
js='\n'.join((R/'src'/p).read_text() for p in parts)
js=re.sub(r'(?m)^\s*//.*(?:\n|$)','',js)
js=re.sub(r'\n\s*','\n',js)
js=re.sub(r'\n+','\n',js)
tpl=(R/'src/index.template.html').read_text()
html=tpl.replace('/*__JS__*/',js)
(R/'dist').mkdir(exist_ok=True)
(R/'dist/index.html').write_text(html)
zi=zipfile.ZipInfo('index.html',(2026,8,13,0,0,0))
zi.compress_type=zipfile.ZIP_DEFLATED
zi.external_attr=0o100644<<16
with zipfile.ZipFile(R/'Gothicorn_SUBMISSION.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    z.writestr(zi,html.encode())
print('dist bytes',len(html.encode()))
print('submission zip bytes',(R/'Gothicorn_SUBMISSION.zip').stat().st_size)
