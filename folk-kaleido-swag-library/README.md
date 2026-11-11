# Folk / Kaleido / Swag

A Tamil-first procedural asset library for energetic hero compositions. Original screen-print shapes, paired radial symmetry, controlled optical depth, silhouette treatments and supplied-text typography. **This is an asset pack and a set of demonstration compositions, not a final music-video edit.** No celebrity photograph, soundtrack, song lyric or deity image is included.

## Contents

- **88 SVG masters**: 16 single source segments, 18 optical forms, 15 impacts, 15 transitions, 10 hero-treatment demonstrations, 11 supplied-text demonstrations and 3 texture fields.
- **176 transparent PNGs**: 88 masters plus 88 editing-size copies. Masters are 2160 × 2160 or 2160 × 2880; convenience copies are 1080 × 1080 or 1080 × 1440.
- **40 transparent VP9 WebMs**: 20 priority motions, each with a 2160px master and a 1080px editing copy. Every motion is evaluated at 30fps for 60 frames / 2 seconds. Central overlays are square; full-frame overlays use 3:4.
- **3 compatible Lottie animations**: exact circle/stroke/transform exports, not approximated SVG effects.
- **22 motion presets**, 12 generator APIs, 10 hero wrappers and 11 lyric wrappers.
- A local catalog, 5 rendered Remotion galleries and separate technical/art-direction proofs.

The 16 files under `assets/kaleidoscope/` are copies of the single-segment SVG masters, supplied for convenience. They contain one source segment, not a baked full kaleidoscope. `assets/cultural/neutral-hero.svg` is an original schematic person. All other `assets/*/*.config.json` files are reusable generator configurations. The old `south-indian-folk-motion-library/` is preserved; this package does not depend on its source at runtime.

## Installation and repository integration

The current checkout reuses the existing sibling package's **installed** npm dependencies through a local `node_modules` symlink. No second installation, root configuration change or modification of the previous library was needed. The seeded-random utility was derived into this folder from the existing library; the new package is self-contained in the ZIP.

```sh
cd /workspace/motion-assets/folk-kaleido-swag-library
npm run typecheck
npm run preview
```

For a fresh download, extract the ZIP into its own directory and run `npm ci`. The archive excludes the local dependency symlink. It includes an npm lockfile with the same pinned stack as the existing library: React 19.1.0, Remotion 4.0.387, TypeScript 5.9.2, Sharp 0.34.3 and tsx 4.20.5. The tested runtime is Node 24.22.1 / npm 11.9.0; Node 22 or newer is recommended. No additional runtime dependency was installed for this library.

The installed Sharp/librsvg build does not paint SVG `textPath`. The shared raster helper detects that feature and uses the existing Chromium renderer for its PNG and WebM exports; it does not approximate glyphs or supply a blank file. Other vector forms use Sharp.

Exports require FFmpeg / ffprobe with `libvpx-vp9`, Python 3 for strict XML checks, and system `zip` / `unzip` for packaging. Browser checks and Remotion use the existing `/usr/bin/chromium`; set `CHROMIUM_PATH` if installed elsewhere. Chromium temporary profiles use the short **local** `t/` directory to avoid Linux Unix-socket path-length limits. This directory and `.scratch/` are never packaged. `remotion.config.ts` disables Webpack caching so the shared dependency installation is not changed by bundling.

There are no API keys, network media, downloaded images or remote fonts. Installation needs the ordinary npm registry; all creative work and catalog operation are local.

## Preview and export

```sh
npm run preview                         # Remotion Studio; src/scenes/index.ts
npm run typecheck
npm run export:svg
npm run proof                           # Small still/contact-sheet and frame-strip proofs
npm run export:webm -- --draft           # 270px animation proofs first
npm run export:png                       # 2160px masters and 1080px copies
npm run export:webm                      # 20 master + editing pairs
npm run export:lottie
npm run catalog
npm run previews                        # All five demonstration videos
npm run proof:technical                  # Count matrix, face masks and preset checks
npm run proof:exports                    # Actual VP9 alpha on five review plates
npm run check:browser                    # Catalog, 1x playback and Lottie comparisons
npm run validate
npm run package
```

