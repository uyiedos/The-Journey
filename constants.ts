import { LevelConfig, GameModeConfig, Achievement, Badge, BiblePlan } from './types';

// Player Level Thresholds
export const PLAYER_LEVELS = [
  { level: 1, xp: 0, title: "Wanderer" },
  { level: 2, xp: 500, title: "Seeker" },
  { level: 3, xp: 1500, title: "Disciple" },
  { level: 4, xp: 3000, title: "Scribe" },
  { level: 5, xp: 5000, title: "Guardian" },
  { level: 6, xp: 8000, title: "Saint" },
  { level: 7, xp: 12000, title: "Prophet" },
  { level: 8, xp: 20000, title: "Patriarch" },
];

export const BADGES: Badge[] = [
  { id: 'early_riser', name: 'Early Riser', icon: '🌅', description: 'Logged in 7 days in a row' },
  { id: 'scholar', name: 'Scholar', icon: '📜', description: 'Read 10 Bible chapters' },
  { id: 'slayer', name: 'Giant Slayer', icon: '⚔️', description: 'Completed David Campaign' },
  { id: 'prayer', name: 'Prayer Warrior', icon: '🙏', description: 'Collected 20 Verses' },
  { id: 'beta', name: 'Founder', icon: '💎', description: 'Joined during Dev Net' },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first level.',
    icon: '🦶',
    xpReward: 100
  },
  {
    id: 'prayer_warrior',
    title: 'Prayer Warrior',
    description: 'Collect 5 scripture verses.',
    icon: '🙏',
    xpReward: 300
  },
  {
    id: 'devoted',
    title: 'Devoted',
    description: 'Read a daily devotional.',
    icon: '📖',
    xpReward: 50
  },
  {
    id: 'socialite',
    title: 'Fellowship',
    description: 'Participate in Journey TV chat.',
    icon: '💬',
    xpReward: 50
  },
  {
    id: 'high_score',
    title: 'Legend',
    description: 'Reach 1000 total points.',
    icon: '🏆',
    xpReward: 500
  },
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Open the Bible Reader.',
    icon: '📜',
    xpReward: 50
  }
];

