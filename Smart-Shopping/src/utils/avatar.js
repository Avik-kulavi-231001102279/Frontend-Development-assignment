/**
 * Smart Gender Detection and Avatar Assignment Engine
 * Automatically assigns modern, high-resolution portrait avatars based on user name
 */

// Curated high-resolution male portrait avatars (diverse, professional, realistic)
export const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
];

// Curated high-resolution female portrait avatars (diverse, professional, realistic)
export const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
];

/**
 * Checks whether an avatar URL is part of the curated stock collections
 * @param {string} url
 * @returns {boolean}
 */
export const isStockAvatar = (url) => {
  return MALE_AVATARS.includes(url) || FEMALE_AVATARS.includes(url);
};

// Known female first names (Indian, Bengali, and Western / International)
export const KNOWN_FEMALE_NAMES = new Set([
  // Bengali & Indian female names
  'priya', 'pooja', 'puja', 'ananya', 'sneha', 'neha', 'riya', 'reya', 'shreya',
  'deepa', 'dipa', 'sunita', 'kavita', 'meera', 'mira', 'anita', 'tanya', 'maya',
  'ahana', 'alisha', 'ayesha', 'fatima', 'swati', 'nisha', 'shruti', 'tanushree', 'payal',
  'diya', 'ishita', 'aditi', 'rituparna', 'mousumi', 'debaleena', 'debleena',
  'sushmita', 'susmita', 'madhumita', 'anindita', 'paramita', 'bipasha', 'sayantani',
  'srijita', 'sampurna', 'trisha', 'roshni', 'anjali', 'jyoti', 'komal', 'rani',
  'simran', 'sonam', 'mona', 'pallavi', 'shikha', 'preeti', 'priti', 'sangeeta',
  'sangita', 'rekha', 'asha', 'shabnam', 'nasreen', 'parveen', 'taslima', 'ruma',
  'shoma', 'tanima', 'madhuri', 'radha', 'laxmi', 'lakshmi', 'saraswati', 'durga',
  'gita', 'geeta', 'champa', 'kamala', 'supriya', 'sumita', 'bula', 'poly',
  'mimi', 'nandini', 'payel', 'sonia', 'sarita', 'rashmi', 'sweta', 'shweta',
  'kajal', 'tulsi', 'shobha', 'rupa', 'shilpa', 'moumita', 'tumpa', 'jhuma',
  'chumki', 'soma', 'runa', 'dolly', 'tithi', 'mrinmoyee', 'debanjana', 'sanchita',
  'madhushree', 'manasi', 'barnali', 'kakoli', 'chhanda', 'sharmila', 'piyali',
  'baishakhi', 'rupali', 'ankita', 'subhashree', 'rimpa', 'tania', 'antora',
  'proma', 'mitu', 'mitra', 'sutapa', 'aparajita', 'indrani', 'sudeshna',
  'shanta', 'shila', 'shubhra', 'chhaya', 'surabhi', 'suravi', 'sonali',
  'monali', 'tanu', 'mili', 'munmun', 'papia', 'mitul', 'keya', 'ria', 'tia',
  'piya', 'koyel', 'koel', 'mamon', 'moni', 'paromita', 'debopriya', 'oindrila',
  'anwesha', 'soumita', 'ipsita', 'suchitra', 'maitreyee', 'monidipa', 'arunima',
  'debjani', 'sukanya', 'tamoshi', 'swagata', 'mithu', 'runu', 'jhumur', 'purnima',
  'sandhya', 'alpana', 'shubha', 'pratima', 'archana', 'pratibha', 'ratna', 'manju',
  'kanan', 'basanti', 'anuradha', 'chameli', 'malati', 'shefali', 'bina', 'beena',
  'pushpa', 'shanti', 'usha', 'sabita', 'savita', 'kusum', 'leela', 'lila', 'seema',
  'sima', 'sapna', 'santoshi', 'bhavna', 'bharti', 'vidya', 'tanvi', 'khushi',
  'avani', 'vani', 'megha', 'varsha', 'drishti', 'prachi', 'palak', 'sakshi',
  'kriti', 'krithi', 'tanisha', 'anushka', 'aalia', 'alia', 'kiara', 'deepika',
  'katrina', 'kareena', 'priyanka', 'aishwarya', 'shraddha', 'sushma', 'mamata',
  'jaya', 'hema', 'shabana', 'smriti', 'nirmala', 'mahua', 'debashree', 'shatabdi',
  'shrabanti', 'nusrat', 'pousali', 'somlata', 'iman', 'anwesshaa', 'lata', 'sunidhi',
  'alka',

  // Western & Global female names
  'sarah', 'sara', 'emma', 'olivia', 'sophia', 'sofia', 'isabella', 'isabel',
  'mia', 'charlotte', 'emily', 'jessica', 'hannah', 'clara', 'anna', 'elizabeth',
  'maria', 'laura', 'mary', 'patricia', 'jennifer', 'linda', 'barbara', 'susan',
  'margaret', 'dorothy', 'lisa', 'nancy', 'karen', 'betty', 'helen', 'sandra',
  'donna', 'carol', 'ruth', 'sharon', 'michelle', 'amanda', 'kimberly', 'deborah',
  'stephanie', 'rebecca', 'cynthia', 'kathleen', 'amy', 'angela', 'shirley', 'brenda',
  'pamela', 'nicole', 'samantha', 'katherine', 'christine', 'debra', 'rachel',
  'carolyn', 'janet', 'catherine', 'heather', 'diane', 'virginia', 'julie', 'joyce',
  'victoria', 'kelly', 'christina', 'joan', 'evelyn', 'lauren', 'judith', 'megan',
  'cheryl', 'andrea', 'martha', 'jacqueline', 'frances', 'gloria', 'ann', 'teresa',
  'kathryn', 'janice', 'jean', 'alice', 'madison', 'doris', 'abigail', 'julia',
  'judy', 'grace', 'denise', 'amber', 'marilyn', 'beverly', 'danielle', 'theresa',
  'marie', 'diana', 'brittany', 'natalie', 'rose', 'kayla', 'alexis', 'lori',
  'vanessa', 'elena', 'chloe', 'zoe', 'lucy', 'eva', 'sophie', 'audrey', 'amelia',
  'harper', 'mila', 'ella', 'avery', 'camila', 'aria', 'scarlett', 'luna', 'penelope',
  'layla', 'riley', 'zoey', 'nora', 'lily', 'eleanor', 'lillian', 'addison', 'aubrey',
  'ellie', 'stella', 'leah', 'hazel', 'violet', 'aurora', 'savannah', 'brooklyn',
  'bella', 'claire', 'skylar', 'isla', 'paisley', 'everly', 'caroline', 'nova',
  'emilia', 'kennedy', 'willow', 'kinsley', 'naomi', 'aaliyah', 'ariana', 'allison',
  'gabriella', 'madelyn', 'cora', 'ruby', 'serenity', 'autumn', 'adeline', 'hailey',
  'gianna', 'valentina', 'eliana', 'quinn', 'nevaeh', 'ivy', 'sadie', 'piper',
  'lydia', 'alexa', 'josephine', 'emery', 'delilah', 'arianna', 'vivian', 'kaylee',
  'brielle', 'madeline',
]);

