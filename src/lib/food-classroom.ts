export const foodClassroomTemplate = 'food-vocabulary-bingo';
export const classroomCardCount = 24;
export const classroomPapers = [
  { id: 'A4', label: 'A4', suffix: 'a4' },
  { id: 'Letter', label: 'US Letter', suffix: 'letter' },
] as const;
export const classroomDownloadEvents = {
  pack: 'classroom_pack_download',
  bingo: 'classroom_bingo_download',
  flashcards: 'classroom_flashcards_download',
  matching: 'classroom_matching_download',
} as const;
export type ClassroomDownload = keyof typeof classroomDownloadEvents;

export function classroomFilename(
  part: ClassroomDownload,
  paper: (typeof classroomPapers)[number],
) {
  return `bingo-card-kit-food-vocabulary-${part}-${paper.suffix}.pdf`;
}
