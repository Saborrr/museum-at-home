# Content and rights policy

Museum at Home is designed for commercial distribution. A famous artwork is not
automatically safe to distribute merely because a copy can be found online.
Each catalog record must document both the status of the artwork and the source
of the exact digital reproduction.

## Release requirements

An artwork can enter the generated TV catalog only when it has:

- a stable identifier;
- title, artist, year and museum;
- Russian and English descriptions;
- a clean local fallback image;
- an exact source page;
- a license or public-domain statement;
- `commercialUseAllowed: true`;
- at least two category tags;
- a manual visual review confirming that there are no visitors, frames,
  reflections, watermarks or unrelated objects.

Records explicitly marked `commercialUseAllowed: false` are excluded by the
build. The initial commercial blocklist includes Salvador Dalí's *The
Persistence of Memory* and René Magritte's *The Son of Man* until appropriate
licenses are obtained.

## Image profile

LG webOS renders app graphics at 1920×1080 on UHD models and 1280×720 on Full HD
models. Source images are therefore normalized to a clean 1920-pixel fallback
instead of bundling memory-heavy 4K files that the graphics layer cannot display
at native 4K.

Preferred release profile:

- JPEG, sRGB;
- longest useful display dimension at least 1920 px;
- no artificial sharpening or generative reconstruction;
- under 5 MB per image;
- no embedded personal metadata;
- `object-fit: contain` so the artwork is never cropped.

## Review workflow

1. Add metadata to `data/collection.json` or
   `data/russian-collection.json`.
2. Add the reviewed fallback to `img/paintings/<id>.jpg`.
3. Run `npm run validate`.
4. Review the image on both landscape and portrait artworks.
5. Commit the source URL and rights decision together with the asset.

AI may help draft descriptions, but it must not approve licenses or invent
facts. Museum object pages remain the primary reference.
