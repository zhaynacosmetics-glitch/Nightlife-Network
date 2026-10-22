"""Musique originale du film (27 s), synthétisée de A à Z : aucun échantillon externe, aucune licence tierce.

Calée sur la voix off (repères VO ci-dessous, en secondes, les mêmes que dans src/Film.tsx).
0 → 12,5 s, le problème : pizzicati en la mineur, tic-tac, un sifflet qui se dégonfle à chaque « Pschit ».
12,5 s : impact sur « VTC Copilot ! ». Ensuite, la solution : do majeur, pad lumineux, arpèges, rythmique entraînante.
Usage : python3 scripts/music.py public/audio/musique.wav
"""
import sys
import wave
import numpy as np

SR = 44100
DUR = 27.0
BPM = 120
BEAT = 60 / BPM
rng = np.random.default_rng(7)
mix = np.zeros(int(SR * DUR) + SR)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def add(sig, t, gain=1.0):
    i = int(t * SR)
    end = min(len(mix), i + len(sig))
    mix[i:end] += sig[: end - i] * gain


def tt(d):
    return np.arange(int(d * SR)) / SR


def pluck(m, d=0.35, bright=6, decay=9.0):
    t = tt(d)
    f = hz(m)
    s = sum(np.sin(2 * np.pi * f * h * t) / h * np.exp(-t * decay * (1 + h * 0.6)) for h in range(1, bright + 1))
    return s * np.minimum(1, t * 400)


def bell(m, d=1.2):
    t = tt(d)
    f = hz(m)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4) + 0.3 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 8)) * np.exp(-t * 3) * np.minimum(1, t * 300)


def pad(notes, d, attack=0.25):
    t = tt(d)
    s = np.zeros_like(t)
    for m in notes:
        for det in (-0.08, 0, 0.08):
            f = hz(m + det)
            s += sum(np.sin(2 * np.pi * f * h * t + h) / (h * h) for h in range(1, 6))
    env = np.minimum(1, t / attack) * np.minimum(1, (d - t) / 0.3)
    return s * env / (len(notes) * 3)


def bass(m, d, decay=3.0):
    t = tt(d)
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return s * np.exp(-t * decay) * np.minimum(1, t * 200) * np.minimum(1, (d - t) / 0.02)


def kick(d=0.4):
    t = tt(d)
    f = 45 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def noise(d):
    return rng.standard_normal(int(d * SR))


def highpass(x, k=0.9):
    y = np.copy(x)
    y[1:] = x[1:] - k * x[:-1]
    return y


def lowpass(x, a):
    """Filtre passe-bas à un pôle ; a (0→1) peut varier dans le temps."""
    a = np.broadcast_to(a, x.shape)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def hat(d=0.06):
    t = tt(d)
    return highpass(highpass(noise(d))) * np.exp(-t * 60)


def clap():
    t = tt(0.2)
    n = highpass(noise(0.2), 0.6)
    env = np.exp(-t * 25) + 0.6 * np.exp(-((t - 0.012) ** 2) / 1e-5) + 0.5 * np.exp(-((t - 0.024) ** 2) / 1e-5)
    return n * env



def riser(d):
    t = tt(d)
    f = 200 + 1400 * (t / d) ** 2
    return (lowpass(noise(d), np.linspace(0.05, 0.6, len(t))) * 0.8 + 0.25 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * (t / d) ** 2


VO = dict(am=0.05, stram=0.55, gram=1.1, plus=2.89, prix=4.14, pschit1=6.55, pschit2=7.72, pschit3=9.77, six=11.34, copilot=12.53, biff=23.85, fin=24.6)
SWITCH = VO["copilot"]

# ---------------------------------------------------------------- le problème (la mineur, comique et tendu)
A, C, D, E, F, G = 57, 60, 62, 64, 65, 67

# « Am, stram, gram… » : boîte à musique sur chaque mot
for t0, m in ((VO["am"], 76), (VO["stram"], 74), (VO["gram"], 72)):
    add(bell(m, 0.9), t0, 0.22)
    add(bell(m - 12, 0.9), t0, 0.08)

# pizzicati sautillants + basse « bom-bom » + tic-tac jusqu'au logo
riff = [A, E, C, E, D, F, E, C]
t0 = 1.85
k = 0
while t0 < SWITCH - 0.6:
    add(pluck(riff[k % len(riff)] + 12, 0.22, decay=14), t0, 0.16)
    if k % 2 == 0:
        add(bass(riff[k % len(riff)] - 12 if k % 4 == 0 else E - 24, 0.22, decay=10), t0, 0.32)
    add(hat(0.04), t0 + BEAT / 4, 0.05)
    t0 += BEAT / 2
    k += 1

# « gagner PLUS ? » : petit « ka-ching »
add(bell(84, 0.6), VO["plus"] + 0.55, 0.12)
add(bell(88, 0.6), VO["plus"] + 0.65, 0.12)

# « 32 euros ?! » : étincelles
for i, m in enumerate((84, 88, 91)):
    add(bell(m, 0.5), VO["prix"] + i * 0.07, 0.06)


def deflate(d):
    """Sifflet qui se dégonfle (sous le « Pschit » de la voix)."""
    t = tt(d)
    f = 900 * np.exp(-t * (1.6 / d)) + 180
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (2.2 / d)) * np.minimum(1, t * 60)