// Enhanced Default Plans with Content
export const DEFAULT_PLANS: BiblePlan[] = [
  {
    id: 'gospel_30',
    title: "The Messiah's Footsteps",
    desc: "A 30-day chronological journey through the Gospels, focusing on the miracles and parables of Jesus.",
    category: 'Study',
    image: "https://image.pollinations.ai/prompt/pixel%20art%20jesus%20walking%20on%20water%20sea%20of%20galilee%20storm?width=400&height=250&nologo=true",
    duration: 30,
    progress: 0,
    isActive: false,
    days: [
      { 
        day: 1, 
        reading: "John 1:1-18", 
        topic: "The Word Made Flesh",
        content: "In the beginning was the Word. Before the miracles, before the parables, there was the eternal existence of Christ. Today, meditate on the divinity of Jesus. He is not just a teacher; He is God breaking into our reality."
      },
      { 
        day: 2, 
        reading: "Luke 1:5-25", 
        topic: "Gabriel's Announcement",
        content: "Silence is broken. After 400 years of prophetic silence, an angel appears. God often moves in the quiet places of our lives before the public miracles begin."
      },
      { 
        day: 3, 
        reading: "Matthew 1:18-25", 
        topic: "The Birth of Jesus",
        content: "Emmanuel, God with us. The scandal of the virgin birth reminds us that God's plans often defy human reputation and logic. Trust Him when things don't make sense."
      }
    ]
  },
  {
    id: 'psalms_peace',
    title: "Songs of the Valley",
    desc: "Finding deep peace and emotional regulation through the Psalms during difficult seasons.",
    category: 'Devotional',
    image: "https://image.pollinations.ai/prompt/pixel%20art%20shepherd%20playing%20harp%20green%20pastures%20peaceful%20stream?width=400&height=250&nologo=true",
    duration: 7,
    progress: 0,
    isActive: false,
    days: [
        { 
          day: 1, 
          reading: "Psalm 23", 
          topic: "The Lord is my Shepherd",
          content: "You shall not want. In a world of constant craving, the Shepherd offers contentment. He makes you lie down in green pastures—sometimes He rests us before we know we need it."
        },
        { 
          day: 2, 
          reading: "Psalm 91", 
          topic: "The Shelter of the Most High",
          content: "He will cover you with his feathers. The image is one of a mother bird protecting her young. You are safe under the shadow of the Almighty. Fear has no place here."
        },
        { 
          day: 3, 
          reading: "Psalm 42", 
          topic: "Thirsting for God",
          content: "As the deer pants for streams of water. Is your soul thirsty today? Do not try to quench it with the world's salt water. Go to the source of life."
        }
    ]
  },
  {
    id: 'wisdom_kings',
    title: "The Crown of Wisdom",
    desc: "Practical leadership and life lessons from Proverbs and Ecclesiastes.",
    category: 'Topical',
    image: "https://image.pollinations.ai/prompt/pixel%20art%20king%20solomon%20throne%20gold%20temple?width=400&height=250&nologo=true",
    duration: 21,
    progress: 0,
    isActive: false,
    days: [
        { day: 1, reading: "Proverbs 1", topic: "The Beginning of Knowledge", content: "The fear of the Lord is the beginning. Not terror, but awe. Do you stand in awe of God today?" },
        { day: 2, reading: "Ecclesiastes 3", topic: "A Time for Everything", content: "To everything there is a season. Are you trying to harvest in a season of planting? Trust God's timing." }
    ]
  },
  {
    id: 'armor_god',
    title: "Spiritual Warfare",
    desc: "Equipping yourself daily with the Armor of God. A study on Ephesians.",
    category: 'Study',
    image: "https://image.pollinations.ai/prompt/pixel%20art%20shining%20knight%20armor%20sword%20spirit%20shield%20faith?width=400&height=250&nologo=true",
    duration: 14,
    progress: 0,
    isActive: false,
    days: [
        { day: 1, reading: "Ephesians 6:10-18", topic: "The Full Armor", content: "Stand firm. The armor is not just for defense, but to enable you to stand your ground when the day of evil comes." },
        { day: 2, reading: "2 Corinthians 10:3-5", topic: "Capturing Thoughts", content: "The battlefield is the mind. Take every thought captive. Does this thought obey Christ? If not, dismiss it." }
    ]
  }
];

// Avatars
export const AVATARS = [
  "https://image.pollinations.ai/prompt/pixel%20art%20avatar%20knight%20helmet?width=100&height=100&nologo=true",
  "https://image.pollinations.ai/prompt/pixel%20art%20avatar%20monk%20hood?width=100&height=100&nologo=true",
  "https://image.pollinations.ai/prompt/pixel%20art%20avatar%20female%20warrior%20bible?width=100&height=100&nologo=true",
  "https://image.pollinations.ai/prompt/pixel%20art%20avatar%20shepherd?width=100&height=100&nologo=true",
  "https://image.pollinations.ai/prompt/pixel%20art%20avatar%20angel%20halo?width=100&height=100&nologo=true",
  "https://image.pollinations.ai/prompt/pixel%20art%20avatar%20king%20crown?width=100&height=100&nologo=true"
];

// Mock Chat Messages for TV
export const MOCK_CHAT_MESSAGES = [
  "Amen!", "Such a powerful word.", "Listening from Brazil 🇧🇷", "God is good all the time.", "Praying for everyone here.", "Hallelujah!", "Peace be with you."
];

// 8x8 Pixel art patterns
const HEART_PATTERN = [
  [0,0,0,0,0,0,0,0],
  [0,1,1,0,0,1,1,0],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,0,1,1,0,0,0],
];

