import { readFile, writeFile } from 'node:fs/promises';
import { PDFDocument, StandardFonts, rgb, type PDFImage } from 'pdf-lib';
import { generate } from '../src/lib/model';
import { exportPdf } from '../src/lib/pdf';
import { productionOrigin } from '../src/lib/deployment';
import { templates } from '../src/lib/templates';
import {
  classroomCardCount,
  classroomFilename,
  classroomPapers,
  foodClassroomTemplate,
  type ClassroomDownload,
} from '../src/lib/food-classroom';

const vocabulary = [
  ['Apple', '1F34E'],
  ['Banana', '1F34C'],
  ['Strawberry', '1F353'],
  ['Pear', '1F350'],
  ['Lemon', '1F34B'],
  ['Pineapple', '1F34D'],
  ['Carrot', '1F955'],
  ['Broccoli', '1F966'],
  ['Cucumber', '1F952'],
  ['Bread', '1F35E'],
  ['Pizza', '1F355'],
  ['Sandwich', '1F96A'],
  ['Cheese', '1F9C0'],
  ['Egg', '1F95A'],
  ['Cookie', '1F36A'],
  ['Ice cream', '1F366'],
] as const;
const words = vocabulary.map(([word]) => word);
const template = templates.find(({ id }) => id === foodClassroomTemplate);
if (!words.every((word) => template?.words.includes(word)))
  throw new Error(
    'Classroom pack words must be part of the Food Vocabulary template.',
  );

const templateUrl = `${productionOrigin}/templates/${foodClassroomTemplate}/`;
const margin = 42;
const ink = rgb(0.13, 0.16, 0.16);
const ruled = rgb(0.42, 0.42, 0.42);
const lato = await readFile('public/fonts/Lato-Regular.ttf');
const pictureFiles = await Promise.all(
  vocabulary.map(([, code]) => readFile(`assets/openmoji-food/${code}.png`)),
);

