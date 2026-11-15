#!/usr/bin/env python3
"""Render the six article figures as SVG + 2x PNG, without model/device access.

Uses Python stdlib, existing Pillow for text measurements, and rsvg-convert.
All charts use linear axes from zero. English labels are shared by PL and EN.
Run from any directory: python3 path/to/generate-charts.py
"""
from html import escape
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
import subprocess
from PIL import ImageFont

OUT = Path(__file__).resolve().parent
BG = '#f8fafc'
INK = '#17263c'
MUTED = '#58677b'
GRID = '#dce3ec'
BLUE = '#4164df'
TEAL = '#008875'
OLD = '#94a2b7'
LIGHT = '#e9eef8'
FONT = 'Noto Sans'
FONT_PATH = subprocess.check_output(['fc-match', '-f', '%{file}', FONT], text=True)
BOLD_PATH = subprocess.check_output(['fc-match', '-f', '%{file}', FONT+':style=Bold'], text=True)


class Figure:
    def __init__(self, name, height, title, description):
        self.name, self.height = name, height
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="{height}" '
                      f'viewBox="0 0 1200 {height}" role="img" aria-labelledby="title desc">',
                      f'<title id="title">{escape(title)}</title>',
                      f'<desc id="desc">{escape(description)}</desc>',
                      '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" '
                      'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                      '<path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="#728198" stroke-width="1.5"/>'
                      '</marker></defs>']
        self.rect(0, 0, 1200, height, BG, radius=0)
        self.text(48, 61, title, 34, bold=True)

    def rect(self, x, y, w, h, fill, stroke='none', radius=10):
        assert w >= 0 and h >= 0
        self.parts.append(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" '
                          f'rx="{radius}" fill="{fill}" stroke="{stroke}"/>')

    def text(self, x, y, value, size=22, color=INK, bold=False, anchor='start'):
        # Match the SVG renderer's actual font and reject cropped labels.
        font = ImageFont.truetype(BOLD_PATH if bold else FONT_PATH, size)
        width = font.getlength(value)
        left = x if anchor == 'start' else x-width if anchor == 'end' else x-width/2
        assert left >= 15 and left+width <= 1185, (self.name, value, left, width)
        assert size <= y <= self.height-12, (self.name, value, y)
        self.parts.append(f'<text x="{x:g}" y="{y:g}" fill="{color}" '
                          f'font-family="{FONT}, sans-serif" font-size="{size}" '
                          f'font-weight="{700 if bold else 400}" text-anchor="{anchor}">{escape(value)}</text>')

    def line(self, x1, y1, x2, y2, color=GRID, width=1, arrows=False):
        markers = ' marker-start="url(#arrow)" marker-end="url(#arrow)"' if arrows else ''
        self.parts.append(f'<line x1="{x1:g}" y1="{y1:g}" x2="{x2:g}" y2="{y2:g}" '
                          f'stroke="{color}" stroke-width="{width}"{markers}/>')

    def dot(self, x, y, color, radius=6):
        self.parts.append(f'<circle cx="{x:g}" cy="{y:g}" r="{radius}" fill="{color}"/>')

    def subtitle(self, value):
        self.text(48, 100, value, 21, MUTED)

    def axis(self, x, ytop, ybottom, width, maximum, ticks):
        for tick in ticks:
            px = x + width*tick/maximum
            self.line(px, ytop, px, ybottom)
            self.text(px, ybottom+31, str(tick), 18, MUTED, anchor='middle')

    def bar(self, x, cy, width, value, maximum, color, label, size=23):
        length = width*value/maximum
        # Square ends preserve visible length even for very short bars.
        self.rect(x, cy-18, length, 36, color, radius=0)
        self.text(x+length+13, cy+8, label, size, bold=True)

    def save(self):
        svg = OUT/(self.name+'.svg')
        svg.write_text('\n'.join(self.parts+['</svg>'])+'\n', encoding='utf-8')
        subprocess.run(['rsvg-convert', '--width', '2400', '--output', str(OUT/(self.name+'.png')),
                        str(svg)], check=True)
        print('Rendered', self.name)