const SWORD_PATTERN = [
  [0,0,0,0,0,1,1,0],
  [0,0,0,0,1,1,2,1],
  [0,0,0,1,1,2,1,1],
  [0,0,1,1,2,1,0,0],
  [0,1,1,2,1,0,0,0],
  [0,1,2,1,0,0,0,0],
  [1,3,1,0,0,0,0,0],
  [3,1,0,0,0,0,0,0],
];

const COIN_PATTERN = [
  [0,0,1,1,1,1,0,0],
  [0,1,2,2,2,2,1,0],
  [1,2,1,1,1,1,2,1],
  [1,2,1,2,2,1,2,1],
  [1,2,1,2,2,1,2,1],
  [1,2,1,1,1,1,2,1],
  [0,1,2,2,2,2,1,0],
  [0,0,1,1,1,1,0,0],
];

const MOUTH_PATTERN = [
  [0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,2,2,2,2,0,1],
  [1,0,0,0,0,0,0,1],
  [0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0],
];

const CLOUD_PATTERN = [
  [0,0,0,0,0,0,0,0],
  [0,0,1,1,1,0,0,0],
  [0,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0],
];

const FIRE_PATTERN = [
  [0,0,0,2,2,0,0,0],
  [0,0,2,2,1,2,0,0],
  [0,2,1,1,1,1,2,0],
  [2,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,2],
  [1,2,1,1,1,1,2,1],
  [0,1,2,2,2,2,1,0],
  [0,0,1,1,1,1,0,0],
];

const CHAINS_PATTERN = [
  [1,1,0,0,0,0,1,1],
  [1,0,1,0,0,1,0,1],
  [0,1,0,1,1,0,1,0],
  [0,0,1,0,0,1,0,0],
  [0,1,0,1,1,0,1,0],
  [1,0,1,0,0,1,0,1],
  [1,1,0,0,0,0,1,1],
  [0,0,0,0,0,0,0,0],
];

const MASK_PATTERN = [
  [0,0,1,1,1,1,0,0],
  [0,1,2,2,2,2,1,0],
  [1,2,3,2,2,3,2,1],
  [1,2,2,2,2,2,2,1],
  [1,2,2,0,0,2,2,1],
  [0,1,2,2,2,2,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0],
];

const CROSS_PATTERN = [
  [0,0,0,1,1,0,0,0],
  [0,0,0,1,1,0,0,0],
  [0,0,0,2,2,0,0,0],
  [1,1,1,2,2,1,1,1],
  [0,0,0,2,2,0,0,0],
  [0,0,0,1,1,0,0,0],
  [0,0,0,1,1,0,0,0],
  [0,0,0,1,1,0,0,0],
];

const CROWN_PATTERN = [
  [1,0,1,0,1,0,1,0],
  [1,1,1,1,1,1,1,0],
  [1,1,2,1,2,1,1,0],
  [1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
];

const SHIP_PATTERN = [
  [0,0,1,0,0,0,0,0],
  [0,0,1,1,0,0,0,0],
  [0,0,1,1,1,0,0,0],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0],
  [1,0,1,0,1,0,1,0],
];

// --- LEVEL SETS ---