for key, d, g in (("pschit1", 0.45, 0.14), ("pschit2", 0.5, 0.15), ("pschit3", 0.95, 0.18)):
    add(deflate(d), VO[key] + 0.05, g)
    add(lowpass(noise(d), np.linspace(0.6, 0.05, int(d * SR))) * np.exp(-tt(d) * (2.5 / d)), VO[key] + 0.05, 0.12)

# « 6 euros de l'heure » : trombone triste
for i, m in enumerate((52, 51, 50)):
    tr = tt(0.28 if i < 2 else 0.6)
    f = hz(m) * (1 + 0.012 * np.sin(2 * np.pi * 6 * tr))
    s = sum(np.sin(2 * np.pi * np.cumsum(f) * h / SR) / h for h in range(1, 7)) * np.minimum(1, tr * 30) * np.exp(-tr * 2)
    add(s, VO["six"] + 0.2 + i * 0.26, 0.13)

# montée vers le logo
add(riser(0.85), SWITCH - 0.85, 0.35)

# ---------------------------------------------------------------- « VTC Copilot ! » : impact
add(kick(0.8), SWITCH, 0.7)
add(lowpass(noise(1.6), 0.25) * np.exp(-tt(1.6) * 2.5), SWITCH, 0.25)
for m in (72, 76, 79, 84):
    add(bell(m, 1.6), SWITCH, 0.09)

# ---------------------------------------------------------------- la solution (do majeur, lumineux)
PROG = [([60, 64, 67], 48), ([59, 62, 67], 43), ([57, 60, 64], 45), ([57, 60, 65], 41), ([60, 64, 67], 48), ([59, 62, 67], 43)]
for i, (notes, root) in enumerate(PROG):
    t0 = SWITCH + i * 2.0
    add(pad([n + 12 for n in notes], 2.0, 0.15), t0, 0.22)
    arp = notes + [notes[1] + 12, notes[2] + 12, notes[0] + 24, notes[2] + 12, notes[1] + 12]
    for s16 in range(16):
        add(pluck(arp[s16 % len(arp)] + 12, 0.25, bright=4, decay=12), t0 + s16 * BEAT / 4, 0.1)
    for b in range(4):
        add(bass(root - 12 + (12 if b % 2 else 0), BEAT * 0.9, decay=4), t0 + b * BEAT, 0.3)

# batterie : une mesure après l'impact, jusqu'à la carte finale
b = 0
while SWITCH + 1.0 + b * BEAT < VO["fin"] - 0.1:
    tn = SWITCH + 1.0 + b * BEAT
    add(kick(), tn, 0.5)
    if b % 2 == 1:
        add(clap(), tn, 0.18)
    add(hat(), tn + BEAT / 2, 0.07)
    b += 1

# « BIFF » : pluie de pièces
for i in range(8):
    add(bell(91 + (i % 3) * 2, 0.4), VO["biff"] + i * 0.06, 0.07)

# accord final (do majeur) qui résonne sous la carte finale
add(pad([60, 64, 67, 72], DUR - VO["fin"], 0.05), VO["fin"], 0.28)
add(bass(36, DUR - VO["fin"], decay=0.8), VO["fin"], 0.4)
for m in (72, 79, 84):
    add(bell(m, 2.0), VO["fin"], 0.07)

# ---------------------------------------------------------------- mastering simple
out = mix[: int(SR * DUR)]
out[-int(SR * 1.2):] *= np.linspace(1, 0, int(SR * 1.2))
out = np.tanh(out * 1.2) / np.tanh(1.2)  # saturation douce, évite l'écrêtage
out *= 0.5 / np.max(np.abs(out))  # crête à −6 dBFS : de la place pour la voix
pcm = (out * 32767).astype("<i2")
stereo = np.column_stack([pcm, pcm]).ravel()
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())
print("✓", sys.argv[1])
