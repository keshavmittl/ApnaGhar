// ─────────────────────────────────────────────────────────────
// Apna Ghar — demo seed script
//
// Populates the database with sample users, listings (with full
// post details), saved/bought relationships and chats so the UI
// can be demoed end to end.
//
// Run from the `api` directory:
//   npx prisma db seed
//   # or, directly:
//   node prisma/seed.js
//
// The script is idempotent: it upserts the demo users, then
// removes and recreates all demo-owned data on every run.
// Records belonging to real (non-demo) users are left untouched.
// ─────────────────────────────────────────────────────────────

import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "apnaghar123";

// Demo accounts — all share the same password (DEMO_PASSWORD).
const demoUsers = [
  {
    username: "priya",
    email: "priya@apnaghar.demo",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    blurb: "Looking for a home for my family",
  },
  {
    username: "rahul",
    email: "rahul@apnaghar.demo",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    blurb: "Owner — Pune, Mumbai & Jaipur",
  },
  {
    username: "anjali",
    email: "anjali@apnaghar.demo",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    blurb: "Owner — Delhi & Kolkata",
  },
  {
    username: "vikram",
    email: "vikram@apnaghar.demo",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    blurb: "Owner — Bengaluru, Hyderabad & Pune",
  },
  {
    username: "amit",
    email: "amit@apnaghar.demo",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    blurb: "Looking to rent near work",
  },
];