export const PILGRIM_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "The Grey Cave",
    sin: "Apathy (Limbo)",
    virtue: "Hope",
    description: "A foggy, colorless cave where a prophet sits in silence.",
    colorTheme: "bg-gray-500",
    accentColor: "bg-gray-300",
    gridPattern: CLOUD_PATTERN,
    bibleContext: {
        storyTitle: "The Whispers at Horeb",
        reference: "1 Kings 19:11-13",
        character: "Elijah",
        narrativeIntro: "You stand beside Elijah at the mouth of the cave. He believes he is the only faithful one left. The wind howls.",
        keyVerse: "And after the fire came a gentle whisper. (1 Kings 19:12)",
        prayerFocus: "Pray for the ability to hear God's small voice."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20foggy%20mountain%20cave%20entrance%20stormy%20grey%20sky%20mysterious%20bible%20scene?width=800&height=600&nologo=true&seed=1",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20prophet%20elijah%20old%20bearded%20sad%20robes?width=400&height=400&nologo=true&seed=1"
    }
  },
  {
    id: 2,
    name: "The Palace Roof",
    sin: "Lust",
    virtue: "Self-Control",
    description: "A warm, breezy rooftop at twilight.",
    colorTheme: "bg-pink-600",
    accentColor: "bg-purple-400",
    gridPattern: HEART_PATTERN,
    bibleContext: {
        storyTitle: "The King's Gaze",
        reference: "2 Samuel 11",
        character: "David",
        narrativeIntro: "King David paces the roof. His armies are at war, but he is here, idle.",
        keyVerse: "Create in me a pure heart, O God. (Psalm 51:10)",
        prayerFocus: "Pray for eyes that look to God rather than fleeting desires."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20ancient%20jerusalem%20palace%20rooftop%20sunset%20twilight%20beautiful%20view?width=800&height=600&nologo=true&seed=2",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20king%20david%20royal%20robes%20crown%20contemplative?width=400&height=400&nologo=true&seed=2"
    }
  },
  {
    id: 3,
    name: "The Lentil Field",
    sin: "Gluttony",
    virtue: "Temperance",
    description: "A muddy field smelling of earth and stew.",
    colorTheme: "bg-yellow-700",
    accentColor: "bg-yellow-900",
    gridPattern: MOUTH_PATTERN,
    bibleContext: {
        storyTitle: "The Birthright Trade",
        reference: "Genesis 25",
        character: "Esau",
        narrativeIntro: "Esau returns from the hunt, famished. He sees a bowl of red stew.",
        keyVerse: "Man shall not live on bread alone. (Matthew 4:4)",
        prayerFocus: "Pray for the strength to value the eternal over the temporary."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20rustic%20tent%20interior%20bowl%20of%20red%20stew%20steaming%20cozy?width=800&height=600&nologo=true&seed=3",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20esau%20hunter%20wild%20red%20hair%20hungry?width=400&height=400&nologo=true&seed=3"
    }
  },
  {
    id: 4,
    name: "The Dusty Road",
    sin: "Greed",
    virtue: "Charity",
    description: "A marketplace cluttered with possessions.",
    colorTheme: "bg-yellow-500",
    accentColor: "bg-yellow-300",
    gridPattern: COIN_PATTERN,
    bibleContext: {
        storyTitle: "The Rich Young Ruler",
        reference: "Mark 10",
        character: "The Young Ruler",
        narrativeIntro: "A wealthy young man approaches Jesus. His hands are too full of gold.",
        keyVerse: "It is easier for a camel to go through the eye of a needle. (Mark 10:25)",
        prayerFocus: "Pray for a heart that holds possessions loosely."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20ancient%20market%20dusty%20road%20middle%20east%20bags%20of%20gold%20sunlight?width=800&height=600&nologo=true&seed=4",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20rich%20young%20man%20fine%20clothes%20sad%20jewelry?width=400&height=400&nologo=true&seed=4"
    }
  },
  {
    id: 5,
    name: "The Field of Blood",
    sin: "Wrath",
    virtue: "Patience",
    description: "A rocky field where the ground cries out.",
    colorTheme: "bg-red-700",
    accentColor: "bg-red-500",
    gridPattern: FIRE_PATTERN,
    bibleContext: {
        storyTitle: "The First Murder",
        reference: "Genesis 4",
        character: "Cain",
        narrativeIntro: "Cain's countenance has fallen. Jealousy burns in his chest.",
        keyVerse: "Refrain from anger and turn from wrath. (Psalm 37:8)",
        prayerFocus: "Pray for the grace to master anger."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20desolate%20farm%20field%20rocky%20ground%20dark%20clouds%20ancient?width=800&height=600&nologo=true&seed=5",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20cain%20bible%20angry%20jealous%20farmer?width=400&height=400&nologo=true&seed=5"
    }
  },
  {
    id: 6,
    name: "The Locked Room",
    sin: "Heresy (Unbelief)",
    virtue: "Faithfulness",
    description: "A dark room with the doors bolted shut.",
    colorTheme: "bg-indigo-800",
    accentColor: "bg-indigo-600",
    gridPattern: CHAINS_PATTERN,
    bibleContext: {
        storyTitle: "The Doubter",
        reference: "John 20",
        character: "Thomas",
        narrativeIntro: "Thomas sits in the corner. 'Unless I see the nail marks... I will not believe.'",
        keyVerse: "Blessed are those who have not seen and yet have believed. (John 20:29)",
        prayerFocus: "Pray for faith when you cannot see."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20ancient%20room%20locked%20heavy%20door%20candle%20light%20shadows%20mystery?width=800&height=600&nologo=true&seed=6",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20apostle%20thomas%20doubting%20skeptical%20beard%20robe?width=400&height=400&nologo=true&seed=6"
    }
  },
  {
    id: 7,
    name: "The Garden Night",
    sin: "Violence",
    virtue: "Peace",
    description: "A garden at night, shadowed by olive trees.",
    colorTheme: "bg-green-900",
    accentColor: "bg-red-800",
    gridPattern: SWORD_PATTERN,
    bibleContext: {
        storyTitle: "The Sword Strike",
        reference: "Matthew 26",
        character: "Peter",
        narrativeIntro: "Soldiers approach. Peter draws his sword in fear.",
        keyVerse: "Put your sword back in its place. (Matthew 26:52)",
        prayerFocus: "Pray to be a peacemaker."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20garden%20of%20gethsemane%20night%20olive%20trees%20torches%20in%20distance?width=800&height=600&nologo=true&seed=7",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20apostle%20peter%20holding%20sword%20fierce%20protective?width=400&height=400&nologo=true&seed=7"
    }
  },
  {
    id: 8,
    name: "The Tent of Deceit",
    sin: "Fraud",
    virtue: "Truth",
    description: "A dimly lit tent filled with disguises.",
    colorTheme: "bg-purple-800",
    accentColor: "bg-purple-600",
    gridPattern: MASK_PATTERN,
    bibleContext: {
        storyTitle: "The Stolen Blessing",
        reference: "Genesis 27",
        character: "Jacob",
        narrativeIntro: "Jacob prepares to deceive his blind father for a blessing.",
        keyVerse: "The Lord detests lying lips. (Proverbs 12:22)",
        prayerFocus: "Pray for integrity."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20inside%20nomad%20tent%20ancient%20near%20east%20rugs%20dim%20light?width=800&height=600&nologo=true&seed=8",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20jacob%20bible%20young%20sneaky%20look%20sheepskin?width=400&height=400&nologo=true&seed=8"
    }
  },
  {
    id: 9,
    name: "The Courtyard",
    sin: "Treachery",
    virtue: "Loyalty",
    description: "A cold courtyard with a charcoal fire.",
    colorTheme: "bg-blue-900",
    accentColor: "bg-blue-400",
    gridPattern: CROSS_PATTERN,
    bibleContext: {
        storyTitle: "The Denial",
        reference: "Luke 22",
        character: "Peter",
        narrativeIntro: "Peter warms his hands. A servant girl asks if he knows Jesus.",
        keyVerse: "Lord, you know all things; you know that I love you. (John 21:17)",
        prayerFocus: "Pray for loyalty to Christ."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20stone%20courtyard%20night%20charcoal%20fire%20burning%20embers%20cold?width=800&height=600&nologo=true&seed=9",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20peter%20apostle%20weeping%20sad%20by%20fire%20night?width=400&height=400&nologo=true&seed=9"
    }
  }
];

