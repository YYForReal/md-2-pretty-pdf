#!/usr/bin/env python3
"""Build an allowlisted static release; never publish local settings or credentials."""
from pathlib import Path
import argparse, hashlib, json, re, shutil, subprocess
from urllib.parse import urlsplit, unquote

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=root / 'dist')
args = parser.parse_args()
out = args.output.resolve()
if out == root or root in out.parents and out.parts[len(root.parts)] in ['js', 'styles', 'assets']:
    raise SystemExit('Output must not overwrite source directories')
# Refuse to erase a pre-existing directory; an explicit new output makes releases reviewable.
out.mkdir(parents=True, exist_ok=False)
for name in ['index.html', 'js', 'styles', 'assets', 'sample.md', 'LICENSE']:
    source = root / name
    if source.is_dir():
        shutil.copytree(source, out / name, ignore=shutil.ignore_patterns('.*', '__pycache__'))
    else:
        shutil.copy2(source, out / name)
html = (out / 'index.html').read_text()
for attr, value in re.findall(r'(src|href)="([^"]+)"', html):
    url = urlsplit(value)
    if url.scheme or url.netloc or value.startswith(('#', '../')):
        continue
    path = out / unquote(url.path)
    if not path.is_file():
        raise SystemExit('Missing runtime asset: ' + value)
files = []
for path in sorted(out.rglob('*')):
    if path.is_file():
        path.chmod(0o644)
        files.append({'path': path.relative_to(out).as_posix(), 'bytes': path.stat().st_size,
                      'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
commit = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
manifest = {'source_commit': commit, 'base_path': '/home/toy/md2pdf/', 'files': files,
            'external_runtime_dependency': 'MathJax 3.2.2 via cdn.jsdelivr.net; core Markdown/printing runs locally',
            'ai_background': 'optional user-configured provider; no shared server credential'}
(out / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
print(json.dumps({'output': str(out), 'files': len(files), 'source_commit': commit}))
