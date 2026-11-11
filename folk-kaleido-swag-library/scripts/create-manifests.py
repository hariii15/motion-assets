from pathlib import Path
import json
P=Path('.')
segments='peacock-feather-segment kolam-wedge-01 kolam-wedge-02 temple-car-wheel-segment lotus-petal-segment jasmine-chain-segment textile-diamond-segment banana-leaf-segment folk-flame-segment ornamental-eye-segment painted-arrow-segment Tamil-letter-segment mural-brush-segment parai-rhythm-segment flower-chain-segment temple-arch-segment'.split()
optical='concentric-kolam-rings checkerboard-tunnel flower-spiral radial-textile-pattern rotating-diamond-grid expanding-temple-arches circular-Tamil-letter-ring warped-dot-field pulse-target spiral-garland mirrored-peacock-ring lotus-depth-tunnel temple-wheel-portal block-print-vortex kolam-infinity-tunnel'.split()
impact='folk-impact-star brush-burst petal-explosion kolam-shatter radial-arrow-burst print-stamp-circle painted-speed-lines flower-impact-ring Tamil-letter-burst screen-print-cloud peacock-feather-burst turmeric-powder-burst vermilion-stamp-impact drum-pulse-impact mirrored-leaf-impact'.split()
trans='kaleidoscope-iris radial-shutter mirrored-wedge-wipe kolam-tunnel-transition flower-spiral-wipe temple-wheel-transition Tamil-letter-tunnel textile-zoom-wipe hero-silhouette-wipe colour-stamp-transition peacock-feather-iris lotus-petal-shutter block-print-flip mirrored-arch-transition flower-chain-sweep'.split()
heroes=['hero-duotone-demo','hero-outline-demo','hero-echo-demo','hero-mirror-demo','hero-contact-sheet-demo','hero-slice-demo','hero-colour-shadow-demo','hero-freeze-impact-demo','hero-tunnel-demo','hero-kaleidoscope-demo']
lyrics=['lyric-stamp-demo','lyric-behind-hero-demo','lyric-circular-demo','lyric-mirror-pair-demo','lyric-repeated-background-demo','lyric-scale-punch-demo','lyric-slice-reveal-demo','lyric-beat-sequence-demo','lyric-kaleidoscope-demo','lyric-tunnel-demo','Tamil-English-alternator-demo']
priority='peacock-feather-kaleidoscope kolam-kaleidoscope temple-wheel-portal lotus-depth-tunnel radial-textile-pattern Tamil-letter-ring checkerboard-tunnel spiral-garland flower-impact-ring peacock-feather-burst kolam-shatter kaleidoscope-iris mirrored-wedge-wipe textile-zoom-wipe flower-spiral-wipe hero-echo-demo hero-mirror-demo hero-slice-demo lyric-circular-demo lyric-kaleidoscope-demo'.split()
presetNames='slow-kaleido-rotation beat-kaleido-pulse kaleido-direction-reversal radial-zoom-punch optical-tunnel-push mirrored-snap hero-echo-trail hero-colour-shadow-impact hero-contact-sheet-flash hero-slice-shift kolam-draw-and-burst flower-ring-expansion Tamil-letter-orbit temple-wheel-portal peacock-feather-open block-print-stamp colour-palette-swap short-cream-flash short-vermilion-flash pattern-contract-before-drop drop-expansion poster-change-impact'.split()
notes={
'kaleidoscope':'Original repeatable segment studies from Tamil kolam geometry, southern textiles, botanical ornament and temple-car craft. Sources remain single segments, not baked radial patterns. Ornamental eye is a feather-eye motif, not a religious emblem.',
'optical':'Contemporary optical compositions derived from Tamil threshold geometry, wooden temple-car wheels, textile repeats and local floral forms. These are decorative studies, not sacred diagrams or named historical designs.',
'impact':'Celebratory print marks and rhythmic floral or geometric dispersal. No weapons, literal explosions, deity symbols or Western comic-book insignia.',
 'transitions':'Ornamental alpha mattes motivated by wheels, leaves, textile edges and kolam. Transparent gutters are intentional; expand the matte in your edit to cover a full frame.',
'hero':'Original neutral human silhouette only. Supply your own rights-cleared transparent PNG or WebP; no celebrity image, user photograph or earlier hero cutout is included.',
 'typography':'Demo labels are English placeholders, not lyrics. The API defaults to empty text. Tamil-inspired marks elsewhere are non-linguistic fragments, never invented Tamil words or authenticated glyphs.',
 'textures':'Seeded fine pigment, paper-fibre and registration studies. No grunge, scratches or external texture photographs.'}