export const DAVID_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "The Sheep Pasture",
    sin: "Fear",
    virtue: "Courage",
    description: "Green pastures where dangers lurk in the shadows.",
    colorTheme: "bg-green-600",
    accentColor: "bg-green-400",
    gridPattern: CLOUD_PATTERN,
    bibleContext: {
      storyTitle: "The Lion and the Bear",
      reference: "1 Samuel 17:34-37",
      character: "Young David",
      narrativeIntro: "You are alone with the sheep. A shadow moves in the brush. A lion crouches, ready to strike the flock. Panic rises.",
      keyVerse: "The Lord who rescued me from the paw of the lion... will rescue me. (1 Samuel 17:37)",
      prayerFocus: "Pray for courage to face the private battles no one else sees."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20ancient%20israel%20pasture%20hills%20sheep%20peaceful%20day?width=800&height=600&nologo=true&seed=10",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20young%20david%20shepherd%20sling%20boy?width=400&height=400&nologo=true&seed=10"
    }
  },
  {
    id: 2,
    name: "Valley of Elah",
    sin: "Doubt",
    virtue: "Faith",
    description: "The valley where two armies stand frozen in fear.",
    colorTheme: "bg-yellow-600",
    accentColor: "bg-yellow-400",
    gridPattern: SWORD_PATTERN,
    bibleContext: {
      storyTitle: "Facing the Giant",
      reference: "1 Samuel 17",
      character: "David",
      narrativeIntro: "Goliath shouts blasphemies against God. The soldiers of Israel tremble. You hold only a sling and five stones.",
      keyVerse: "The battle is the Lord's. (1 Samuel 17:47)",
      prayerFocus: "Pray for faith that sees God as bigger than your giants."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20valley%20of%20elah%20armies%20tents%20dry%20ground%20bright%20sun?width=800&height=600&nologo=true&seed=11",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20goliath%20giant%20armor%20fearsome?width=400&height=400&nologo=true&seed=11"
    }
  },
  {
    id: 3,
    name: "Cave of Adullam",
    sin: "Vengeance",
    virtue: "Mercy",
    description: "A dark cave where the anointed king hides like a criminal.",
    colorTheme: "bg-stone-600",
    accentColor: "bg-stone-400",
    gridPattern: CROWN_PATTERN,
    bibleContext: {
      storyTitle: "Cutting the Robe",
      reference: "1 Samuel 24",
      character: "David",
      narrativeIntro: "King Saul, who wants to kill you, enters the cave alone to relieve himself. Your men whisper, 'Kill him now!'",
      keyVerse: "I will not lay my hand on my lord, because he is the Lord's anointed. (1 Samuel 24:10)",
      prayerFocus: "Pray for the strength to show mercy to those who hurt you."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20dark%20cave%20interior%20hiding%20rocks%20torchlight?width=800&height=600&nologo=true&seed=12",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20king%20saul%20mad%20king%20paranoia%20cave?width=400&height=400&nologo=true&seed=12"
    }
  }
];