// Known male names (Bengali, Indian, and Global)
export const KNOWN_MALE_NAMES = new Set([
  // Core user name and variations
  'avik', 'kulavi', 'avikkulavi', 'avick', 'abik',

  // Bengali & Indian male names
  'rahul', 'rohit', 'amit', 'arjun', 'aryan', 'aditya', 'vivek',
  'sourav', 'subrata', 'anirban', 'debabrata', 'tanmoy', 'sayan', 'subhash', 'pratik',
  'ayan', 'raj', 'rohan', 'suresh', 'ramesh', 'vikram', 'deepak', 'sunil', 'anil',
  'manoj', 'ajay', 'vijay', 'sanjay', 'dinesh', 'naresh', 'mahesh', 'ashok',
  'vinod', 'prakash', 'rakesh', 'mukesh', 'alok', 'anand', 'siddharth', 'varun',
  'karan', 'roshan', 'vishal', 'mayank', 'gaurav', 'abhishek', 'pranav', 'harsh',
  'kunal', 'mohit', 'sumit', 'ankit', 'sourabh', 'shivam', 'shubham', 'ayush',
  'rishabh', 'yash', 'aman', 'piyush', 'shantanu', 'debashis', 'debasish', 'subhashis',
  'partha', 'soumen', 'suvendu', 'tapas', 'bappa', 'bapi', 'shibu', 'shankar',
  'bidhan', 'tarun', 'prabir', 'samir', 'sandip', 'sudipto', 'surojit', 'abhik',
  'arup', 'pulak', 'tushar', 'koushik', 'kaushik', 'indrajit', 'samrat', 'swapan',
  'prabhat', 'mrinmoy', 'biswajit', 'subhankar', 'debayan', 'joy', 'bijoy', 'prosenjit',
  'jeet', 'dev', 'ankush', 'soham', 'rudra', 'niladri', 'anupam', 'nachiketa',
  'rupam', 'shaan', 'sonu', 'arijit', 'kumar', 'kishore', 'hemanta', 'manna',
  'bappi', 'mithun', 'soumitra', 'uttam', 'satyajit', 'ritwik', 'mrinal', 'buddhadeb',
  'rabindra', 'kazi', 'sharat', 'bankim', 'bibhutibhushan', 'tarasankar', 'manik',
  'sukumar', 'upendrakishore', 'satyendranath', 'jagadish', 'meghnad', 'prashanta',
  'prafulla', 'subhas', 'chittaranjan', 'surendranath', 'bipin', 'swami', 'ramakrishna',
  'vivekananda', 'aurobindo', 'chaitanya', 'surya', 'shiva', 'krishna', 'rama',
  'vishnu', 'brahma', 'ganesh', 'kartik', 'indra', 'varuna', 'vayu', 'agni',
  'kuber', 'yama', 'arya', 'somnath', 'loknath', 'amartya', 'sukanta',
  'shankha', 'chiranjit', 'dipankar', 'dhritiman', 'ravi', 'hari', 'rishi', 'ali',
  'deb', 'gautam', 'goutam', 'subho', 'shubho', 'subhajit', 'prasenjit', 'sujit',
  'ajit', 'ranjit', 'indranil', 'debjit', 'arun', 'barun', 'bikram', 'bimal',
  'kamal', 'amal', 'utpal', 'nirmal', 'shyamal', 'pranab', 'pradip', 'pradeep',
  'dilip', 'sandeep', 'kuldeep',

  // Western & Global male names
  'alex', 'alexander', 'john', 'david', 'michael', 'james', 'daniel', 'chris',
  'christopher', 'robert', 'william', 'richard', 'joseph', 'thomas', 'charles',
  'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua',
  'kenneth', 'kevin', 'brian', 'george', 'timothy', 'ronald', 'edward', 'jason',
  'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen',
  'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel', 'gregory', 'frank',
  'patrick', 'raymond', 'jack', 'dennis', 'jerry', 'tyler', 'aaron', 'jose',
  'adam', 'nathan', 'henry', 'douglas', 'zachary', 'peter', 'kyle', 'noah',
  'ethan', 'jeremy', 'walter', 'christian', 'keith', 'roger', 'terry', 'austin',
  'sean', 'gerald', 'carl', 'harold', 'dylan', 'arthur', 'lawrence', 'jordan',
  'jesse', 'bryan', 'billy', 'bruce', 'gabriel', 'logan', 'albert', 'willie',
  'alan', 'juan', 'wayne', 'elijah', 'randy', 'roy', 'vincent', 'ralph',
  'eugene', 'russell', 'bobby', 'mason', 'philip', 'louis', 'lucas', 'liam',
  'oliver', 'elias', 'leo', 'theodore', 'sebastian', 'ezra', 'mateo', 'miles',
  'asher', 'axel', 'luca', 'carter', 'hudson', 'owen', 'lincoln', 'landon',
  'cooper', 'greyson', 'colton', 'roman', 'bentley', 'kingston', 'brody', 'declan',
  'silas', 'rowan', 'micah', 'weston', 'jasper', 'kai', 'sawyer', 'finn',
  'august', 'emmett', 'milo', 'graham', 'theo', 'elliot', 'felix', 'simon',
  'max', 'jonah', 'hugo', 'tobias', 'oscar', 'callum',
]);

