#!/usr/bin/env python3
"""Render STT and TTS speed charts (stt-speed-comparison, tts-speed-comparison).

Historical measurements, not a single unified benchmark. No private data.
Run: MPLCONFIGDIR=/tmp/mplconfig /tmp/chartvenv/bin/python generate-speed-charts.py
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

INK = '#1e293b'
MUT = '#475569'
NPU = '#2563eb'
NPU_MID = '#60a5fa'
NPU_LIGHT = '#93c5fd'
CPU = '#16a34a'
OLD = '#dc2626'


def pl(v, nd=2):
    return f"{v:.{nd}f}".replace('.', ',')


def label_axis(ax, hide=('top', 'right', 'left')):
    for s in hide:
        ax.spines[s].set_visible(False)


# ===================== STT =====================
fig, ax = plt.subplots(figsize=(12, 6.4), dpi=200)
labels = ['Medium INT8\nCPU', 'Small FP16\nNPU', 'Medium W8A16\nNPU', 'Turbo W8A16\nNPU']
values = [12.0, 0.506, 0.673, 0.429]
colors = [CPU, NPU_LIGHT, NPU_MID, NPU]
y = np.arange(len(labels))[::-1]

bars = ax.barh(y, values, color=colors, height=0.58, zorder=3)
ax.set_xscale('log')
ax.set_xlim(0.1, 20)
ax.set_yticks(y)
ax.set_yticklabels(labels, fontsize=13, color=INK)
ax.tick_params(axis='x', labelsize=11, colors=MUT)
label_axis(ax)
ax.set_xlabel('sekundy (oś logarytmiczna) — transkrypcja przygotowanego klipu 2,832 s', fontsize=12, color=MUT)
ax.set_title('STT: CPU kontra NPU oraz model na NPU', fontsize=15, fontweight='bold', color=INK, pad=14)

for b, v in zip(bars, values):
    ax.text(v * 1.12, b.get_y() + b.get_height() / 2, f'{pl(v)} s', va='center', ha='left',
            fontsize=12.5, fontweight='bold', color=INK)

# annotation: NPU speedup vs CPU
ax.annotate('≈28× szybciej\n(12 s → 0,43 s)', xy=(0.429, y[-1]), xytext=(2.5, y[0] + 0.9),
            fontsize=12, color=OLD, fontweight='bold',
            arrowprops=dict(arrowstyle='-|>', color=OLD, lw=1.5))

fig.tight_layout()
fig.savefig('stt-speed-comparison.png', dpi=200, facecolor='white', bbox_inches='tight', pad_inches=0.08)
fig.savefig('stt-speed-comparison.svg', format='svg', facecolor='white', bbox_inches='tight', pad_inches=0.08)
plt.close(fig)

# ===================== TTS =====================
fig, ax = plt.subplots(figsize=(12, 5.2), dpi=200)
labels = ['Python/PyTorch\n(pierwsze PCM)', 'Rust ARM64\n(pierwsze PCM)']
values = [5.653, 0.8]
colors = [OLD, CPU]
y = np.arange(len(labels))[::-1]

bars = ax.barh(y, values, color=colors, height=0.5, zorder=3)
ax.set_xlim(0, 6.5)
ax.set_yticks(y)
ax.set_yticklabels(labels, fontsize=13, color=INK)
ax.tick_params(axis='x', labelsize=11, colors=MUT)
label_axis(ax)
ax.set_xlabel('sekundy — czas do pierwszych próbek PCM u klienta Wyoming', fontsize=12, color=MUT)
ax.set_title('TTS: ten sam model, szybszy runtime (Python → Rust)', fontsize=15, fontweight='bold', color=INK, pad=14)

for b, v in zip(bars, values):
    ax.text(v + 0.08, b.get_y() + b.get_height() / 2, f'{pl(v)} s', va='center', ha='left',
            fontsize=12.5, fontweight='bold', color=INK)

ax.annotate('≈7× szybciej', xy=(0.8, y[0]), xytext=(2.6, y[1] + 0.75),
            fontsize=12.5, color=OLD, fontweight='bold',
            arrowprops=dict(arrowstyle='-|>', color=OLD, lw=1.5))

fig.tight_layout()
fig.savefig('tts-speed-comparison.png', dpi=200, facecolor='white', bbox_inches='tight', pad_inches=0.08)
fig.savefig('tts-speed-comparison.svg', format='svg', facecolor='white', bbox_inches='tight', pad_inches=0.08)
plt.close(fig)

print('saved stt-speed-comparison + tts-speed-comparison')
