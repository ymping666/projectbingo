export const featured: Record<
  string,
  { scene: string; settings: string; steps: string[]; examples: string[] }
> = {
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