const unsplash = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=60`;

// Reusable photo pool (exteriors + interiors).
const PHOTOS = {
  house1: [
    unsplash("photo-1580587771525-78b9dba3b914"),
    unsplash("photo-1600607687939-ce8a6c25118c"),
    unsplash("photo-1522708323590-d24dbb6b0267"),
    unsplash("photo-1493809842364-78817add7ffb"),
  ],
  house2: [
    unsplash("photo-1568605114967-8130f3a36994"),
    unsplash("photo-1600596542815-ffad4c1539a9"),
    unsplash("photo-1523217582562-09d0def993a6"),
  ],
  house3: [
    unsplash("photo-1570129477492-45c003edd2be"),
    unsplash("photo-1583608205776-bfd35f0d9f83"),
    unsplash("photo-1600210492486-724fe5c67fb0"),
    unsplash("photo-1600566753086-00f18fb6b3ea"),
  ],
  house4: [
    unsplash("photo-1512917774080-9991f1c4c750"),
    unsplash("photo-1600585154340-be6161a56a0c"),
    unsplash("photo-1600566753190-17f0baa2a6c3"),
  ],
  flat1: [
    unsplash("photo-1560448204-e02f11c3d0e2"),
    unsplash("photo-1502672260266-1c1ef2d93688"),
    unsplash("photo-1522708323590-d24dbb6b0267"),
  ],
  flat2: [
    unsplash("photo-1600047509807-ba8f99d2cdde"),
    unsplash("photo-1600607687939-ce8a6c25118c"),
    unsplash("photo-1523217582562-09d0def993a6"),
  ],
  flat3: [
    unsplash("photo-1493809842364-78817add7ffb"),
    unsplash("photo-1600210492486-724fe5c67fb0"),
    unsplash("photo-1600607687939-ce8a6c25118c"),
  ],
};

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

// ── Listings ────────────────────────────────────────────────
// availableFrom: null => ready now · future date => "coming soon" card
const postFixtures = [
  // Rahul — Pune (buy)
  {
    user: "rahul",
    title: "Sunny 3 BHK Family House in Kothrud",
    price: 14500000,
    images: PHOTOS.house1,
    address: "D.P. Road, Kothrud, Pune",
    city: "Pune",
    bedroom: 3,
    bathroom: 3,
    latitude: "18.5074",
    longitude: "73.8077",
    type: "buy",
    property: "house",
    availableFrom: null,
    detail: {
      desc: "A proper family home in the heart of Kothrud — 3 spacious bedrooms, a big balcony overlooking the gulmohar trees, and a puja room near the entrance. The society is gated with 24x7 security, power backup, and ample visitor parking. Schools, hospitals and the new metro station are all within walking distance. Ideal for a family looking to settle down in Pune.",
      utilities: "owner",
      pet: "allowed",
      income: "Not applicable — sale",
      size: 1850,
      school: 450,
      bus: 200,
      restaurant: 350,
    },
  },
  // Rahul — Mumbai (buy)
  {
    user: "rahul",
    title: "Modern 2 BHK Apartment with Balcony",
    price: 18500000,
    images: PHOTOS.flat1,
    address: "Veera Desai Road, Andheri West, Mumbai",
    city: "Mumbai",
    bedroom: 2,
    bathroom: 2,
    latitude: "19.1355",
    longitude: "72.8290",
    type: "buy",
    property: "apartment",
    availableFrom: null,
    detail: {
      desc: "High-floor 2 BHK in a modern tower facing the sea breeze. Floor-to-ceiling windows, modular kitchen, and a wide balcony perfect for Sunday chai. The building has a gym, swimming pool and children's play area. Close to Infinity Mall, Metro and the Western Express Highway.",
      utilities: "owner",
      pet: "allowed",
      income: "Not applicable — sale",
      size: 980,
      school: 600,
      bus: 150,
      restaurant: 180,
    },
  },
  // Rahul — Pune (rent)
  {
    user: "rahul",
    title: "Cozy 2 BHK near Hinjewadi IT Park",
    price: 22000,
    images: PHOTOS.flat2,
    address: "Phase 1, Hinjewadi, Pune",
    city: "Pune",
    bedroom: 2,
    bathroom: 2,
    latitude: "18.5906",
    longitude: "73.7393",
    type: "rent",
    property: "apartment",
    availableFrom: null,
    detail: {
      desc: "Semi-furnished 2 BHK ideal for IT professionals — 5 minutes from Phase 1 and the IT park shuttle. Two balconies, covered parking and 24-hour water. Owners stay in the same society, so maintenance is quick and easy.",
      utilities: "tenant",
      pet: "not allowed",
      income: "2x monthly rent required",
      size: 850,
      school: 800,
      bus: 120,
      restaurant: 400,
    },
  },
  // Rahul — Jaipur (buy, coming soon)
  {
    user: "rahul",
    title: "Heritage-style 4 BHK House with Courtyard",
    price: 9800000,
    images: PHOTOS.house3,
    address: "Malviya Nagar, Jaipur",
    city: "Jaipur",
    bedroom: 4,
    bathroom: 4,
    latitude: "26.8547",
    longitude: "75.8100",
    type: "buy",
    property: "house",
    availableFrom: daysFromNow(70),
    detail: {
      desc: "A rare independent house with a central courtyard, jaali windows and a rooftop terrace overlooking the Aravallis. Freshly renovated — new wiring, plumbing and waterproofing. Near Malviya Nagar market and good schools. Registration can happen after the current tenants move out.",
      utilities: "owner",
      pet: "allowed",
      income: "Not applicable — sale",
      size: 2400,
      school: 500,
      bus: 250,
      restaurant: 300,
    },
  },

  // Anjali — Delhi (buy, bought by Priya => SOLD demo)
  {
    user: "anjali",
    title: "Premium 2 BHK Condo in Dwarka",
    price: 9500000,
    images: PHOTOS.flat3,
    address: "Sector 12, Dwarka, New Delhi",
    city: "Delhi",
    bedroom: 2,
    bathroom: 2,
    latitude: "28.5788",
    longitude: "77.0303",
    type: "buy",
    property: "condo",
    availableFrom: null,
    detail: {
      desc: "Corner unit 2 BHK in Sector 12 with open views on two sides. Vaastu-friendly layout, granite kitchen, and two covered parking spots. Walking distance to the metro station and Sector 12 market. All original papers and OC ready for a smooth transfer.",
      utilities: "owner",
      pet: "allowed",
      income: "Not applicable — sale",
      size: 1150,
      school: 700,
      bus: 300,
      restaurant: 250,
    },
  },
  // Anjali — Delhi (rent, coming soon)
  {
    user: "anjali",
    title: "Designer 2 BHK in Hauz Khas Village",
    price: 45000,
    images: PHOTOS.house2,
    address: "Hauz Khas Enclave, New Delhi",
    city: "Delhi",
    bedroom: 2,
    bathroom: 2,
    latitude: "28.5494",
    longitude: "77.2003",
    type: "rent",
    property: "apartment",
    availableFrom: daysFromNow(30),
    detail: {
      desc: "Beautifully styled 2 BHK in a quiet lane off Hauz Khas Village. Wooden floors, an open kitchen and a lovely sit-out. Perfect for couples who love cafes, galleries and long walks around the lake. Society has power backup and a friendly resident community.",
      utilities: "shared",
      pet: "allowed",
      income: "2.5x monthly rent required",
      size: 1200,
      school: 900,
      bus: 350,
      restaurant: 150,
    },
  },
  // Anjali — Kolkata (buy)
  {
    user: "anjali",
    title: "Bright 3 BHK near New Town",
    price: 11000000,
    images: PHOTOS.house1,
    address: "Action Area 1, New Town, Kolkata",
    city: "Kolkata",
    bedroom: 3,
    bathroom: 3,
    latitude: "22.5786",
    longitude: "88.4818",
    type: "buy",
    property: "apartment",
    availableFrom: null,
    detail: {
      desc: "East-facing 3 BHK with abundant natural light in a reputed New Town high-rise. Large balconies, servo-stabilised power, clubhouse and 24x7 security. Close to Eco Park, the airport and top schools in the area.",
      utilities: "owner",
      pet: "allowed",
      income: "Not applicable — sale",
      size: 1420,
      school: 550,
      bus: 180,
      restaurant: 300,
    },
  },

  // Vikram — Bengaluru (rent)
  {
    user: "vikram",
    title: "Spacious 2 BHK in Whitefield",
    price: 32000,
    images: PHOTOS.flat2,
    address: "ITPL Main Road, Whitefield, Bengaluru",
    city: "Bengaluru",
    bedroom: 2,
    bathroom: 2,
    latitude: "12.9698",
    longitude: "77.7500",
    type: "rent",
    property: "apartment",
    availableFrom: null,
    detail: {
      desc: "Airy 2 BHK with a dedicated work-from-home nook — walk to ITPL and several tech parks. Residents' clubhouse, jogging track and kids' play area. Generator backup for common areas and lifts.",
      utilities: "tenant",
      pet: "allowed",
      income: "2x monthly rent required",
      size: 1050,
      school: 750,
      bus: 100,
      restaurant: 200,
    },
  },
  // Vikram — Bengaluru (buy)
  {
    user: "vikram",
    title: "2 BHK Condo on 100 Feet Road",
    price: 13500000,
    images: PHOTOS.flat3,
    address: "100 Feet Road, Indiranagar, Bengaluru",
    city: "Bengaluru",
    bedroom: 2,
    bathroom: 2,
    latitude: "12.9719",
    longitude: "77.6412",
    type: "buy",
    property: "condo",
    availableFrom: null,
    detail: {
      desc: "Rare resale 2 BHK in the heart of Indiranagar. Newly painted, with a modern modular kitchen and wardrobes in every room. Walk to Metro, restaurants and the famous 12th Main. Ideal for young professionals and families alike.",
      utilities: "owner",
      pet: "allowed",
      income: "Not applicable — sale",
      size: 1280,
      school: 650,
      bus: 200,
      restaurant: 120,
    },
  },
  // Vikram — Hyderabad (buy)
  {
    user: "vikram",
    title: "Villa-style 3 BHK with Lawn",
    price: 16000000,
    images: PHOTOS.house4,
    address: "Gachibowli, Hyderabad",
    city: "Hyderabad",
    bedroom: 3,
    bathroom: 3,
    latitude: "17.4401",
    longitude: "78.3489",
    type: "buy",
    property: "house",
    availableFrom: null,
    detail: {
      desc: "Ground-floor villa in a gated community with a private lawn and covered car porch. High ceilings, teak woodwork and a servant room. Minutes from the financial district, schools and shopping. A quiet address in a busy city.",
      utilities: "owner",
      pet: "allowed",
      income: "Not applicable — sale",
      size: 2100,
      school: 900,
      bus: 400,
      restaurant: 500,
    },
  },
  // Vikram — Pune (rent, budget)
  {
    user: "vikram",
    title: "Budget 1 BHK with Garden View",
    price: 15000,
    images: PHOTOS.flat1,
    address: "Baner Road, Pune",
    city: "Pune",
    bedroom: 1,
    bathroom: 1,
    latitude: "18.5590",
    longitude: "73.7868",
    type: "rent",
    property: "apartment",
    availableFrom: null,
    detail: {
      desc: "Compact, cheerful 1 BHK on a quiet lane off Baner Road. Freshly painted with a new geyser and fridge provided. Society garden is lovely for evening walks. Ideal for a single professional or a young couple.",
      utilities: "tenant",
      pet: "not allowed",
      income: "2x monthly rent required",
      size: 560,
      school: 700,
      bus: 250,
      restaurant: 350,
    },
  },

  // Priya — Chennai (rent, coming soon — also her "My Listings" demo)
  {
    user: "priya",
    title: "2 BHK Family Apartment near Metro",
    price: 26000,
    images: PHOTOS.house2,
    address: "Velachery, Chennai",
    city: "Chennai",
    bedroom: 2,
    bathroom: 2,
    latitude: "12.9815",
    longitude: "80.2182",
    type: "rent",
    property: "apartment",
    availableFrom: daysFromNow(45),
    detail: {
      desc: "Our family apartment in Velachery — 2 BHK with a pooja room and a big balcony. Near the lake park and metro station. Tenants moving out at the end of this quarter; we will hand over freshly painted with a professional deep-clean.",
      utilities: "owner",
      pet: "allowed",
      income: "2.5x monthly rent required",
      size: 950,
      school: 500,
      bus: 150,
      restaurant: 400,
    },
  },
];

const hourAgo = (days, hour, minute) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

// ── Main ───────────────────────────────────────────────────

// --- BEGIN AUTO-GENERATED MASSIVE SEED ---
const CITIES = [
  { city: "Delhi", lat: 28.6139, lng: 77.2090 },
  { city: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { city: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { city: "Pune", lat: 18.5204, lng: 73.8567 },
  { city: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707 },
  { city: "Gurgaon", lat: 28.4595, lng: 77.0266 },
  { city: "Noida", lat: 28.5355, lng: 77.3910 }
];

const PROPERTY_TYPES = ["apartment", "house", "condo"];
const TX_TYPES = ["buy", "rent"];
const DEMO_USERS = ["priya", "rahul", "anjali", "vikram", "amit"];
const PHOTO_KEYS = Object.keys(PHOTOS);

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < 60; i++) {
  const cityObj = randomItem(CITIES);
  const property = randomItem(PROPERTY_TYPES);
  const type = randomItem(TX_TYPES);
  const bed = randomInt(1, 5);
  const bath = randomInt(1, Math.max(bed, 2));
  const user = randomItem(DEMO_USERS);
  const photoKey = randomItem(PHOTO_KEYS);
  
  // vary price based on type
  const basePrice = type === 'buy' ? randomInt(40, 200) * 100000 : randomInt(15, 80) * 1000;
  
  // slightly jitter lat/lng so they don't all stack on map perfectly
  const lat = (cityObj.lat + (Math.random() - 0.5) * 0.1).toFixed(4);
  const lng = (cityObj.lng + (Math.random() - 0.5) * 0.1).toFixed(4);
  
  postFixtures.push({
    user,
    title: `Beautiful ${bed} BHK ${property.charAt(0).toUpperCase() + property.slice(1)} in ${cityObj.city}`,
    price: basePrice,
    images: PHOTOS[photoKey],
    address: `Sector ${randomInt(1, 100)}, ${cityObj.city}`,
    city: cityObj.city,
    bedroom: bed,
    bathroom: bath,
    latitude: String(lat),
    longitude: String(lng),
    type,
    property,
    availableFrom: Math.random() > 0.8 ? daysFromNow(randomInt(5, 30)) : null,
    detail: {
      desc: `This is a beautiful ${bed} bedroom ${property} available for ${type}. It is located in a prime area of ${cityObj.city} with excellent connectivity to schools, hospitals, and markets. The property features spacious rooms, modern amenities, and 24/7 security. Perfect for families looking for a comfortable living space.`,
      utilities: randomItem(["owner", "tenant", "shared"]),
      pet: randomItem(["allowed", "not allowed"]),
      income: type === 'rent' ? `3x rent` : `Not applicable`,
      size: randomInt(800, 3500),
      school: randomInt(100, 2000),
      bus: randomInt(50, 1000),
      restaurant: randomInt(100, 1500),
    }
  });
}
// --- END AUTO-GENERATED MASSIVE SEED ---

async function main() {
  console.log("🌱 Seeding Apna Ghar demo data…\n");

  // 1. Upsert demo users (password is re-hashed so reseeding never locks
  //    anyone out; the login flow uses the same bcrypt pipeline).
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = {};
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        username: u.username,
        avatar: u.avatar,
        password,
      },
      create: {
        username: u.username,
        email: u.email,
        avatar: u.avatar,
        password,
      },
    });
    users[u.username] = user;
    console.log(`  ✓ user ${u.username} (${u.email})`);
  }

  const demoIds = Object.values(users).map((u) => u.id);

  // 2. Remove previous demo-owned content (posts, relations, chats).
  const demoPosts = await prisma.post.findMany({
    where: { userId: { in: demoIds } },
    select: { id: true },
  });
  const demoPostIds = demoPosts.map((p) => p.id);

  if (demoPostIds.length) {
    await prisma.postDetail.deleteMany({
      where: { postId: { in: demoPostIds } },
    });
    await prisma.savedPost.deleteMany({
      where: {
        OR: [
          { userId: { in: demoIds } },
          { postId: { in: demoPostIds } },
        ],
      },
    });
    await prisma.boughtPost.deleteMany({
      where: {
        OR: [
          { userId: { in: demoIds } },
          { postId: { in: demoPostIds } },
        ],
      },
    });
    await prisma.post.deleteMany({ where: { id: { in: demoPostIds } } });
  }

  const demoChats = await prisma.chat.findMany({
    where: { userIDs: { hasSome: demoIds } },
    select: { id: true },
  });
  if (demoChats.length) {
    const chatIds = demoChats.map((c) => c.id);
    await prisma.message.deleteMany({ where: { chatId: { in: chatIds } } });
    await prisma.chat.deleteMany({ where: { id: { in: chatIds } } });
  }

  // 3. Create listings with nested post details.
  const created = {};
  for (const f of postFixtures) {
    const post = await prisma.post.create({
      data: {
        title: f.title,
        price: f.price,
        images: f.images,
        address: f.address,
        city: f.city,
        bedroom: f.bedroom,
        bathroom: f.bathroom,
        latitude: f.latitude,
        longitude: f.longitude,
        type: f.type,
        property: f.property,
        availableFrom: f.availableFrom,
        userId: users[f.user].id,
        postDetail: { create: f.detail },
      },
    });
    (created[f.user] ||= []).push(post);
  }

  const allPosts = Object.values(created).flat();
  const byTitle = (t) => allPosts.find((p) => p.title === t);
  const rahulHinjewadi = byTitle("Cozy 2 BHK near Hinjewadi IT Park");
  const anjaliDwarka = byTitle("Premium 2 BHK Condo in Dwarka");
  const vikramHyderabad = byTitle("Villa-style 3 BHK with Lawn");
  const priyaChennai = byTitle("2 BHK Family Apartment near Metro");
  console.log(`  ✓ ${allPosts.length} listings created`);

  // 4. Priya's saved homes (incl. a "coming soon" one) and one purchase.
  const requirePost = (p, label) => {
    if (!p) throw new Error(`Fixture not found: ${label}`);
    return p;
  };
  const priyaSaved = [
    requirePost(rahulHinjewadi, "Cozy 2 BHK near Hinjewadi IT Park"),
    requirePost(vikramHyderabad, "Villa-style 3 BHK with Lawn"),
    requirePost(priyaChennai, "2 BHK Family Apartment near Metro"),
  ];
  for (const post of priyaSaved) {
    await prisma.savedPost.create({
      data: { userId: users.priya.id, postId: post.id },
    });
  }
  await prisma.boughtPost.create({
    data: {
      userId: users.priya.id,
      postId: requirePost(anjaliDwarka, "Premium 2 BHK Condo in Dwarka").id,
    },
  });
  console.log("  ✓ saved homes + 1 purchased listing (SOLD demo)");

  // 5. Chats with believable conversation history.
  //    seenBy holds everyone who has read the thread. A chat that does not
  //    include the viewer in seenBy shows an unread badge/notification.
  const chat1 = await prisma.chat.create({
    data: {
      userIDs: [users.priya.id, users.rahul.id],
      seenBy: [users.priya.id, users.rahul.id],
      lastMessage: "Saturday 11 baje aa sakte hain aap. Address bhej deta hoon. 🙏",
      messages: {
        create: [
          {
            text: "Namaste Rahul ji! Main Hinjewadi wala 2 BHK dekhna chahti hoon. Weekend pe dikha sakte hain kya?",
            userId: users.priya.id,
            createdAt: hourAgo(3, 10, 5),
          },
          {
            text: "Namaste Priya ji! Zaroor. Flat abhi vacant hai, Saturday ya Sunday dono chalega.",
            userId: users.rahul.id,
            createdAt: hourAgo(3, 10, 22),
          },
          {
            text: "Sunday theek rahega. Society mein parking ki kya vyavastha hai?",
            userId: users.priya.id,
            createdAt: hourAgo(3, 21, 40),
          },
          {
            text: "Covered parking included hai, aur visitors ke liye alag space hai.",
            userId: users.rahul.id,
            createdAt: hourAgo(2, 9, 15),
          },
          {
            text: "Saturday 11 baje aa sakte hain aap. Address bhej deta hoon. 🙏",
            userId: users.rahul.id,
            createdAt: hourAgo(1, 18, 30),
          },
        ],
      },
    },
  });
  console.log(`  ✓ chat priya ↔ rahul (${chat1.id})`);

  const chat2 = await prisma.chat.create({
    data: {
      userIDs: [users.priya.id, users.anjali.id],
      seenBy: [users.anjali.id], // Priya has 1 unread => navbar badge demo
      lastMessage: "Namaste Priya ji! Documents ready hain, aap kab aa sakti hain?",
      messages: {
        create: [
          {
            text: "Hi Anjali ji, Dwarka flat ke papers ek baar check karne the. Registry ka time kya rahega?",
            userId: users.priya.id,
            createdAt: hourAgo(1, 11, 20),
          },
          {
            text: "Namaste Priya ji! Documents ready hain, aap kab aa sakti hain?",
            userId: users.anjali.id,
            createdAt: hourAgo(0, 9, 45),
          },
        ],
      },
    },
  });
  console.log(`  ✓ chat priya ↔ anjali (${chat2.id})`);

  const chat3 = await prisma.chat.create({
    data: {
      userIDs: [users.amit.id, users.rahul.id],
      seenBy: [users.amit.id], // Rahul has 1 unread
      lastMessage: "Ok sir, main kal office ke baad aa jaunga. Thank you!",
      messages: {
        create: [
          {
            text: "Rahul sir, Andheri wali flat ke liye loan eligible hai kya?",
            userId: users.amit.id,
            createdAt: hourAgo(1, 14, 10),
          },
          {
            text: "Ok sir, main kal office ke baad aa jaunga. Thank you!",
            userId: users.amit.id,
            createdAt: hourAgo(0, 20, 10),
          },
        ],
      },
    },
  });
  console.log(`  ✓ chat amit ↔ rahul (${chat3.id})`);

  console.log("\n✅ Seed complete!");
  console.log("\nDemo login (password for every account): " + DEMO_PASSWORD);
  for (const u of demoUsers) {
    console.log(`   • ${u.username.padEnd(7)} — ${u.email}`);
  }
}

main()
  .catch((error) => {
    console.error("\n❌ Seeding failed:\n", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