// Prefixes for compound names / joined usernames (sorted longest to shortest)
const SORTED_MALE_PREFIXES = Array.from(KNOWN_MALE_NAMES)
  .filter((n) => n.length >= 4)
  .sort((a, b) => b.length - a.length);

const SORTED_FEMALE_PREFIXES = Array.from(KNOWN_FEMALE_NAMES)
  .filter((n) => n.length >= 4)
  .sort((a, b) => b.length - a.length);

/**
 * Detect gender ('male' or 'female') from a user's display or full name
 * @param {string} fullName
 * @param {string} [email]
 * @returns {'male' | 'female'}
 */
export const detectGenderFromName = (fullName, email = '') => {
  if ((!fullName || typeof fullName !== 'string') && (!email || typeof email !== 'string')) {
    return 'male';
  }

  // 1. Collect inputs to analyze (name first, email username second)
  const inputSources = [];
  if (fullName && typeof fullName === 'string') {
    inputSources.push(fullName);
  }
  if (email && typeof email === 'string' && email.includes('@')) {
    inputSources.push(email.split('@')[0]);
  }

  for (const raw of inputSources) {
    // Expand camelCase (e.g. "AvikKulavi1" -> "Avik Kulavi 1")
    const separated = raw
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[0-9_.\-+@]+/g, ' ')
      .trim();

    const words = separated.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;

    const firstWord = words[0];

    // Check title honorifics
    if (['mrs', 'ms', 'miss', 'smt', 'shrimati', 'lady', 'madam'].includes(firstWord)) {
      return 'female';
    }
    if (['mr', 'sri', 'shri', 'shree', 'md', 'sheikh', 'sir', 'lord', 'babu'].includes(firstWord)) {
      return 'male';
    }

    // Skip generic non-gender title if present: dr, prof, er
    const primaryTokens = ['dr', 'prof', 'er'].includes(firstWord) && words[1]
      ? words.slice(1)
      : words;

    // A. Check exact dictionary match on tokens
    for (const token of primaryTokens) {
      if (KNOWN_MALE_NAMES.has(token)) {
        return 'male';
      }
      if (KNOWN_FEMALE_NAMES.has(token)) {
        return 'female';
      }
    }

    // B. Check compound name or joined username prefix
    // (e.g. "avikkulavi", "priyasharma", "rahul123")
    for (const token of primaryTokens) {
      if (token.length >= 4) {
        // Check if token starts with or contains known male prefix
        for (const malePrefix of SORTED_MALE_PREFIXES) {
          if (token.startsWith(malePrefix) || token.includes(malePrefix)) {
            return 'male';
          }
        }
        // Check if token starts with or contains known female prefix
        for (const femalePrefix of SORTED_FEMALE_PREFIXES) {
          if (token.startsWith(femalePrefix) || token.includes(femalePrefix)) {
            return 'female';
          }
        }
      }
    }

    // C. Check multi-letter feminine morphological suffixes (NEVER single letter 'i' or 'a'!)
    const femaleSuffixes = [
      'khatun', 'begum', 'devi', 'kumari', 'shree', 'shri',
      'wati', 'mati', 'vati', 'mita', 'nita', 'leena', 'lina',
      'purna', 'bina', 'beena', 'lata', 'rani', 'bala', 'mala',
      'tara', 'rekha', 'didi', 'moni', 'shikha', 'priya',
      'nisha', 'lisha', 'risha', 'mika', 'lika', 'drika',
      'shita', 'hita', 'bita', 'mrita', 'mrata', 'ranya',
    ];

    for (const token of primaryTokens) {
      for (const suffix of femaleSuffixes) {
        if (token.length > suffix.length + 1 && token.endsWith(suffix)) {
          if (!KNOWN_MALE_NAMES.has(token)) {
            return 'female';
          }
        }
      }
    }
  }

  // Safe fallback default is male
  return 'male';
};

