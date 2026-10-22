export type Template = {
  id: string;
  name: string;
  icon: string;
  size: 3 | 5;
  category: string;
  description: string;
  tip: string;
  words: string[];
  variants?: { id: string; name: string; words: string[] }[];
};
const list = (s: string) => s.split('|');
export const templates: Template[] = [
  {
    id: 'food-vocabulary-bingo',
    name: 'Food Vocabulary',
    icon: '◒',
    size: 5,
    category: 'Everyday learning',
    description:
      'Bring familiar foods to the table with 50 words for fruit, vegetables, meals, and treats.',
    tip: 'Say each food aloud and invite players to describe its taste after the round. Two cards per page keeps the words comfortable to read.',
    words: list(
      'Apple|Banana|Orange|Grape|Strawberry|Blueberry|Pineapple|Watermelon|Peach|Pear|Mango|Lemon|Cherry|Kiwi|Avocado|Carrot|Potato|Tomato|Broccoli|Spinach|Cucumber|Onion|Pepper|Corn|Peas|Bread|Rice|Pasta|Noodles|Pizza|Sandwich|Soup|Salad|Cheese|Yogurt|Milk|Egg|Chicken|Fish|Beef|Beans|Tofu|Butter|Honey|Cereal|Pancake|Cookie|Cake|Chocolate|Ice cream',
    ),
  },
  {
    id: 'animal-bingo',
    name: 'Animals',
    icon: '♧',
    size: 5,
    category: 'Everyday learning',
    description:
      'Explore 36 familiar animals from homes, farms, forests, and oceans.',
    tip: 'Use the printed caller list to add a sound or a habitat clue. Keep a copy of the actual called word so every player can check their card.',
    words: list(
      'Cat|Dog|Rabbit|Hamster|Horse|Cow|Sheep|Goat|Pig|Chicken|Duck|Goose|Turkey|Donkey|Lion|Tiger|Elephant|Giraffe|Zebra|Monkey|Bear|Wolf|Fox|Deer|Squirrel|Hedgehog|Owl|Eagle|Penguin|Parrot|Dolphin|Whale|Shark|Turtle|Frog|Butterfly',
    ),
  },
  {
    id: 'transportation-bingo',
    name: 'Transportation',
    icon: '↗',
    size: 5,
    category: 'Everyday learning',
    description:
      'A journey through 32 vehicles and ways to travel, from a bicycle to a space shuttle.',
    tip: 'Ask players where they might see each vehicle. Use one card per page for a group that needs larger print.',
    words: list(
      'Car|Bus|Train|Bicycle|Motorcycle|Scooter|Taxi|Truck|Van|Tram|Subway|Ferry|Sailboat|Canoe|Kayak|Rowboat|Speedboat|Ship|Submarine|Airplane|Helicopter|Glider|Hot air balloon|Rocket|Space shuttle|Ambulance|Fire engine|Police car|Tractor|School bus|Cable car|Skateboard',
    ),
  },
  {
    id: 'classroom-objects-bingo',
    name: 'Classroom Objects',
    icon: '✎',
    size: 5,
    category: 'Everyday learning',
    description:
      'Make classroom vocabulary tangible with 35 objects used for learning and creating.',
    tip: 'Point to a real object after calling its name. These are word cards; players mark a matching word, rather than collecting objects.',
    words: list(
      'Pencil|Pen|Eraser|Ruler|Notebook|Textbook|Dictionary|Folder|Binder|Paper|Scissors|Glue stick|Crayon|Marker|Paintbrush|Calculator|Backpack|Desk|Chair|Whiteboard|Chalk|Chalkboard|Projector|Computer|Keyboard|Mouse|Screen|Clock|Calendar|Map|Globe|Bookshelf|Stapler|Paper clip|Pencil sharpener',
    ),
  },
  {
    id: 'household-objects-bingo',
    name: 'Household Objects',
    icon: '⌂',
    size: 5,
    category: 'Everyday learning',
    description:
      'Practice 36 useful names for everyday objects around the home.',
    tip: 'Invite players to name the room where an object belongs. Print in black and white for an easy, low-ink activity.',
    words: list(
      'Sofa|Table|Chair|Bed|Pillow|Blanket|Lamp|Mirror|Clock|Curtain|Rug|Shelf|Cupboard|Drawer|Door|Window|Key|Telephone|Television|Remote control|Refrigerator|Oven|Microwave|Kettle|Toaster|Plate|Bowl|Cup|Spoon|Fork|Knife|Towel|Soap|Toothbrush|Broom|Vacuum cleaner',
    ),
  },
  {
    id: 'action-words-bingo',
    name: 'Everyday Actions',
    icon: '↝',
    size: 5,
    category: 'Everyday learning',
    description:
      'Thirty-six familiar action words for an active vocabulary game.',
    tip: 'Choose Next word in the host, demonstrate the displayed action, then say its word aloud. The host records that displayed call automatically.',
    words: list(
      'Walk|Run|Jump|Hop|Skip|Climb|Swim|Dance|Sing|Read|Write|Draw|Paint|Cook|Eat|Drink|Sleep|Wake up|Sit|Stand|Smile|Laugh|Cry|Listen|Speak|Watch|Open|Close|Push|Pull|Carry|Throw|Catch|Kick|Wash|Clean',
    ),
  },
  {
    id: 'birthday-bingo',
    name: 'Birthday Party',
    icon: '✧',
    size: 5,
    category: 'Celebrations',
    description:
      'Add a simple table game to a birthday gathering with 32 party words.',
    tip: 'Hand out cards before opening the caller. This is a called-word game: no signatures, gifts, or real-world actions are required to win.',
    words: list(
      'Birthday|Cake|Candle|Balloon|Gift|Ribbon|Wrapping paper|Party hat|Confetti|Invitation|Guest|Friend|Family|Music|Dance|Game|Prize|Wish|Surprise|Cupcake|Cookie|Ice cream|Juice|Lemonade|Pizza|Sandwich|Banner|Streamer|Card|Bow|Celebration|Party bag',
    ),
  },
  {
    id: 'christmas-bingo',
    name: 'Christmas Words',
    icon: '✳',
    size: 5,
    category: 'Celebrations',
    description:
      'A festive collection of 36 seasonal words for a cozy group activity.',
    tip: 'Use this as a quiet table activity or a group game. Sage is a gentle optional accent, while the default ink theme saves color ink.',
    words: list(
      'Christmas|Tree|Star|Bauble|Tinsel|Garland|Wreath|Candle|Stocking|Gift|Ribbon|Wrapping paper|Bell|Snowflake|Snowman|Snow|Sleigh|Reindeer|Santa|Elf|Chimney|Fireplace|Gingerbread|Candy cane|Cookie|Hot chocolate|Mistletoe|Holly|Pine cone|Carol|Choir|Angel|Ornament|Advent calendar|Christmas Eve|Christmas dinner',
    ),
  },
  {
    id: 'weather-bingo',
    name: 'Weather',
    icon: '☀',
    size: 3,
    category: 'Quick little games',
    description:
      'Eighteen weather words in a compact 3 × 3 game that is quick to set up.',
    tip: 'Try a round after talking about the weather outside. Four 3 × 3 cards per page makes a compact handout.',
    words: list(
      'Sunny|Cloudy|Rainy|Snowy|Windy|Foggy|Stormy|Hot|Cold|Warm|Cool|Thunder|Lightning|Rainbow|Hail|Frost|Drizzle|Breeze',
    ),
  },
  {
    id: 'color-bingo',
    name: 'Colors',
    icon: '◉',
    size: 3,
    category: 'Quick little games',
    description:
      'Sixteen color names on text-only cards that work beautifully in black and white.',
    tip: 'Call the color names aloud. Every cell contains text, so players can use these cards without a color printer.',
    words: list(
      'Red|Orange|Yellow|Green|Blue|Purple|Pink|Brown|Black|White|Gray|Gold|Silver|Turquoise|Navy|Beige',
    ),
  },
  {
    id: 'sight-word-bingo',
    name: 'Sight Word',
    icon: 'Aa',
    size: 3,
    category: 'Classroom vocabulary',
    description:
      'Practice the complete 40-word Dolch Pre-K list with printable text Bingo cards, a caller list, and your own editable activity.',
    tip: 'Call the displayed word first, then use it in a short sentence. Start with 3 × 3 for fewer spaces to scan; 5 × 5 works with all 40 words.',
    words: list(
      'a|and|away|big|blue|can|come|down|find|for|funny|go|help|here|I|in|is|it|jump|little|look|make|me|my|not|one|play|red|run|said|see|the|three|to|two|up|we|where|yellow|you',
    ),
  },
  {
    id: 'alphabet-bingo',
    name: 'Alphabet',
    icon: 'Ab',
    size: 3,
    category: 'Letters and numbers',
    description:
      'Choose separate A–Z uppercase or a–z lowercase letter presets. Print 3 × 3 or 5 × 5 alphabet recognition cards and call letter names.',
    tip: 'Say the letter name, pause, and show the same printed letter if learners need a visual cue. This is letter recognition, with no recorded audio or automatic pronunciation.',
    words: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    variants: [
      {
        id: 'uppercase',
        name: 'Uppercase A–Z',
        words: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      },
      {
        id: 'lowercase',
        name: 'Lowercase a–z',
        words: Array.from('abcdefghijklmnopqrstuvwxyz'),
      },
    ],
  },
  {
    id: 'numbers-1-20-bingo',
    name: 'Numbers 1–20',
    icon: '20',
    size: 3,
    category: 'Letters and numbers',
    description:
      'A 3 × 3 number recognition game using exactly the numbers 1 through 20. Customize and print a distinct card for each learner.',
    tip: 'Read the displayed number aloud: for 14, say “fourteen”. Players find its numeral. This is a number recognition activity, not 75-ball or 90-ball Bingo.',
    words: Array.from({ length: 20 }, (_, i) => String(i + 1)),
  },
  {
    id: 'thanksgiving-bingo',
    name: 'Thanksgiving Word',
    icon: '♧',
    size: 5,
    category: 'Celebrations',
    description:
      'Printable Thanksgiving word cards with 32 food, gathering, and autumn terms for a classroom or family table. Text cards, ready to customize.',
    tip: 'Review unfamiliar food and gathering words together. Call the exact displayed word or phrase; players mark text, rather than pictures or real objects.',
    words: list(
      'Thanksgiving|Gratitude|Thankful|Family|Friends|Gathering|Guest|Welcome|Table|Tablecloth|Napkin|Plate|Bowl|Fork|Spoon|Turkey|Stuffing|Gravy|Mashed potatoes|Sweet potato|Cranberry|Corn|Green beans|Bread roll|Pumpkin|Pumpkin pie|Apple pie|Harvest|Autumn|Leaf|Acorn|Basket',
    ),
  },
];
export const food = templates[0];
export function templateDraft(t: Template, variant?: string) {
  const preset = t.variants?.find((v) => v.id === variant) || t.variants?.[0];
  return {
    title: `${t.name} Bingo${preset ? ` — ${preset.name}` : ''}`,
    text: (preset?.words || t.words).join('\n'),
    size: t.size,
    free: true,
    count: 40,
    templateId: t.id,
  };
}
