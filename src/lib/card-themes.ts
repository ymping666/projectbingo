// Small print-safe vector motifs, used by both the browser and the PDF renderer.
export const motifs = {
  sparkle: ['M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z'],
  apple: [
    'M12 7C8 2 2 6 4 14C5 21 9 23 12 20C15 23 19 21 20 14C22 6 16 2 12 7Z',
    'M12 7V3M12 5Q16 0 20 3Q17 7 12 5',
  ],
  paw: [
    'M6 18C6 14 10 10 12 10C14 10 18 14 18 18C18 23 14 20 12 20C10 20 6 23 6 18Z',
    'M6 7C6 11 2 11 2 7C2 3 6 3 6 7ZM12 4C12 8 8 8 8 4C8 0 12 0 12 4ZM18 4C18 8 14 8 14 4C14 0 18 0 18 4ZM22 9C22 13 18 13 18 9C18 5 22 5 22 9Z',
  ],
  bus: ['M4 4Q12 1 20 4V18H4ZM4 9H20M12 4V9M7 18V22M17 18V22M6 14H8M16 14H18'],
  book: [
    'M12 5Q7 1 2 4V20Q7 17 12 21Q17 17 22 20V4Q17 1 12 5V21',
    'M5 8L9 9M5 12L9 13M15 9L19 8M15 13L19 12',
  ],
  pencil: ['M3 16L16 3Q18 1 21 4Q23 6 21 8L8 21L2 22ZM14 5L19 10M3 16L8 21'],
  home: ['M2 11L12 2L22 11M5 9V22H19V9M9 22V14H15V22'],
  runner: [
    'M15 4C15 7 11 7 11 4C11 1 15 1 15 4ZM4 9L9 8L14 11L20 9M9 8L8 15L3 20M8 15L15 17L18 22M14 11L15 17',
  ],
  balloon: [
    'M19 9C19 19 5 19 5 9C5 0 19 0 19 9ZM12 16L10 19H14ZM12 19Q18 24 10 23',
  ],
  tree: ['M12 1L5 9H8L3 16H9V22H15V16H21L16 9H19ZM7 13H17'],
  sun: [
    'M17 12C17 19 7 19 7 12C7 5 17 5 17 12ZM12 1V4M12 20V23M1 12H4M20 12H23M4 4L6 6M18 18L20 20M4 20L6 18M18 6L20 4',
  ],
  palette: [
    'M22 11C22 3 12 0 6 4C-1 8 1 19 10 22C16 24 13 16 17 16C21 17 22 14 22 11Z',
    'M7 8H8M12 6H13M17 9H18M5 13H6',
  ],
  letters: [
    'M2 19L7 4L12 19M4 14H10M16 4V19H20Q24 16 20 12H16M16 4H19Q24 8 19 12',
  ],
  numbers: ['M3 7L7 3V21M12 7Q12 0 19 3Q24 6 17 12L12 20H22'],
  leaf: [
    'M20 3C5 1 0 9 5 17C13 23 22 17 20 3ZM4 22L17 7M8 17L7 11M12 13L18 14',
  ],
  shirt: ['M8 3L3 5L1 11L5 13L7 9V22H17V9L19 13L23 11L21 5L16 3Q12 9 8 3Z'],
  person: [
    'M16 5C16 11 8 11 8 5C8-1 16-1 16 5ZM6 22V14Q12 9 18 14V22M9 16V22M15 16V22',
  ],
  city: [
    'M2 22V8H10V22M10 22V2H21V22M0 22H23M5 11H7M5 15H7M14 6H17M14 10H17M14 14H17M14 18H17',
  ],
  smile: [
    'M22 12C22 25 2 25 2 12C2-1 22-1 22 12ZM7 9H8M16 9H17M7 15Q12 21 17 15',
  ],
  ball: [
    'M22 12C22 25 2 25 2 12C2-1 22-1 22 12ZM2 12H22M12 2V22M5 4Q15 12 5 20M19 4Q9 12 19 20',
  ],
  snowflake: [
    'M12 1V23M2 6L22 18M2 18L22 6M8 3L12 7L16 3M8 21L12 17L16 21M2 11L7 10L6 5M18 19L17 14L22 13M6 19L7 14L2 13M22 11L17 10L18 5',
  ],
  fireworks: [
    'M12 2V7M12 17V22M2 12H7M17 12H22M4 4L8 8M16 16L20 20M4 20L8 16M16 8L20 4M12 10L14 12L12 14L10 12Z',
  ],
  heart: ['M12 21L3 12C-4 3 7-2 12 6C17-2 28 3 21 12Z'],
  egg: [
    'M21 15C21 25 3 25 3 15C3 8 8 1 12 1C16 1 21 8 21 15ZM4 12L8 15L12 12L16 15L20 12M5 19H19',
  ],
  clover: [
    'M12 10C3-4-4 10 8 13C-4 24 11 29 12 17C22 29 29 14 16 13C29 6 17-3 12 10ZM12 14Q14 20 19 23',
  ],
  pumpkin: [
    'M12 7C4 2 0 11 3 18C5 24 10 23 12 21C14 23 19 24 21 18C24 11 20 2 12 7ZM12 7V21M8 8Q4 15 8 21M16 8Q20 15 16 21M12 7Q11 2 16 1',
  ],
  music: [
    'M10 17V4L22 2V15M10 8L22 6M10 17C10 23 2 23 2 19C2 15 10 14 10 17ZM22 15C22 21 14 21 14 17C14 13 22 12 22 15Z',
  ],
  briefcase: ['M8 6V2H16V6M2 6H22V21H2ZM2 11Q12 18 22 11M10 13H14V17H10Z'],
  headset: [
    'M3 13V10C3-2 21-2 21 10V13M3 11H7V19H3ZM17 11H21V19H17ZM21 19Q21 23 14 23H12',
  ],
  baby: [
    'M22 12C22 25 2 25 2 12C2-1 22-1 22 12ZM12 2Q17 5 12 7M7 11H8M16 11H17M8 16Q12 20 16 16',
  ],
} as const;
export type Motif = keyof typeof motifs;
export type CardPalette = {
  dark: string;
  light: string;
  line: string;
  accent: string;
  festive: boolean;
};
const palette = (
  dark: string,
  light: string,
  line: string,
  accent: string,
): CardPalette => ({ dark, light, line, accent, festive: true });
const colors = {
  citrus: palette('#73501e', '#fff5df', '#c4ae82', '#f6d996'),
  woodland: palette('#3c604c', '#eef5e9', '#a5baa0', '#d6e5bf'),
  sky: palette('#315d7d', '#edf6fb', '#a0bbcc', '#cce7f3'),
  school: palette('#365a79', '#eef3fa', '#a1b4cc', '#d5e2f6'),
  clay: palette('#825647', '#faf0e8', '#c9ad9c', '#eed6bf'),
  coral: palette('#8b514b', '#fff0e9', '#d0aaa0', '#f6d1bb'),
  party: palette('#794a73', '#fcf0f8', '#c7a4c2', '#f1cedf'),
  christmas: palette('#315b46', '#f0f5eb', '#a7b79e', '#e9d4a0'),
  rainbow: palette('#5d537d', '#f5f1fc', '#b5abce', '#d9e8d2'),
  autumn: palette('#875333', '#fcf1e5', '#c9ad8f', '#efd4a7'),
  winter: palette('#3f6179', '#eff7fb', '#aac2d2', '#d5eaf5'),
  midnight: palette('#3d456c', '#f1f2f9', '#a9afc8', '#ebd99f'),
  rose: palette('#934d62', '#fff0f3', '#d1a8b4', '#f3cdd8'),
  easter: palette('#68527f', '#f6f0fb', '#bcabca', '#dce9c6'),
  jade: palette('#356146', '#eef7eb', '#a0b99d', '#d4e5b1'),
  halloween: palette('#7d492f', '#fff3e6', '#c7a68c', '#f4c794'),
  music: palette('#60456f', '#f5effa', '#b7a4c4', '#e8cfe9'),
  office: palette('#3d576b', '#f0f4f7', '#a8b9c6', '#d9e4eb'),
};
const profile = (name: string, motif: Motif, color: keyof typeof colors) => ({
  name,
  motif,
  palette: colors[color],
});
export const cardThemes = {
  'food-vocabulary-bingo': profile('Market day', 'apple', 'citrus'),
  'animal-bingo': profile('Woodland friends', 'paw', 'woodland'),
  'transportation-bingo': profile('All aboard', 'bus', 'sky'),
  'classroom-objects-bingo': profile('School supplies', 'pencil', 'school'),
  'household-objects-bingo': profile('Home sweet home', 'home', 'clay'),
  'action-words-bingo': profile('Ready, set, play', 'runner', 'coral'),
  'birthday-bingo': profile('Birthday wishes', 'balloon', 'party'),
  'christmas-bingo': profile('Holly & gold', 'tree', 'christmas'),
  'weather-bingo': profile('Hello sunshine', 'sun', 'sky'),
  'color-bingo': profile('Color studio', 'palette', 'rainbow'),
  'sight-word-bingo': profile('Little readers', 'book', 'school'),
  'alphabet-bingo': profile('Letter club', 'letters', 'school'),
  'numbers-1-20-bingo': profile('Number club', 'numbers', 'jade'),
  'thanksgiving-bingo': profile('Harvest table', 'leaf', 'autumn'),
  'kindergarten-sight-word-bingo': profile(
    'First little stories',
    'book',
    'coral',
  ),
  'first-grade-sight-word-bingo': profile('Reading explorers', 'book', 'sky'),
  'second-grade-sight-word-bingo': profile('Book club', 'book', 'woodland'),
  'cvc-word-bingo': profile('Sound it out', 'letters', 'citrus'),
  'consonant-blends-bingo': profile('Sound partners', 'letters', 'jade'),
  'consonant-digraph-bingo': profile('Letter detectives', 'pencil', 'rainbow'),
  'jobs-and-occupations-bingo': profile(
    'When I grow up',
    'briefcase',
    'office',
  ),
  'clothes-bingo': profile('Dress-up day', 'shirt', 'clay'),
  'body-parts-bingo': profile('Head to toe', 'person', 'sky'),
  'places-in-town-bingo': profile('Around town', 'city', 'jade'),
  'feelings-and-emotions-bingo': profile('All the feelings', 'smile', 'coral'),
  'sports-bingo': profile('Game day', 'ball', 'woodland'),
  'winter-bingo': profile('Snow day', 'snowflake', 'winter'),
  'new-years-eve-bingo': profile('Midnight sparkle', 'fireworks', 'midnight'),
  'valentines-day-bingo': profile('Love notes', 'heart', 'rose'),
  'easter-bingo': profile('Spring surprise', 'egg', 'easter'),
  'st-patricks-day-bingo': profile('Lucky clover', 'clover', 'jade'),
  'halloween-bingo': profile('Pumpkin patch', 'pumpkin', 'halloween'),
  'music-bingo': profile('On the playlist', 'music', 'music'),
  'office-buzzword-bingo': profile('Office hours', 'briefcase', 'office'),
  'conference-call-bingo': profile('You are on mute', 'headset', 'office'),
  'office-icebreaker': profile('Meet the team', 'smile', 'office'),
  'baby-shower': profile('Little celebration', 'baby', 'rose'),
  nature: profile('Into the outdoors', 'leaf', 'woodland'),
} satisfies Record<string, ReturnType<typeof profile>>;
const fallback = profile('A little celebration', 'sparkle', 'party');
export function cardTheme(templateId?: string) {
  return templateId && Object.hasOwn(cardThemes, templateId)
    ? cardThemes[templateId as keyof typeof cardThemes]
    : fallback;
}
