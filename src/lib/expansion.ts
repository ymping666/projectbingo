import type { Template } from './templates';
const words = (s: string) => s.split('|');
const dolch = {
  label: 'Dolch grouped lists, Sightwords.com (checked October 23, 2026)',
  url: 'https://sightwords.com/pdfs/word_lists/dolch_group.pdf',
};
const phonics = {
  label:
    'Pattern definitions: Reading Rockets, Phonics in Practice. Word selections are our own.',
  url: 'https://www.readingrockets.org/reading-101/reading-101-learning-modules/course-modules/phonics/practice',
};
// Standard lists are transcribed by complete group, not inferred from grade labels.
export const expansionTemplates: Template[] = [
  {
    id: 'kindergarten-sight-word-bingo',
    name: 'Kindergarten Sight Word',
    icon: 'Aa',
    size: 5,
    category: 'Sight words',
    description:
      'Review all 52 Dolch Kindergarten words on editable Bingo cards. Use spoken words and short sentences with a saved classroom activity.',
    tip: 'Call “because” only if you add it yourself: it is not in this group. For “please”, say “Please. Please sit here.” Only please is the call.',
    source: dolch,
    words: words(
      'all|am|are|at|ate|be|black|brown|but|came|did|do|eat|four|get|good|have|he|into|like|must|new|no|now|on|our|out|please|pretty|ran|ride|saw|say|she|so|soon|that|there|they|this|too|under|want|was|well|went|what|white|who|will|with|yes',
    ),
    notes: [
      'This is the complete Dolch Kindergarten (Primer) group. The group name identifies the source list, not a required age or learning standard. Review words your learners have already met.',
      'For a whole-group round, model one call with “like”: say the word, then “I like this book.” Pause for marking. Use 5 × 5 for broad review or 3 × 3 for fewer spaces to scan.',
      'Print two cards per A4 or Letter sheet. Remove unfamiliar entries if needed; generation validates the remaining distinct count. Compare this list with the Pre-K group before choosing.',
    ],
    relatedIds: [
      'sight-word-bingo',
      'first-grade-sight-word-bingo',
      'second-grade-sight-word-bingo',
      'cvc-word-bingo',
    ],
  },
  {
    id: 'first-grade-sight-word-bingo',
    name: 'First Grade Sight Word',
    icon: 'Aa',
    size: 5,
    category: 'Sight words',
    description:
      'Make a review game from the exact 41-word Dolch First Grade group, with real printable cards and a matching caller pool.',
    tip: 'For “after”, say “After. We read after lunch.” Return to the displayed word so the sentence does not become several calls.',
    source: dolch,
    words: words(
      'after|again|an|any|as|ask|by|could|every|fly|from|give|going|had|has|her|him|his|how|just|know|let|live|may|of|old|once|open|over|put|round|some|stop|take|thank|them|then|think|walk|were|when',
    ),
    notes: [
      'The 41 entries match the complete Dolch First Grade group. Choose it for review when the words fit your learners, regardless of their age. It is not a test of grade readiness.',
      'Invite learners to read the called word back before marking. After a round, contrast “her”, “him” and “his” in spoken sentences without treating those discussion examples as calls.',
      'Start with 5 × 5, FREE and two per sheet; choose one per sheet for larger print. If you keep only a subset, use a grid the actual unique pool can fill.',
    ],
    relatedIds: [
      'kindergarten-sight-word-bingo',
      'second-grade-sight-word-bingo',
      'sight-word-bingo',
      'action-words-bingo',
    ],
  },
  {
    id: 'second-grade-sight-word-bingo',
    name: 'Second Grade Sight Word',
    icon: 'Aa',
    size: 5,
    category: 'Sight words',
    description:
      'Print Bingo cards using all 46 words in the Dolch Second Grade group, then revisit them through calls and sentence discussion.',
    tip: 'For “because”, say “Because. I took a coat because it is cold.” Mark because only. Discuss another sentence after the call.',
    source: dolch,
    words: words(
      'always|around|because|been|before|best|both|buy|call|cold|does|don’t|fast|first|five|found|gave|goes|green|its|made|many|off|or|pull|read|right|sing|sit|sleep|tell|their|these|those|upon|us|use|very|wash|which|why|wish|work|would|write|your',
    ),
    notes: [
      'This complete 46-entry source group includes the contraction don’t. Its grade label is a list name, not a requirement for a particular child. Use already taught words.',
      'Before play, agree on the intended pronunciation of “read” in your sentence. “I read every day” and “I read yesterday” use the same spelling; this activity matches printed words, not pronunciation scores.',
      'Use 5 × 5 for an extended review and two cards per sheet. Afterward, choose “their” and “your” for sentence practice. Save JSON with the printed cards so later calls use the same layouts.',
    ],
    relatedIds: [
      'first-grade-sight-word-bingo',
      'kindergarten-sight-word-bingo',
      'sight-word-bingo',
      'consonant-digraph-bingo',
    ],
  },
  {
    id: 'cvc-word-bingo',
    name: 'CVC Word',
    icon: 'cat',
    size: 5,
    category: 'Phonics',
    description:
      'Practice simple short-vowel CVC words across a, e, i, o and u. Read a called word and find its printed spelling.',
    tip: 'Say “map”, then slowly segment /m/ /a/ /p/ if helpful. Read the whole word again before players mark it.',
    source: phonics,
    words: words(
      'cat|map|pan|hat|bag|jam|red|hen|pen|bed|net|leg|sit|pin|pig|lip|fin|kid|dog|hop|pot|log|mop|top|sun|cup|bus|mud|rug|nut',
    ),
    notes: [
      'The original pool contains six short-vowel words for each of a, e, i, o and u. It excludes consonant clusters, digraph spellings and silent-e patterns; these are whole words, not letter cards.',
      'Review the five short-vowel groups before play. The caller reads a word; players scan for its spelling. Add oral segmenting after an exact-word round, keeping the same recorded call.',
      'Default 5 × 5 uses 24 of the 30 entries with FREE. For a shorter review select 3 × 3. Two per sheet works for most groups; use one per sheet when demonstrating letter-by-letter reading.',
    ],
    relatedIds: [
      'consonant-blends-bingo',
      'consonant-digraph-bingo',
      'alphabet-bingo',
      'sight-word-bingo',
    ],
  },
  {
    id: 'consonant-blends-bingo',
    name: 'Consonant Blends',
    icon: 'fl',
    size: 5,
    category: 'Phonics',
    description:
      'Read complete words with consonant blends such as flag, clap and stop. Each consonant in the blend retains an audible sound.',
    tip: 'Call “frog”; invite learners to notice /f/ and /r/ at the start, then repeat the whole word. Do not call just the blend.',
    source: phonics,
    words: words(
      'flag|flat|flap|clap|clip|clam|glad|glob|plan|plug|plum|slip|slam|sled|stop|step|stem|spin|spot|snap|snip|swim|swam|frog|from|grab|grin|drip|drop|trip',
    ),
    notes: [
      'This pool focuses on initial two-consonant blends. Each consonant retains its own sound, unlike a digraph such as sh. The entries are complete words, not isolated letter combinations.',
      'Model “clap” and stretch the beginning without adding an extra vowel between /k/ and /l/. Players mark clap after hearing the whole word. Save a sound-sorting discussion for after the round.',
      'Use two per sheet and 5 × 5 for a mixed blend review. Remove untaught blends and switch to 3 × 3 if the remaining unique pool is too small.',
    ],
    relatedIds: [
      'cvc-word-bingo',
      'consonant-digraph-bingo',
      'action-words-bingo',
      'alphabet-bingo',
    ],
  },
  {
    id: 'consonant-digraph-bingo',
    name: 'Consonant Digraph',
    icon: 'sh',
    size: 5,
    category: 'Phonics',
    description:
      'Find whole words containing sh, ch or th. Practice common consonant digraph spellings with editable printed word cards.',
    tip: 'For “ship”, say the whole word, then point out sh representing one sound. Contrast it with a blend only after marking.',
    source: phonics,
    words: words(
      'ship|shop|shed|shin|shut|shell|fish|dish|wish|cash|chin|chop|chat|chip|chess|check|much|rich|such|lunch|thin|thick|thud|thank|bath|math|moth|path|this|that',
    ),
    notes: [
      'The targeted digraphs are sh, ch and th: two letters representing a single consonant sound. The selected th words include voiced and unvoiced sounds. This is not a promise that every word is CVC or contains only one spelling pattern.',
      'Review the targeted spelling in each word first. Call “fish”, let players find the word, then identify the final sh. A letter sound clue should supplement a clear word call.',
      'For the default 5 × 5 mixed review, print two per sheet. A smaller taught subset can use 3 × 3; keep at least eight unique entries with FREE, or nine without.',
    ],
    relatedIds: [
      'consonant-blends-bingo',
      'cvc-word-bingo',
      'first-grade-sight-word-bingo',
      'alphabet-bingo',
    ],
  },
  {
    id: 'jobs-and-occupations-bingo',
    name: 'Jobs and Occupations',
    icon: '✎',
    size: 5,
    category: 'Everyday vocabulary',
    description:
      'Review 30 familiar occupations with editable text Bingo cards, from teacher and nurse to mechanic and photographer.',
    tip: 'Call “chef”, then say “A chef prepares food.” Keep the displayed occupation as the recorded call.',
    words: words(
      'teacher|doctor|nurse|chef|firefighter|farmer|engineer|driver|artist|dentist|vet|pilot|baker|builder|plumber|electrician|mechanic|librarian|scientist|writer|musician|actor|photographer|cashier|waiter|gardener|cleaner|hairdresser|police officer|postal worker',
    ),
    notes: [
      'Use job names for ESL vocabulary review or a discussion of community work. Introduce unfamiliar titles before the game and avoid assigning jobs to a gender. These are text cards, not pictures.',
      'Start with spoken job names. In a later round, display the host word privately, give a definition, and then confirm the exact term before advancing. Accept discussion without changing what the host records.',
      'Print two per sheet with 5 × 5 for a full review. For a short introductory lesson keep a smaller familiar selection and choose 3 × 3.',
    ],
    relatedIds: [
      'places-in-town-bingo',
      'transportation-bingo',
      'clothes-bingo',
      'classroom-objects-bingo',
    ],
  },
  {
    id: 'clothes-bingo',
    name: 'Clothes and Accessories',
    icon: '♧',
    size: 5,
    category: 'Everyday vocabulary',
    description:
      'Printable text Bingo for everyday clothes and accessories. Review shirts, jackets, footwear and simple accessories without needing picture cards.',
    tip: 'For “scarf”, read the word and describe where it is worn. Players mark text; no one needs to show or wear an item.',
    words: words(
      'shirt|pants|jacket|shoes|hat|scarf|socks|dress|belt|gloves|coat|sweater|skirt|shorts|jeans|boots|sandals|sneakers|cap|tie|vest|raincoat|pajamas|swimsuit|sunglasses|watch|necklace|bracelet|earrings|handbag',
    ),
    notes: [
      'Review clothing words using objects or gestures before giving out these text-only cards. No image library, clothing recognition or color printing is involved.',
      'Agree on regional alternatives before play: for example, pants here means trousers. Edit terms to your class vocabulary rather than asking players to infer which regional word counts.',
      'Two per A4 or Letter sheet is a useful default for 5 × 5. Choose 3 × 3 for a small taught selection; use one per sheet if learners need larger words.',
    ],
    relatedIds: [
      'body-parts-bingo',
      'winter-bingo',
      'color-bingo',
      'jobs-and-occupations-bingo',
    ],
  },
  {
    id: 'body-parts-bingo',
    name: 'Body Parts',
    icon: '✋',
    size: 3,
    category: 'Everyday vocabulary',
    description:
      'A compact text Bingo game for 20 familiar body parts. Practice everyday words such as hand, knee and shoulder on a 3 × 3 grid.',
    tip: 'Say “elbow” and point to your own elbow if useful. Learners may simply read and mark; touching another person is not part of the activity.',
    words: words(
      'head|hair|face|eye|ear|nose|mouth|tooth|tongue|neck|shoulder|arm|elbow|hand|finger|thumb|leg|knee|foot|toe',
    ),
    notes: [
      'The 20-word pool uses familiar everyday vocabulary rather than specialist anatomy. Singular forms label individual parts; discuss feet or teeth separately if learners know those forms.',
      'Review with a drawing or a voluntary gesture, then call one printed entry at a time. Do not require physical demonstrations or touching as a condition for marking.',
      'Default 3 × 3 keeps the search compact. This pool cannot fill 5 × 5. Try two per sheet for larger print or four for a compact handout after checking readability.',
    ],
    relatedIds: [
      'clothes-bingo',
      'action-words-bingo',
      'feelings-and-emotions-bingo',
      'color-bingo',
    ],
  },
  {
    id: 'places-in-town-bingo',
    name: 'Places in Town',
    icon: '⌂',
    size: 5,
    category: 'Everyday vocabulary',
    description:
      'Practice community places with 30 useful words and phrases, including library, hospital, post office and train station.',
    tip: 'Call “library”, then ask where people borrow books. The exact displayed phrase remains the call, even when a place has several uses.',
    words: words(
      'library|school|hospital|park|supermarket|restaurant|bank|post office|train station|museum|cinema|cafe|bakery|pharmacy|police station|fire station|bus stop|airport|hotel|market|playground|swimming pool|sports center|bookshop|town hall|church|temple|mosque|clinic|car park',
    ),
    notes: [
      'Use this community vocabulary set with a simple town map. Review which places are familiar locally, and edit the list to reflect the language your group uses.',
      'Begin with exact phrases. In a later round give a clear definition and confirm the target word afterward. “A place to buy food” could mean market or supermarket, so avoid ambiguous clues.',
      'For multiword places, use two cards per sheet on 5 × 5. One per sheet leaves more room. A 3 × 3 neighborhood subset works when fewer places have been taught.',
    ],
    relatedIds: [
      'jobs-and-occupations-bingo',
      'transportation-bingo',
      'household-objects-bingo',
      'food-vocabulary-bingo',
    ],
  },
  {
    id: 'feelings-and-emotions-bingo',
    name: 'Feelings and Emotions',
    icon: '☺',
    size: 3,
    category: 'Everyday vocabulary',
    description:
      'Explore 18 everyday feeling words in a short text Bingo round. Use fictional situations and voluntary discussion, without clinical labels.',
    tip: 'Call “proud”, then describe a fictional person finishing a difficult puzzle. Learners never need to share personal feelings to mark a word.',
    words: words(
      'happy|sad|excited|worried|tired|angry|surprised|calm|nervous|proud|bored|confused|hopeful|lonely|grateful|relaxed|disappointed|curious',
    ),
    notes: [
      'This is a vocabulary activity, not a psychological assessment. Everyday feelings are not diagnoses. Players can discuss imaginary characters rather than personal experiences.',
      'Review meanings with brief stories. Call the printed word first; an expression or situation can be an optional follow-up. There may be several reasonable feelings in the same situation.',
      'Use 3 × 3 with the 18-entry pool. It is too small for 5 × 5. One or two per sheet gives space to read longer words such as disappointed.',
    ],
    relatedIds: [
      'action-words-bingo',
      'body-parts-bingo',
      'sight-word-bingo',
      'color-bingo',
    ],
  },
  {
    id: 'sports-bingo',
    name: 'Sports Vocabulary',
    icon: '○',
    size: 5,
    category: 'Everyday vocabulary',
    description:
      'Review the names of 30 sports and physical activities on text Bingo cards, from basketball and badminton to skating and rowing.',
    tip: 'Read “badminton”, then ask what equipment is used. Players mark the name, without performing the sport.',
    words: words(
      'basketball|soccer|tennis|badminton|swimming|baseball|volleyball|cycling|running|table tennis|rugby|cricket|golf|hockey|gymnastics|boxing|wrestling|judo|karate|fencing|archery|rowing|sailing|surfing|skiing|snowboarding|skating|bowling|softball|handball',
    ),
    notes: [
      'The pool emphasizes sport names rather than a mixture of players, equipment and scoring rules. Review unfamiliar activities with your group before playing.',
      'Agree whether soccer or football is your classroom term and edit as needed. Call the exact chosen entry; optional equipment clues come after the clear call. No physical participation is required.',
      'Try 5 × 5 with two per sheet. Choose one per sheet for long names such as snowboarding, or trim to familiar sports and select 3 × 3.',
    ],
    relatedIds: [
      'action-words-bingo',
      'clothes-bingo',
      'transportation-bingo',
      'body-parts-bingo',
    ],
  },
  {
    id: 'winter-bingo',
    name: 'Winter Word',
    icon: '❄',
    size: 5,
    category: 'Celebrations',
    description:
      'Make a winter activity with clothing, snow-play and cold-weather objects. This word pool focuses on the season rather than Christmas traditions.',
    tip: 'For “icicle”, say the word and discuss what it looks like. No outdoor trip or handling ice is needed.',
    words: words(
      'mittens|scarf|sled|snowball|boots|icicle|snow boots|earmuffs|parka|thermal socks|snow shovel|snowplow|snow fort|snow angel|ice skates|ski poles|snowboard|toboggan|hand warmer|wool hat|fleece|quilt|thermos|firewood|ice scraper|snowshoe|ski lift|ice rink|snow suit|balaclava',
    ),
    notes: [
      'Use this as an indoor seasonal vocabulary game. Its focus is clothing, equipment and winter activities, not Christmas decorations or a list of weather conditions.',
      'Review snow-related objects where they are unfamiliar. Call “snow fort” as a whole phrase; a child can mark the words without having built one. Edit regional clothing terms to suit your group.',
      'Use two per sheet on 5 × 5, or one for larger multiword entries. For a brief indoor round choose 3 × 3 and discuss favorite seasonal activities afterward.',
    ],
    relatedIds: [
      'clothes-bingo',
      'weather-bingo',
      'christmas-bingo',
      'sports-bingo',
    ],
  },
  {
    id: 'new-years-eve-bingo',
    name: 'New Year’s Eve',
    icon: '✧',
    size: 3,
    category: 'Celebrations',
    description:
      'An evergreen New Year’s Eve word game for countdowns and gatherings, with an editable 20-entry pool and no year-specific cards.',
    tip: 'Call “countdown” during a scheduled word round; a real countdown is not automatically recorded by the web host.',
    words: words(
      'countdown|midnight|fireworks|resolution|calendar|celebration|toast|confetti|party hat|clock|balloon|streamer|music|dance|cheer|sparkle|new beginning|wish|invitation|greeting',
    ),
    notes: [
      'Plan a short called-word round before your celebration. This template does not listen to the party or mark real events automatically. A toast can use any suitable drink.',
      'Invite players to explain a wish or goal after the round, with no obligation to share. No date or year appears in the preset, so the same activity can be customized for future gatherings.',
      'Use 3 × 3 with these 20 entries, two per A4 or Letter sheet. The pool is insufficient for 5 × 5 unless you deliberately add more distinct words.',
    ],
    relatedIds: [
      'birthday-bingo',
      'christmas-bingo',
      'winter-bingo',
      'valentines-day-bingo',
    ],
  },
  {
    id: 'valentines-day-bingo',
    name: 'Valentine’s Day',
    icon: '♡',
    size: 3,
    category: 'Celebrations',
    description:
      'A friendly Valentine’s Day text game about cards, kindness and shared treats, suitable for a classroom or family table.',
    tip: 'For “kindness”, say the word and offer a simple example such as helping someone carry books. Personal relationships are not a game requirement.',
    words: words(
      'heart|card|friendship|kindness|chocolate|flower|red|pink|ribbon|envelope|message|smile|gift|bow|sticker|cupcake|cookie|candy|sharing|thank you',
    ),
    notes: [
      'Focus the gathering on friendship and kind actions. Players match words rather than naming a partner, giving gifts or discussing private relationships.',
      'Review “friendship” and “kindness” before play. Call “thank you” as one phrase. After marking, invite an optional example of a considerate action.',
      'This 20-entry pool defaults to 3 × 3. Two per sheet is a useful tabletop size. Use one per sheet for larger words; it cannot fill 5 × 5 without added entries.',
    ],
    relatedIds: [
      'birthday-bingo',
      'color-bingo',
      'thanksgiving-bingo',
      'food-vocabulary-bingo',
    ],
  },
  {
    id: 'easter-bingo',
    name: 'Easter Word',
    icon: '○',
    size: 3,
    category: 'Celebrations',
    description:
      'Print a short Easter and spring-activity word game with eggs, baskets, flowers and simple craft vocabulary.',
    tip: 'Read “basket”, then invite players to describe what might go in one. Finding a real basket is not required for this called-word game.',
    words: words(
      'Easter|egg|basket|bunny|chick|lamb|flower|spring|ribbon|chocolate egg|egg hunt|paint|dye|sticker|grass|nest|tulip|daffodil|bonnet|jelly bean',
    ),
    notes: [
      'Use these words for a craft table or seasonal gathering. Review which terms suit your event; this is a short vocabulary activity, without a history lesson or a required religious observance.',
      'Review “egg” and “chocolate egg” as separate entries. Call the full displayed phrase and wait for players to mark only that phrase. An egg hunt elsewhere does not update web calls.',
      'Choose 3 × 3 and two per sheet for the 20-word pool. Edit out unfamiliar terms and check the actual unique count before generation.',
    ],
    relatedIds: [
      'animal-bingo',
      'color-bingo',
      'valentines-day-bingo',
      'birthday-bingo',
    ],
  },
  {
    id: 'st-patricks-day-bingo',
    name: 'St. Patrick’s Day',
    icon: '♧',
    size: 3,
    category: 'Celebrations',
    description:
      'A compact St. Patrick’s Day word game with familiar celebration vocabulary, designed for a 3 × 3 printable activity.',
    tip: 'Read “shamrock” clearly and show an illustration beforehand if the word is unfamiliar. No folklore knowledge is needed to win.',
    words: words(
      'shamrock|green|rainbow|gold|parade|music|dance|hat|ribbon|clover|coin|flag|harp|festival|greeting|celebration',
    ),
    notes: [
      'The small pool deliberately stays with recognizable celebration words. It is not a source of historical facts, and it avoids padding the list with obscure terms just to fill 5 × 5.',
      'Introduce shamrock and harp before handing out cards. In this word game, green and gold are text labels; a color printer is not necessary. Call each word exactly as printed.',
      'Use 3 × 3 with FREE and two per sheet. The 16 entries do not support 5 × 5. Review your own event vocabulary before replacing or adding terms.',
    ],
    relatedIds: [
      'color-bingo',
      'new-years-eve-bingo',
      'valentines-day-bingo',
      'birthday-bingo',
    ],
  },
  {
    id: 'halloween-bingo',
    name: 'Halloween Word',
    icon: '☾',
    size: 5,
    category: 'Celebrations',
    description:
      'A family-friendly Halloween text Bingo game with costumes, decorations and treats. Customize 30 seasonal words and print your own activity.',
    tip: 'For “bat”, call the word and discuss the animal after marking. There are no sound effects, jump scares or graphic images.',
    words: words(
      'pumpkin|costume|ghost|spider|candy|bat|witch|moon|broom|hat|mask|cape|lantern|cobweb|skeleton|black cat|owl|scarecrow|cauldron|treat bag|doorbell|party|apple|candle|jack-o-lantern|monster|mummy|vampire|trick or treat|decoration',
    ),
    notes: [
      'Use a quiet table round for a family gathering or an optional classroom seasonal activity. Preview the words and remove any creatures or decorations your group would rather avoid.',
      'Review “pumpkin” and “jack-o-lantern” as different entries. Call the complete displayed phrase. Receiving candy or wearing a costume is not needed to mark the text.',
      'The 30-word pool supports 5 × 5 with two per sheet. One per sheet is roomier for phrases; 3 × 3 makes a short round while guests arrive.',
    ],
    relatedIds: [
      'thanksgiving-bingo',
      'birthday-bingo',
      'animal-bingo',
      'color-bingo',
    ],
  },
  {
    id: 'office-buzzword-bingo',
    name: 'Office Buzzword',
    icon: '↗',
    size: 5,
    category: 'Activities',
    mode: 'observed',
    description:
      'Print observation Bingo cards for expressions heard in meetings. Players mark phrases as they hear them, without random website calls.',
    tip: 'Agree on exact phrases and reasonable variants before the meeting. Mark “circle back” when someone naturally says it, without prompting colleagues to complete a card.',
    words: words(
      'circle back|touch base|bandwidth|follow up|action item|quick win|sync|offline|deadline|next steps|on track|big picture|moving forward|deep dive|roadmap|stakeholder|deliverable|priority|timeline|feedback|takeaway|alignment|check in|kick off|wrap up|parking lot|scope|update|milestone|teamwork',
    ),
    notes: [
      'This is an observation game for an appropriate, optional workplace session. Print cards in advance and mark expressions when actually heard. Avoid distracting the speaker or encouraging performative phrases.',
      'Decide whether inflected forms such as following up count for follow up. The organizer settles disputed matches and confirms a completed row, column or diagonal manually.',
      'Try 5 × 5, two per sheet, or 3 × 3 for a shorter meeting. The site does not listen, record, transcribe or synchronize the meeting. Its called-word checker cannot verify these real-world observations.',
    ],
    relatedIds: [
      'conference-call-bingo',
      'jobs-and-occupations-bingo',
      'action-words-bingo',
    ],
  },
  {
    id: 'conference-call-bingo',
    name: 'Conference Call',
    icon: '▣',
    size: 3,
    category: 'Activities',
    mode: 'observed',
    description:
      'Print a remote-meeting observation game: mark everyday call events such as muted audio or a screen-sharing question when they happen.',
    tip: 'Choose a meeting where a light optional game is appropriate. Observe events without deliberately causing disruptions or singling anyone out.',
    words: words(
      'someone is muted|background noise|screen sharing issue|can you see my screen?|someone joins late|connection freezes|someone waves hello|a pet appears|someone uses chat|a reminder to unmute|two people speak at once|someone shares a link|a slide changes|a calendar is mentioned|someone says goodbye|a question is repeated|headphones are adjusted|a meeting runs over',
    ),
    notes: [
      'Participants mark an event after observing it during the call. It is not a list for a random caller. No microphone or camera access is requested, and the site does not monitor the meeting.',
      'Agree what qualifies, whether a repeated event may fill different matching squares, and when play ends. Treat ordinary technical difficulties kindly. The organizer checks a claimed line against the group’s observations.',
      'The 18-entry pool uses 3 × 3. Print one per sheet for generous space or two for a desk-sized card. Save the generated project if you need to reprint the same layouts; automated call-based verification does not apply.',
    ],
    relatedIds: [
      'office-buzzword-bingo',
      'jobs-and-occupations-bingo',
      'feelings-and-emotions-bingo',
    ],
  },
];
export const activityPresets: Template[] = [
  {
    id: 'office-icebreaker',
    name: 'Office Icebreaker',
    icon: '☺',
    size: 3,
    category: 'Activities',
    mode: 'people',
    description:
      'Meet people through low-pressure conversation prompts and write names on paper.',
    tip: 'Ask permission to write a name. Anyone may pass on a prompt; the site never collects participants’ names.',
    words: words(
      'Has a pet|Likes cooking|Speaks more than one language|Has visited another country|Enjoys hiking|Likes puzzles|Enjoys reading|Plays a musical instrument|Likes gardening|Enjoys cycling|Has tried a new recipe|Likes board games|Enjoys drawing|Likes swimming|Enjoys baking|Has a favorite podcast|Likes museums|Enjoys walking|Has made something by hand|Likes photography|Enjoys live music|Likes learning new skills|Has volunteered|Enjoys camping|Likes watching sports|Enjoys crafts|Likes tea|Likes coffee|Has grown a plant|Enjoys dancing',
    ),
  },
  {
    id: 'baby-shower',
    name: 'Baby Shower Gift',
    icon: '✧',
    size: 3,
    category: 'Activities',
    mode: 'observed',
    description:
      'Mark gift words as gifts are opened, with on-the-spot human judgment.',
    tip: 'A gift can match an agreed category; decide together whether a gift set can count as several items.',
    words: words(
      'blanket|bottle|diapers|onesie|bib|pacifier|toy|book|socks|hat|towel|washcloth|stroller|carrier|teether|rattle|burp cloth|sleep sack|changing mat|diaper bag',
    ),
  },
  {
    id: 'nature',
    name: 'Nature Scavenger Hunt',
    icon: '♧',
    size: 3,
    category: 'Activities',
    mode: 'observed',
    description:
      'Observe familiar outdoor features and mark them on paper without collecting or touching wildlife.',
    tip: 'Observe only, follow local park rules, and edit the list for your location. The site does not use a camera or location permission.',
    words: words(
      'bird|flower|tree|rock|cloud|insect|leaf|pine cone|twig|grass|seed|puddle|shadow|moss|feather|bark|ant|fallen branch|birdsong|footprint',
    ),
  },
];