`npm run export:all` runs the principal steps in order. Review small proofs before starting the master WebM batch. SVG and configuration writers preserve byte-identical files. PNG and WebM exporters record rendering fingerprints and skip matching successful outputs. `--only=id,id` is supported by PNG, WebM and proof scripts for targeted revisions. A partial WebM is promoted only after FFmpeg exits successfully. Frames are streamed; no temporary render-frame sequence is stored. Validation compares encoded alpha with the current SVG evaluator before updating verified cache fingerprints.

Preview rendering skips existing video files and requests video-only output. `scripts/normalize-previews.ts` can remove silent AAC padding from older Remotion exports without re-encoding pictures; it verifies identical encoded-video hashes and exact durations. To revise a composition intentionally, render that composition directly with Remotion to its desired preview path, or remove only its own generated preview first. No command should remove or alter the older library. The package command preserves an already-existing final ZIP rather than silently replacing it.

The complete archive is `dist/folk-kaleido-swag-assets.zip`; a SHA-256 checksum accompanies it. The ZIP includes source, manifests, source configurations, exports, catalog and documentation; it excludes dependencies, browser binaries, build caches, frame caches and source maps.

## Catalog

Open `exports/catalog/index.html` in a normal local browser. It uses a bundled local script, static thumbnails and relative downloads; there is no fetch/API requirement. Managed Chrome blocks `file:` navigation, so use a local server there:

```sh
python3 -m http.server 8000
# Open /exports/catalog/ under that server.
```

The catalog supports category, export-format, loop/one-shot and beat-intensity filters; dark, light, vermilion and moving-background plates; neutral hero overlays; 6/8/12/16 segment counts; registration offset; beat strength; supplied text; preset selection; and individual master/editing downloads. Start one live SVG preview at a time. All 88 forms can animate live, including those without a pre-rendered WebM. The encoded WebM preview is also available for each priority asset.

The optional cutout selector accepts a local PNG or WebP for live hero previews. It stays in your browser as an object URL and is not uploaded or added to the package. Lyric inputs are blank or explicitly labelled English placeholders until you supply text. `PLACEHOLDER`, `TAMIL INPUT` and `ENGLISH INPUT` in proofs are demonstration labels, not generated lyrics or Tamil words.

## Generator and source-segment architecture

`src/generators/engine.ts` owns layout, transform, colour, safety-mask and export logic. `segments.ts` contains 16 compact source forms. Complete patterns are generated by repetition, paired mirroring and sector mattes. Precision geometry is separate from optional ink registration.

The public generators are `KaleidoscopeGenerator`, `RadialPatternGenerator`, `OpticalTunnelGenerator`, `HeroEchoGenerator`, `HeroSymmetryGenerator`, `KolamGenerator`, `TamilLetterRingGenerator`, `FolkPatternGenerator`, `ImpactBurstGenerator`, `TransitionMaskGenerator`, `LyricPatternGenerator` and `ScreenPrintTextureGenerator`. They return complete SVG strings. `Asset` and `RemotionAsset` are the React interfaces to the same evaluator.

```tsx
import {Asset, RemotionAsset, KaleidoscopeGenerator} from './src';

const markup = KaleidoscopeGenerator({
  asset: 'peacock-feather-segment',
  segments: 16,
  mirror: true,
  progress: 0.4,
  primaryColor: '#13706D',
  secondaryColor: '#D95B82',
  accentColor: '#171311',
  innerRadius: 145,
  outerRadius: 435,
  registrationOffset: 1.2,
  seed: 901,
});

const Pattern = () => <RemotionAsset
  id="peacock-feather-kaleidoscope"
  segments={8}
  durationInFrames={90}
  beatStrength={0.6}
  exclusionZones={[{x:390,y:320,width:300,height:280,kind:'face'}]}
/>;
```

