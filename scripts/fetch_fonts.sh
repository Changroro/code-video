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
