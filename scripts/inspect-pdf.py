"""Verify real PDF card IDs, cell positions, minimum sizes and non-full sheets."""
import json
import re
from pathlib import Path
import pdfplumber
from pypdf import PdfReader

root = Path('output/pdf')
for paper in ['A4', 'Letter']:
    for per_page in [1, 2, 4]:
        name = f'{paper}-{per_page}'
        p = json.loads((root / f'{name}-project.json').read_text(encoding='utf-8'))
        words = {w['id']: w['text'] for w in p['words']}
        ids = []
        with pdfplumber.open(root / f'{name}-cards.pdf') as pdf:
            pw, ph = pdf.pages[0].width, pdf.pages[0].height
            cols, rows = (2 if per_page == 4 else 1), (1 if per_page == 1 else 2)
            aw, ah = (pw - 72 - 18 * (cols - 1)) / cols, (ph - 88 - 18 * (rows - 1)) / rows
            side = min(aw, ah - 62)
            for i, card in enumerate(p['cards']):
                page = pdf.pages[i // per_page]
                slot = i % per_page
                x = 36 + slot % cols * (aw + 18) + (aw - side) / 2
                top = 36 + slot // cols * (ah + 18) + 60
                for j, cell in enumerate(card['cells']):
                    cw = side / p['size']
                    left, upper = x + j % p['size'] * cw, top + j // p['size'] * cw
                    extracted = page.crop((left + .5, upper + .5, left + cw - .5, upper + cw - .5)).extract_text() or ''
                    expected = 'FREE' if cell['kind'] == 'free' else words[cell['wordId']]
                    assert re.sub(r'\s+', '', extracted) == re.sub(r'\s+', '', expected), (name, card['id'], j, extracted, expected)
            for page in pdf.pages:
                ids.extend(re.findall(r'Card ([A-F0-9]{8}-\d{3})', page.extract_text()))
                assert all(c['size'] >= 9.99 for c in page.chars), 'Text smaller than 10 pt'
        assert ids == [c['id'] for c in p['cards']], (name, ids)
        print(f'{name}: all 5 IDs once, all 125 cells match saved matrices, minimum 10 pt')
assert len(PdfReader(root / '200-cards.pdf').pages) == 50
print('Real PDF extraction: positions, IDs, non-full sheets, font minimum and 200-card page count verified.')