Change `segments` to 6, 8, 12 or 16. `asset` selects a built-in segment; `sourceSvg` accepts your own **trusted** local SVG fragment in the same segment space. Source geometry is around x=0, y=-155 to -455 before radial placement. Keep it inside the narrowest 16-part wedge, give paths safe stroke joins and test all counts. Do not supply a full existing kaleidoscope as a source wedge.

Source SVG masters use a 2160px viewBox. **API layout, radii and exclusion coordinates use the 1080-unit design space** (1080 × 1080 or 1080 × 1440), which is scaled by two for vector masters. `Asset` preserves that aspect ratio in its container. When composing square overlays in a tall container, account for their centred square viewport before placing exclusion zones; the layer demo shows per-layer masks rather than one inaccurate global face box.

Generic controls include `progress`, `rotation`, `rotationSpeed`, `direction`, `zoom`, `opacity`, `strokeWidth`, `intensity`, `beatStrength`, `seed`, `durationInFrames`, `loop`, `blurAmount`, `registrationOffset` and `exclusionZones`. Family-specific controls include `segments`, `mirror`, `symmetryMode`, `innerRadius`, `outerRadius`, `twist`, `depth`, `copies`, `spacing`, `delayFrames` and `alternateColors`. A control is used where it has a meaningful role; for example `delayFrames` belongs to hero echoes, not a static pigment field.

For multiple SVG strings embedded into the same DOM, supply unique `instanceId` values to isolate masks/filters. The React wrapper assigns unique IDs automatically. Colours supplied to SVG filter-based hero treatments should be six-digit hex values.

## Timing, easing and beat maps

All creative randomness is seeded; no wall-clock or `Math.random` calls drive geometry. `frame` is the animation input; `progress` can explicitly override it. Duration defaults to 60 frames. Non-looping effects anticipate, hit and settle; looping optical forms return to a matching pose. Settled holds are intentional and are not accidental frame duplication. No 60fps file is supplied; a future 60fps export must evaluate twice as many actual frames, not duplicate the 30fps output.

`src/animations/easing.ts` implements elegant in/out, sharp impact, restrained overshoot, heavy settle, ceremonial, fast stamp, smooth orbit, controlled zoom, graceful sway, tension build and drop release curves. `motion.ts` keeps the 3-frame anticipation, 2-frame attack, short overshoot and 8-ish-frame settle separate from optical background movement. Direction reversals and palette changes are deliberate presets, not random oscillation. Short flash presets are one-shot, two-frame accents; do not repeat them rapidly.

```tsx
import {useCurrentFrame} from 'remotion';
import {Asset, evaluateBeatMap} from './src';
const frame = useCurrentFrame();
const strength = evaluateBeatMap(frame, [
  {frame:12,strength:.5,type:'regular'},
  {frame:30,strength:.7,type:'strong'},
  {frame:60,strength:1,type:'drop'},
]);
<Asset id="kolam-kaleidoscope" frame={frame}
  animationPreset="pattern-contract-before-drop"
  beatStrength={strength} intensity={.6} />;
```

Use separate layers and preset windows for anticipation and release rather than asking every layer to react at once. Regular beats generally favour 5–12% optical scale changes; preserve a strong hero hold while background detail moves. The layer demo makes one deliberate palette/pattern change at its drop and reserves foreground accents for that event.

## Hero cutouts and face safety

The wrappers are `HeroDuotone`, `HeroOutline`, `HeroEcho`, `HeroMirror`, `HeroContactSheet`, `HeroSlice`, `HeroColorShadow`, `HeroFreezeImpact`, `HeroTunnel` and `HeroKaleidoscope`.

```tsx
import {staticFile, useCurrentFrame} from 'remotion';
import {HeroEcho, HeroDuotone, Asset} from './src';
const frame = useCurrentFrame();
<HeroEcho src={staticFile('my-licensed-cutout.png')} frame={frame}
  copies={3} spacing={22} delayFrames={3}
  faceSafe={{x:420,y:300,width:240,height:260,kind:'face'}} />;
<HeroDuotone src={staticFile('my-licensed-cutout.png')} frame={frame}
  primaryColor="#C9342F" accentColor="#171311" />;
```