export const PRESET_AVATARS = [
  ...FEMALE_AVATARS,
  ...MALE_AVATARS,
];

export const DEFAULT_AVATAR = PRESET_AVATARS[0];

/**
 * Deterministically get an avatar URL based on the user's name and email
 * @param {string} name
 * @param {string} [seed]
 * @param {'male' | 'female' | null} [genderOverride]
 * @returns {string} avatar image URL
 */
export const getUserAvatar = (name, seed = '', genderOverride = null) => {
  if (name && typeof name === 'string' && (name.startsWith('http') || name.startsWith('data:image'))) {
    return name;
  }

  const gender = genderOverride || detectGenderFromName(name, seed);
  const avatarList = gender === 'female' ? FEMALE_AVATARS : MALE_AVATARS;

  // Simple string hash for consistent portrait index per user
  const source = `${(name || '').trim().toLowerCase()}_${(seed || '').trim().toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % avatarList.length;
  return avatarList[index];
};

/**
 * Returns the effective avatar for a user.
 * Unconditionally respects user-uploaded or user-chosen avatars.
 * @param {object|string} user
 * @returns {string} avatar image URL
 */
export const getEffectiveUserAvatar = (user) => {
  if (!user) return DEFAULT_AVATAR;

  if (typeof user === 'string') {
    if (user.startsWith('http') || user.startsWith('data:image')) {
      return user;
    }
    return getUserAvatar(user);
  }

  if (user.avatar) {
    return user.avatar;
  }

  const name = user.name || user.email || 'User';
  const email = user.email || '';
  return getUserAvatar(name, email);
};
