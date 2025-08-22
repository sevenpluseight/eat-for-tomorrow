function getRandomStat (min= -2, max = 2) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const days = [
  {
    day: 1,
    title: "Morning Fuel ☀️",
    question: "You wake up starving. The first meal sets the vibe - what's your pick?",
    choices: [
      {
        emoji: "🍩",
        label: "Donut",
        description: "Sugar rush now, crash later.",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🥬",
        label: "Kale Smoothie",
        description: "Feels like drinking grass... but healthy.",
        health: +1,
        wallet: -1,
        env: +1
      },
      {
        emoji: "☕",
        label: "Coffee Only",
        description: "Fuel of champions... or zombies.",
        health: -1,
        wallet: +1,
        env: 0
      },
      {
        emoji: "🥯",
        label: "Bagel with Local Jam",
        description: "Simple, cozy, framer-approved!",
        health: +1,
        wallet: -1,
        env: +1
      }
    ]
  },
  {
    day: 2,
    title: "Lunch Break 🍽️",
    question: "Lunchtime hunger hits. Your stomach growls like a Pokémon.",
    choices: [
      {
        emoji: "🍔",
        label: "Greasy Burger",
        description: "The classic guilty pleasure.",
        health: -1,
        wallet: +1,
        env:-1
      },
      {
        emoji: "🥪",
        label: "Homemade Sandwich",
        description: "Made with love (and leftovers).",
        health: +1,
        wallet: +1,
        env: 0
      },
      {
        emoji: "🍜",
        label: "Instant Noodles",
        description: "Quick, salty, and suspiciously addictive.",
        health: -1,
        wallet: +1,
        env: 0
      },
      {
        emoji: "🌯",
        label: "Veggie Wrap",
        description: "Healthy, filling, and Instagrammable.",
        health: +1,
        wallet: -1,
        env: +1
      }
    ]
  },
  {
    day: 3,
    title: "Grocery Run 🛒",
    question: "You're at the store. The cart is rolling. What fills it?",
    choices: [
      {
        emoji: "🥫",
        label: "20 cans of beans",
        description: "Survival mode: activated.",
        health: 0,
        wallet: +1,
        env: 0
      },
      {
        emoji: "🥩",
        label: "Giant Meat Slab",
        description: "Carnivore's dream, planet's nightmare.",
        health: 0,
        wallet: -1,
        env: -1
      },
      {
        emoji: "🥕",
        label: "Farmer's Market Veggies",
        description: "Fresh, local, and overpriced.",
        health: +1,
        wallet: -1,
        env: +1
      },
      {
        emoji: "🍪",
        label: "Family Pack of Cookies",
        description: "Because who can resist?",
        health: -1,
        wallet: +1,
        env: 0
      }
    ]
  },
  {
    day: 4,
    title: "Late Night Munchies 🌙",
    question: "Midnight snack attack! What do you reach for?",
    choices: [
      {
        emoji: "🍕",
        label: "Cold Pizza",
        description: "The breakfast of champions?",
        health: -1,
        wallet: 0,
        env: -1
      },
      {
        emoji: "🍎",
        label: "Apple",
        description: "An apple a day... keeps the cravings at bay.",
        health: +1,
        wallet: 0,
        env: +1
      },
      {
        emoji: "🍫",
        label: "Chocolate Bar",
        description: "Sweet, sweet comfort.",
        health: -1,
        wallet: +1,
        env: 0
      },
      {
        emoji: "❓",
        label: "Mystery Leftovers",
        description: "Could be curry... or doom...",
        health: () => getRandomStat(-2,2),
        wallet: () => getRandomStat(-2,2),
        env: () => getRandomStat(-2,2)
      }
    ]
  },
  {
    day: 5,
    title: "Thirst Quest 🥵",
    question: "You're thirsty. Drinking water is a choice, but your lifestyle is also... a problem.",
    choices: [
      {
        emoji: "🥤",
        label: "Soda Can",
        description: "Fizzy, sugary, and oh-so-refreshing.",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "💧",
        label: "Reusable Bottle of Water",
        description: "Saves the planet, boring but elite choice.",
        health: +1,
        wallet: 0,
        env: +1
      },
      {
        emoji: "🍵",
        label: "Green Tea",
        description: "Zen vibes, antioxidants, and a hint of bitterness.",
        health: +1,
        wallet: -1,
        env: 0
      },
      {
        emoji: "🧋",
        label: "Fancy Smoothie",
        description: "Costs more than rent... at least you're happy.",
        health: +1,
        wallet: -2,
        env: 0
      }
    ]
  },
  {
    day: 6,
    title: "Beach Picnic 🏖️",
    question: "You packed for a chill beach day. The seagulls are already eyeing your food.",
    choices: [
      {
        emoji: "🍟",
        label: "Fries + Ketchup Packets",
        description: "Classic beach snack, instantly stolen by seagulls.",
        health: -1,
        wallet: -1,
        env: -1
      },
      {
        emoji: "🥗",
        label: "Quinoa Salad",
        description: "Trendy and eco-friendly!",
        health: +1,
        wallet: -1,
        env: +1
      },
      {
        emoji: "🌭",
        label: "Hotdog",
        description: "A beach staple, but at what cost?",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🍉",
        label: "Watermelon Slices",
        description: "Summer perfection!",
        health: +1,
        wallet: +1,
        env: +1
      }
    ]
  },
  {
    day: 7,
    title: "Gaming Marathon Snack 🎮",
    question: "You're 5 hours into a game. Hunger strikes during boss fight loading screen.",
    choices: [
      {
        emoji: "🍕",
        label: "Leftover Pizza",
        description: "Still edible?",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🍏",
        label: "Apple",
        description: "Healthy, crunchy, and keeps the doctor away.",
        health: +1,
        wallet: 0,
        env: +1
      },
      {
        emoji: "🍪",
        label: "Cookies",
        description: "Sweet XP boost.",
        health: -1,
        wallet: +1,
        env: 0
      },
      {
        emoji: "🥜",
        label: "Mixed Nuts",
        description: "Protein-packed, but watch out for allergies!",
        health: +1,
        wallet: -1,
        env: +1
      }
    ]
  },
  {
    day: 8,
    title: "Road Trip Gas Station Stop ⛽",
    question: "You're at a dusty gas station shop. The choices are... questionable.",
    choices: [
      {
        emoji: "🍬",
        label: "Candy Bar",
        description: "Car sugar rush.",
        health: -1,
        wallet: +1,
        env: 0
      },
      {
        emoji: "🥙",
        label: "Pre-packed Sandwich",
        description: "Looks like it survived the apocalypse.",
        health: +1,
        wallet: 0,
        env: +1
      },
      {
        emoji: "🧃",
        label: "Big Gulp Soda",
        description: "Hydration? Nope.",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🍌",
        label: "Banana",
        description: "Nature's power bar, but watch out for bruises.",
        health: +1,
        wallet: 0,
        env: +1
      }
    ]
  },
  {
    day: 9,
    title: "Birthday Party 🎉",
    question: "Cake everywhere. Everyone's yelling \"EAT!\" What's your move?",
    choices: [
      {
        emoji: "🍰",
        label: "Giant Cake Slice",
        description: "Sugar overload, but it's a party!",
        health: -1,
        wallet: 0,
        env: -1
      },
      {
        emoji: "🍇",
        label: "Fruit Platter",
        description: "Quiet hero of the party.",
        health: +1,
        wallet: 0,
        env: +1
      },
      {
        emoji: "🍕",
        label: "Pizza Slice",
        description: "The party staple, but at what cost?",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🥗",
        label: "Salad Nobody Wants",
        description: "You legend.",
        health: +1,
        wallet: -1,
        env: +1
      }
    ]
  },
  {
    day: 10,
    title: "Lazy Sunday Brunch 🛌",
    question: "You refuse to get out of pajamas. What's for brunch?",
    choices: [
      {
        emoji: "🥞",
        label: "Pancakes with Syrup",
        description: "Fluffy, sweet, and syrupy goodness.",
        health: -1,
        wallet: -1,
        env: 0
      },
      {
        emoji: "🍳",
        label: "Eggs & Veggie Omelet",
        description: "Healthy, filling, and makes you feel like a chef.",
        health: +1,
        wallet: -1,
        env: +1
      },
      {
        emoji: "🍔",
        label: "Double Cheeseburger",
        description: "Who eats this at 11am? You do!",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🥐",
        label: "Coffee & Croissant",
        description: "Simple, elegant, and French-approved.",
        health: 0,
        wallet: -1,
        env: 0
      }
    ]
  },
  {
    day: 11,
    title: "Cafeteria Chaos 🍱",
    question: "The line is long, food smells... mysterious. What do you choose?",
    choices: [
      {
        emoji: "🍟",
        label: "Fries & Nuggets",
        description: "Classic combo, greasy but fast.",
        health: -2,
        wallet: -1,
        env: -1
      },
      {
        emoji: "🥗",
        label: "Salad Bar",
        description: "Lettuce be friends.",
        health: +1,
        wallet: -1,
        env: +1
      },
      {
        emoji: "🍕",
        label: "Pizza Slice",
        description: "The cafeteria staple, always questionable.",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🥪",
        label: "Sandwich",
        description: "A safe bet, but can be boring.",
        health: +1,
        wallet: 0,
        env: 0
      }
    ]
  },
  {
    day: 12,
    title: "Street Food Festival 🎪",
    question: "Rows of sizzling stalls. The smell of grilled food fills the air. What do you pick?",
    choices: [
      {
        emoji: "🌭",
        label: "Corn Dog",
        description: "A classic, but is it really corn?",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🥟",
        label: "Veggie Dumplings",
        description: "Steamed goodness, but are they fresh?",
        health: +1,
        wallet: -1,
        env: +1
      },
      {
        emoji: "🌮",
        label: "Spicy Taco",
        description: "Spicy, messy, and oh-so-delicious.",
        health: -1,
        wallet: -1,
        env: -1
      },
      {
        emoji: "🍢",
        label: "Mystery Skewer",
        description: "Could be meat, could be tofu... who knows?",
        health: () => getRandomStat(-2,2),
        wallet: () => getRandomStat(-2,2),
        env: () => getRandomStat(-2,2)
      }
    ]
  },
  {
    day: 13,
    title: "Work Stress Snack 🖥️",
    question: "Deadline tomorrow. Stress = hunger. What's in your hand?",
    choices: [
      {
        emoji: "🍫",
        label: "Chocolate",
        description: "Sweet stress relief, therapy in a wrapper.",
        health: -1,
        wallet: +1,
        env: 0
      },
      {
        emoji: "🥛",
        label: "Milk",
        description: "Classic comfort drink, but does it really help?",
        health: +1,
        wallet: 0,
        env: 0
      },
      {
        emoji: "🍟",
        label: "Fries",
        description: "Crispy, salty, and oh-so-satisfying.",
        health: -1,
        wallet: +1,
        env: -1
      },
      {
        emoji: "🥒",
        label: "Cucumber Sticks",
        description: "The crunch of discipline.",
        health: +1,
        wallet: -1,
        env: +1
      }
    ]
  },
  {
    day: 14,
    title: "Final Feast 🎊",
    question: "The journey ends. One last choice before the story closes.",
    choices: [
      {
        emoji: "🍔",
        label: "Mega Burger Combo",
        description: "The ultimate indulgence, but at what cost?",
        health: -2, 
        wallet: +2,
        env: -2
      },
      {
        emoji: "🥗",
        label: "Seasonal Local Salad",
        description: "Fresh, healthy, and a bit pricey. Sustainable finale.",
        health: +2,
        wallet: -1,
        env: +2
      },
      {
        emoji: "🍣",
        label: "Sushi Roll",
        description: "A taste of the sea, fresh and fancy.",
        health: +1,
        wallet: -2,
        env: 0
      },
      {
        emoji: "🎂",
        label: "Whole Cake",
        description: "Yes... the whole cake. Because why not?",
        health: -2,
        wallet: +1,
        env: 0
      }
    ]
  },
]  