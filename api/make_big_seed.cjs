const fs = require('fs');

let seedStr = fs.readFileSync('prisma/seed.js', 'utf8');

const injection = `
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
    title: \`Beautiful \${bed} BHK \${property.charAt(0).toUpperCase() + property.slice(1)} in \${cityObj.city}\`,
    price: basePrice,
    images: PHOTOS[photoKey],
    address: \`Sector \${randomInt(1, 100)}, \${cityObj.city}\`,
    city: cityObj.city,
    bedroom: bed,
    bathroom: bath,
    latitude: String(lat),
    longitude: String(lng),
    type,
    property,
    availableFrom: Math.random() > 0.8 ? daysFromNow(randomInt(5, 30)) : null,
    detail: {
      desc: \`This is a beautiful \${bed} bedroom \${property} available for \${type}. It is located in a prime area of \${cityObj.city} with excellent connectivity to schools, hospitals, and markets. The property features spacious rooms, modern amenities, and 24/7 security. Perfect for families looking for a comfortable living space.\`,
      utilities: randomItem(["owner", "tenant", "shared"]),
      pet: randomItem(["allowed", "not allowed"]),
      income: type === 'rent' ? \`3x rent\` : \`Not applicable\`,
      size: randomInt(800, 3500),
      school: randomInt(100, 2000),
      bus: randomInt(50, 1000),
      restaurant: randomInt(100, 1500),
    }
  });
}
// --- END AUTO-GENERATED MASSIVE SEED ---
`;

seedStr = seedStr.replace('async function main() {', injection + '\nasync function main() {');
fs.writeFileSync('prisma/seed.js', seedStr);
console.log('Seed file successfully augmented with 60 more properties!');
