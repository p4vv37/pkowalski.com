#!/usr/bin/env python3
"""Render the architecture diagram (architecture.png) with matplotlib.

Coordinates mirror architecture.svg (top-down, 1240x760). English/minimal labels.
Run: MPLCONFIGDIR=/tmp/mplconfig /tmp/chartvenv/bin/python generate-architecture.py
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

W, H = 1240, 760
NPU_F, NPU_E = '#dbeafe', '#2563eb'
CPU_F, CPU_E = '#dcfce7', '#16a34a'
RUL_F, RUL_E = '#fef3c7', '#d97706'
HA_F, HA_E = '#e2e8f0', '#334155'
NEU_F, NEU_E = '#f1f5f9', '#475569'
INK = '#1e293b'
MUT = '#475569'


def box(ax, x, y, w, h, fc, ec, lw=2, ls='-', r=10):
    ax.add_patch(FancyBboxPatch((x, H - y - h), w, h,
                                boxstyle=f"round,pad=0,rounding_size={r}",
                                linewidth=lw, edgecolor=ec, facecolor=fc, linestyle=ls))


def txt(ax, cx, cy, s, size, weight='normal', color=INK, ha='center'):
    ax.text(cx, H - cy, s, ha=ha, va='center', fontsize=size, fontweight=weight, color=color)


def arrow(ax, x1, y1, x2, y2, color=MUT, lw=2, ls='-'):
    ax.add_patch(FancyArrowPatch((x1, H - y1), (x2, H - y2), arrowstyle='-|>',
                                 mutation_scale=16, linewidth=lw, color=color,
                                 linestyle=ls, shrinkA=0, shrinkB=0))


fig, ax = plt.subplots(figsize=(12.4, 7.6), dpi=200)
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.axis('off')
fig.patch.set_facecolor('white')

# LVA microphone
box(ax, 470, 28, 300, 66, NEU_F, NEU_E)
txt(ax, 620, 55, 'Linux Voice Assistant', 15, 'bold')
txt(ax, 620, 76, 'microphone · wake word «Okay Nabu»', 12.5)

# Home Assistant
box(ax, 270, 170, 700, 72, HA_F, HA_E, lw=2.5)
txt(ax, 620, 198, 'Home Assistant', 16, 'bold')
txt(ax, 620, 220, 'orchestration · tool execution (tool_calls)', 12.5)

# STT
box(ax, 60, 330, 340, 92, NPU_F, NPU_E, lw=2.5)
txt(ax, 230, 358, 'STT · speech → text', 14.5, 'bold', '#1e3a8a')
txt(ax, 230, 380, 'Whisper Large-v3-Turbo W8A16', 12.5, color='#1e40af')
txt(ax, 230, 400, 'encoder + decoder on NPU', 12.5, color='#1e40af')

# Gateway
box(ax, 450, 300, 340, 212, '#f8fafc', MUT, lw=2, ls='--', r=10)
txt(ax, 620, 322, 'LLM gateway · port 18191', 13, 'bold', MUT)
box(ax, 470, 336, 300, 66, RUL_F, RUL_E, r=8)
txt(ax, 620, 360, 'narrow rule router (CPU)', 13, 'bold', '#92400e')
txt(ax, 620, 382, 'unambiguous commands → tool_calls to HA', 12, color='#92400e')
box(ax, 470, 420, 300, 72, NPU_F, NPU_E, r=8)
txt(ax, 620, 446, 'Qwen2.5-3B-Instruct Q4_0', 13.5, 'bold', '#1e3a8a')
txt(ax, 620, 468, 'NPU (Hexagon, HTP0) · other requests', 12, color='#1e40af')

# TTS
box(ax, 840, 330, 340, 92, CPU_F, CPU_E, lw=2.5)
txt(ax, 1010, 358, 'TTS · text → speech', 14.5, 'bold', '#14532d')
txt(ax, 1010, 380, 'Pocket TTS Polish', 12.5, color='#15803d')
txt(ax, 1010, 400, 'CPU · Rust ARM64 runtime', 12.5, color='#15803d')

# LVA speaker
box(ax, 470, 650, 300, 66, NEU_F, NEU_E)
txt(ax, 620, 677, 'Linux Voice Assistant', 15, 'bold')
txt(ax, 620, 698, 'answer playback', 12.5)

# Arrows
arrow(ax, 620, 94, 620, 170)                    # mic -> HA
arrow(ax, 440, 242, 235, 330)                   # HA -> STT
arrow(ax, 620, 242, 620, 300)                   # HA -> gateway
arrow(ax, 800, 242, 1005, 330)                  # HA -> TTS
arrow(ax, 235, 422, 530, 650)                   # STT -> speaker
arrow(ax, 620, 492, 620, 650)                   # Qwen -> speaker
arrow(ax, 1005, 422, 710, 650)                  # TTS -> speaker
arrow(ax, 470, 360, 330, 244, color='#b45309', ls='--')  # router -> HA (loop)
txt(ax, 300, 310, 'tool_calls', 12, color='#b45309')

# Legend
box(ax, 40, 650, 330, 88, '#ffffff', '#cbd5e1', lw=1.5, r=8)
txt(ax, 60, 672, 'Legend', 12.5, 'bold', '#334155', ha='left')
box(ax, 56, 684, 14, 14, NPU_F, NPU_E, lw=1.5, r=3)
txt(ax, 78, 691, 'NPU (Hexagon)', 12, color='#334155', ha='left')
box(ax, 180, 684, 14, 14, CPU_F, CPU_E, lw=1.5, r=3)
txt(ax, 202, 691, 'CPU', 12, color='#334155', ha='left')
box(ax, 56, 708, 14, 14, RUL_F, RUL_E, lw=1.5, r=3)
txt(ax, 78, 715, 'rule logic', 12, color='#334155', ha='left')

plt.savefig('architecture.png', dpi=200, facecolor='white', bbox_inches='tight', pad_inches=0.08)
plt.savefig('architecture.svg', format='svg', facecolor='white', bbox_inches='tight', pad_inches=0.08)
print('saved architecture')