def architecture():
    fig = Figure('architecture', 790, 'One board. Three local models.',
                 'Home Assistant exchanges audio with Linux Voice Assistant and calls STT, the LLM agent and TTS. '
                 'LVA and all AI services run on VENTUNO Q. All results return to HA. Only HA executes device actions.')
    fig.subtitle('Home Assistant coordinates every stage of the conversation.')
    fig.rect(421, 135, 731, 608, '#eff3fa', GRID, 18)
    fig.text(451, 174, 'Arduino VENTUNO Q', 24, bold=True)
    fig.text(451, 201, 'LVA + local AI services', 19, MUTED)
    fig.rect(48, 394, 280, 134, '#17263c', radius=14)
    fig.text(188, 433, 'Home Assistant', 27, '#ffffff', True, 'middle')
    fig.text(188, 469, 'Conversation flow', 20, '#dbe5f4', anchor='middle')
    fig.text(188, 499, 'Device actions', 20, '#dbe5f4', anchor='middle')
    # Bus represents bidirectional requests/results, never STT or LLM -> speaker.
    fig.line(328, 461, 382, 461, '#728198', 2.5)
    fig.line(382, 281, 382, 674, '#728198', 2.5)
    cards = [
        (233, 96, 'Linux Voice Assistant', 'Microphone · “Okay Nabu” · playback', 'LVA', '#e6ecf5', MUTED),
        (349, 96, 'Whisper Large-v3-Turbo', 'STT · speech to text', 'NPU', '#e7edff', BLUE),
        (465, 130, 'LLM agent', 'Router (CPU) for simple commands', None, '#fff1db', '#916014'),
        (626, 96, 'Pocket TTS Polish', 'TTS · text to speech · Rust', 'CPU', '#e2f3ed', TEAL),
    ]
    for y, h, title, subtitle, badge, fill, color in cards:
        fig.rect(451, y, 671, h, '#ffffff', GRID, 12)
        fig.text(475, y+37, title, 25, bold=True)
        fig.text(475, y+70, subtitle, 20, MUTED)
        if badge:
            fig.rect(1028, y+22, 72, 34, fill, radius=7)
            fig.text(1064, y+46, badge, 18, color, True, 'middle')
        else:
            fig.text(475, y+103, 'Qwen2.5-3B (NPU) for other requests', 20, BLUE)
        fig.line(382, y+h/2, 442, y+h/2, '#728198', 2.5, arrows=True)
    fig.save()


def speed():
    fig = Figure('stt-speed-comparison', 555, 'STT: from 12 seconds to 0.43',
                 'Linear zero-based bars for transcription times: CPU Medium about 12 seconds, '
                 'NPU Small 0.506, Medium 0.673 and Turbo 0.429 seconds.')
    fig.subtitle('Transcription time · prepared 2.832 s recording')
    fig.axis(350, 145, 458, 660, 12, [0, 3, 6, 9, 12])
    for cy, label, detail, value, color, number in [
        (190, 'Whisper Medium', 'CPU · INT8', 12, OLD, '~12.0 s'),
        (270, 'Whisper Small', 'NPU · FP16', .506, BLUE, '0.51 s'),
        (350, 'Whisper Medium', 'NPU · W8A16', .673, BLUE, '0.67 s'),
        (430, 'Whisper Large-v3-Turbo', 'NPU · W8A16', .429, TEAL, '0.43 s')]:
        fig.text(48, cy-1, label, 22, bold=True)
        fig.text(48, cy+25, detail, 18, MUTED)
        fig.bar(350, cy, 660, value, 12, color, number)
    fig.text(680, 528, 'Transcription time (s)', 19, MUTED, anchor='middle')
    fig.save()

    fig = Figure('tts-speed-comparison', 390, 'TTS: first audio in 0.8 seconds',
                 'Time to first PCM at the Wyoming client: Python/PyTorch 5.653 seconds, Rust ARM64 0.8 seconds. '
                 'Same Polish checkpoint and reference voice.')
    fig.subtitle('Same Polish model and voice · time to first audio')
    fig.axis(330, 135, 297, 700, 6, [0, 1, 2, 3, 4, 5, 6])
    for cy, label, value, color, number in [(181, 'Python / PyTorch', 5.653, OLD, '5.65 s'),
                                            (257, 'Rust ARM64', .8, TEAL, '0.80 s')]:
        fig.text(48, cy+7, label, 24, bold=True)
        fig.bar(330, cy, 700, value, 6, color, number)
    fig.text(680, 367, 'Time to first audio (s)', 19, MUTED, anchor='middle')
    fig.save()


