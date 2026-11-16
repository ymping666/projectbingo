import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { templates } from '../src/lib/templates';
import { featuredIds, sampleProject, sampleFilename } from '../src/lib/samples';
import { exportPdf } from '../src/lib/pdf';
import { productionOrigin } from '../src/lib/deployment';
const [templateId] = process.argv.slice(2);
if (templateId && !featuredIds.includes(templateId))
  throw new Error(`Unknown sample template: ${templateId}`);
const font = new Uint8Array(await readFile('public/fonts/Lato-Regular.ttf'));
await mkdir('public/samples', { recursive: true });
const selected = templates.filter((t) =>
  templateId ? t.id === templateId : featuredIds.includes(t.id),
);
for (const t of selected) {
  const result = await exportPdf(
    sampleProject(t),
    true,
    font,
    undefined,
    `${productionOrigin}/templates/${t.id}/`,
  );
  await writeFile(`public/samples/${sampleFilename(t.id)}`, result.bytes);
  console.log(`${t.name}: two sample cards, caller list and rules`);
}

const alphabet = templates.find((t) => t.id === 'alphabet-bingo')!;
const variants = !templateId || templateId === alphabet.id ? alphabet.variants! : [];
for (const variant of variants) {
  const result = await exportPdf(
    sampleProject(alphabet, variant.id),
    true,
    font,
    undefined,
    `${productionOrigin}/templates/${alphabet.id}/`,
  );
  await writeFile(
    `public/samples/${sampleFilename(`${alphabet.id}-${variant.id}`)}`,
    result.bytes,
  );
}
