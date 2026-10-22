import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { templates } from '../src/lib/templates';
import { featuredIds, sampleProject, sampleFilename } from '../src/lib/samples';
import { exportPdf } from '../src/lib/pdf';
const font = new Uint8Array(await readFile('public/fonts/Lato-Regular.ttf'));
await mkdir('public/samples', { recursive: true });
for (const t of templates.filter((t) => featuredIds.includes(t.id))) {
  const result = await exportPdf(sampleProject(t), true, font);
  await writeFile(`public/samples/${sampleFilename(t.id)}`, result.bytes);
  console.log(`${t.name}: two sample cards, caller list and rules`);
}
