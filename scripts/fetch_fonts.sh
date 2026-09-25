#!/usr/bin/env bash
# Download OFL fonts into <dir> (default assets/fonts). Fails loudly on any missing file.
set -euo pipefail
dir="${1:-assets/fonts}"; mkdir -p "$dir"
get() { curl -fsSL -o "$dir/$1" "$2" || { echo "font download failed: $1 <- $2" >&2; exit 1; }; echo "ok $1"; }
GF=https://github.com/google/fonts/raw/main/ofl
get Pretendard-ExtraBold.otf https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/Pretendard-ExtraBold.otf
get BlackHanSans-Regular.ttf "$GF/blackhansans/BlackHanSans-Regular.ttf"
get Gaegu-Bold.ttf "$GF/gaegu/Gaegu-Bold.ttf"
get NanumMyeongjo-ExtraBold.ttf "$GF/nanummyeongjo/NanumMyeongjo-ExtraBold.ttf"
get PressStart2P-Regular.ttf "$GF/pressstart2p/PressStart2P-Regular.ttf"
get Geist.ttf "$GF/geist/Geist%5Bwght%5D.ttf"
get PlayfairDisplay.ttf "$GF/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf"
# used by the scene-API styles (arcade, terminal, thermal, transit, blueprint)
PJ=https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static
get Pretendard-Regular.otf "$PJ/Pretendard-Regular.otf"
get Pretendard-Bold.otf "$PJ/Pretendard-Bold.otf"
get Pretendard-Black.otf "$PJ/Pretendard-Black.otf"
get Galmuri11-Bold.ttf https://cdn.jsdelivr.net/npm/galmuri@2.40.3/dist/Galmuri11-Bold.ttf
get NanumGothicCoding-Regular.ttf "$GF/nanumgothiccoding/NanumGothicCoding-Regular.ttf"
get NanumGothicCoding-Bold.ttf "$GF/nanumgothiccoding/NanumGothicCoding-Bold.ttf"
get IBMPlexMono-Regular.ttf "$GF/ibmplexmono/IBMPlexMono-Regular.ttf"
# used by the style modules (handdrawn.js, motion.js, lyric.js, sand.js, comic.js, toon.js, scrapbook.js, particles.js, splitflap.js, neon.js)
get SourceSerif4.ttf "$GF/sourceserif4/SourceSerif4%5Bopsz,wght%5D.ttf"
get Caveat.ttf "$GF/caveat/Caveat%5Bwght%5D.ttf"
get Cormorant.ttf "$GF/cormorant/Cormorant%5Bwght%5D.ttf"
get Cormorant-Italic.ttf "$GF/cormorant/Cormorant-Italic%5Bwght%5D.ttf"
get Poppins-SemiBold.ttf "$GF/poppins/Poppins-SemiBold.ttf"
get Poppins-Bold.ttf "$GF/poppins/Poppins-Bold.ttf"
get IBMPlexSans.ttf "$GF/ibmplexsans/IBMPlexSans%5Bwdth,wght%5D.ttf"
get IBMPlexMono-Medium.ttf "$GF/ibmplexmono/IBMPlexMono-Medium.ttf"
get NanumMyeongjo-Regular.ttf "$GF/nanummyeongjo/NanumMyeongjo-Regular.ttf"
get Bangers-Regular.ttf "$GF/bangers/Bangers-Regular.ttf"
get DoHyeon-Regular.ttf "$GF/dohyeon/DoHyeon-Regular.ttf"
get Fredoka.ttf "$GF/fredoka/Fredoka%5Bwdth,wght%5D.ttf"
get Jua-Regular.ttf "$GF/jua/Jua-Regular.ttf"
get PermanentMarker-Regular.ttf "https://github.com/google/fonts/raw/main/apache/permanentmarker/PermanentMarker-Regular.ttf"
get RobotoMono.ttf "$GF/robotomono/RobotoMono%5Bwght%5D.ttf"
get TiltNeon.ttf "$GF/tiltneon/TiltNeon%5BXROT,YROT%5D.ttf"
# used by the brand presets (brand.js): free substitutes, never the brands' own fonts
get Inter.ttf "$GF/inter/Inter%5Bopsz,wght%5D.ttf"
get Manrope.ttf "$GF/manrope/Manrope%5Bwght%5D.ttf"
get Archivo.ttf "$GF/archivo/Archivo%5Bwdth,wght%5D.ttf"
get Anton-Regular.ttf "$GF/anton/Anton-Regular.ttf"
get DMSans.ttf "$GF/dmsans/DMSans%5Bopsz,wght%5D.ttf"
get GeistMono.ttf "$GF/geistmono/GeistMono%5Bwght%5D.ttf"
