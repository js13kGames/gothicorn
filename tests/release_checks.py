from pathlib import Path
import re, subprocess, tempfile, zipfile
R=Path(__file__).resolve().parents[1]
p=R/'Gothicorn_SUBMISSION.zip'
assert p.exists() and p.stat().st_size <= 13312, p.stat().st_size
with zipfile.ZipFile(p) as z:
    assert z.namelist()==['index.html'], z.namelist()
    s=z.read('index.html')
    assert not re.search(rb'https?://|wss?://|fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|sourceMappingURL|console\.|debugger',s,re.I)
    js=s.split(b'<script>',1)[1].split(b'</script>',1)[0]
    with tempfile.NamedTemporaryFile(suffix='.js') as f:
        f.write(js); f.flush(); subprocess.run(['node','--check',f.name],check=True)
subprocess.run(['node',str(R/'tests/runtime_logic_checks.js')],check=True)
subprocess.run(['node',str(R/'tests/shipping_audio_checks.js')],check=True)
print('RELEASE CHECKS VERIFIED',p.stat().st_size,'bytes')
