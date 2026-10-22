export type Guide = {
  slug: string;
  title: string;
  description: string;
  sections: { title: string; text: string; links?: [string, string][] }[];
  preset?: string;
};
export const guides: Guide[] = [
  {
    slug: 'esl-bingo',
    title: 'ESL Bingo for Vocabulary Review',
    description:
      'Plan an English vocabulary review with familiar words, clear calls, definition clues and a useful follow-up conversation.',
    sections: [
      {
        title: 'Choose what learners already know',
        text: 'Select 12–40 previously taught words around a useful topic. Food, jobs or places work well because you can explain each item clearly. A 12–23 word pool needs 3 × 3; 5 × 5 requires at least 24 with FREE or 25 without. Do not stretch the list with unfamiliar filler.',
        links: [
          ['food-vocabulary-bingo', 'Food'],
          ['animal-bingo', 'Animals'],
          ['jobs-and-occupations-bingo', 'Jobs'],
          ['clothes-bingo', 'Clothes'],
          ['places-in-town-bingo', 'Places in Town'],
        ],
      },
      {
        title: 'Introduce and model the first round',
        text: 'Read the chosen list together, check meanings and demonstrate one sample card. Generate one layout per learner, save JSON and print. In the first round, read the displayed host word aloud and let players repeat it before marking. Keep the pace slow enough to scan the card.',
      },
      {
        title: 'Add definition or sentence clues',
        text: 'In a later round, keep the displayed host word private, give a definition, then confirm the exact word before advancing. Avoid ambiguous clues: a place to buy food may describe several entries. A sentence can give context, but only the displayed target is the call.',
        links: [
          ['action-words-bingo', 'Everyday Actions'],
          ['sight-word-bingo', 'Pre-K Sight Words'],
        ],
      },
      {
        title: 'Review after the game',
        text: 'Ask pairs to choose three called words and make spoken sentences. Revisit confusing spellings or meanings before another round. Bingo is a review activity alongside systematic English teaching, not a replacement for it. For class sizes, printing and project continuity, use the classroom organization guide.',
        links: [
          ['/classroom-bingo/', 'Organize the class'],
          ['/educational-bingo/', 'Choose a learning goal'],
        ],
      },
    ],
  },
  {
    slug: 'family-bingo',
    title: 'Family Game Night Bingo',
    description:
      'Prepare a short family word Bingo game, help younger readers, print different cards and rotate the caller while keeping the same saved activity.',
    preset: 'animal-bingo',
    sections: [
      {
        title: 'Build a shared pool',
        text: 'Let everyone suggest familiar foods, animals or celebration words. Pick one theme and check that everyone understands the entries. Children can help choose words without entering personal details. Keep at least eight unique entries for 3 × 3 with FREE.',
        links: [
          ['animal-bingo', 'Animals'],
          ['food-vocabulary-bingo', 'Food'],
          ['birthday-bingo', 'Birthday Party'],
        ],
      },
      {
        title: 'Keep the first round short',
        text: 'Start with 3 × 3 and one card per person, printed two per sheet. Generate once, download the game pack and save JSON. Agree on a row, column or diagonal. Set aside a brief round, with a break rather than requiring young players to finish a long session.',
      },
      {
        title: 'Help readers and rotate the caller',
        text: 'One person reads the displayed word; an adult or older reader may help a child find the text. Avoid revealing the next call early. Check a claim with its full card ID. Multiple players may win together. Between rounds, rotate the caller and choose Start a new round to retain the cards.',
      },
      {
        title: 'Keep the printed set together',
        text: 'Changing the word pool requires a new generated activity and new printouts. To repeat tonight’s exact layouts, retain the JSON beside the PDF. The fixed sample below is an example only; generate your own set to use web verification.',
        links: [
          ['/bingo-caller/', 'Use a separate word caller'],
          ['/how-to-play/', 'Read the rules'],
        ],
      },
    ],
  },
  {
    slug: 'office-icebreaker-bingo',
    title: 'Office Icebreaker: People Bingo',
    description:
      'Print conversation prompts with room to handwrite names. Meet people, agree on matching rules and have an organizer confirm the paper cards.',
    preset: 'office-icebreaker',
    sections: [
      {
        title: 'Agree on a comfortable activity',
        text: 'Invite participation in an optional meet-and-talk round. Review prompts for your group and remove anything too personal or unsuitable. Anyone can pass without explanation. The prompts are conversation starters, not conditions the website evaluates.',
      },
      {
        title: 'Find a person, ask, write',
        text: 'Participants look for someone who matches a prompt, have a short conversation and ask before writing that person’s name in the cell. Decide in advance whether a name may appear once per card or several times. Tell everyone the rule before distributing cards.',
      },
      {
        title: 'Leave room for names',
        text: 'The people preset reserves the lower part of each PDF cell for a name line. Use one card per A4 or Letter sheet, especially for 5 × 5; 3 × 3 leaves more writing space. Set a short activity window and keep full card IDs visible if you plan to reprint.',
      },
      {
        title: 'Confirm wins in the room',
        text: 'A full row, column or diagonal is a suggested goal. The organizer checks with participants manually and can invite a volunteered introduction. There is no random-word host requirement, online attendee list, account or collection of handwritten names.',
        links: [
          ['office-buzzword-bingo', 'Observe meeting phrases'],
          ['conference-call-bingo', 'Observe remote-call events'],
          ['/family-bingo/', 'A called-word group game'],
        ],
      },
    ],
  },
  {
    slug: 'baby-shower-bingo',
    title: 'Baby Shower Gift Bingo',
    description:
      'Create printable gift-observation cards. Guests mark matching items as gifts are opened, with editable categories and manual winner confirmation.',
    preset: 'baby-shower',
    sections: [
      {
        title: 'Prepare for the gifts you expect',
        text: 'Review the default gift list and replace terms with categories that suit the occasion. These are words on cards, not pictures. Do not add recipient names or private registry details unless you intend those words to appear in the local printout.',
      },
      {
        title: 'Mark while gifts are opened',
        text: 'Hand out distinct layouts before gift opening. Guests mark a blanket, book or another entry when a corresponding gift is opened. Agree whether a gift set may count as several entries and whether similar items share a category. The group decides what matches.',
      },
      {
        title: 'Use a compact printout',
        text: 'Start with 3 × 3 and FREE, two per A4 or Letter sheet. The 20-entry default cannot fill 5 × 5. You can add more distinct categories yourself or keep the shorter game. Check a test print at Actual size / 100%.',
      },
      {
        title: 'Check the paper cards together',
        text: 'Agree on a row, column or diagonal and have the organizer confirm a claimed line from the gifts everyone observed. Do not use random web calls as the main flow. The website does not recognize gifts, access a camera or automatically verify reality.',
        links: [
          ['birthday-bingo', 'A celebration word game'],
          ['/blank-bingo-cards/', 'Write your own gift guesses'],
          ['/family-bingo/', 'Family game planning'],
        ],
      },
    ],
  },
  {
    slug: 'nature-bingo',
    title: 'Nature Scavenger Hunt Bingo',
    description:
      'Print an observation-only outdoor Bingo activity. Adapt familiar items to your location and mark discoveries without touching or collecting wildlife.',
    preset: 'nature',
    sections: [
      {
        title: 'Adapt the walk before printing',
        text: 'Review the 20 starting entries for the place and season. Replace a pine cone or puddle if it is unlikely where you are going. Choose a suitable route and agree where the group can go. The website provides no directions, live map or local hazard assessment.',
      },
      {
        title: 'Observe without collecting',
        text: 'Mark a matching entry when you see or, for birdsong, hear it. Look from a respectful distance: no touching wildlife, collecting feathers, picking protected plants or reaching into unknown spaces is required. Follow local park rules and leave objects where they are.',
      },
      {
        title: 'Print for the outing',
        text: 'Use 3 × 3 with FREE and one card per participant. One per sheet gives room for notes; two is a compact option. If rain is likely, a clipboard cover can help. The default 20 entries cannot fill 5 × 5 without deliberate additions.',
      },
      {
        title: 'Review discoveries manually',
        text: 'The organizer confirms a line from the group’s observations. Invite a discussion of an interesting discovery rather than a race to collect objects. This activity requests no location or camera permission and offers no image recognition or AR.',
        links: [
          ['animal-bingo', 'Animal words indoors'],
          ['weather-bingo', 'Weather vocabulary'],
          ['/blank-bingo-cards/', 'Handwrite a local list'],
        ],
      },
    ],
  },
  {
    slug: 'educational-bingo',
    title: 'Educational Bingo by Learning Goal',
    description:
      'Choose letter, number, sight-word, phonics or vocabulary Bingo by the task learners are practicing, with useful grid and classroom planning advice.',
    sections: [
      {
        title: 'Recognize a printed symbol',
        text: 'Choose Alphabet for a single uppercase or lowercase pool. Choose Numbers 1–20 to connect spoken number names to numerals. A quick 3 × 3 search gives fewer spaces to scan. Choose by familiarity and task, not a required age.',
        links: [
          ['alphabet-bingo', 'Alphabet recognition'],
          ['numbers-1-20-bingo', 'Number recognition'],
        ],
      },
      {
        title: 'Revisit high-frequency words',
        text: 'The Dolch group labels identify the source lists rather than mandatory grade expectations. Preview the exact entries and select already taught words. Use a simple sentence after a clear word call.',
        links: [
          ['sight-word-bingo', 'Pre-K'],
          ['kindergarten-sight-word-bingo', 'Kindergarten / Primer'],
          ['first-grade-sight-word-bingo', 'First Grade'],
          ['second-grade-sight-word-bingo', 'Second Grade'],
        ],
      },
      {
        title: 'Notice spelling and sound patterns',
        text: 'CVC focuses on simple short-vowel words. Blends retain the individual consonant sounds, while digraphs use two letters for one sound. Review the pattern first, then ask learners to find the whole printed word. These games supplement phonics instruction.',
        links: [
          ['cvc-word-bingo', 'CVC words'],
          ['consonant-blends-bingo', 'Consonant blends'],
          ['consonant-digraph-bingo', 'Consonant digraphs'],
        ],
      },
      {
        title: 'Review a meaningful vocabulary topic',
        text: 'Use a known topic with exact calls first and definition clues later. For a broader review choose 5 × 5 when the actual unique pool has at least 24 entries with FREE or 25 without. Small pools work naturally as 3 × 3.',
        links: [
          ['food-vocabulary-bingo', 'Food'],
          ['animal-bingo', 'Animals'],
          ['jobs-and-occupations-bingo', 'Jobs'],
          ['clothes-bingo', 'Clothes'],
          ['body-parts-bingo', 'Body parts'],
          ['places-in-town-bingo', 'Places'],
          ['feelings-and-emotions-bingo', 'Feelings'],
          ['sports-bingo', 'Sports'],
          ['classroom-objects-bingo', 'Classroom objects'],
          ['action-words-bingo', 'Actions'],
        ],
      },
      {
        title: 'Prepare the group, then review the learning',
        text: 'Use the classroom guide for distinct cards, paper settings and preserving the same project. Use the ESL guide for introducing words, adjusting clues and reviewing language after play.',
        links: [
          ['/classroom-bingo/', 'Classroom organization'],
          ['/esl-bingo/', 'ESL vocabulary review'],
          ['/bingo-caller/', 'Independent caller'],
        ],
      },
    ],
  },
  {
    slug: 'holiday-bingo',
    title: 'Holiday and Seasonal Bingo',
    description:
      'Choose a text Bingo activity for a seasonal classroom session, family holiday table or birthday gathering, with practical guidance rather than duplicate print variants.',
    sections: [
      {
        title: 'Autumn gatherings',
        text: 'Halloween offers a family-friendly selection of creatures, costumes and decorations; remove any words your group dislikes. Thanksgiving focuses on food, gratitude and gathering. Both are called-word games, not activities that detect events around the table.',
        links: [
          ['halloween-bingo', 'Halloween'],
          ['thanksgiving-bingo', 'Thanksgiving'],
        ],
      },
      {
        title: 'Winter tables and celebrations',
        text: 'Christmas Words covers seasonal decorations and traditions. Winter focuses on clothing, equipment and snow activities without requiring a Christmas setting. New Year’s Eve is a compact, year-independent called-word game for a short gathering.',
        links: [
          ['christmas-bingo', 'Christmas'],
          ['winter-bingo', 'Winter'],
          ['new-years-eve-bingo', 'New Year’s Eve'],
        ],
      },
      {
        title: 'Friendship and spring themes',
        text: 'Valentine’s Day emphasizes friendship and kind actions. Easter combines recognizable celebration and spring craft words. St. Patrick’s Day keeps a small familiar pool. Each defaults to 3 × 3 rather than padding the list to fill a larger grid.',
        links: [
          ['valentines-day-bingo', 'Valentine’s Day'],
          ['easter-bingo', 'Easter'],
          ['st-patricks-day-bingo', 'St. Patrick’s Day'],
        ],
      },
      {
        title: 'Celebrate any time',
        text: 'Birthday Party works at a family or group table throughout the year. Match the words to the people present and keep participation comfortable. Baby Shower Gift Bingo has different rules: guests mark gifts as they are opened, with manual confirmation.',
        links: [
          ['birthday-bingo', 'Birthday'],
          ['/baby-shower-bingo/', 'Baby shower gift activity'],
          ['/family-bingo/', 'Plan a family game'],
        ],
      },
      {
        title: 'Print once for the event',
        text: 'Use one card per guest, normally two per A4 or Letter sheet. For multiword phrases, one per sheet gives more room. Save JSON with your PDF and host the same activity. Paper size and grid remain options inside each page, without separate duplicate pages.',
        links: [
          ['/printing-guide/', 'Printing guide'],
          ['/templates/', 'All templates'],
        ],
      },
    ],
  },
];
