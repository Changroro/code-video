"""Synthesize background music and sound effects from audio.json into audio.wav.

    uv run --with numpy --with scipy python audio.py audio.json audio.wav

audio.json (times in seconds, same clock as the video):
{
  "dur": 30, "bpm": 100, "key": "D", "mode": "major",
  "chords": ["I", "V", "vi", "IV"],               # one chord per bar, looped
  "sections": [[0, 8, 0.3], [8, 26, 0.9], [26, 30, 0.5]],   # [start, end, energy 0..1]
  "song": {"path": "assets/song.mp3", "offset": 0},          # optional: a licensed track replaces the synthesized music
  "cues": [[1.0, "whoosh"], [3.5, "pop", 0.8], [4.0, "chime"]]   # [time, sfx, gain]
}
Energy < 0.35 plays pad only, < 0.7 adds bass and arpeggio, and higher adds drums.
render.mjs muxes audio.wav into the video and normalizes loudness.
"""
import json
import subprocess
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
NOTES = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6,
         "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
DEGREES = {"i": 0, "ii": 2, "iii": 4, "iv": 5, "v": 7, "vi": 9, "vii": 11}
MINOR_SHIFT = {"iii": -1, "vi": -1, "vii": -1}  # natural minor lowers 3, 6, 7


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def chord_notes(root_midi, numeral, mode):
    """Roman numeral -> MIDI triad. Upper case = major triad, lower case = minor."""
    base = numeral.lower().rstrip("°")
    semis = DEGREES[base] + (MINOR_SHIFT.get(base, 0) if mode == "minor" else 0)
    third = 4 if numeral[0].isupper() else 3
    r = root_midi + semis
    return [r, r + third, r + 7]


def env(n, a=0.005, d=0.3, curve=4.0):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d * curve / 4)


def filt(x, kind, f):
    return sosfilt(butter(2, f, kind, fs=SR, output="sos"), x)


def tone(f, n, harm=(1, .5, .25), detune=0.0):
    t = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * (k + 1) * t * (1 + detune)) for k, a in enumerate(harm))


def add(buf, x, t, gain=1.0):
    i = int(t * SR)
    if i >= len(buf) or i < 0:
        return
    x = x[: len(buf) - i]
    buf[i:i + len(x)] += x * gain


rng = np.random.default_rng(7)


def noise(n):
    return rng.standard_normal(n)


SFX = {
    "whoosh": lambda: filt(noise(int(.6 * SR)), "bandpass", [400, 4000]) * np.sin(np.linspace(0, np.pi, int(.6 * SR))) ** 2 * .5,
    "pop": lambda: tone(hz(84) * np.exp(-np.arange(int(.12 * SR)) / SR * 18), int(.12 * SR), (1,)) * env(int(.12 * SR), .002, .08),
    "click": lambda: filt(noise(int(.03 * SR)), "highpass", 2500) * env(int(.03 * SR), .001, .01) * .6,
    "chime": lambda: tone(hz(88), int(1.6 * SR), (1, .4, .2, .1)) * env(int(1.6 * SR), .003, 1.2) * .35,
    "ping": lambda: tone(hz(91), int(1.2 * SR), (1, .15)) * env(int(1.2 * SR), .002, .9) * .3,
    "thud": lambda: tone(55 * np.exp(-np.arange(int(.35 * SR)) / SR * 6), int(.35 * SR), (1, .3)) * env(int(.35 * SR), .002, .25),
    "sand": lambda: filt(noise(int(1.5 * SR)), "lowpass", 1800) * np.sin(np.linspace(0, np.pi, int(1.5 * SR))) * .25,
    "wave": lambda: filt(noise(int(3 * SR)), "lowpass", 900) * np.sin(np.linspace(0, np.pi, int(3 * SR))) ** 2 * .3,
    "type": lambda: filt(noise(int(.02 * SR)), "bandpass", [1500, 6000]) * env(int(.02 * SR), .001, .006) * .5,
}


def music(spec, n):
    bpm, beat = spec["bpm"], 60 / spec["bpm"]
    bar = beat * 4
    root = 48 + NOTES[spec.get("key", "C")]
    mode = spec.get("mode", "major")
    chords = spec.get("chords", ["I", "V", "vi", "IV"])
    sections = spec.get("sections", [[0, spec["dur"], 0.6]])
    energy = lambda t: next((e for a, b, e in sections if a <= t < b), sections[-1][2])
    pad, bass, arp, drums = (np.zeros(n) for _ in range(4))
    for k in range(int(np.ceil(spec["dur"] / bar))):
        t0 = k * bar
        notes = chord_notes(root, chords[k % len(chords)], mode)
        e = energy(t0)
        m = int(bar * SR)
        for note in notes:  # pad: soft, detuned, whole bar
            add(pad, (tone(hz(note + 12), m, (1, .3), .003) + tone(hz(note + 12), m, (1, .3), -.003)) * env(m, .4, bar * 2), t0, .08)
        if e >= .35:
            for b in range(4):  # bass on every beat, arpeggio on eighths
                add(bass, tone(hz(notes[0] - 12), int(beat * SR), (1, .5, .1)) * env(int(beat * SR), .005, beat * .8), t0 + b * beat, .22)
            for s in range(8):
                note = notes[s % 3] + 24 + (12 if s % 4 == 3 else 0)
                q = int(beat / 2 * SR)
                add(arp, tone(hz(note), q, (1, .45, .2, .1)) * env(q, .002, .18), t0 + s * beat / 2, .09)
        if e >= .7:
            for b in range(4):
                add(drums, SFX["thud"](), t0 + b * beat, .9)
                if b % 2:
                    add(drums, filt(noise(int(.18 * SR)), "bandpass", [900, 5000]) * env(int(.18 * SR), .001, .09), t0 + b * beat, .35)
                for h in range(2):
                    add(drums, filt(noise(int(.05 * SR)), "highpass", 7000) * env(int(.05 * SR), .001, .02), t0 + b * beat + h * beat / 2, .12)
    pad = filt(pad, "lowpass", 2500)
    left = pad + bass + arp * .7 + drums
    right = pad + bass + arp * 1.3 + drums
    return np.stack([left, right], 1)


def load_song(path, offset, n):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(offset), "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         check=True, capture_output=True).stdout
    x = np.frombuffer(raw, np.float32).reshape(-1, 2)[:n]
    if len(x) < n:
        raise SystemExit(f"song is shorter than the video: {len(x) / SR:.1f}s < {n / SR:.1f}s")
    return x.astype(np.float64)


def main(spec_path, out_path):
    spec = json.load(open(spec_path))
    n = int(spec["dur"] * SR)
    song = spec.get("song")
    mix = load_song(song["path"], song.get("offset", 0), n) * song.get("gain", 1.0) if song else music(spec, n)
    fx = np.zeros(n)
    for cue in spec.get("cues", []):
        t, name, gain = (cue + [1.0])[:3]
        if name not in SFX:
            raise SystemExit(f"unknown sfx '{name}'. Available: {', '.join(SFX)}")
        add(fx, SFX[name](), t, gain)
    mix = mix + fx[:, None] * .8
    mix = np.tanh(mix * 1.2)
    mix *= 0.89 / max(1e-6, np.abs(mix).max())
    wavfile.write(out_path, SR, (mix * 32767).astype(np.int16))
    print(f"{out_path}: {spec['dur']}s, {len(spec.get('cues', []))} cues, {'song' if song else 'synth @ %s bpm' % spec['bpm']}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