export const PAUL_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Road to Damascus",
    sin: "Pride",
    virtue: "Surrender",
    description: "A blinding light on a dusty highway.",
    colorTheme: "bg-yellow-200",
    accentColor: "bg-white",
    gridPattern: CLOUD_PATTERN,
    bibleContext: {
      storyTitle: "The Great Light",
      reference: "Acts 9",
      character: "Saul of Tarsus",
      narrativeIntro: "You ride with authority, breathing murderous threats against Christians. Suddenly, a light from heaven flashes around you.",
      keyVerse: "Lord, what do You want me to do? (Acts 9:6)",
      prayerFocus: "Pray for the humility to surrender your plans to God."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20desert%20road%20blinding%20light%20noon%20sun%20rays?width=800&height=600&nologo=true&seed=13",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20saul%20of%20tarsus%20blinded%20falling%20horse?width=400&height=400&nologo=true&seed=13"
    }
  },
  {
    id: 2,
    name: "Philippian Jail",
    sin: "Despair",
    virtue: "Joy",
    description: "A deep, dark dungeon at midnight.",
    colorTheme: "bg-slate-800",
    accentColor: "bg-slate-600",
    gridPattern: CHAINS_PATTERN,
    bibleContext: {
      storyTitle: "Midnight Praise",
      reference: "Acts 16",
      character: "Paul",
      narrativeIntro: "You are beaten, bleeding, and locked in stocks for doing good. It is midnight. The darkness whispers hopelessness.",
      keyVerse: "Rejoice in the Lord always. (Philippians 4:4)",
      prayerFocus: "Pray for joy that is not dependent on your circumstances."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20ancient%20dungeon%20jail%20cell%20midnight%20chains?width=800&height=600&nologo=true&seed=14",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20paul%20apostle%20singing%20in%20chains?width=400&height=400&nologo=true&seed=14"
    }
  },
  {
    id: 3,
    name: "The Stormy Sea",
    sin: "Panic",
    virtue: "Trust",
    description: "A wooden ship tossing in a violent tempest.",
    colorTheme: "bg-blue-800",
    accentColor: "bg-blue-600",
    gridPattern: SHIP_PATTERN,
    bibleContext: {
      storyTitle: "The Shipwreck",
      reference: "Acts 27",
      character: "Paul",
      narrativeIntro: "The storm has raged for days. Neither sun nor stars have appeared. All hope of being saved is given up.",
      keyVerse: "Keep up your courage, for I have faith in God that it will happen just as he told me. (Acts 27:25)",
      prayerFocus: "Pray for trust in the middle of life's storms."
    },
    images: {
      landscape: "https://image.pollinations.ai/prompt/pixel%20art%20stormy%20ocean%20wooden%20ship%20waves%20crashing%20dark?width=800&height=600&nologo=true&seed=15",
      character: "https://image.pollinations.ai/prompt/pixel%20art%20portrait%20paul%20apostle%20calm%20on%20boat%20rain?width=400&height=400&nologo=true&seed=15"
    }
  }
];

