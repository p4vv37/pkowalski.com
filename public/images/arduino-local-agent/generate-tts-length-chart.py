#!/usr/bin/env python3
"""Render TTS delivery-time-by-audio-length chart (tts-length-chart.png/.svg).

English/minimal labels. Current Rust streaming solution, three real samples.
Run: MPLCONFIGDIR=/tmp/mplconfig /tmp/chartvenv/bin/python generate-tts-length-chart.py
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

INK = '#1e293b'
MUT = '#475569'
FIRST = '#2563eb'
FULL = '#16a34a'


def pl(v, nd=2):
    return f"{v:.{nd}f}".replace('.', ',')


fig, ax = plt.subplots(figsize=(12, 5.6), dpi=200)
labels = ['short\n(1.5 s audio)', 'medium\n(6.6 s audio)', 'long\n(11.4 s audio)']
first = [0.793, 0.956, 0.801]
full = [0.818, 2.327, 3.775]
x = np.arange(len(labels))
w = 0.34

b1 = ax.bar(x - w/2, first, width=w, color=FIRST, label='first PCM', zorder=3)
b2 = ax.bar(x + w/2, full, width=w, color=FULL, label='full PCM', zorder=3)

ax.set_xticks(x)
ax.set_xticklabels(labels, fontsize=13, color=INK)
ax.set_ylabel('seconds', fontsize=12, color=MUT)
ax.set_ylim(0, 4.4)
ax.set_title('TTS (Rust, streaming): delivery time by utterance length', fontsize=15, fontweight='bold', color=INK, pad=14)
for s in ('top', 'right'):
    ax.spines[s].set_visible(False)
ax.tick_params(axis='y', labelsize=11, colors=MUT)

for bars in (b1, b2):
    for b in bars:
        ax.text(b.get_x() + b.get_width()/2, b.get_height() + 0.06,
                f'{pl(b.get_height())} s', ha='center', va='bottom',
                fontsize=12, fontweight='bold', color=INK)

ax.annotate('first PCM ~0.8 s regardless of length\n(streaming keeps the start low)',
            xy=(0, 0.793), xytext=(0.9, 1.7),
            fontsize=12, color=FIRST, fontweight='bold',
            arrowprops=dict(arrowstyle='-|>', color=FIRST, lw=1.5))

ax.legend(fontsize=12, frameon=False, loc='upper left')

fig.tight_layout()
fig.savefig('tts-length-chart.png', dpi=200, facecolor='white', bbox_inches='tight', pad_inches=0.08)
fig.savefig('tts-length-chart.svg', format='svg', facecolor='white', bbox_inches='tight', pad_inches=0.08)
plt.close(fig)
print('saved tts-length-chart')