def context():
    fig = Figure('ha-context-before-after', 490, 'Less context. Faster answers.',
                 'Qwen2.5-3B before and after reducing HA exposure. Original prompt: 7781 vs 3550 tokens. '
                 'Controlled fixed-sentence answer: median 22.741 vs 9.968 seconds, three runs per variant.')
    fig.subtitle('Qwen2.5-3B · before and after limiting device exposure')
    for origin, title, maximum, ticks, values, labels, change in [
        (48, 'Input tokens', 8000, [0,4000,8000], [7781,3550], ['7,781','3,550'], '54% fewer tokens'),
        (644, 'LLM answer (s)', 25, [0,10,20], [22.741,9.968], ['22.74 s','9.97 s'], '56% less time')]:
        fig.text(origin, 164, title, 25, bold=True)
        x = origin+90
        fig.axis(x, 190, 349, 350, maximum, ticks)
        for y, word, value, number, color in zip([232,308], ['Before','After'], values, labels, [OLD,TEAL]):
            fig.text(origin, y+6, word, 20, MUTED)
            fig.bar(x, y, 350, value, maximum, color, number, size=22)
        fig.text(origin, 427, change, 26, TEAL, True)
    fig.text(644, 464, 'Full answer · median of 3 runs', 18, MUTED)
    fig.save()


def models():
    fig = Figure('npu-model-comparison', 550, 'Why Qwen2.5-3B?',
                 'Full HA context, fixed-sentence benchmark, medians of 3 runs. Qwen3-1.7B: 18.148 seconds, '
                 'requested response form 2 of 3. Qwen2.5-3B: 22.741 seconds, requested form 3 of 3. '
                 '4B QAIRT context was too short; 4B GGUF failed to load. No timing was measured for either.')
    fig.subtitle('Full HA context · fixed answer · 3 runs per model')
    fig.text(1055, 150, 'Requested form', 20, MUTED, anchor='middle')
    fig.axis(300, 166, 334, 555, 25, [0,10,20])
    for y, name, value, color, number, compliance in [
        (211, 'Qwen3-1.7B', 18.148, OLD, '18.15 s', '2 / 3'),
        (291, 'Qwen2.5-3B', 22.741, TEAL, '22.74 s', '3 / 3')]:
        fig.text(48, y+8, name, 25, bold=True)
        fig.bar(300, y, 555, value, 25, color, number)
        fig.text(1055, y+9, compliance, 28, color, True, 'middle')
    fig.text(575, 393, 'Full LLM answer (s)', 18, MUTED, anchor='middle')
    for x, name, status in [(48, '4B · QAIRT', 'Context too short'), (644, '4B · GGUF', 'Model load failed')]:
        fig.rect(x, 425, 508, 91, '#edf1f7', radius=10)
        fig.text(x+22, 461, name, 23, bold=True)
        fig.text(x+22, 493, status, 20, MUTED)
    fig.save()


def length():
    fig = Figure('tts-length-chart', 600, 'Longer speech, similar start time',
                 'Three measured samples with generated audio durations of 1.496, 6.609 and 11.389 seconds. '
                 'First PCM: 0.793, 0.956, 0.801 seconds. Complete PCM: 0.818, 2.327, 3.775 seconds. '
                 'Both axes are linear and the x positions reflect actual audio duration.')
    fig.subtitle('Pocket TTS · Rust · 3 recorded samples')
    fig.dot(70, 141, BLUE)
    fig.text(86, 148, 'First audio', 20, BLUE)
    fig.dot(290, 141, TEAL)
    fig.text(306, 148, 'Complete audio', 20, TEAL)
    x0, y0, width, height = 135, 480, 910, 285
    for tick in [0,1,2,3,4]:
        y = y0-height*tick/4
        fig.line(x0,y,x0+width,y)
        fig.text(106, y+6, str(tick), 18, MUTED, anchor='end')
    fig.text(48, 182, 'Wait (s)', 18, MUTED)
    durations = [1.496,6.609,11.389]
    for x in durations:
        px = x0+width*x/12
        fig.line(px, y0, px, y0+7, MUTED)
        fig.text(px, y0+37, f'{x:.1f}', 19, MUTED, anchor='middle')
    fig.text(590, 572, 'Generated audio duration (s)', 20, MUTED, anchor='middle')
    for values, color, above in [([.793,.956,.801],BLUE,False), ([.818,2.327,3.775],TEAL,True)]:
        points = [(x0+width*x/12,y0-height*y/4) for x,y in zip(durations,values)]
        for (x1,y1),(x2,y2) in zip(points,points[1:]):
            fig.line(x1,y1,x2,y2,color,3)
        for (x,y),value in zip(points,values):
            fig.dot(x,y,color,7)
            number = Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            fig.text(x,y-18 if above else y+34,f'{number} s',21,color,True,'middle')
    fig.save()


if __name__ == '__main__':
    architecture()
    speed()
    context()
    models()
    length()