for (const paper of classroomPapers) {
  const dimensions: [number, number] =
    paper.id === 'A4' ? [595.28, 841.89] : [612, 792];
  const [width, height] = dimensions;

  async function document(title: string) {
    const doc = await PDFDocument.create();
    doc.setTitle(`Food Vocabulary | ${title} | ${paper.label}`);
    doc.setAuthor('Bingo Card Kit');
    const regular = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    return { doc, regular, bold };
  }

  const bingo = await document('Classroom Bingo');
  const teacher = bingo.doc.addPage(dimensions);
  teacher.drawText('Food Vocabulary Classroom Bingo', {
    x: margin,
    y: height - 74,
    size: 25,
    font: bingo.bold,
    color: ink,
  });
  const guide = [
    'Teacher call sheet',
    `Print single-sided at actual size (100%). This set has ${classroomCardCount} different cards.`,
    'Review the words first. Give each student one card. The center logo is FREE.',
    'Call the words below in any order, just once each. Check each word as you call it.',
    'Students mark what they hear. A row, column or diagonal wins.',
  ];
  for (const [i, line] of guide.entries())
    teacher.drawText(line, {
      x: margin,
      y: height - 109 - i * 23,
      size: i === 0 ? 16 : 12,
      font: i === 0 ? bingo.bold : bingo.regular,
      color: ink,
    });
  for (const [i, word] of words.entries()) {
    const x = margin + ((i % 4) * (width - 2 * margin)) / 4;
    const y = height - 251 - Math.floor(i / 4) * 36;
    teacher.drawRectangle({
      x,
      y,
      width: 11,
      height: 11,
      borderColor: ruled,
      borderWidth: 0.8,
    });
    teacher.drawText(word, {
      x: x + 18,
      y,
      size: 13,
      font: bingo.regular,
      color: ink,
    });
  }
  teacher.drawText(templateUrl.replace('https://', ''), {
    x: margin,
    y: 26,
    size: 10,
    font: bingo.regular,
    color: ink,
  });
  let seed = 204;
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  const project = generate(
    {
      title: 'Food Vocabulary Bingo',
      text: words.join('\n'),
      size: 3,
      free: true,
      count: classroomCardCount,
      templateId: foodClassroomTemplate,
    },
    { paper: paper.id, perPage: 2, theme: 'ink' },
    random,
    'F00D0024',
  );
  const boardPdf = await PDFDocument.load(
    (await exportPdf(project, false, lato)).bytes,
  );
  for (const page of await bingo.doc.copyPages(
    boardPdf,
    boardPdf.getPageIndices(),
  ))
    bingo.doc.addPage(page);

  async function cutouts(kind: 'flashcards' | 'matching') {
    const flashcards = kind === 'flashcards';
    const { doc, regular, bold } = await document(
      flashcards ? 'Picture Flashcards' : 'Matching Game',
    );
    const pictures = await Promise.all(
      pictureFiles.map((bytes) => doc.embedPng(bytes)),
    );
    const sections = flashcards
      ? [
          {
            title: 'Food Picture Flashcards',
            hint: 'Cut along the grid. Show each card and say the word together.',
            pictures,
            labels: words,
          },
        ]
      : [
          {
            title: 'Food Matching Game | Pictures',
            hint: 'Cut out the pictures. Mix them with the word cards and match each pair.',
            pictures,
          },
          {
            title: 'Food Matching Game | Words',
            hint: 'Cut out the words. Shuffle all pieces before playing.',
            labels: words,
          },
        ];
    const perSheet = 8;
    for (const section of sections) {
      for (let start = 0; start < words.length; start += perSheet) {
        const page = doc.addPage(dimensions);
        page.drawText(section.title, {
          x: margin,
          y: height - 65,
          size: 24,
          font: bold,
          color: ink,
        });
        page.drawText(section.hint, {
          x: margin,
          y: height - 89,
          size: 11,
          font: regular,
          color: ink,
        });
        const sheet = `Sheet ${start / perSheet + 1} of ${Math.ceil(words.length / perSheet)}`;
        page.drawText(sheet, {
          x: width - margin - regular.widthOfTextAtSize(sheet, 10),
          y: height - 110,
          size: 10,
          font: regular,
          color: ink,
        });
        const top = height - 122;
        const cardWidth = (width - 2 * margin) / 2;
        const cardHeight = (top - 57) / 4;
        const line = { thickness: 0.65, color: ruled, dashArray: [4, 3] };
        for (let col = 0; col <= 2; col++) {
          const x = margin + col * cardWidth;
          page.drawLine({ ...line, start: { x, y: 57 }, end: { x, y: top } });
        }
        for (let row = 0; row <= 4; row++) {
          const y = top - row * cardHeight;
          page.drawLine({
            ...line,
            start: { x: margin, y },
            end: { x: width - margin, y },
          });
        }
        for (let slot = 0; slot < perSheet; slot++) {
          const x = margin + ((slot % 2) + 0.5) * cardWidth;
          const y = top - (Math.floor(slot / 2) + 0.5) * cardHeight;
          const file: PDFImage | undefined = section.pictures?.[start + slot];
          if (file) {
            const side = flashcards ? 85 : 108;
            page.drawImage(file, {
              x: x - side / 2,
              y: y - side / 2 + (flashcards ? 14 : 0),
              width: side,
              height: side,
            });
          }
          const label = section.labels?.[start + slot];
          if (label) {
            const size = flashcards ? 20 : 26;
            page.drawText(label, {
              x: x - bold.widthOfTextAtSize(label, size) / 2,
              y: y - (flashcards ? 46 : 9),
              size,
              font: bold,
              color: ink,
            });
          }
        }
        page.drawText(
          'Bingo Card Kit | Print single-sided at actual size (100%).',
          {
            x: margin,
            y: 39,
            size: 10,
            font: regular,
            color: ink,
          },
        );
        if (section.pictures)
          page.drawText(
            'Icons by OpenMoji (openmoji.org) | CC BY-SA 4.0 (creativecommons.org/licenses/by-sa/4.0)',
            {
              x: margin,
              y: 24,
              size: 9,
              font: regular,
              color: ink,
            },
          );
      }
    }
    return doc;
  }

  const flashcards = await cutouts('flashcards');
  const matching = await cutouts('matching');
  const pack = await document('Classroom Pack');
  for (const part of [bingo.doc, flashcards, matching])
    for (const page of await pack.doc.copyPages(part, part.getPageIndices()))
      pack.doc.addPage(page);

  const downloads: [ClassroomDownload, PDFDocument][] = [
    ['pack', pack.doc],
    ['bingo', bingo.doc],
    ['flashcards', flashcards],
    ['matching', matching],
  ];
  for (const [name, doc] of downloads) {
    const file = `public/samples/${classroomFilename(name, paper)}`;
    await writeFile(file, await doc.save());
    console.log(`${file}: ${doc.getPageCount()} pages`);
  }
}