colors=[['#C9342F','#E4A928','#171311','#F0D9A4'],['#13706D','#D95B82','#171311','#F0D9A4'],['#24305E','#C9342F','#F0D9A4','#E4A928']]
assets=[]
def preset(id,cat):
 if cat=='kaleidoscope':return 'slow-kaleido-rotation'
 if cat=='transitions':return 'drop-expansion' if 'iris' in id or 'tunnel' in id else 'mirrored-snap' if 'wedge' in id or 'flip' in id else 'optical-tunnel-push'
 if cat=='impact':return 'flower-ring-expansion' if 'flower' in id else 'kolam-draw-and-burst' if 'kolam' in id else 'block-print-stamp' if 'stamp' in id else 'drop-expansion'
 if cat=='hero':return 'hero-echo-trail' if 'echo' in id else 'hero-slice-shift' if 'slice' in id else 'hero-contact-sheet-flash' if 'sheet' in id else 'hero-colour-shadow-impact' if 'shadow' in id else 'mirrored-snap' if 'mirror' in id else 'radial-zoom-punch'
 if cat=='typography':return 'Tamil-letter-orbit' if 'circular' in id else 'optical-tunnel-push' if 'tunnel' in id else 'block-print-stamp'
 if cat=='textures':return 'colour-palette-swap'
 return 'temple-wheel-portal' if 'wheel' in id else 'Tamil-letter-orbit' if 'Tamil' in id else 'optical-tunnel-push' if 'tunnel' in id else 'flower-ring-expansion' if 'garland' in id else 'beat-kaleido-pulse'
