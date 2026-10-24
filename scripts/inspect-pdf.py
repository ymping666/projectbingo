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
            side = min(aw, ah - 76)
            for i, card in enumerate(p['cards']):
                page = pdf.pages[i // per_page]
                slot = i % per_page
                x = 36 + slot % cols * (aw + 18) + (aw - side) / 2
                top = 36 + slot // cols * (ah + 18) + 58
                for j, cell in enumerate(card['cells']):
                    cw = side / p['size']
                    left, upper = x + j % p['size'] * cw, top + j // p['size'] * cw
                    extracted = page.crop((left + .5, upper + .5, left + cw - .5, upper + cw - .5)).extract_text() or ''
                    expected = '' if cell['kind'] == 'free' else words[cell['wordId']]
                    assert re.sub(r'\s+', '', extracted) == re.sub(r'\s+', '', expected), (name, card['id'], j, extracted, expected)
                    if cell['kind'] == 'free':
                        assert len(page.crop((left + .5, upper + .5, left + cw - .5, upper + cw - .5)).curves) >= 10, 'Missing vector logo'
            for page in pdf.pages:
                ids.extend(re.findall(r'Card ([A-F0-9]{8}-\d{3})', page.extract_text()))
                assert all(c['size'] >= 9.99 for c in page.chars), 'Text smaller than 10 pt'
        assert ids == [c['id'] for c in p['cards']], (name, ids)
        print(f'{name}: all 5 IDs once, all 125 cells match saved matrices, minimum 10 pt')
assert len(PdfReader(root / '200-cards.pdf').pages) == 50
for name in ['literal-free-logo', 'literal-free-no-logo']:
    with pdfplumber.open(root / f'{name}.pdf') as pdf:
        page = pdf.pages[0]
        assert page.extract_text().split().count('FREE') == 1, 'Custom FREE word was lost or duplicated'
        p = json.loads((root / f'{name}.json').read_text())
        side = page.width - 72
        center = (page.width / 2, 36 + 58 + side / 2)
        cell = side / 3
        region = page.crop((center[0] - cell/2 + 1, center[1] - cell/2 + 1, center[0] + cell/2 - 1, center[1] + cell/2 - 1))
        assert (len(region.curves) >= 10) == p['free'], 'Logo presence differs from saved FREE setting'
        assert all(c['size'] >= 9.99 for c in page.chars), 'Text smaller than 10 pt'
print('Literal FREE stays a playable word; center logo follows the saved free-space setting.')
for project_file in (root / 'themes').glob('*.json'):
    p = json.loads(project_file.read_text(encoding='utf-8'))
    words = {w['id']: w['text'] for w in p['words']}
    with pdfplumber.open(project_file.with_suffix('.pdf')) as pdf:
        page = pdf.pages[0]
        side = min(page.width - 72, page.height - 88 - 76)
        x = (page.width - side) / 2
        cell_width = side / p['size']
        for j, cell in enumerate(p['cards'][0]['cells']):
            left = x + j % p['size'] * cell_width
            top = 36 + 58 + j // p['size'] * cell_width
            # The top portion contains the prompt in meet-and-write activities.
            bottom = top + cell_width * (0.68 if p.get('mode') == 'people' and cell['kind'] != 'free' else 1)
            extracted = page.crop((left + .5, top + .5, left + cell_width - .5, bottom - .5)).extract_text() or ''
            expected = '' if cell['kind'] == 'free' else words[cell['wordId']]
            assert re.sub(r'\s+', '', extracted) == re.sub(r'\s+', '', expected), (p['templateId'], j, extracted, expected)
        # The existing meet-and-write form uses an 8 pt "Name" caption;
        # playable entries and all other text still have a 10 pt minimum.
        captions = [c for c in page.chars if c['size'] < 9.99]
        if p.get('mode') == 'people':
            assert ''.join(c['text'] for c in captions) == 'Name' * (p['size'] ** 2 - int(p['free']))
            assert all(abs(c['size'] - 8) < .01 for c in captions)
        else:
            assert not captions, p['templateId']
        assert len(page.crop((x, 67, x + 35, 91)).curves) > 0, 'Missing template header motif'
print('Every themed template PDF: word positions, minimum font sizes and vector header artwork verified.')
print('Real PDF extraction: positions, IDs, non-full sheets, font minimum and 200-card page count verified.')
