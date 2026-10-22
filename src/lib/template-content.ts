export const featured: Record<
  string,
  { scene: string; settings: string; steps: string[]; examples: string[] }
> = {
  'sight-word-bingo': {
    scene:
      'Use this word recognition activity to revisit words you have already taught. The starting pool is the complete Dolch Pre-K group: 40 entries, preserving the capital I. It is a practice game, not a reading assessment or a substitute for instruction.',
    settings:
      'Start with 3 × 3 and a FREE center for eight words on each card. Use 5 × 5 for a longer review with 24 words per card. If you shorten the list, generation checks the actual distinct count: 8 or 9 for 3 × 3, and 24 or 25 for 5 × 5, depending on FREE.',
    steps: [
      'Review the source list below. Remove only words you do not want to practice, then choose a card for each learner.',
      'Generate your own activity, download its game pack, and save JSON before printing. Static sample cards belong to a separate example.',
      'Read each word shown in the host, use it in a short sentence, and give learners time to mark. Check a claimed line with the full printed card ID.',
    ],
    examples: [
      'For “can”, say “Can. I can jump.” Repeat “can” before the next call.',
      'For “here”, say “Here. Come here, please.” Only the displayed word counts; other words in the sentence are not additional calls.',
    ],
  },
  'alphabet-bingo': {
    scene:
      'Use separate uppercase and lowercase rounds to practice identifying printed letters. Each preset has exactly 26 letters. The two cases are never combined into one pool; there is no mixed-case matching mode.',
    settings:
      'Choose 3 × 3 for a short letter search or 5 × 5 for a larger scan. Both presets support either grid with or without a FREE center. Try one card per sheet for large letters or two per sheet for table groups.',
    steps: [
      'Choose uppercase or lowercase below. The maker loads that preset as an ungenerated draft, leaving the saved card set intact.',
      'Changing the preset in the maker also changes only the draft. Generate and confirm a replacement when ready; save the old JSON first if those cards have been printed.',
      'Say the letter name shown by the host. Players mark the same letter in the chosen case. Keep the card ID to check a line in that activity.',
    ],
    examples: [
      'When A or a is displayed, say the letter name “A”. A sound clue alone can be ambiguous, so repeat the letter name.',
      'Agree on your local names for letters such as Z before playing. The site displays text; the caller supplies the voice.',
    ],
  },
  'numbers-1-20-bingo': {
    scene:
      'Practice recognizing numerals and connecting them to spoken number names. The pool contains each integer from 1 to 20 exactly once. There are no number ranges by column, arithmetic prompts, or numbered-ball rules.',
    settings:
      'The default is 3 × 3. A 5 × 5 grid requires 24 distinct entries with FREE or 25 without it, so these 20 numbers cannot fill it. The maker reports the shortage and blocks generation; it does not add 21–25, repeat numbers, or change your grid.',
    steps: [
      'Use the preset to load the exact 1–20 pool and 3 × 3 grid into the maker.',
      'Choose the class size, generate once, download the game pack and save its JSON. Two per sheet is a useful start; use one for larger numerals.',
      'Read the displayed numeral aloud. Learners mark the matching numeral; use that same project in the host to check a complete line.',
    ],
    examples: [
      'For 7, say “seven”, then show seven fingers as an optional cue.',
      'For 12 and 20, articulate “twelve” and “twenty” clearly. Count objects after marking if extra practice helps; those objects are not extra calls.',
    ],
  },
  'thanksgiving-bingo': {
    scene:
      'Set out a quiet word game at a family table, or review food and gathering vocabulary with a class. These are text-only cards. Review the 32 terms with your group and replace foods or seasonal words that do not fit your celebration.',
    settings:
      'For 12 guests, generate 12 cards on a 5 × 5 grid with FREE enabled. Print two per A4 or US Letter sheet at Actual size / 100%. One per sheet gives multiword foods more room; choose 3 × 3 for a shorter round.',
    steps: [
      'Review the word list and explain phrases such as mashed potatoes before playing. Choose one distinct card per person.',
      'Generate your activity and save JSON beside its PDF. Offer pencils or counters and agree that a full row, column or diagonal wins.',
      'Use Next word to call the displayed term. Give everyone time to find its text. Enter a claimed winner’s full card ID in the same host activity.',
    ],
    examples: [
      'For “Gratitude”, say the word clearly and invite players to name something they appreciate after marking.',
      'For “Pumpkin pie”, call the whole phrase. “Pumpkin” is a separate entry and is marked only when it is called.',
    ],
  },
  'food-vocabulary-bingo': {
    scene:
      'Use these cards in an English vocabulary lesson, a library food theme, or a family game before a shared meal. The words cover fruit, vegetables, ingredients and familiar dishes; no food or tasting is required.',
    settings:
      'For a class of 24, make 24 distinct cards on a 5 × 5 grid with the center FREE space enabled. A4 or US Letter with two cards per page is a comfortable starting point. Use one per page for larger print, or a 3 × 3 grid for a shorter round.',
    steps: [
      'Review the 50 words below. Use this template, remove unfamiliar entries, and set the card count to match your players.',
      'Generate once, download the game pack, and save the project JSON. Give one card to each player.',
      'Start hosting that same activity. Read the displayed word aloud, let players mark it, then choose Next word. Check a claimed row, column or diagonal using the printed card ID.',
    ],
    examples: [
      'When the host displays “Apple”, say “Apple” and ask players to find the word. After marking, invite a volunteer to name an apple color.',
      'For “Watermelon”, ask “Is it a fruit or a vegetable?” after the call. Keep the exact displayed word clear for everyone.',
      'After a round, choose “Rice” and “Pasta” from the word list for a conversation about meals. These extra discussion words do not count as web-host calls.',
    ],
  },
  'classroom-objects-bingo': {
    scene:
      'A practical start-of-term activity, English class warm-up, or review before a school tour. The cards name things learners can often see around them, without requiring a scavenger hunt or moving around the room.',
    settings:
      'For 30 learners, generate 30 cards using the 5 × 5 grid and center FREE space. Start with two cards per A4 or US Letter sheet. For beginners, select 3 × 3 and review the smaller set of target words together before playing.',
    steps: [
      'Check the 35 entries and remove objects your group has not met yet. Apply the template and choose one card per learner.',
      'Generate and download your own game pack. Save its JSON so another device can host the identical cards.',
      'Use Start hosting and Call first word. Point to the object only after reading the displayed word, and check a Bingo claim with the card’s full ID.',
    ],
    examples: [
      'If “Pencil” appears, say the word and hold up a pencil. Players mark the matching text on their cards.',
      'For “Glue stick”, keep the two-word phrase together when speaking. Ask what it is used for after everyone has marked.',
      'If the host calls “Pencil sharpener”, point out its place in the room. A learner who lacks that entry simply waits for the next call.',
    ],
  },
  'christmas-bingo': {
    scene:
      'A quiet table game for a Christmas gathering, a seasonal library session, or an English vocabulary lesson. Review the traditions represented in the list and adapt the words to suit your guests.',
    settings:
      'For a table of 12, make 12 cards with a 5 × 5 grid and center FREE space, then print two per A4 or US Letter sheet. Ink saver works in black and white; Sage is an optional FREE-cell accent. A 3 × 3 grid makes a quicker game for a short visit.',
    steps: [
      'Read the 36 seasonal words and customize any unfamiliar terms. Apply the template and match the card count to your guests.',
      'Generate your activity and download the game pack. Save its project JSON before handing out the cards.',
      'Open the same activity in the host, call each displayed word, and mark matching entries. Agree on a row, column or diagonal and verify a claim with its full card ID.',
    ],
    examples: [
      'When “Candy cane” appears, read the whole phrase. Players mark the words; they do not need to find an actual sweet.',
      'For “Snowflake”, ask guests to imagine its shape after marking. The game works even where Christmas falls in summer.',
      'If “Carol” is called, invite a short conversation about a favorite song after the round. Audio playback is not needed.',
    ],
  },
};
export const related: Record<string, string[]> = {
  'sight-word-bingo': [
    'alphabet-bingo',
    'classroom-objects-bingo',
    'action-words-bingo',
  ],
  'alphabet-bingo': ['numbers-1-20-bingo', 'sight-word-bingo', 'color-bingo'],
  'numbers-1-20-bingo': ['alphabet-bingo', 'color-bingo', 'weather-bingo'],
  'thanksgiving-bingo': [
    'food-vocabulary-bingo',
    'christmas-bingo',
    'birthday-bingo',
  ],
  'food-vocabulary-bingo': [
    'household-objects-bingo',
    'birthday-bingo',
    'color-bingo',
  ],
  'classroom-objects-bingo': [
    'action-words-bingo',
    'color-bingo',
    'animal-bingo',
  ],
  'christmas-bingo': [
    'birthday-bingo',
    'weather-bingo',
    'food-vocabulary-bingo',
  ],
  'animal-bingo': [
    'weather-bingo',
    'food-vocabulary-bingo',
    'action-words-bingo',
  ],
  'transportation-bingo': [
    'action-words-bingo',
    'weather-bingo',
    'classroom-objects-bingo',
  ],
  'household-objects-bingo': [
    'classroom-objects-bingo',
    'food-vocabulary-bingo',
    'action-words-bingo',
  ],
  'action-words-bingo': [
    'classroom-objects-bingo',
    'animal-bingo',
    'transportation-bingo',
  ],
  'birthday-bingo': ['christmas-bingo', 'food-vocabulary-bingo', 'color-bingo'],
  'weather-bingo': ['color-bingo', 'animal-bingo', 'transportation-bingo'],
  'color-bingo': ['weather-bingo', 'classroom-objects-bingo', 'birthday-bingo'],
};