def add(ids,cat,gen):
 for id in ids:
  i=len(assets);full=cat in ['transitions','hero','typography'] or id in ['checkerboard-tunnel','lotus-depth-tunnel','kolam-infinity-tunnel','expanding-temple-arches'];loop=cat not in ['impact','transitions'] and not (cat=='hero' and any(x in id for x in ['freeze','slice','shadow']))
  pal=colors[(i//3)%3]; anim=preset(id,cat);web=id in priority;lot=id in ['pulse-target','print-stamp-circle','drum-pulse-impact'];fmt='full-frame' if full else 'central';w,h=2160,2880 if full else 2160
  a={'id':id,'displayName':id.replace('-',' ').title(),'category':cat,'sourceFilename':id+'.svg','generator':gen,'variant':id,'palette':pal,'animationPreset':anim,'durationInFrames':60,'fps':30,'loop':loop,'recommendedBeatType':'ambient' if cat=='textures' else 'transition' if cat=='transitions' else 'downbeat' if cat in ['impact','hero'] else 'secondary beat','recommendedLayer':{'kaleidoscope':'optical background','optical':'optical background','impact':'supporting accent / behind hero','transitions':'transition alpha matte','hero':'hero treatment','typography':'lyric foreground','textures':'finishing texture'}[cat],'segmentCounts':[6,8,12,16],'heroSafe':True,'lyricSafe':True,'webmPath':f'exports/webm/{id}.webm' if web else None,'webmMasterPath':f'exports/webm/masters/{id}.webm' if web else None,'svgPath':f'exports/svg/{id}.svg','pngPath':f'exports/png/{id}.png','png1080Path':f'exports/png/1080/{id}.png','previewPath':f'exports/previews/thumbs/{id}.png','lottiePath':f'exports/lottie/{id}.json' if lot else None,'lottieCompatible':lot,'lottieLimitation':None if lot else 'Excluded from the exact circle/transform Lottie subset: uses wedge mattes, compound repeated ornament, text shaping, raster-capable filters or staged local deformation. React/SVG animation remains supported.','compatibleAssets':[],'usageNotes':f'{fmt}; transparent padding; use with face and lyric exclusion zones. '+('Single source wedge: feed this into KaleidoscopeGenerator; preview repetition is not baked into this SVG. ' if cat=='kaleidoscope' else '')+('User-supplied text only; PLACEHOLDER in demos is not a lyric. ' if cat=='typography' else ''),'culturalNotes':notes[cat],'masterWidth':w,'masterHeight':h,'editingWidth':1080,'editingHeight':1440 if full else 1080,'seed':701+i*97,'defaultSegments':12 if cat!='hero' else 6,'sourceAsset':segments[i%len(segments)],'exportFrames':60 if web else None,'isSourceSegment':cat=='kaleidoscope','alphaMode':'straight','colorSpace':'sRGB','safePadding':72,'loopVariant':('loop' if loop else 'one-shot')}
  assets.append(a)
add(segments,'kaleidoscope','KaleidoscopeGenerator')
add(optical,'optical','OpticalTunnelGenerator')
add(impact,'impact','ImpactBurstGenerator')
add(trans,'transitions','TransitionMaskGenerator')
add(['peacock-feather-kaleidoscope','kolam-kaleidoscope','Tamil-letter-ring'],'optical','KaleidoscopeGenerator')
add(heroes,'hero','HeroEchoGenerator')
add(lyrics,'typography','LyricPatternGenerator')
add(['fine-pigment-grain','paper-fibre-field','registration-diamond-print'],'textures','ScreenPrintTextureGenerator')
for a in assets:
 if a['id'] in ['Tamil-letter-ring','circular-Tamil-letter-ring','radial-textile-pattern']:a['defaultSegments']=16
 if a['id']=='hero-mirror-demo':a['loop']=False;a['loopVariant']='one-shot'
 if a['category']=='typography':
  a['loop']=a['id'] in ['lyric-circular-demo','lyric-kaleidoscope-demo','lyric-tunnel-demo'];a['loopVariant']='loop' if a['loop'] else 'one-shot'
  if a['id']=='lyric-kaleidoscope-demo':a['animationPreset']='slow-kaleido-rotation'
 if a['id']=='drum-pulse-impact':a['animationPreset']='flower-ring-expansion'
 if a['id']=='vermilion-stamp-impact':a['palette']=['#C9342F','#E4A928','#171311','#F0D9A4']
 if a['id']=='turmeric-powder-burst':a['palette']=['#E4A928','#F0D9A4','#171311','#C9342F']
 if a['id']=='peacock-feather-kaleidoscope':a['sourceAsset']='peacock-feather-segment'
 if a['id']=='kolam-kaleidoscope':a['sourceAsset']='kolam-wedge-01'
 if a['id']=='Tamil-letter-ring':a['sourceAsset']='Tamil-letter-segment'
 a['compatibleAssets']=[b['id'] for b in assets if b['category']!=a['category'] and b['id'] in ['kolam-kaleidoscope','hero-duotone-demo','flower-impact-ring','lyric-stamp-demo','fine-pigment-grain']][:3]
# Each preset has the same complete metadata schema, plus timing, easing and pose controls.
entries=[]
for j,id in enumerate(presetNames):
 base=next((a for a in assets if a['animationPreset']==id),assets[j%len(assets)])
 entry={k:v for k,v in base.items()};entry.update(id=id,displayName=id.replace('-',' ').title(),category='motion-preset',sourceFilename='src/animations/motion.ts',generator='evaluateMotion',variant=id,animationPreset=id,svgPath=None,pngPath=None,png1080Path=None,previewPath=None,webmPath=None,webmMasterPath=None,lottiePath=None,lottieCompatible=False,exampleAsset=base['id'],usageNotes='Frame-based pose evaluator. Apply to a relevant asset; quiet holds surround motivated accents. Flash presets are one-shot only and gated to one two-frame accent.',timing={'anticipationFrames':3,'impactFrames':2,'overshootFrames':3,'settleFrames':8,'minimumFlashSeparationFrames':15},easing=['tension build','sharp impact','heavy settle'],loop=False if 'flash' in id or 'drop' in id else base['loop'])
 entries.append(entry)
(P/'manifests/assets.json').write_text(json.dumps(assets,indent=2)+'\n');(P/'manifests/presets.json').write_text(json.dumps(entries,indent=2)+'\n');(P/'manifests/cultural-notes.json').write_text(json.dumps({'scope':'Tamil-first original procedural visual studies, not historical transcriptions. No deities, invented Tamil words or celebrity pictures.','categories':notes,'textPolicy':'Only supplied text is rendered by lyric APIs. Exported demos use the literal English label PLACEHOLDER; abstract Tamil-derived curves are explicitly non-linguistic.','review':'No external cultural practitioner review is claimed. Seek contextual review for ritual, heritage or community-specific commissions.'},indent=2)+'\n')
print(len(assets),'assets;',len(entries),'presets;',len(priority),'priority animations')
