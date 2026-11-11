# Download the complete asset ZIP

GitHub limits ordinary repository files to 100 MB. The original 158 MiB ZIP is
therefore stored here in two parts. Both parts, the checksum and the helper are
included when cloning or downloading this repository.

From the repository root, run:

```sh
python3 folk-kaleido-swag-library/dist/reassemble.py
```

On Windows, `python` or `py` can be used instead of `python3`.

The script creates `folk-kaleido-swag-assets.zip` beside the parts and verifies
its SHA-256 before reporting success. It preserves an existing output and never
overwrites one with different contents. The resulting archive is byte-for-byte
the validated original asset pack. Extract it to use the standalone library.

For individual assets and the local catalog, use `../exports/` directly; no ZIP
assembly is needed. Open `../exports/catalog/index.html` after downloading the
repository, or serve the library directory with a local HTTP server.