Use a clean transparent PNG or WebP, not an image with a white background. Filters preserve the source alpha; the source file is never modified. Two-colour treatment uses luminance remapping. Outlines are built from an alpha dilation **outside** the source, not a bright feather. Shadows and echoes use colourized alpha copies behind a sharp main cutout. Aspect ratio is preserved; the cutout is contained in a stable grounded box.

Contact sheets support `columns`, `copies` and `spacing`, with grid spacing clamped to the design frame. Face-safe regions on slices restore the sharp original within the protected region.

Face zones use rounded exclusion mattes for optical backgrounds. Hero `faceSafe` / exclusion controls suppress supporting echoes/shadows/tunnel copies while preserving the main cutout. Mirror and contact-sheet modes deliberately duplicate the supplied image; place them as supporting treatments or choose a main `HeroDuotone` / untreated layer above them. Keep a clean main face above any sliced or radial treatment when identity clarity is essential. Do not expect an effect to repair a poorly keyed source image. Main hero and lyric layers are excluded from automatic velocity blur; optional deterministic directional blur supports fast optical detail and returns to zero on holds.

## Lyric motion

The wrappers are `LyricStamp`, `LyricBehindHero`, `LyricCircularRing`, `LyricMirrorPair`, `LyricRepeatedBackground`, `LyricScalePunch`, `LyricSliceReveal`, `LyricBeatSequence`, `LyricKaleidoscopeTexture`, `LyricTunnel` and `TamilEnglishAlternator`.

```tsx
import {LyricStamp, TamilEnglishAlternator} from './src';
<LyricStamp text={userSuppliedLine} frame={frame}
  foregroundColor="#F0D9A4" accentColor="#171311"
  safeArea={100} showGuides={false} />;
<TamilEnglishAlternator textTa={suppliedTamil}
  textEn={suppliedEnglish} frame={frame} />;
```

Default lyric API text is empty; supply the line explicitly. No text is invented or translated. Font family is configurable and shaping is performed by SVG/browser font support. Supply and license a suitable Tamil font in your own project when using actual Tamil text; no external font is bundled here. Proofs use local sans-serif with clear English placeholder labels.

Responsive sizing, centred baselines, consistent margins and restrained outlines support short words/lines. Circular and kaleidoscope type are ornamental supporting layers; use a short supplied phrase and a separate primary headline for full readability. Do not feed paragraphs into radial cells. Break long lyrics into separate readable lines/components and verify them in your actual font and frame format. Safe-area guides and exclusion masks can reserve the face or subtitle region. Mirrored lyric pairs duplicate readable text; they do not horizontally reverse the glyphs.

## Layer order

1. A minimal coloured background.
2. Optical/kaleidoscopic pattern, with a face/body matte.
3. Supporting cultural ornament.
4. Hero echo and colour-shadow copies.
5. A clean main cutout.
6. Supplied lyric typography.
7. Limited foreground petals or print detail, masked away from the face and headline.
8. A restrained finishing texture.

`SwagLayerDemo` is a four-second, 1080 × 1440 example using this order, procedural beat timing, an original neutral silhouette and a clearly labelled placeholder. It includes no song audio and is not a fan edit or final song sequence. The other four galleries use 960 × 540 review renders of 1920 × 1080 compositions to avoid wasting master-render resources.

## Formats and editing applications

SVG and PNG masters are the highest-fidelity stills. RGB source colours are authored in sRGB with limited flat palettes. VP9 uses straight alpha and YUV 4:2:0 colour compression; its alpha plane is checked by decoding with the alpha-capable libvpx decoder. Do not infer missing transparency merely because a generic ffprobe decoder reports `yuv420p`: inspect AlphaMode and decode with `libvpx-vp9`.

WebM works in supporting browsers/editors. Premiere, Resolve and After Effects support varies by version/plugin. For an editor-native alpha intermediate:

```sh
ffmpeg -c:v libvpx-vp9 -i exports/webm/masters/peacock-feather-kaleidoscope.webm \
  -c:v prores_ks -profile:v 4 -pix_fmt yuva444p10le \
  peacock-feather-kaleidoscope-prores4444.mov
```