// Aggregate all levels for lookup
export const LEVELS: LevelConfig[] = [...PILGRIM_LEVELS, ...DAVID_LEVELS, ...PAUL_LEVELS];

// Configuration for game modes
export const GAMES: GameModeConfig[] = [
  {
    id: 'pilgrim',
    title: "Pilgrim's Path",
    description: "The classic 9 circles journey. Overcome sin and find the light.",
    image: "https://image.pollinations.ai/prompt/pixel%20art%20dark%20forest%20path%20light%20at%20end?width=400&height=300&nologo=true",
    mapBackground: "https://image.pollinations.ai/prompt/pixel%20art%20dark%20dante%20inferno%20path%20forest?width=1080&height=720&nologo=true",
    levels: PILGRIM_LEVELS
  },
  {
    id: 'david',
    title: "David's Rise",
    description: "From Shepherd to King. Face giants and learn leadership.",
    image: "https://image.pollinations.ai/prompt/pixel%20art%20king%20david%20crown%20harp%20lion?width=400&height=300&nologo=true",
    mapBackground: "https://image.pollinations.ai/prompt/pixel%20art%20ancient%20israel%20map%20hills%20desert%20parchment?width=1080&height=720&nologo=true",
    levels: DAVID_LEVELS
  },
  {
    id: 'paul',
    title: "Paul's Mission",
    description: "Travel the ancient world. Spread the gospel despite persecution.",
    image: "https://image.pollinations.ai/prompt/pixel%20art%20ancient%20ship%20map%20mediterranean%20scroll?width=400&height=300&nologo=true",
    mapBackground: "https://image.pollinations.ai/prompt/pixel%20art%20ancient%20mediterranean%20map%20sea%20travel?width=1080&height=720&nologo=true",
    levels: PAUL_LEVELS
  }
];

export const BIBLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", 
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", 
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", 
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", 
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", 
  "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", 
  "Mark", "Luke", "John", "Acts", "Romans", 
  "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", 
  "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", 
  "Titus", "Philemon", "Hebrews", "James", "1 Peter", 
  "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];
