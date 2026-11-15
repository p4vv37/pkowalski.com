#!/usr/bin/env python3
"""Compatibility entry point: regenerate the shared article figures."""
from pathlib import Path
import runpy

if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).with_name('generate-charts.py')), run_name='__main__')