Select straight/unmatted alpha when asked. Do not flatten over black before converting. ProRes versions are not bundled. Check colour management in the receiving project; source-vector/PNG masters are the sRGB reference, while video compression and editor display pipelines may introduce small differences.

Transitions are reusable decorative alpha mattes with safe gutters, not a complete scene switch. Use their alpha as a track matte or drive their progress in a parent composition. Expand or precompose the matte in your edit if it must cover the entire output. Keep separate one-shot transitions and looping backgrounds according to the manifest; they are not interchangeable.

## Lottie

`pulse-target`, `print-stamp-circle` and `drum-pulse-impact` are the exact supported subset. Ellipse geometry, stroke widths, transform, opacity and frame sampling match the SVG evaluator. Chromium renders the exported Lottie JSON at four frames per asset and compares alpha against SVG.

Other assets use sector mattes, compound geometry, text shaping, raster-capable filters or local deformation. They intentionally have no Lottie file, and each manifest explains that limitation. Do not route a hero PNG, blurred composite or complex kaleidoscope through this subset exporter and claim equivalence. All source animations still work through React/SVG/Remotion.

## Cultural use

These are original interpretive shapes grounded in Tamil/South Indian kolam studies, temple-car craft, textiles, peacock-feather eyes, lotus, jasmine, banana leaves, abstract brush marks and instrument-inspired rhythm. They are not museum reconstructions, authenticated kolam diagrams or ritual instructions. No named deity or sectarian emblem is depicted. An ornamental eye refers to feather ornament, not an imported religious symbol.

`Tamil-letter-segment`, `Tamil-letter-ring` and related assets contain **non-linguistic abstract strokes**. They are not correct Tamil words, mantras or guaranteed letter shapes. Supply actual Tamil writing separately and review spelling, shaping and context. Do not label these abstractions as a historical inscription. Parai/thavil references are graphic rhythm studies, not technical instrument diagrams or a claim that all communities use them identically.

For a ritual, heritage, community-specific or institutional commission, seek contextual review from a knowledgeable Tamil practitioner. No outside cultural expert review, endorsement, specific designer imitation or copyrighted campaign recreation is claimed.

## Extending the library

Add a segment to `segments.ts`, register its ID and create an asset configuration in `manifests/assets.json`. Keep a coherent narrow wedge for all four supported counts. Prefer deriving a new variant from a strong generator instead of adding another independent component. Add beat windows through `evaluateMotion` and document timing/loop behaviour in `manifests/presets.json`. Then generate small proofs, evaluate all counts, test masks and exports, and only promote successful masters.

The JSON manifests are the authoritative export definitions. `scripts/create-manifests.py` is the original manifest bootstrap; keep any project-specific changes in sync if you intentionally rerun it. `preservation-baseline.json` records hashes of the prior library for this build's no-overwrite check. In a fresh ZIP without the sibling checkout, preservation verification is reported as not applicable; it is not a missing asset dependency.

## Quality-control evidence and limits

`exports/previews/validation-report.json` records actual automated results. Separate QC images show silhouette, monochrome timing, colour, compositing, segment-count symmetry and frame stepping. Browser tests load all 88 previews, exercise filters/backgrounds, advance live animation, play all five composition videos at 1x and compare 12 Lottie frames. The validator parses SVG/JSON, checks viewBoxes/IDs/paths, tests geometry at five frame samples per asset, compares loop joins, decodes all 40 VP9 files, verifies alpha against the current renderer, checks raster hero filters, and confirms the prior library's recorded files are unchanged.

The art-direction pass uses contact sheets, full-size/hold-frame checks and frame strips; browser playback tests are automated actual-speed playback, not a claim that an outside human watched or approved the work. Background checks use black, light, vermilion and a procedural moving plate with neutral silhouettes; no external moving footage is supplied or bundled. Test over your own footage before final delivery. Optional 60fps, ProRes, actual Tamil font files, full song edits and Lottie approximations of unsupported effects are not included.
