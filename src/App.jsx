import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import GameOverScreen from './components/GameOverScreen';
import './App.css';

// Enhanced balanced letter frequency distribution
// More vowels and common consonants for easier word formation
const LETTER_FREQUENCIES = {
  // Vowels (40% of letters)
  'E': 12, 'A': 10, 'I': 9, 'O': 8, 'U': 4,
  // High-frequency consonants (40% of letters)
  'R': 8, 'T': 8, 'N': 7, 'S': 7, 'L': 5, 'D': 5, 'H': 5, 'C': 5,
  // Medium-frequency consonants (15% of letters)
  'M': 4, 'F': 4, 'P': 4, 'G': 4, 'W': 3, 'Y': 3, 'B': 3,
  // Lower-frequency consonants (5% of letters)
  'V': 2, 'K': 2, 'J': 1, 'X': 1, 'Q': 1, 'Z': 1
};

// Generate weighted letter pool
const generateLetterPool = () => {
  const pool = [];
  for (const [letter, weight] of Object.entries(LETTER_FREQUENCIES)) {
    for (let i = 0; i < weight; i++) {
      pool.push(letter);
    }
  }
  return pool;
};

const App = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for more gameplay
  const [currentLetters, setCurrentLetters] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  // Generate vowels and consonants separately for better balance
  const generateBalancedLetters = () => {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    
    const letters = [];
    const vowelCount = Math.max(4, Math.floor(16 / 4)); // At least 4 vowels, ~1/4 of letters
    const consonantCount = 16 - vowelCount;
    
    // Add vowels
    for (let i = 0; i < vowelCount; i++) {
      const randomIndex = Math.floor(Math.random() * vowels.length);
      letters.push(vowels[randomIndex]);
    }
    
    // Add consonants
    for (let i = 0; i < consonantCount; i++) {
      const randomIndex = Math.floor(Math.random() * consonants.length);
      letters.push(consonants[randomIndex]);
    }
    
    // Shuffle the letters
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    return letters;
  };

  // Comprehensive word validation dictionary
  const isValidEnglishWord = (word) => {
    // Comprehensive list of valid English words
    const validWords = new Set([
      // Common 2-letter words
      'AA', 'AB', 'AD', 'AE', 'AG', 'AH', 'AI', 'AL', 'AM', 'AN', 'AR', 'AS', 'AT', 'AW', 'AX', 'AY',
      'BA', 'BE', 'BI', 'BO', 'BY',
      'CA', 'CE', 'CI', 'CM', 'CO', 'CR', 'CU', 'CY',
      'DA', 'DE', 'DI', 'DO', 'DY',
      'EA', 'EC', 'ED', 'EE', 'EF', 'EH', 'EL', 'EM', 'EN', 'EO', 'EP', 'ER', 'ES', 'ET', 'EW', 'EX', 'EY',
      'FA', 'FE', 'FI', 'FO', 'FY',
      'GA', 'GE', 'GI', 'GO', 'GY',
      'HA', 'HE', 'HI', 'HM', 'HO',
      'IA', 'ID', 'IF', 'IN', 'IO', 'IS', 'IT', 'IW',
      'JA', 'JI', 'JO',
      'KA', 'KI', 'KO', 'KY',
      'LA', 'LI', 'LO',
      'MA', 'ME', 'MI', 'MM', 'MO', 'MU', 'MY',
      'NA', 'NE', 'NO', 'NU',
      'OA', 'OB', 'OD', 'OE', 'OF', 'OH', 'OI', 'OM', 'ON', 'OP', 'OR', 'OS', 'OW', 'OX', 'OY',
      'PA', 'PE', 'PI', 'PO', 'PY',
      'QA',
      'RA', 'RE', 'RH',
      'SA', 'SC', 'SD', 'SE', 'SH', 'SI', 'SO', 'ST', 'SU',
      'TA', 'TE', 'TH', 'TI', 'TM', 'TO', 'TP', 'TR', 'TS', 'TT', 'TU', 'TW', 'TY',
      'UG', 'UK', 'UM', 'UN', 'UP', 'US', 'UT',
      'VIA', 'VO',
      'WE', 'WO', 'WP', 'WR', 'WS',
      'XI', 'XU',
      'YA', 'YE', 'YO',
      'ZA',
      
      // 3-letter words
      'CAT', 'DOG', 'SUN', 'BAT', 'RAT', 'HAT', 'MAT', 'PAT', 'SAT', 'FAT',
      'RUN', 'FUN', 'SUN', 'CUP', 'MUG', 'BUG', 'HUG', 'RUG', 'TUG', 'PUG',
      'EAT', 'MEAT', 'BEAT', 'HEAT', 'REAT', 'SEAT', 'TREAT', 'GREAT', 'CREAT',
      'WIN', 'PIN', 'FIN', 'BIN', 'GIN', 'TIN', 'SIN', 'DIN', 'MIN', 'LIN',
      'ACE', 'ACT', 'ADD', 'ADO', 'AFT', 'AGE', 'AGO', 'AID', 'AIL', 'AIM', 'AIR', 'ALE', 'ALL', 'AND', 'ANT', 'ANY', 'APE', 'APT', 'ARC', 'ARE', 'ARK', 'ARM', 'ART', 'ASH', 'ASK', 'ATE', 'AVE', 'AWL', 'AWN', 'AXE', 'AYE',
      'BAD', 'BAG', 'BAT', 'BAY', 'BED', 'BEE', 'BEG', 'BET', 'BIB', 'BID', 'BIG', 'BIN', 'BIT', 'BOA', 'BOB', 'BOD', 'BOG', 'BOO', 'BOP', 'BOT', 'BOW', 'BOX', 'BOY', 'BUB', 'BUD', 'BUG', 'BUM', 'BUN', 'BUS', 'BUT', 'BUY', 'BYE',
      'CAB', 'CAD', 'CAM', 'CAN', 'CAP', 'CAR', 'CAT', 'CAW', 'COD', 'COG', 'COL', 'CON', 'COO', 'COP', 'COT', 'COW', 'COY', 'CRY', 'CUB', 'CUE', 'CUP', 'CUR', 'CUT',
      'DAD', 'DAM', 'DAN', 'DAR', 'DAY', 'DEN', 'DES', 'DEW', 'DID', 'DIE', 'DIG', 'DIM', 'DIN', 'DIP', 'DOE', 'DOG', 'DON', 'DOT', 'DOW', 'DRY', 'DUB', 'DUD', 'DUE', 'DUG', 'DUO', 'DYE',
      'EACH', 'EAR', 'EASE', 'EAST', 'EASY', 'EAT', 'EDGE', 'EDGY', 'EDIT', 'END', 'ENVY', 'EPIC', 'ERA', 'ERROR', 'ESPY', 'EVEN', 'EVER', 'EVIL', 'EWE', 'EXAM', 'EXEC', 'EXIT', 'EYES',
      // Additional common 3-letter words
      'GOD', 'GUN', 'GAP', 'GEM', 'GAS', 'GEL', 'GOT', 'GUY', 'GYM', 'GUT', 'GNU', 'GEE', 'GIG', 'GIP', 'GIT', 'GUV', 'GYP',
      'HIM', 'HER', 'HIS', 'HAS', 'HAD', 'HUT', 'HOT', 'HOP', 'HIP', 'HID', 'HIT', 'HIC', 'HIM', 'HIS', 'HOB', 'HOD', 'HOG', 'HOP', 'HOT', 'HOW', 'HUB', 'HUE', 'HUG', 'HUH', 'HUM', 'HUT',
      'ICE', 'INK', 'ILL', 'IMP', 'ION', 'ITS', 'IVY',
      'JAM', 'JAR', 'JAW', 'JET', 'JOB', 'JOG', 'JOT', 'JOY', 'JUG', 'JUT',
      'KEY', 'KIT', 'KIN', 'KIP', 'KID', 'KEG', 'KEN', 'KEX', 'KHI', 'KIN', 'KIP', 'KIR', 'KOA', 'KOB', 'KOI', 'KOP', 'KOR', 'KOS', 'KUE', 'KYE',
      'LIP', 'LID', 'LOG', 'LOT', 'LOW', 'LAW', 'LAY', 'LAP', 'LAM', 'LAB', 'LAD', 'LAG', 'LAP', 'LAW', 'LAX', 'LAY', 'LEA', 'LED', 'LEE', 'LEG', 'LEI', 'LET', 'LEX', 'LEY', 'LIB', 'LID', 'LIE', 'LIN', 'LIP', 'LIT', 'LOB', 'LOG', 'LOO', 'LOP', 'LOT', 'LOU', 'LOW', 'LUG', 'LUX', 'LYE',
      'MAP', 'MAN', 'MAD', 'MAY', 'MEN', 'MET', 'MOW', 'MUD', 'MUG', 'MUM', 'MIX', 'MAD', 'MAE', 'MAG', 'MAN', 'MAP', 'MAR', 'MAS', 'MAT', 'MAW', 'MAX', 'MAY', 'MED', 'MEE', 'MEL', 'MEM', 'MEN', 'MET', 'MEW', 'MHO', 'MIB', 'MIC', 'MID', 'MIG', 'MIL', 'MIM', 'MIR', 'MIS', 'MIX', 'MOA', 'MOB', 'MOC', 'MOD', 'MOE', 'MOG', 'MOL', 'MOM', 'MON', 'MOO', 'MOP', 'MOS', 'MOT', 'MOW', 'MUD', 'MUG', 'MUM', 'MUN', 'MUS', 'MUT',
      'NEW', 'NOW', 'NET', 'NOT', 'NOR', 'NUN', 'NUT', 'NAB', 'NAE', 'NAG', 'NAH', 'NAM', 'NAN', 'NAP', 'NAT', 'NAW', 'NAY', 'NEB', 'NEG', 'NET', 'NEW', 'NIB', 'NIL', 'NIM', 'NIP', 'NIT', 'NIX', 'NOB', 'NOD', 'NOG', 'NOH', 'NOM', 'NON', 'NOO', 'NOR', 'NOS', 'NOT', 'NOW', 'NUB', 'NUN', 'NUS', 'NUT',
      'OLD', 'OUR', 'OUT', 'OFF', 'OFT', 'OAR', 'OAT', 'OBE', 'ODD', 'ODE', 'OFF', 'OFT', 'OHM', 'OHO', 'OHS', 'OIL', 'OKA', 'OKE', 'OLD', 'OLE', 'OMS', 'ONE', 'ONO', 'OOF', 'OON', 'OOT', 'OPE', 'OPT', 'ORA', 'ORB', 'ORC', 'ORE', 'ORF', 'ORS', 'ORT', 'OSE', 'OUD', 'OUR', 'OUT', 'OVA', 'OWL', 'OWN', 'OXO', 'OXY',
      'PEN', 'PET', 'PUT', 'PAD', 'PAL', 'PAN', 'PAR', 'PAT', 'PAW', 'PAY', 'PEA', 'PEG', 'PEN', 'PEP', 'PER', 'PET', 'PEW', 'PHI', 'PIE', 'PIG', 'PIN', 'PIP', 'PIT', 'PLY', 'POD', 'POE', 'POP', 'POT', 'POW', 'PRO', 'PRY', 'PUB', 'PUG', 'PUN', 'PUP', 'PUR', 'PUS', 'PUT', 'PYA', 'PYE',
      'RED', 'RUN', 'RAT', 'RAN', 'RAP', 'RAW', 'RAY', 'REF', 'REG', 'REP', 'REV', 'RHO', 'RIB', 'RID', 'RIG', 'RIM', 'RIN', 'RIP', 'ROB', 'ROD', 'ROE', 'ROT', 'ROW', 'RUB', 'RUE', 'RUG', 'RUM', 'RUN', 'RUT', 'RYE', 'RYU',
      'SEA', 'SEE', 'SET', 'SAY', 'SIR', 'SIT', 'SAD', 'SAP', 'SAT', 'SAW', 'SAX', 'SAY', 'SEA', 'SEC', 'SEE', 'SEG', 'SEL', 'SEN', 'SET', 'SEX', 'SEY', 'SHE', 'SHY', 'SIB', 'SIC', 'SIM', 'SIN', 'SIP', 'SIR', 'SIS', 'SIT', 'SIX', 'SKA', 'SKI', 'SKY', 'SLY', 'SOB', 'SOD', 'SOL', 'SOM', 'SON', 'SOP', 'SOS', 'SOT', 'SOW', 'SOY', 'SPA', 'SPY', 'SUB', 'SUD', 'SUE', 'SUM', 'SUN', 'SUP', 'SYN', 'SYS',
      'TEN', 'THE', 'TOP', 'TRY', 'TAB', 'TAD', 'TAG', 'TAN', 'TAP', 'TAR', 'TAT', 'TAU', 'TAX', 'TEA', 'TED', 'TEE', 'TEN', 'THE', 'THY', 'TIC', 'TIE', 'TIL', 'TIN', 'TIP', 'TIT', 'TOE', 'TOG', 'TOM', 'TON', 'TOO', 'TOP', 'TOR', 'TOT', 'TOW', 'TOY', 'TRY', 'TSK', 'TUB', 'TUG', 'TUN', 'TUP', 'TUT', 'TUX', 'TWA', 'TWO', 'TYE', 'TYPE',
      'USE', 'UGH', 'UMM', 'UMP', 'UNS', 'UPB', 'UPS', 'URB', 'URD', 'URN', 'URP', 'USE',
      'VAN', 'VAT', 'VIA', 'VIE', 'VAC', 'VAN', 'VAR', 'VAS', 'VAT', 'VAU', 'VAV', 'VAW', 'VEE', 'VEG', 'VET', 'VEX', 'VIA', 'VID', 'VIE', 'VIG', 'VIM', 'VIS', 'VLY', 'VOE', 'VOW', 'VOX', 'VUG', 'VUM',
      'WAS', 'WAY', 'WHO', 'WHY', 'WIG', 'WIN', 'WIT', 'WAD', 'WAG', 'WAR', 'WAS', 'WAT', 'WAX', 'WAY', 'WEB', 'WED', 'WEE', 'WEN', 'WET', 'WHO', 'WHY', 'WIG', 'WIN', 'WIS', 'WIT', 'WIZ', 'WOE', 'WOG', 'WOK', 'WON', 'WOO', 'WOP', 'WOS', 'WOT', 'WOW', 'WRY', 'WUD', 'WUS', 'WYE',
      'YES', 'YET', 'YAM', 'YAP', 'YAR', 'YAW', 'YEA', 'YEN', 'YEP', 'YES', 'YET', 'YEW', 'YID', 'YIN', 'YIP', 'YOB', 'YOD', 'YOK', 'YOM', 'YON', 'YOU', 'YOW', 'YUK', 'YUM', 'YUP', 'YUS',
      'ZAP', 'ZED', 'ZEE', 'ZIP', 'ZIT', 'ZOA', 'ZAP', 'ZAS', 'ZAX', 'ZEA', 'ZED', 'ZEE', 'ZEK', 'ZEP', 'ZEX', 'ZIG', 'ZIN', 'ZIP', 'ZIT', 'ZIZ', 'ZOA', 'ZOL', 'ZOO', 'ZOS', 'ZUZ', 'ZZZ',
      
      // 4-letter words
      'ABLE', 'ACHE', 'ACID', 'ACRE', 'ACTS', 'ADDS', 'ADEPT', 'ADORE', 'ADORN', 'ADULT',
      'BABY', 'BACK', 'BAKE', 'BALL', 'BAND', 'BANG', 'BANK', 'BARK', 'BARN', 'BASE',
      'CAKE', 'CALL', 'CALM', 'CAME', 'CAMP', 'CANE', 'CARD', 'CARE', 'CASE', 'CASH',
      'DADA', 'DADS', 'DALE', 'DAME', 'DAMP', 'DAMS', 'DARE', 'DARK', 'DARN', 'DART',
      'EACH', 'EARN', 'EASE', 'EAST', 'EASY', 'EBBS', 'EDGE', 'EDGY', 'EDIT', 'EGGS',
      'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FAKE', 'FALL', 'FAME', 'FANG', 'FARM',
      'GAME', 'GANG', 'GARB', 'GASP', 'GATE', 'GAZE', 'GEAR', 'GIFT', 'GIRL', 'GIVE',
      'HAIR', 'HALF', 'HALL', 'HAND', 'HANG', 'HARM', 'HATE', 'HAVE', 'HEAD', 'HEAL',
      'ICE', 'ICON', 'IDEA', 'IDLE', 'IDOL', 'IMPS', 'INFO', 'INTO', 'IONS', 'IOTA',
      'JABS', 'JADE', 'JAIL', 'JAMS', 'JARS', 'JAVA', 'JAWS', 'JAZZ', 'JEER', 'JERK',
      'KALE', 'KEEN', 'KEEP', 'KICK', 'KILL', 'KIND', 'KING', 'KISS', 'KITE', 'KNEE',
      'LACE', 'LACK', 'LADS', 'LADY', 'LAID', 'LAIN', 'LAKE', 'LAMB', 'LAME', 'LAND',
      'MAIL', 'MAIN', 'MAKE', 'MALE', 'MALL', 'MAMA', 'NAME', 'NEAR', 'NECK', 'NEED',
      'OAKS', 'OARS', 'OATH', 'OBEY', 'ODDS', 'ODES', 'OFFS', 'OILY', 'OKAY', 'OLDS',
      'PACE', 'PACK', 'PAGE', 'PAID', 'PAIN', 'PAIR', 'PALM', 'PALS', 'PART', 'PASS',
      'QUIT', 'QUIZ', 'RACE', 'RACK', 'RAGE', 'RAID', 'RAIL', 'RAIN', 'RAKE', 'RANK',
      'SACK', 'SAFE', 'SAGE', 'SAID', 'SAIL', 'SAKE', 'SALE', 'SALT', 'SAME', 'SAND',
      'TAIL', 'TAKE', 'TALK', 'TALL', 'TANK', 'TASK', 'TAXI', 'TEAM', 'TEAR', 'TELL',
      'VAIN', 'VALE', 'VARY', 'VAST', 'VERY', 'VEST', 'VIEW', 'VINE', 'VISA', 'VOID',
      'WAGE', 'WAIT', 'WAKE', 'WALK', 'WALL', 'WANT', 'WARD', 'WARM', 'WARN', 'WASH',
      'YARD', 'YARN', 'YAWN', 'YEAR', 'YELL', 'YOGA', 'YOUR', 'YULE', 'ZOOM',
      // Additional common 4-letter words
      'ABLY', 'ACNE', 'ACRE', 'ACTS', 'ADDS', 'ADEN', 'ADER', 'ADIT', 'ADOS', 'ADZE', 'AEON', 'AERO', 'AERY', 'AFAR', 'AFRO', 'AGAR', 'AGAS', 'AGED', 'AGEE', 'AGEL', 'AGEN', 'AGER', 'AGES', 'AGHA', 'AGIN', 'AGIO', 'AGLY', 'AGMA', 'AGOG', 'AGON', 'AGUE', 'AHEM', 'AHOY', 'AIDE', 'AIDS', 'AIOL', 'AIRS', 'AIRT', 'AIRY', 'AITS', 'AJAR', 'AKIN', 'ALAN', 'ALAR', 'ALAS', 'ALBA', 'ALBE', 'ALBS', 'ALES', 'ALGA', 'ALIA', 'ALLY', 'ALMA', 'ALME', 'ALMS', 'ALOE', 'ALSO', 'ALTO', 'ALUM', 'AMAH', 'AMAS', 'AMEN', 'AMES', 'AMIA', 'AMID', 'AMIN', 'AMIR', 'AMIS', 'AMMO', 'AMOK', 'AMPS', 'AMUS', 'AMYL', 'ANAL', 'ANAN', 'ANAS', 'ANES', 'ANIL', 'ANIS', 'ANKH', 'ANNA', 'ANON', 'ANSA', 'ANTA', 'ANTE', 'ANTI', 'ANTS', 'ANUS', 'APED', 'APER', 'APES', 'APIS', 'APSE', 'AQUA', 'ARAK', 'ARAM', 'ARAR', 'ARBA', 'ARCH', 'ARCO', 'ARCS', 'AREA', 'AREG', 'ARES', 'ARIA', 'ARID', 'ARIL', 'ARIS', 'ARKS', 'ARMS', 'ARMY', 'ARNA', 'AROW', 'ARSE', 'ARTS', 'ARTY', 'ARUM', 'ARVO', 'ASEA', 'ASHY', 'ASIA', 'ASKS', 'ASPS', 'ASSY', 'ATEL', 'ATES', 'ATMA', 'ATOM', 'ATOP', 'AULD', 'AUNT', 'AURA', 'AUTO', 'AVER', 'AVES', 'AVIS', 'AVOS', 'AVOW', 'AWAY', 'AWDL', 'AWEI', 'AWES', 'AWLS', 'AWNS', 'AWNY', 'AWOL', 'AWRY', 'AXED', 'AXEL', 'AXES', 'AXIL', 'AXIS', 'AXLE', 'AXON',
      'BABE', 'BABU', 'BABY', 'BACH', 'BACK', 'BADE', 'BAIL', 'BAIT', 'BAKE', 'BALD', 'BALE', 'BALL', 'BAND', 'BANE', 'BANG', 'BANK', 'BANS', 'BARD', 'BARE', 'BARK', 'BARN', 'BARS', 'BASE', 'BASH', 'BASK', 'BASS', 'BATE', 'BATH', 'BATS', 'BAWD', 'BAWL', 'BAYS', 'BEAD', 'BEAK', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEAU', 'BECK', 'BEEF', 'BEEN', 'BEER', 'BEES', 'BEET', 'BEGS', 'BELL', 'BELT', 'BEND', 'BENT', 'BERG', 'BERM', 'BEST', 'BETA', 'BETH', 'BETS', 'BEVY', 'BEYS', 'BHUT', 'BIAS', 'BIBB', 'BIBS', 'BICE', 'BIDE', 'BIDS', 'BIEN', 'BIER', 'BILE', 'BILI', 'BILL', 'BIND', 'BINE', 'BING', 'BIRD', 'BIRL', 'BIRR', 'BITE', 'BITS', 'BLAB', 'BLAT', 'BLED', 'BLEW', 'BLOB', 'BLOC', 'BLOT', 'BLOW', 'BLUE', 'BLUR', 'BOAR', 'BOAS', 'BOAT', 'BOBS', 'BODE', 'BODS', 'BODY', 'BOGS', 'BOGY', 'BOIL', 'BOLA', 'BOLD', 'BOLO', 'BOLT', 'BOMB', 'BONA', 'BOND', 'BONE', 'BONG', 'BONK', 'BONS', 'BOOK', 'BOOM', 'BOON', 'BOOR', 'BOOS', 'BOOT', 'BOPS', 'BORA', 'BORE', 'BORN', 'BOSE', 'BOSS', 'BOTA', 'BOTH', 'BOTS', 'BOTT', 'BOUR', 'BOUT', 'BOWL', 'BOWS', 'BOYS', 'BRAD', 'BRAE', 'BRAG', 'BRAN', 'BRAS', 'BRAT', 'BRAW', 'BRAY', 'BRED', 'BREW', 'BRIG', 'BRIM', 'BROW', 'BUCK', 'BUDD', 'BUFF', 'BULB', 'BULK', 'BULL', 'BUNK', 'BUNS', 'BUOY', 'BURB', 'BURG', 'BURL', 'BURN', 'BURR', 'BURS', 'BURY', 'BUSH', 'BUSS', 'BUST', 'BUSY', 'BYTE',
      'CABS', 'CACA', 'CACHE', 'CACK', 'CADE', 'CADI', 'CADS', 'CAFE', 'CAGE', 'CAGY', 'CAKE', 'CALF', 'CALL', 'CALM', 'CAME', 'CAMP', 'CAMS', 'CANE', 'CANS', 'CAPE', 'CAPS', 'CARD', 'CARE', 'CARP', 'CARR', 'CARS', 'CART', 'CASE', 'CASH', 'CASK', 'CAST', 'CATS', 'CAVA', 'CAVE', 'CAWK', 'CAYS', 'CECA', 'CEDE', 'CEDS', 'CEES', 'CELL', 'CELT', 'CENT', 'CERE', 'CERT', 'CESS', 'CHAD', 'CHAI', 'CHAM', 'CHAT', 'CHAW', 'CHEF', 'CHEM', 'CHEW', 'CHEZ', 'CHIA', 'CHIC', 'CHIN', 'CHIP', 'CHIT', 'CHON', 'CHOP', 'CHOW', 'CHUB', 'CHUG', 'CHUM', 'CITE', 'CITY', 'CLAD', 'CLAM', 'CLAN', 'CLAP', 'CLAW', 'CLAY', 'CLEF', 'CLEW', 'CLIP', 'CLOD', 'CLOG', 'CLON', 'CLOT', 'CLOW', 'CLUB', 'CLUE', 'COAL', 'COAT', 'COAX', 'COBB', 'COBS', 'COCA', 'COCK', 'COCO', 'CODA', 'CODE', 'CODS', 'COED', 'COFF', 'COGS', 'COHO', 'COIL', 'COIN', 'COIR', 'COKE', 'COLA', 'COLD', 'COLT', 'COMA', 'COMB', 'COME', 'COMM', 'COMP', 'COND', 'CONE', 'CONN', 'CONS', 'CONT', 'COOK', 'COOL', 'COON', 'COOP', 'COOS', 'COOT', 'COPE', 'COPS', 'COPY', 'CORD', 'CORE', 'CORK', 'CORN', 'COST', 'COSS', 'COTE', 'COTS', 'COUP', 'COUR', 'COVE', 'COWL', 'COYU', 'COZY', 'CRAB', 'CRAG', 'CRAM', 'CRAP', 'CRAW', 'CRED', 'CREW', 'CRIB', 'CROP', 'CROW', 'CRUD', 'CRUX', 'CUBE', 'CUBS', 'CUES', 'CUFF', 'CULL', 'CULT', 'CUPS', 'CURB', 'CURD', 'CURE', 'CURL', 'CURN', 'CURR', 'CURS', 'CURT', 'CUSH', 'CUSK', 'CUSS', 'CUTE', 'CUTS', 'CWMS', 'CYAN', 'CYMA', 'CYST',
      'DABS', 'DACE', 'DADA', 'DADS', 'DAES', 'DAFF', 'DAFT', 'DAGO', 'DAGS', 'DAHL', 'DAIL', 'DAIS', 'DALE', 'DALI', 'DALS', 'DAME', 'DAMN', 'DAMP', 'DAMS', 'DANG', 'DANK', 'DANS', 'DARE', 'DARK', 'DARN', 'DART', 'DASH', 'DATA', 'DATE', 'DATO', 'DATS', 'DAUB', 'DAWN', 'DAYS', 'DAZE', 'DEAD', 'DEAF', 'DEAL', 'DEAN', 'DEAR', 'DEBT', 'DECK', 'DEED', 'DEEM', 'DEEP', 'DEFY', 'DELL', 'DELT', 'DEMO', 'DENI', 'DENS', 'DENT', 'DENY', 'DESK', 'DEUS', 'DEVI', 'DEVS', 'DEWY', 'DEXY', 'DEYS', 'DHAK', 'DHOW', 'DIAM', 'DIBS', 'DICE', 'DICK', 'DIDO', 'DIED', 'DIEL', 'DIES', 'DIET', 'DIFF', 'DIFS', 'DIGS', 'DIKE', 'DILL', 'DIMS', 'DINE', 'DING', 'DINK', 'DINO', 'DINT', 'DIPS', 'DIPT', 'DIRE', 'DIRK', 'DIRL', 'DIRT', 'DISC', 'DISH', 'DISK', 'DITA', 'DITS', 'DITT', 'DIVE', 'DJIN', 'DOBS', 'DOCK', 'DOCS', 'DODO', 'DOER', 'DOES', 'DOFF', 'DOGS', 'DOGY', 'DOIT', 'DOJO', 'DOLCE', 'DOLI', 'DOLL', 'DOLS', 'DOLT', 'DOMS', 'DONE', 'DOOM', 'DOOR', 'DOPA', 'DOPE', 'DOPS', 'DOPY', 'DORB', 'DORK', 'DORM', 'DORP', 'DORR', 'DORS', 'DORY', 'DOSE', 'DOSH', 'DOSS', 'DOST', 'DOTE', 'DOTH', 'DOTS', 'DOTY', 'DOUB', 'DOUR', 'DOVE', 'DOWN', 'DOWS', 'DOXY', 'DOZE', 'DOZY', 'DRAB', 'DRAG', 'DRAM', 'DRAW', 'DREW', 'DRIP', 'DROP', 'DRUB', 'DRUG', 'DRUM', 'DUAL', 'DUCE', 'DUCK', 'DUCT', 'DUEL', 'DUET', 'DUFF', 'DUGS', 'DUKE', 'DULL', 'DULY', 'DUMB', 'DUMP', 'DUNE', 'DUNG', 'DUNK', 'DUNS', 'DUOS', 'DUPS', 'DURA', 'DURE', 'DURN', 'DURO', 'DURR', 'DUSH', 'DUSK', 'DUST', 'DUTY', 'DWEE', 'DWEL', 'DWELT', 'DYAD', 'DYED', 'DYER', 'DYES', 'DYKE',
      'EACH', 'EADI', 'EADS', 'EALE', 'EANS', 'EARD', 'EARS', 'EASE', 'EAST', 'EASY', 'EATH', 'EATS', 'EBBS', 'EBON', 'ECHE', 'ECHT', 'EELS', 'EELY', 'EERY', 'EFFS', 'EFTA', 'EGAD', 'EGAL', 'EGGS', 'EGGY', 'EGOS', 'EIKS', 'EILD', 'EISE', 'EISH', 'EKED', 'EKES', 'EKKA', 'ELAN', 'ELDS', 'ELFS', 'ELHI', 'ELKS', 'ELLS', 'ELMS', 'ELSE', 'ELTS', 'ELVE', 'EMES', 'EMEU', 'EMFS', 'EMIC', 'EMIR', 'EMIT', 'EMMA', 'EMMY', 'EMOS', 'EMPT', 'EMUS', 'EMYD', 'ENDS', 'ENDU', 'ENES', 'ENGS', 'ENOL', 'ENOW', 'ENSA', 'ENTS', 'ENVO', 'ENZY', 'EONS', 'EOSI', 'EPHA', 'EPIC', 'EPIS', 'EPIT', 'EPOS', 'EPSO', 'EQUI', 'ERAS', 'ERED', 'ERES', 'ERIC', 'ERIE', 'ERKS', 'ERNE', 'ERNES', 'EROS', 'EROS', 'ERRS', 'ERST', 'ERUV', 'ESKY', 'ESNE', 'ESPY', 'ESSE', 'ESTS', 'ESWS', 'ETAS', 'ETCH', 'ETEN', 'ETES', 'ETHS', 'ETIC', 'ETNA', 'ETUI', 'ETYM', 'EUGE', 'EUOI', 'EUOI', 'EURO', 'EVEN', 'EVER', 'EVES', 'EVET', 'EVIL', 'EVOE', 'EWER', 'EWES', 'EWKS', 'EWTS', 'EXAM', 'EXEC', 'EXED', 'EXES', 'EXIT', 'EXON', 'EXPO', 'EXUL', 'EYAS', 'EYED', 'EYEN', 'EYER', 'EYES', 'EYOT', 'EYRA', 'EYRE', 'EYRY',
            
      // 5-letter words
      'WATER', 'HOUSE', 'LIGHT', 'NIGHT', 'RIGHT', 'FIGHT', 'MIGHT', 'SIGHT', 'TIGHT', 'WHITE',
      'BLACK', 'GREEN', 'WORLD', 'FIRST', 'LAST', 'START', 'BEGIN', 'SMILE', 'LAUGH', 'DANCE',
      'MUSIC', 'SOUND', 'VOICE', 'SPEAK', 'TALK', 'WRITE', 'READ', 'LEARN', 'STUDY', 'TEACH',
      'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
      'BEACH', 'BEARD', 'BEAST', 'BEATS', 'BEFIT', 'BEGAN', 'BEGIN', 'BEGUN', 'BEING', 'BELOW',
      'CACTI', 'CADET', 'CAFES', 'CAGED', 'CAGES', 'CAMEL', 'CAMES', 'CAMPS', 'CANAL', 'CANDY',
      // Additional 5-letter words
      'ABACK', 'ABAFT', 'ABASE', 'ABASH', 'ABATE', 'ABAYA', 'ABBAS', 'ABBED', 'ABBES', 'ABBOT', 'ABEAM', 'ABEAR', 'ABELE', 'ABETS', 'ABHOR', 'ABIDE', 'ABIES', 'ABLED', 'ABLER', 'ABLES', 'ABLOW', 'ABMHO', 'ABODE', 'ABOHM', 'ABOIL', 'ABOMA', 'ABOON', 'ABORD', 'ABORE', 'ABORT', 'ABOUT', 'ABOVE', 'ABRAM', 'ABRAY', 'ABRIM', 'ABRIN', 'ABRIS', 'ABSEA', 'ABSED', 'ABSEE', 'ABSEY', 'ABSIT', 'ABUSE', 'ABUTS', 'ABUZZ', 'ABYES', 'ABYSM', 'ABYSS', 'ACARI', 'ACCRA', 'ACCUS', 'ACERB', 'ACERS', 'ACETA', 'ACHAR', 'ACHED', 'ACHES', 'ACHEY', 'ACHOO', 'ACIDS', 'ACING', 'ACINI', 'ACKED', 'ACMES', 'ACMIC', 'ACNED', 'ACNES', 'ACOCK', 'ACOLD', 'ACORN', 'ACRED', 'ACRES', 'ACRID', 'ACROS', 'ACTED', 'ACTIN', 'ACTON', 'ACTOR', 'ACUTE', 'ACYLS', 'ADAGE', 'ADAPT', 'ADAWS', 'ADAYS', 'ADBOT', 'ADDAX', 'ADDED', 'ADDER', 'ADDIO', 'ADDLE', 'ADEEM', 'ADEPT', 'ADHAN', 'ADIEU', 'ADIOS', 'ADITS', 'ADMAN', 'ADMEN', 'ADMIN', 'ADMIT', 'ADMIX', 'ADOBE', 'ADOPT', 'ADORE', 'ADORN', 'ADOWN', 'ADOZE', 'ADRAD', 'ADRED', 'ADSUM', 'ADUKI', 'ADULT', 'ADUNC', 'ADUST', 'ADVEW', 'ADVTS', 'ADYTA', 'ADZED', 'ADZES', 'AECIA', 'AEDAS', 'AEDIS', 'AEGIS', 'AEONS', 'AERIE', 'AEROS', 'AESIR', 'AFALD', 'AFARA', 'AFARS', 'AFEAR', 'AFFIX', 'AFFLY', 'AFION', 'AFIRE', 'AFLAJ', 'AFLOW', 'AFLAD', 'AFOOT', 'AFORE', 'AFOUL', 'AFRIT', 'AFROS', 'AFTER', 'AGAIN', 'AGAMA', 'AGAMI', 'AGARS', 'AGAST', 'AGAVE', 'AGAZE', 'AGENE', 'AGENT', 'AGERS', 'AGGER', 'AGGIE', 'AGGRI', 'AGGRO', 'AGGRY', 'AGHAS', 'AGILA', 'AGILE', 'AGING', 'AGIOS', 'AGISM', 'AGIST', 'AGITA', 'AGLEE', 'AGLET', 'AGLEY', 'AGLOO', 'AGLOW', 'AGMAS', 'AGNUS', 'AGOOD', 'AGORA', 'AGREE', 'AGRIA', 'AGRIN', 'AGROS', 'AGUED', 'AGUES', 'AGUNA', 'AGUTI', 'AHEAP', 'AHENT', 'AHIGH', 'AHIND', 'AHING', 'AHINT', 'AHOLD', 'AHULL', 'AHURU', 'AIDAS', 'AIDED', 'AIDER', 'AIDES', 'AIDOS', 'AIERY', 'AIGAS', 'AIGHT', 'AILED', 'AIMED', 'AIMER', 'AINEE', 'AINGA', 'AIOLI', 'AIRED', 'AIRER', 'AIRNS', 'AIRTH', 'AIRTS', 'AISLE', 'AITCH', 'AITUS', 'AIVER', 'AIYEE', 'AIZLE', 'AJIES', 'AJIVA', 'AJUGA', 'AJWAN', 'AKEES', 'AKELA', 'AKENE', 'AKING', 'AKITA', 'AKKER', 'AKKOS', 'ALAAP', 'ALACK', 'ALAMO', 'ALAND', 'ALANE', 'ALANG', 'ALANS', 'ALANT', 'ALAPA', 'ALAPS', 'ALARM', 'ALARY', 'ALATE', 'ALAYS', 'ALBAS', 'ALBEE', 'ALBUM', 'ALCID', 'ALCOS', 'ALDER', 'ALDOL', 'ALECK', 'ALECS', 'ALEFT', 'ALEPH', 'ALERT', 'ALEWS', 'ALEYE', 'ALFAS', 'ALGAE', 'ALGAL', 'ALGAS', 'ALGID', 'ALGIN', 'ALGOR', 'ALGUM', 'ALIAS', 'ALIBI', 'ALIFS', 'ALIGN', 'ALIKE', 'ALINE', 'ALIST', 'ALIVE', 'ALIYA', 'ALKIE', 'ALKOS', 'ALKYD', 'ALKYL', 'ALLAY', 'ALLEE', 'ALLEL', 'ALLEN', 'ALLER', 'ALLIS', 'ALLOD', 'ALLOT', 'ALLOW', 'ALLOY', 'ALLYL', 'ALMAH', 'ALMAS', 'ALMEH', 'ALMEN', 'ALMES', 'ALMUD', 'ALMUG', 'ALODS', 'ALOED', 'ALOES', 'ALOFT', 'ALOHA', 'ALOIN', 'ALONE', 'ALONG', 'ALOOF', 'ALOOS', 'ALOUD', 'ALOWE', 'ALPHA', 'ALTAR', 'ALTER', 'ALTHO', 'ALTOS', 'ALULA', 'ALUMS', 'ALURE', 'ALURK', 'ALVAR', 'ALWAY', 'AMAHS', 'AMAIN', 'AMATE', 'AMAZE', 'AMBAN', 'AMBER', 'AMBIT', 'AMBLE', 'AMBOS', 'AMBRY', 'AMEBA', 'AMEER', 'AMEND', 'AMENE', 'AMENS', 'AMENT', 'AMIAS', 'AMICE', 'AMICI', 'AMIDE', 'AMIDO', 'AMIDS', 'AMIES', 'AMIGA', 'AMIGO', 'AMINE', 'AMINO', 'AMINS', 'AMIRS', 'AMLAS', 'AMMAN', 'AMMON', 'AMMOS', 'AMNIA', 'AMNIC', 'AMNIO', 'AMOKS', 'AMOLE', 'AMONG', 'AMORT', 'AMOUR', 'AMOVE', 'AMOWT', 'AMPED', 'AMPUL', 'AMRIT', 'AMUCK', 'AMUSE', 'AMYLS', 'ANANA', 'ANATA', 'ANCHO', 'ANCLE', 'ANCON', 'ANDRO', 'ANEAR', 'ANELE', 'ANENT', 'ANGAS', 'ANGEL', 'ANGER', 'ANGLE', 'ANGLO', 'ANGRY', 'ANGST', 'ANIGH', 'ANILE', 'ANILS', 'ANIMA', 'ANIME', 'ANIMI', 'ANION', 'ANISE', 'ANKER', 'ANKHS', 'ANKLE', 'ANKUS', 'ANLAS', 'ANNAL', 'ANNAS', 'ANNAT', 'ANNEX', 'ANNOY', 'ANNUL', 'ANOAS', 'ANODE', 'ANOLE', 'ANOMY', 'ANSAE', 'ANTAE', 'ANTAR', 'ANTAS', 'ANTED', 'ANTES', 'ANTIC', 'ANTIS', 'ANTRA', 'ANTRE', 'ANTRY', 'ANURA', 'ANVIL', 'ANYON', 'AORTA', 'APACE', 'APAGE', 'APAID', 'APART', 'APAYD', 'APAYS', 'APEAK', 'APEEK', 'APERU', 'APERY', 'APERT', 'APGAR', 'APHID', 'APHIS', 'APIAN', 'APING', 'APIOL', 'APISH', 'APISM', 'APLET', 'APLIT', 'APNEA', 'APODE', 'APODS', 'APOOP', 'APORT', 'APPAL', 'APPAY', 'APPEL', 'APPLE', 'APPLY', 'APPRO', 'APPUI', 'APPUY', 'APRES', 'APRON', 'APSES', 'APSIS', 'APSOS', 'APTED', 'APTER', 'APTLY', 'AQUAE', 'AQUAL', 'AQUAS', 'ARABA', 'ARAKS', 'ARAME', 'ARARS', 'ARBAS', 'ARBOR', 'ARCED', 'ARCHI', 'ARCOS', 'ARCUS', 'ARDEB', 'ARDOR', 'ARDRI', 'AREAD', 'AREAE', 'AREAL', 'AREAR', 'AREAS', 'ARECA', 'AREDD', 'AREDE', 'AREFY', 'AREIC', 'ARENA', 'ARENE', 'AREPA', 'ARERE', 'ARETE', 'ARETS', 'ARETT', 'ARGAL', 'ARGAN', 'ARGIL', 'ARGLE', 'ARGOL', 'ARGON', 'ARGOT', 'ARGUE', 'ARGUS', 'ARHAT', 'ARIAS', 'ARIEL', 'ARILS', 'ARIOT', 'ARISE', 'ARISH', 'ARKED', 'ARLED', 'ARLES', 'ARMED', 'ARMER', 'ARMET', 'ARMIL', 'ARMOR', 'ARNAS', 'ARNUT', 'AROBA', 'AROHA', 'AROID', 'AROMA', 'AROSE', 'ARPAS', 'ARPEN', 'ARRAH', 'ARRAS', 'ARRAY', 'ARRET', 'ARRIS', 'ARROW', 'ARROZ', 'ARSED', 'ARSES', 'ARSEY', 'ARSIS', 'ARSON', 'ARTAL', 'ARTED', 'ARTER', 'ARTIC', 'ARTIS', 'ARTSY', 'ARUHE', 'ARUMS', 'ARVAL', 'ARVEE', 'ARVOS', 'ARYLS', 'ASANA', 'ASCON', 'ASCOT', 'ASCUS', 'ASDIC', 'ASHED', 'ASHEN', 'ASHES', 'ASHET', 'ASHIE', 'ASHIT', 'ASHME', 'ASHYG', 'ASIDE', 'ASKED', 'ASKER', 'ASKOI', 'ASKOS', 'ASPEN', 'ASPER', 'ASPIC', 'ASPIS', 'ASPRO', 'ASSAI', 'ASSAM', 'ASSAY', 'ASSES', 'ASSEZ', 'ASSOT', 'ASTER', 'ASTIR', 'ASTUN', 'ASURA', 'ASWAY', 'ASWIM', 'ASYLA', 'ATAPS', 'ATAXY', 'ATIGI', 'ATILT', 'ATIMY', 'ATLAS', 'ATMAN', 'ATMAS', 'ATMOS', 'ATOCS', 'ATOKE', 'ATOKS', 'ATOLL', 'ATOMS', 'ATOMY', 'ATONY', 'ATOPY', 'ATRIA', 'ATRIP', 'ATTAP', 'ATTAR', 'ATTIC', 'ATUAS', 'AUDAD', 'AUDIO', 'AUDIT', 'AUGER', 'AUGHT', 'AUGUR', 'AULAS', 'AULIC', 'AULOI', 'AULOS', 'AUMIL', 'AUNES', 'AUNTS', 'AUNTY', 'AURAL', 'AURAR', 'AURAS', 'AUREI', 'AURES', 'AURIC', 'AURIS', 'AURUM', 'AUTOS', 'AUXIN', 'AVAIL', 'AVALE', 'AVANT', 'AVAST', 'AVELS', 'AVENS', 'AVERS', 'AVERT', 'AVIAN', 'AVINE', 'AVION', 'AVISE', 'AVISO', 'AVIZE', 'AVOID', 'AVOWS', 'AVYZE', 'AWAIT', 'AWAKE', 'AWARD', 'AWARE', 'AWARN', 'AWASH', 'AWATO', 'AWAVE', 'AWAYS', 'AWDLS', 'AWEEL', 'AWETO', 'AWFUL', 'AWING', 'AWMRY', 'AWNED', 'AWNER', 'AWOKE', 'AWOLS', 'AWORK', 'AXELS', 'AXIAL', 'AXILE', 'AXILS', 'AXING', 'AXIOM', 'AXION', 'AXITE', 'AXLED', 'AXLES', 'AXMAN', 'AXMEN', 'AXOID', 'AXONE', 'AXONS', 'AYAHS', 'AYAYA', 'AYELP', 'AYGRE', 'AYINS', 'AYONT', 'AYRES', 'AYRIE', 'AZANS', 'AZIDE', 'AZIDO', 'AZINE', 'AZLON', 'AZOIC', 'AZOLE', 'AZONS', 'AZOTE', 'AZOTH', 'AZUKI', 'AZYGY', 'AZURE', 'AZYME', 'AZYMS',
      'DAILY', 'DANCE', 'DARED', 'DEALS', 'DEALT', 'DEATH', 'DECAY', 'DELAY', 'DEPTH', 'DERBY',
      'EAGER', 'EARTH', 'EARLY', 'EASEL', 'EATEN', 'EATER', 'EBONY', 'ECLIP', 'EDICT', 'EDIFY',
      'FABLE', 'FACED', 'FACES', 'FACTS', 'FADED', 'FAILS', 'FAINS', 'FAIRS', 'FAITH', 'FALSE',
      'GAINS', 'GAMES', 'GASES', 'GATED', 'GATES', 'GAUZE', 'GHOST', 'GIANT', 'GIFTS', 'GIRLS',
      'HABIT', 'HAIRY', 'HANDY', 'HAPPY', 'HARDS', 'HATED', 'HAVEN', 'HAVES', 'HEADS', 'HEALS',
      'IDEAL', 'IDIOM', 'IDOLS', 'IGLOO', 'IMAGE', 'IMPLY', 'INANE', 'INDEX', 'INNER', 'INPUT',
      'JAZZY', 'JEANS', 'JELLY', 'JEWEL', 'JOINS', 'JOIST', 'JOKED', 'JOKES', 'JOLLY', 'JOYED',
      'KAYAK', 'KEBAB', 'KHAKI', 'KICKS', 'KILLS', 'KINDS', 'KINGS', 'KIOSK', 'KITES', 'KNIFE',
      'LABEL', 'LABOR', 'LACES', 'LACKS', 'LADEN', 'LADLE', 'LAGER', 'LANCE', 'LANES', 'LARGE',
      'MAGIC', 'MAIDS', 'MAILS', 'MAJOR', 'MAKER', 'MALES', 'MAPLE', 'MARCH', 'MARKS', 'MARRY',
      'NAILS', 'NAIVE', 'NAMED', 'NAMES', 'NANNY', 'NASAL', 'NASTY', 'NATAL', 'NAVAL', 'NEEDS',
      'OAKEN', 'OBESE', 'OCCUR', 'OCEAN', 'OCTAL', 'OCTET', 'ODDER', 'OFFER', 'OFTEN', 'OILED',
      'PAINS', 'PAINT', 'PAIRS', 'PALMS', 'PANEL', 'PANIC', 'PAPER', 'PARKS', 'PARTY', 'PASTA',
      'QUACK', 'QUAIL', 'QUAKE', 'QUALM', 'QUARK', 'QUART', 'QUASH', 'QUASI', 'QUEEN', 'QUERY',
      'RABID', 'RACED', 'RACES', 'RACKS', 'RADAR', 'RADIO', 'RAILS', 'RAINS', 'RAISE', 'RAMPS',
      'SABER', 'SAILS', 'SAINT', 'SALAD', 'SALES', 'SALSA', 'SALVE', 'SANDS', 'SAPPY', 'SASSY',
      'TABLE', 'TACKY', 'TAILS', 'TAKEN', 'TAKER', 'TAKES', 'TALES', 'TALKS', 'TALLY', 'TAMED',
      'VALID', 'VALUE', 'VALVE', 'VAPID', 'VAPOR', 'VAULT', 'VEGAN', 'VENOM', 'VERSE', 'VESTS',
      'WAGON', 'WAIFS', 'WAILS', 'WAIST', 'WAITS', 'WALKS', 'WALLS', 'WALTZ', 'WANTS', 'WARDS',
      'YACHT', 'YANKS', 'YARDS', 'YAWNS', 'YEARN', 'YELLS', 'YIELD', 'YOUNG', 'YOURS', 'YOUTH',
      
      // 6-letter words
      'BANANA', 'ORANGE', 'YELLOW', 'PURPLE', 'FLOWER', 'GARDEN', 'SUMMER', 'WINTER', 'SPRING', 'AUTUMN',
      'SUNFLY', 'BUTTER', 'FLYING', 'JUMPING', 'RUNNING', 'WALKING', 'TALKING', 'SPEAKING', 'READING', 'WRITING',
      'ABACUS', 'ABATED', 'ABATES', 'ABBESS', 'ABBOTS', 'ABBOTT', 'ABDUCT', 'ABHORS', 'ABIDED', 'ABIDER',
      'BACONS', 'BADGES', 'BADMAN', 'BAITED', 'BAKERS', 'BAKERY', 'BAKING', 'BALDLY', 'BALKED', 'BALLAD',
      'CABANA', 'CABBIE', 'CABLED', 'CABLES', 'CACHED', 'CACHES', 'CACKLE', 'CADGED', 'CADGER', 'CADGES',
      'DANCES', 'DANGER', 'DARING', 'DARKEN', 'DARKER', 'DARNED', 'DARTED', 'DASHED', 'DATING', 'DAUBED',
      'EAGERS', 'EAGLET', 'EARTHS', 'EASELS', 'EASIER', 'EASILY', 'EASTED', 'EATERS', 'EBBETS', 'EBONIC',
      'FACADE', 'FACIAL', 'FACILE', 'FACING', 'FACTOR', 'FADING', 'FAILED', 'FAIRER', 'FAIRLY', 'FAITHS',
      'GAINED', 'GAINER', 'GALAXY', 'GALLOP', 'GAMBOL', 'GAMERS', 'GAMING', 'GANDER', 'GANGED', 'GAPING',
      'HABITS', 'HACKED', 'HACKER', 'HACKLE', 'HADRON', 'HAILED', 'HAIRDO', 'HALFEN', 'HALIDE', 'HALLOO',
      'JABBED', 'JACKAL', 'JACKET', 'JACUZZ', 'JAGGED', 'JAGUAR', 'JAILED', 'JALOPY', 'JAMMED', 'JANGLE',
      'KARATE', 'KARMA', 'KAYAKS', 'KEBABS', 'KELVIN', 'KENNEL', 'KERNEL', 'KETTLE', 'KEYPAD', 'KIDNAP',
      'LABELS', 'LABIAL', 'LABORS', 'LACERS', 'LACING', 'LACTIC', 'LADDER', 'LADIES', 'LAGERS', 'LAMENT',
      'MAGGOT', 'MAGNET', 'MAGNUM', 'MAHJON', 'MAIDEN', 'MAILER', 'MAIMED', 'MAINLY', 'MAJORS', 'MAKERS',
      'NABBED', 'NABOBS', 'NACHOS', 'NADIRS', 'NAGGED', 'NAILER', 'NAIVER', 'NAKED', 'NAMERS', 'NAMING',
      'OAFISH', 'OAKENS', 'OARING', 'OATERS', 'OBELUS', 'OBEYED', 'OBJECT', 'OBLATE', 'OBLIGE', 'OBOIST',
      'PACIFY', 'PACKED', 'PACKER', 'PACTED', 'PADDED', 'PADDLE', 'PADRES', 'PAGANS', 'PAGING', 'PAID',
      'QUAICH', 'QUAILS', 'QUAINT', 'QUAKED', 'QUAKER', 'QUALMS', 'QUANTA', 'QUARKS', 'QUARTS', 'QUARTZ',
      'RABBIS', 'RABBLE', 'RABBLY', 'RACERS', 'RACIAL', 'RACING', 'RACKED', 'RACKET', 'RACOON', 'RADARS',
      'SABBAT', 'SABERS', 'SABINO', 'SABLES', 'SABOTS', 'SABRAL', 'SACRAL', 'SACRED', 'SADDEN', 'SADDER',
      'TABLES', 'TABLET', 'TABOOS', 'TACKED', 'TACKLE', 'TACTIC', 'TAFETA', 'TAGGED', 'TAILED', 'TAILOR',
      'VACANT', 'VACATE', 'VACCIN', 'VACUUM', 'VAGARY', 'VAGINA', 'VAGROM', 'VAGUER', 'VAINLY', 'VALETS',
      'WACKED', 'WACKES', 'WADDLE', 'WADING', 'WAFERS', 'WAFFLE', 'WAFTED', 'WAGGED', 'WAGNER', 'WAILED',
      'YACHTS', 'YAHOO', 'YAMMER', 'YANKED', 'YAPPED', 'YARDER', 'YARNED', 'YATTER', 'YAWING', 'YAWNED',
      
      // 7-letter words
      'ABILITY', 'ABSENCE', 'ACADEMY', 'ACCOUNT', 'ACHIEVE', 'ACQUIRE', 'ADDRESS', 'ADVANCE', 'AFFAIRS', 'AFFECT',
      'ANIMALS', 'ANSWERS', 'ANXIETY', 'ANYBODY', 'APPLIED', 'APPROVE', 'ARGUE', 'ARISING', 'ARRANGE', 'ARRIVAL',
      'BAGGAGE', 'BALANCE', 'BALCONY', 'BANANAS', 'BARGAIN', 'BARKEEP', 'BASKETS', 'BATTERY', 'BATTING', 'BEACHED',
      'CABARET', 'CABBAGE', 'CABINET', 'CABLE', 'CACAO', 'CACHE', 'CACKLE', 'CACTUS', 'CADDIE', 'CADDY',
      'DANCERS', 'DANCING', 'DANDEST', 'DANDIFY', 'DANDILY', 'DANGERO', 'DANGLES', 'DANKISH', 'DAPHNIA', 'DARTERS',
      'EAGLETS', 'EAGLING', 'EARDROP', 'EARMARK', 'EARNERS', 'EARNEST', 'EARNING', 'EARPLUG', 'EARRING', 'EARTHEN',
      'FACADES', 'FACEDOW', 'FACETED', 'FACINGS', 'FACTFUL', 'FACTION', 'FACTOID', 'FACTORS', 'FACTORY', 'FACTUAL',
      'GABBARD', 'GABBART', 'GABBLED', 'GABBLER', 'GABBLES', 'GABELLE', 'GABFEST', 'GADGETS', 'GADROON', 'GADWALL',
      'HABITAT', 'HABITED', 'HACKBUT', 'HACKERS', 'HACKING', 'HACKLED', 'HACKLER', 'HACKLES', 'HACKNEY', 'HACKSAW',
      'JABBERS', 'JABBERY', 'JABIRUS', 'JACKALS', 'JACKASS', 'JACKDAW', 'JACKETS', 'JACKLEG', 'JACKPOT', 'JACOBIN',
      'KABBALA', 'KABUKIS', 'KACHINA', 'KADDISH', 'KAFFEEK', 'KAFIRIN', 'KAFTANS', 'KAGOUKS', 'KAHAWAI', 'KAINITE',
      'LABELER', 'LABIATE', 'LABORED', 'LABORER', 'LACERTE', 'LACERTI', 'LACHINE', 'LACINGS', 'LACKEYS', 'LACONIC',
      'MAGENTA', 'MAGGOTS', 'MAGICAL', 'MAGISTR', 'MAGNATE', 'MAGNETO', 'MAGNETS', 'MAGNIFY', 'MAGPIES', 'MAHATMA',
      'NABBING', 'NABOBRY', 'NACELLE', 'NAGGING', 'NAGWARE', 'NAIADAL', 'NAIVEST', 'NAKEDLY', 'NALOXON', 'NAMELES',
      'OAFISHLY', 'OAKMOSS', 'OARFISH', 'OARLOCK', 'OARSMAN', 'OARWEED', 'OATCAKE', 'OATLIKE', 'OATMEAL', 'OBBLIGA',
      'PACIFIC', 'PACKAGE', 'PACKETS', 'PACKING', 'PACQUET', 'PADDING', 'PADDLED', 'PADDLER', 'PADDLES', 'PADDYWH',
      'QUACKED', 'QUACKER', 'QUACKLE', 'QUADRIC', 'QUAFFED', 'QUAGGAS', 'QUAHOGS', 'QUAICHS', 'QUAILED', 'QUAINTS',
      'RABBETS', 'RABBIES', 'RABBINS', 'RABBITS', 'RABBITY', 'RABBLER', 'RABBLRS', 'RABIDLY', 'RACCOON', 'RACECAR',
      'SABBATH', 'SABBATS', 'SABINES', 'SABLEST', 'SABOTED', 'SABOTES', 'SABREUR', 'SACCHAR', 'SACCULE', 'SACLIKE',
      'TABLEAU', 'TABLETS', 'TABLING', 'TABLOID', 'TABOOED', 'TABORER', 'TABORET', 'TABOUR', 'TABOURE', 'TABULAE',
      'VACANCY', 'VACATED', 'VACATES', 'VACCINA', 'VACCINE', 'VACILLA', 'VACUITY', 'VACUOLE', 'VACUOUS', 'VAGABON',
      'WACKIER', 'WACKILY', 'WACKING', 'WADABLE', 'WADDERS', 'WADDIES', 'WADDING', 'WADDLED', 'WADDLER', 'WADDLES',
      'YACHTED', 'YACHTER', 'YAHWISM', 'YAKITOR', 'YAMALKA', 'YAMMERS', 'YAMMING', 'YANKERS', 'YANKING', 'YAPOCKS',
      
      // 8-letter words
      'BUTTERFL', 'CHOCOLATE', 'STRAWBERRY', 'BLUEBERRY', 'RASPBERRY', 'BLACKBERRY', 'WATERMELON', 'PINEAPPLE', 'GRAPEFRUIT', 'NECTARINE',
      'DELICIOUS', 'NUTRITIOUS', 'BEAUTIFUL', 'WONDERFUL', 'COLORFUL', 'PLAYFUL', 'HELPFUL', 'CAREFUL', 'USEFUL', 'PEACEFUL',
      'ABANDON', 'ABDICATE', 'ABERRANT', 'ABHORRED', 'ABIDANCE', 'ABJECTLY', 'ABLATIVE', 'ABNORMAL', 'ABOIDEAU', 'ABOLISH',
      'BACHELOR', 'BACKBITE', 'BACKDATE', 'BACKFIRE', 'BACKHAND', 'BACKLASH', 'BACKPACK', 'BACKREST', 'BACKSIDE', 'BACKSLID',
      'CABALIST', 'CABALLED', 'CABARETS', 'CABBAGES', 'CABDRIVE', 'CABINETS', 'CABINETS', 'CABLEWAY', 'CACHALOT', 'CACHEPOT',
      'DANCERED', 'DANDERED', 'DANDRIFF', 'DANDRUFF', 'DANGERED', 'DANGLING', 'DANISHES', 'DANKNESS', 'DAPPERLY', 'DAPPLING',
      'EAGLEHAW', 'EAGLESHA', 'EAGRETS', 'EARACHES', 'EARDROPS', 'EARMARKS', 'EARMUFFS', 'EARNESTS', 'EARNINGS', 'EARPHONE',
      'FACADEDS', 'FACETING', 'FACIALLY', 'FACILELY', 'FACILITY', 'FACSIMIL', 'FACTIOUS', 'FACTOIDS', 'FACTORED', 'FACTOTUM',
      'GABBARDS', 'GABBARTS', 'GABBIEST', 'GABBROIC', 'GABBROID', 'GABELLED', 'GABELLES', 'GABFESTS', 'GADABOUT', 'GADFLIES',
      'HABANERA', 'HABANERO', 'HABITANT', 'HABITATS', 'HABITUAL', 'HABITUED', 'HACKBERR', 'HACKBUTS', 'HACKLING', 'HACKNEYS',
      'JABBERED', 'JABBERER', 'JACAMARS', 'JACINTHS', 'JACKBOOT', 'JACKDAWS', 'JACKEROO', 'JACKETED', 'JACKFISH', 'JACLEGS',
      'KABADDIS', 'KABALISM', 'KABALIST', 'KABOBBED', 'KACHINAS', 'KADDISHI', 'KAFFIYAH', 'KAFFIYEH', 'KAILYARD', 'KAIMAKAM',
      'LABELERS', 'LABELING', 'LABELLED', 'LABELLER', 'LABIALLY', 'LABORERS', 'LABORING', 'LABORITE', 'LABURNUM', 'LACERATE',
      'MAGALOGS', 'MAGAZINE', 'MAGDALEN', 'MAGENTAS', 'MAGICIAN', 'MAGISTER', 'MAGNATES', 'MAGNESIA', 'MAGNESIC', 'MAGNETIC',
      'NACREOUS', 'NADIRALS', 'NAGGIEST', 'NAILFOLD', 'NAILHEAD', 'NAILSETS', 'NAIVENES', 'NAKEDEST', 'NAMEABLE', 'NAMEDROP',
      'OAFISHLY', 'OAKAPPLE', 'OAKMOSSY', 'OARLOCKS', 'OARSMEN', 'OATCAKES', 'OBDURACY', 'OBDURATE', 'OBEDIENC', 'OBELISED',
      'PACEMAKE', 'PACEMAKR', 'PACIFIED', 'PACIFIER', 'PACIFIES', 'PACIFISM', 'PACIFIST', 'PACKAGES', 'PACKAGED', 'PACKAGER',
      'QUACKERY', 'QUACKIER', 'QUACKING', 'QUACKISM', 'QUADPLEX', 'QUADRANS', 'QUADRANT', 'QUADRATE', 'QUADRATS', 'QUADRICS',
      'RABATINE', 'RABBINIC', 'RABBINOL', 'RABBITSK', 'RABBITTS', 'RABBLERS', 'RABBLING', 'RABIDEST', 'RABIDITY', 'RACCOONS',
      'SABBATHS', 'SABOTEUR', 'SABULOUS', 'SACATONS', 'SACCADIC', 'SACCULAR', 'SACCULES', 'SACELLUM', 'SACKBUTS', 'SACKFULS',
      'TABLEFUL', 'TABLETOP', 'TABLOIDS', 'TABOOING', 'TABORERS', 'TABORETS', 'TABULATE', 'TACHISMS', 'TACHISTS', 'TACHYONS',
      'VACANTLY', 'VACATING', 'VACCINAL', 'VACCINAS', 'VACCINEE', 'VACCINES', 'VACCINIA', 'VACUOLAR', 'VACUOLES', 'VACUOUSL',
      'WACKIEST', 'WADMAALS', 'WADMOLLS', 'WADMOLTS', 'WAFFLING', 'WAGELESS', 'WAGERERS', 'WAGERING', 'WAGGLING', 'WAGGONED',
      'YACHTERS', 'YACHTING', 'YACHTMAN', 'YACHTMEN', 'YAHWISTS', 'YAKITORI', 'YAMALKAS', 'YANQUIES', 'YAPPIEST', 'YARDAGES',
      'YARDARMS', 'YARDLAND', 'YARDWAND', 'YARDWORK', 'YARMELKE', 'YARMULKES', 'YASHMACS', 'YASHMAKS', 'YATAGHAN', 'YATTERED'
    ]);
    
    return word.length >= 2 && validWords.has(word.toUpperCase());
  };

  // Function to check if a word can be formed from available letters
  const canFormWord = (word, letters) => {
    // Count frequency of each letter in the available letters
    const letterCounts = {};
    letters.forEach(letter => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });

    // Count frequency of each letter in the word
    const wordCounts = {};
    word.split('').forEach(letter => {
      wordCounts[letter] = (wordCounts[letter] || 0) + 1;
    });

    // Check if we have enough of each letter
    for (const letter in wordCounts) {
      if (!letterCounts[letter] || wordCounts[letter] > letterCounts[letter]) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('gameOver');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setFoundWords([]);
    setTimeLeft(120); // 2 minutes
    setCurrentLetters(generateBalancedLetters());
  };

  const gameOver = () => {
    setGameState('gameOver');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>WordSwipe</h1>
        {gameState === 'playing' && (
          <div className="game-stats">
            <div className="stat">Score: {score}</div>
            <div className="stat">Time: {timeLeft}s</div>
          </div>
        )}
      </header>

      <main className="app-main">
        {gameState === 'menu' && (
          <div className="menu-screen">
            <h2>Welcome to WordSwipe!</h2>
            <p>Swipe letters to form words. Find as many as you can!</p>
            <button className="start-button" onClick={startGame}>
              Start Game
            </button>
            <div className="instructions">
              <h3>How to Play:</h3>
              <ul>
                <li>Swipe over letters to form words</li>
                <li>Find as many words as possible in 2 minutes</li>
                <li>Each letter can only be used once per word</li>
                <li>Earn points for each word found</li>
                <li>Bigger words = more points!</li>
              </ul>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <GameBoard 
            letters={currentLetters}
            canFormWord={canFormWord}
            isValidEnglishWord={isValidEnglishWord}
            onWordFound={(word) => {
              if (!foundWords.includes(word)) {
                setFoundWords([...foundWords, word]);
                setScore(prev => prev + word.length * 10);
              }
            }}
            onGameOver={gameOver}
            timeLeft={timeLeft}
            foundWords={foundWords}
          />
        )}

        {gameState === 'gameOver' && (
          <GameOverScreen 
            score={score} 
            onRestart={startGame}
            foundWords={foundWords.length}
          />
        )}
      </main>
    </div>
  );
}

export default App;