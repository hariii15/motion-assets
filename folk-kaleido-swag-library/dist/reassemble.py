#!/usr/bin/env python3
"""Reassemble the original ZIP from GitHub-safe parts; verify its SHA-256."""
import argparse
import hashlib
from pathlib import Path

root = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=root / 'folk-kaleido-swag-assets.zip')
args = parser.parse_args()
expected = (root / 'folk-kaleido-swag-assets.zip.sha256').read_text().split()[0]
parts = sorted(root.glob('folk-kaleido-swag-assets.zip.part[0-9][0-9][0-9]'))
if len(parts) != 2:
    raise SystemExit('Download both .part001 and .part002 files beside this script.')
if args.output.exists():
    if hashlib.sha256(args.output.read_bytes()).hexdigest() == expected:
        print('Existing ZIP verified:', args.output)
        raise SystemExit(0)
    raise SystemExit('Output already exists with different contents; choose another --output.')
args.output.parent.mkdir(parents=True, exist_ok=True)
digest = hashlib.sha256()
with args.output.open('xb') as out:
    for part in parts:
        with part.open('rb') as source:
            while block := source.read(1024 * 1024):
                digest.update(block)
                out.write(block)
if digest.hexdigest() != expected:
    raise SystemExit('Checksum mismatch: do not extract this output; download the parts again.')
print('ZIP assembled and SHA-256 verified:', args.output)
