"""Find the beat grid of a song so cuts can land on beats (for the beat style).

    uv run --with librosa python beats.py assets/song.mp3 [offset_seconds] > beats.json

Prints {"bpm", "beats": [...], "downbeats": [...], "drop"} with times in seconds from `offset`.
Downbeats are every 4th beat, phased to the loudest low-frequency hits; "drop" is the biggest energy jump.
"""
import json
import sys

import librosa
import numpy as np


def main(path, offset=0.0):
    y, sr = librosa.load(path, sr=22050, mono=True, offset=offset)
    tempo, frames = librosa.beat.beat_track(y=y, sr=sr, units="frames")
    beats = librosa.frames_to_time(frames, sr=sr)
    # low-band strength at each beat picks which of the 4 phases is the downbeat
    low = librosa.feature.rms(y=librosa.effects.preemphasis(y, coef=-0.97))[0]
    strength = low[np.minimum(frames, len(low) - 1)]
    phase = int(np.argmax([strength[p::4].mean() if len(strength[p::4]) else 0 for p in range(4)]))
    rms = librosa.feature.rms(y=y)[0]
    jump = np.diff(np.convolve(rms, np.ones(20) / 20, mode="same"))
    drop = float(librosa.frames_to_time(int(np.argmax(jump)), sr=sr))
    print(json.dumps({"bpm": round(float(np.atleast_1d(tempo)[0]), 2), "beats": [round(float(b), 3) for b in beats],
                      "downbeats": [round(float(b), 3) for b in beats[phase::4]], "drop": round(drop, 3)}))


if __name__ == "__main__":
    if len(sys.argv) not in (2, 3):
        raise SystemExit(__doc__)
    main(sys.argv[1], float(sys.argv[2]) if len(sys.argv) == 3 else 0.0)
