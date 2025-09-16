// src/scripts/seed-database.ts
import "reflect-metadata";
import { AppDataSource } from "../database/data-source.js";
import { Logger } from "../utils/logger.js";
import { User } from "../entities/user.entity.js";
import { Category } from "../entities/category.entity.js";
import { Product } from "../entities/product.entity.js";
import { Order } from "../entities/order.entity.js";
import { OrderStatus } from "../types/index.js";
import bcrypt from "bcrypt";
import slugify from "slugify";

const logger = new Logger('SeedDatabase');

// Sample data - Expanded for realistic testing
const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Clothing & Accessories", slug: "clothing-accessories" },
    { name: "Books & Media", slug: "books-media" },
    { name: "Home & Garden", slug: "home-garden" },
    { name: "Sports & Outdoors", slug: "sports-outdoors" },
    { name: "Toys & Games", slug: "toys-games" },
    { name: "Health & Beauty", slug: "health-beauty" },
    { name: "Food & Beverages", slug: "food-beverages" },
    { name: "Automotive", slug: "automotive" },
    { name: "Pet Supplies", slug: "pet-supplies" },
    { name: "Office Supplies", slug: "office-supplies" },
    { name: "Tools & Hardware", slug: "tools-hardware" },
    { name: "Baby & Kids", slug: "baby-kids" },
    { name: "Jewelry & Watches", slug: "jewelry-watches" },
    { name: "Arts & Crafts", slug: "arts-crafts" }
];

// Generate more users programmatically
const userFirstNames = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana", "Edward", "Fiona", "George", "Helen",
                        "Ian", "Julia", "Kevin", "Laura", "Mike", "Nancy", "Oliver", "Patricia", "Quinn", "Rachel",
                        "Sam", "Tina", "Ulrich", "Victoria", "William", "Xena", "Yuki", "Zara"];
const userLastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
                       "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const cities = [
    { city: "New York", state: "NY", zip: "10001" },
    { city: "Los Angeles", state: "CA", zip: "90001" },
    { city: "Chicago", state: "IL", zip: "60601" },
    { city: "Houston", state: "TX", zip: "77001" },
    { city: "Phoenix", state: "AZ", zip: "85001" },
    { city: "Philadelphia", state: "PA", zip: "19101" },
    { city: "San Antonio", state: "TX", zip: "78201" },
    { city: "San Diego", state: "CA", zip: "92101" },
    { city: "Dallas", state: "TX", zip: "75201" },
    { city: "San Jose", state: "CA", zip: "95101" },
    { city: "Austin", state: "TX", zip: "78701" },
    { city: "Jacksonville", state: "FL", zip: "32201" },
    { city: "Fort Worth", state: "TX", zip: "76101" },
    { city: "Columbus", state: "OH", zip: "43201" },
    { city: "Charlotte", state: "NC", zip: "28201" }
];

// Generate users array
const users = [
    {
        name: "Admin User",
        email: "admin@shophub.com",
        password: "admin123456",
        role: 1,
        address: "123 Admin Street, Admin City, AC 12345"
    },
    {
        name: "Store Manager",
        email: "manager@shophub.com",
        password: "manager123456",
        role: 1,
        address: "456 Manager Lane, Admin City, AC 12345"
    }
];

// Generate 50+ regular users
for (let i = 0; i < 50; i++) {
    const firstName = userFirstNames[i % userFirstNames.length];
    const lastName = userLastNames[Math.floor(Math.random() * userLastNames.length)];
    const cityInfo = cities[Math.floor(Math.random() * cities.length)];
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const streetNames = ["Main St", "Oak Ave", "Pine Rd", "Elm St", "Maple Dr", "Cedar Ln", "Park Ave", "First St", "Second Ave", "Third Blvd"];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];

    users.push({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        password: "password123",
        role: 0,
        address: `${streetNumber} ${streetName}, ${cityInfo.city}, ${cityInfo.state} ${cityInfo.zip}`
    });
}

// Generate extensive product catalog - 200+ products
const productTemplates = [
    // Electronics (40+ products) - High demand items with adequate stock
    { name: "iPhone 15 Pro Max 256GB", description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.", price: 1199.99, quantity: 200, category: "Electronics", shipping: true, sold: 125 },
    { name: "iPhone 15 Pro 128GB", description: "Pro iPhone with A17 Pro chip and pro camera system.", price: 999.99, quantity: 150, category: "Electronics", shipping: true, sold: 89 },
    { name: "iPhone 15 128GB", description: "Standard iPhone 15 with dynamic island and USB-C.", price: 799.99, quantity: 220, category: "Electronics", shipping: true, sold: 156 },
    { name: "Samsung Galaxy S24 Ultra", description: "Premium Android flagship with S Pen and AI features.", price: 1299.99, quantity: 130, category: "Electronics", shipping: true, sold: 67 },
    { name: "Google Pixel 8 Pro", description: "Google's flagship with best-in-class AI photography.", price: 999.99, quantity: 120, category: "Electronics", shipping: true, sold: 45 },
    { name: "MacBook Pro 16 M3 Max", description: "Powerful laptop with M3 Max chip, 36GB RAM, perfect for professionals.", price: 3499.99, quantity: 80, category: "Electronics", shipping: true, sold: 28 },
    { name: "MacBook Air 15 M2", description: "Thin and light laptop with impressive battery life.", price: 1299.99, quantity: 150, category: "Electronics", shipping: true, sold: 78 },
    { name: "Dell XPS 15", description: "Premium Windows laptop with OLED display.", price: 1899.99, quantity: 90, category: "Electronics", shipping: true, sold: 34 },
    { name: "iPad Pro 12.9 M2", description: "Powerful tablet with mini-LED display.", price: 1099.99, quantity: 120, category: "Electronics", shipping: true, sold: 56 },
    { name: "iPad Air 11", description: "Versatile tablet with M1 chip.", price: 599.99, quantity: 180, category: "Electronics", shipping: true, sold: 89 },
    { name: "Samsung Galaxy Tab S9 Ultra", description: "Large Android tablet with AMOLED display.", price: 1199.99, quantity: 75, category: "Electronics", shipping: true, sold: 23 },
    { name: "Sony WH-1000XM5", description: "Premium noise-canceling wireless headphones.", price: 399.99, quantity: 300, category: "Electronics", shipping: true, sold: 234 },
    { name: "Apple AirPods Pro 2", description: "Active noise cancellation earbuds with spatial audio.", price: 249.99, quantity: 550, category: "Electronics", shipping: true, sold: 456 },
    { name: "Bose QuietComfort Ultra", description: "Immersive audio with world-class noise cancellation.", price: 429.99, quantity: 150, category: "Electronics", shipping: true, sold: 78 },
    { name: "Samsung 65 OLED 4K TV", description: "Stunning OLED display with vibrant colors.", price: 2499.99, quantity: 40, category: "Electronics", shipping: false, sold: 12 },
    { name: "LG 77 OLED C3", description: "Large OLED TV with gaming features.", price: 3499.99, quantity: 25, category: "Electronics", shipping: false, sold: 8 },
    { name: "Sony 65 Bravia XR", description: "Cognitive processor XR for lifelike picture.", price: 2799.99, quantity: 35, category: "Electronics", shipping: false, sold: 9 },
    { name: "PlayStation 5 Slim", description: "Next-gen gaming console with 1TB storage.", price: 499.99, quantity: 150, category: "Electronics", shipping: true, sold: 89 },
    { name: "Xbox Series X", description: "Most powerful Xbox ever built.", price: 499.99, quantity: 120, category: "Electronics", shipping: true, sold: 67 },
    { name: "Nintendo Switch OLED", description: "Hybrid gaming console with vibrant OLED screen.", price: 349.99, quantity: 200, category: "Electronics", shipping: true, sold: 123 },
    { name: "Steam Deck 512GB", description: "Portable PC gaming device.", price: 549.99, quantity: 90, category: "Electronics", shipping: true, sold: 34 },
    { name: "Canon EOS R5", description: "Professional mirrorless camera with 45MP sensor.", price: 3899.99, quantity: 25, category: "Electronics", shipping: true, sold: 5 },
    { name: "Sony A7 IV", description: "Full-frame mirrorless camera for creators.", price: 2498.99, quantity: 30, category: "Electronics", shipping: true, sold: 8 },
    { name: "GoPro Hero 12 Black", description: "Action camera with 5.3K video.", price: 399.99, quantity: 120, category: "Electronics", shipping: true, sold: 67 },
    { name: "DJI Mini 4 Pro", description: "Compact drone with 4K camera.", price: 759.99, quantity: 75, category: "Electronics", shipping: true, sold: 23 },
    { name: "Apple Watch Ultra 2", description: "Rugged smartwatch for extreme sports.", price: 799.99, quantity: 100, category: "Electronics", shipping: true, sold: 45 },
    { name: "Samsung Galaxy Watch 6", description: "Android smartwatch with health tracking.", price: 329.99, quantity: 150, category: "Electronics", shipping: true, sold: 78 },
    { name: "Garmin Fenix 7X", description: "Premium multisport GPS watch.", price: 899.99, quantity: 60, category: "Electronics", shipping: true, sold: 12 },
    { name: "Amazon Echo Show 15", description: "Smart display with Alexa built-in.", price: 279.99, quantity: 30, category: "Electronics", shipping: true, sold: 34 },
    { name: "Google Nest Hub Max", description: "Smart home hub with 10-inch display.", price: 229.99, quantity: 25, category: "Electronics", shipping: true, sold: 28 },
    { name: "Sonos Era 300", description: "Spatial audio smart speaker.", price: 449.99, quantity: 20, category: "Electronics", shipping: true, sold: 15 },
    { name: "Logitech MX Master 3S", description: "Advanced wireless mouse for professionals.", price: 99.99, quantity: 80, category: "Electronics", shipping: true, sold: 123 },
    { name: "Keychron Q1 Pro", description: "Mechanical keyboard with wireless connectivity.", price: 199.99, quantity: 40, category: "Electronics", shipping: true, sold: 56 },
    { name: "Samsung T7 Shield 2TB", description: "Rugged portable SSD.", price: 159.99, quantity: 60, category: "Electronics", shipping: true, sold: 89 },
    { name: "WD Black SN850X 2TB", description: "High-performance NVMe SSD for gaming.", price: 179.99, quantity: 45, category: "Electronics", shipping: true, sold: 67 },
    { name: "ASUS ROG Phone 7", description: "Gaming phone with 165Hz display.", price: 999.99, quantity: 15, category: "Electronics", shipping: true, sold: 12 },
    { name: "Razer Blade 16", description: "Gaming laptop with RTX 4090.", price: 3999.99, quantity: 8, category: "Electronics", shipping: true, sold: 5 },
    { name: "Meta Quest 3", description: "Mixed reality VR headset.", price: 499.99, quantity: 25, category: "Electronics", shipping: true, sold: 34 },
    { name: "Ring Video Doorbell Pro 2", description: "Smart doorbell with 3D motion detection.", price: 249.99, quantity: 50, category: "Electronics", shipping: true, sold: 78 },
    { name: "Philips Hue Starter Kit", description: "Smart lighting system with hub.", price: 199.99, quantity: 40, category: "Electronics", shipping: true, sold: 56 },

    // Clothing & Accessories (30+ products) - Popular fashion items with high stock
    { name: "Nike Air Max 270", description: "Comfortable running shoes with Air Max cushioning.", price: 159.99, quantity: 350, category: "Clothing & Accessories", shipping: true, sold: 234 },
    { name: "Adidas Ultraboost 22", description: "High-performance running shoes.", price: 189.99, quantity: 250, category: "Clothing & Accessories", shipping: true, sold: 156 },
    { name: "New Balance 990v6", description: "Classic comfort sneakers made in USA.", price: 199.99, quantity: 180, category: "Clothing & Accessories", shipping: true, sold: 89 },
    { name: "Levi's 501 Original Jeans", description: "Classic straight fit jeans.", price: 89.99, quantity: 450, category: "Clothing & Accessories", shipping: true, sold: 345 },
    { name: "Levi's Trucker Jacket", description: "Iconic denim jacket.", price: 79.99, quantity: 200, category: "Clothing & Accessories", shipping: true, sold: 123 },
    { name: "North Face Puffer Jacket", description: "Warm winter jacket with down insulation.", price: 299.99, quantity: 50, category: "Clothing & Accessories", shipping: true, sold: 78 },
    { name: "Patagonia Better Sweater", description: "Sustainable fleece jacket.", price: 139.99, quantity: 60, category: "Clothing & Accessories", shipping: true, sold: 89 },
    { name: "Columbia Rain Jacket", description: "Waterproof breathable jacket.", price: 99.99, quantity: 70, category: "Clothing & Accessories", shipping: true, sold: 67 },
    { name: "Ralph Lauren Polo Shirt", description: "Classic polo shirt with embroidered logo.", price: 89.99, quantity: 100, category: "Clothing & Accessories", shipping: true, sold: 156 },
    { name: "Tommy Hilfiger T-Shirt", description: "Cotton t-shirt with flag logo.", price: 39.99, quantity: 120, category: "Clothing & Accessories", shipping: true, sold: 234 },
    { name: "Calvin Klein Underwear Set", description: "3-pack boxer briefs.", price: 42.99, quantity: 600, category: "Clothing & Accessories", shipping: true, sold: 456 },
    { name: "Champion Hoodie", description: "Reverse weave hoodie.", price: 59.99, quantity: 220, category: "Clothing & Accessories", shipping: true, sold: 145 },
    { name: "Under Armour Tech Shirt", description: "Quick-dry athletic shirt.", price: 29.99, quantity: 400, category: "Clothing & Accessories", shipping: true, sold: 289 },
    { name: "Lululemon Align Leggings", description: "Buttery-soft yoga leggings.", price: 128.99, quantity: 200, category: "Clothing & Accessories", shipping: true, sold: 123 },
    { name: "Nike Dri-FIT Shorts", description: "Athletic shorts with moisture-wicking.", price: 44.99, quantity: 280, category: "Clothing & Accessories", shipping: true, sold: 189 },
    { name: "Ray-Ban Aviator Sunglasses", description: "Classic aviator sunglasses.", price: 169.99, quantity: 40, category: "Clothing & Accessories", shipping: true, sold: 67 },
    { name: "Oakley Holbrook Sunglasses", description: "Sport sunglasses with prizm lens.", price: 149.99, quantity: 35, category: "Clothing & Accessories", shipping: true, sold: 45 },
    { name: "Michael Kors Handbag", description: "Leather crossbody bag.", price: 298.99, quantity: 25, category: "Clothing & Accessories", shipping: true, sold: 34 },
    { name: "Coach Wallet", description: "Leather bifold wallet.", price: 178.99, quantity: 30, category: "Clothing & Accessories", shipping: true, sold: 23 },
    { name: "Kate Spade Tote", description: "Large leather tote bag.", price: 358.99, quantity: 20, category: "Clothing & Accessories", shipping: true, sold: 15 },
    { name: "Fossil Leather Watch", description: "Classic analog watch with leather strap.", price: 125.99, quantity: 45, category: "Clothing & Accessories", shipping: true, sold: 56 },
    { name: "Timex Weekender", description: "Casual watch with interchangeable straps.", price: 49.99, quantity: 80, category: "Clothing & Accessories", shipping: true, sold: 123 },
    { name: "Pandora Charm Bracelet", description: "Sterling silver charm bracelet.", price: 89.99, quantity: 35, category: "Clothing & Accessories", shipping: true, sold: 45 },
    { name: "Swarovski Crystal Necklace", description: "Crystal pendant necklace.", price: 129.99, quantity: 25, category: "Clothing & Accessories", shipping: true, sold: 28 },
    { name: "UGG Classic Boots", description: "Sheepskin boots for winter.", price: 169.99, quantity: 40, category: "Clothing & Accessories", shipping: true, sold: 67 },
    { name: "Timberland 6-Inch Boots", description: "Waterproof work boots.", price: 198.99, quantity: 50, category: "Clothing & Accessories", shipping: true, sold: 78 },
    { name: "Converse Chuck Taylor", description: "Classic canvas sneakers.", price: 59.99, quantity: 100, category: "Clothing & Accessories", shipping: true, sold: 234 },
    { name: "Vans Old Skool", description: "Skate shoes with side stripe.", price: 69.99, quantity: 90, category: "Clothing & Accessories", shipping: true, sold: 189 },
    { name: "Dr. Martens 1460", description: "Iconic leather boots.", price: 169.99, quantity: 35, category: "Clothing & Accessories", shipping: true, sold: 56 },
    { name: "Birkenstock Arizona", description: "Comfort sandals with cork footbed.", price: 134.99, quantity: 60, category: "Clothing & Accessories", shipping: true, sold: 89 },

    // Books & Media (25+ products) - Bestsellers with high inventory
    { name: "Atomic Habits", description: "James Clear's guide to building good habits.", price: 24.99, quantity: 700, category: "Books & Media", shipping: true, sold: 567 },
    { name: "The Psychology of Money", description: "Timeless lessons on wealth by Morgan Housel.", price: 22.99, quantity: 550, category: "Books & Media", shipping: true, sold: 423 },
    { name: "Fourth Wing", description: "Fantasy romance novel by Rebecca Yarros.", price: 27.99, quantity: 500, category: "Books & Media", shipping: true, sold: 389 },
    { name: "The Woman in Me", description: "Britney Spears memoir.", price: 32.99, quantity: 100, category: "Books & Media", shipping: true, sold: 234 },
    { name: "The 48 Laws of Power", description: "Robert Greene's guide to power dynamics.", price: 26.99, quantity: 120, category: "Books & Media", shipping: true, sold: 289 },
    { name: "Rich Dad Poor Dad", description: "Robert Kiyosaki's financial education book.", price: 19.99, quantity: 160, category: "Books & Media", shipping: true, sold: 456 },
    { name: "The Subtle Art of Not Giving a F*ck", description: "Mark Manson's counterintuitive approach to living.", price: 22.99, quantity: 140, category: "Books & Media", shipping: true, sold: 378 },
    { name: "Educated", description: "Tara Westover's memoir.", price: 18.99, quantity: 110, category: "Books & Media", shipping: true, sold: 267 },
    { name: "The Silent Patient", description: "Psychological thriller by Alex Michaelides.", price: 16.99, quantity: 130, category: "Books & Media", shipping: true, sold: 312 },
    { name: "Where the Crawdads Sing", description: "Delia Owens' mystery novel.", price: 14.99, quantity: 150, category: "Books & Media", shipping: true, sold: 445 },
    { name: "The Seven Husbands of Evelyn Hugo", description: "Taylor Jenkins Reid novel.", price: 17.99, quantity: 140, category: "Books & Media", shipping: true, sold: 398 },
    { name: "Project Hail Mary", description: "Andy Weir sci-fi adventure.", price: 28.99, quantity: 90, category: "Books & Media", shipping: true, sold: 156 },
    { name: "The Midnight Library", description: "Matt Haig's philosophical fiction.", price: 16.99, quantity: 120, category: "Books & Media", shipping: true, sold: 234 },
    { name: "Klara and the Sun", description: "Kazuo Ishiguro's AI novel.", price: 26.99, quantity: 80, category: "Books & Media", shipping: true, sold: 123 },
    { name: "The Thursday Murder Club", description: "Richard Osman's mystery series.", price: 18.99, quantity: 110, category: "Books & Media", shipping: true, sold: 267 },
    { name: "Clean Code", description: "Robert C. Martin's programming guide.", price: 44.99, quantity: 60, category: "Books & Media", shipping: true, sold: 145 },
    { name: "Design Patterns", description: "Gang of Four software design book.", price: 54.99, quantity: 40, category: "Books & Media", shipping: true, sold: 78 },
    { name: "The Pragmatic Programmer", description: "Classic software development guide.", price: 49.99, quantity: 50, category: "Books & Media", shipping: true, sold: 89 },
    { name: "Cracking the Coding Interview", description: "Programming interview preparation.", price: 38.99, quantity: 70, category: "Books & Media", shipping: true, sold: 156 },
    { name: "Introduction to Algorithms", description: "MIT Press computer science textbook.", price: 89.99, quantity: 30, category: "Books & Media", shipping: true, sold: 45 },
    { name: "Harry Potter Box Set", description: "Complete 7-book collection.", price: 79.99, quantity: 50, category: "Books & Media", shipping: true, sold: 123 },
    { name: "Lord of the Rings Trilogy", description: "Tolkien's epic fantasy.", price: 65.99, quantity: 45, category: "Books & Media", shipping: true, sold: 89 },
    { name: "Game of Thrones Set", description: "George R.R. Martin's series.", price: 99.99, quantity: 35, category: "Books & Media", shipping: true, sold: 67 },
    { name: "The Witcher Collection", description: "Andrzej Sapkowski's fantasy series.", price: 89.99, quantity: 40, category: "Books & Media", shipping: true, sold: 56 },
    { name: "Dune Series", description: "Frank Herbert's sci-fi epic.", price: 75.99, quantity: 30, category: "Books & Media", shipping: true, sold: 45 },

    // Home & Garden (25+ products)
    { name: "Dyson V15 Detect", description: "Cordless vacuum with laser dust detection.", price: 749.99, quantity: 25, category: "Home & Garden", shipping: true, sold: 45 },
    { name: "iRobot Roomba j7+", description: "Self-emptying robot vacuum.", price: 799.99, quantity: 20, category: "Home & Garden", shipping: true, sold: 34 },
    { name: "Shark Navigator Lift-Away", description: "Upright vacuum with detachable canister.", price: 199.99, quantity: 150, category: "Home & Garden", shipping: true, sold: 78 },
    { name: "Instant Pot Duo 7-in-1", description: "Multi-functional pressure cooker.", price: 89.99, quantity: 250, category: "Home & Garden", shipping: true, sold: 156 },
    { name: "Ninja Foodi Air Fryer", description: "Air fryer and pressure cooker combo.", price: 159.99, quantity: 200, category: "Home & Garden", shipping: true, sold: 123 },
    { name: "KitchenAid Stand Mixer", description: "Professional 5-quart stand mixer.", price: 379.99, quantity: 120, category: "Home & Garden", shipping: true, sold: 56 },
    { name: "Vitamix Blender", description: "Professional-grade blender.", price: 449.99, quantity: 100, category: "Home & Garden", shipping: true, sold: 34 },
    { name: "Breville Espresso Machine", description: "Barista Express espresso maker.", price: 699.99, quantity: 75, category: "Home & Garden", shipping: true, sold: 23 },
    { name: "Keurig K-Elite", description: "Single serve coffee maker.", price: 169.99, quantity: 150, category: "Home & Garden", shipping: true, sold: 89 },
    { name: "All-Clad Cookware Set", description: "10-piece stainless steel cookware.", price: 799.99, quantity: 65, category: "Home & Garden", shipping: false, sold: 12 },
    { name: "Le Creuset Dutch Oven", description: "5.5-quart enameled cast iron.", price: 379.99, quantity: 80, category: "Home & Garden", shipping: true, sold: 28 },
    { name: "Philips Hue Light Strip", description: "Smart LED light strip.", price: 89.99, quantity: 200, category: "Home & Garden", shipping: true, sold: 123 },
    { name: "Nest Learning Thermostat", description: "Smart thermostat with auto-schedule.", price: 249.99, quantity: 130, category: "Home & Garden", shipping: true, sold: 67 },
    { name: "Ring Alarm Security Kit", description: "5-piece home security system.", price: 199.99, quantity: 100, category: "Home & Garden", shipping: true, sold: 45 },
    { name: "Weber Spirit II Grill", description: "3-burner gas grill.", price: 639.99, quantity: 70, category: "Home & Garden", shipping: false, sold: 18 },
    { name: "Traeger Pro 575 Pellet Grill", description: "WiFi-enabled pellet grill.", price: 799.99, quantity: 70, category: "Home & Garden", shipping: false, sold: 15 },
    { name: "Tempur-Pedic Mattress Queen", description: "Memory foam mattress.", price: 2199.99, quantity: 60, category: "Home & Garden", shipping: false, sold: 6 },
    { name: "Purple Hybrid Premier", description: "Hybrid mattress with gel grid.", price: 1899.99, quantity: 60, category: "Home & Garden", shipping: false, sold: 8 },
    { name: "Casper Original Mattress", description: "All-foam mattress.", price: 1095.99, quantity: 70, category: "Home & Garden", shipping: false, sold: 12 },
    { name: "Brooklinen Sheet Set", description: "Luxe core sheet set.", price: 149.99, quantity: 300, category: "Home & Garden", shipping: true, sold: 234 },
    { name: "Parachute Down Comforter", description: "European white down comforter.", price: 329.99, quantity: 120, category: "Home & Garden", shipping: true, sold: 56 },
    { name: "West Elm Coffee Table", description: "Mid-century modern coffee table.", price: 499.99, quantity: 60, category: "Home & Garden", shipping: false, sold: 9 },
    { name: "Article Sofa", description: "Modern 3-seat sofa.", price: 1299.99, quantity: 55, category: "Home & Garden", shipping: false, sold: 5 },
    { name: "Herman Miller Office Chair", description: "Ergonomic office chair.", price: 1395.99, quantity: 60, category: "Home & Garden", shipping: false, sold: 7 },
    { name: "IKEA Billy Bookcase", description: "Classic bookcase.", price: 59.99, quantity: 300, category: "Home & Garden", shipping: false, sold: 234 },

    // Additional categories with 10-15 products each
    // Sports & Outdoors
    { name: "Yeti Tundra 45 Cooler", description: "Heavy-duty cooler.", price: 349.99, quantity: 90, category: "Sports & Outdoors", shipping: false, sold: 34 },
    { name: "Coleman 6-Person Tent", description: "Family camping tent.", price: 179.99, quantity: 120, category: "Sports & Outdoors", shipping: false, sold: 56 },
    { name: "Patagonia Black Hole Duffel", description: "55L travel duffel bag.", price: 149.99, quantity: 150, category: "Sports & Outdoors", shipping: true, sold: 78 },
    { name: "Hydro Flask Water Bottle", description: "32oz insulated water bottle.", price: 44.99, quantity: 450, category: "Sports & Outdoors", shipping: true, sold: 345 },
    { name: "Garmin Edge 530", description: "GPS bike computer.", price: 299.99, quantity: 100, category: "Sports & Outdoors", shipping: true, sold: 45 },
    { name: "Specialized Allez Road Bike", description: "Entry-level road bike.", price: 1000.00, quantity: 60, category: "Sports & Outdoors", shipping: false, sold: 8 },
    { name: "Peloton Bike+", description: "Smart exercise bike.", price: 2495.00, quantity: 55, category: "Sports & Outdoors", shipping: false, sold: 3 },
    { name: "NordicTrack Treadmill", description: "Folding treadmill with iFit.", price: 999.99, quantity: 60, category: "Sports & Outdoors", shipping: false, sold: 5 },
    { name: "Bowflex SelectTech Dumbbells", description: "Adjustable dumbbells set.", price: 549.99, quantity: 80, category: "Sports & Outdoors", shipping: false, sold: 23 },
    { name: "TRX Suspension Trainer", description: "Bodyweight training system.", price: 149.99, quantity: 130, category: "Sports & Outdoors", shipping: true, sold: 67 },

    // Toys & Games
    { name: "LEGO Millennium Falcon", description: "Ultimate Collector Series set.", price: 849.99, quantity: 55, category: "Toys & Games", shipping: true, sold: 5 },
    { name: "Nintendo Switch Pro Controller", description: "Wireless gaming controller.", price: 69.99, quantity: 220, category: "Toys & Games", shipping: true, sold: 145 },
    { name: "Pokemon Trading Cards Booster Box", description: "36 pack booster box.", price: 144.99, quantity: 150, category: "Toys & Games", shipping: true, sold: 78 },
    { name: "Monopoly Classic", description: "Classic board game.", price: 19.99, quantity: 300, category: "Toys & Games", shipping: true, sold: 234 },
    { name: "Catan Board Game", description: "Strategy board game.", price: 44.99, quantity: 200, category: "Toys & Games", shipping: true, sold: 123 },
    { name: "Barbie Dreamhouse", description: "3-story dollhouse playset.", price: 199.99, quantity: 120, category: "Toys & Games", shipping: false, sold: 56 },
    { name: "Hot Wheels Ultimate Garage", description: "Multi-level parking garage.", price: 99.99, quantity: 150, category: "Toys & Games", shipping: false, sold: 89 },
    { name: "Nerf Elite 2.0 Commander", description: "Foam dart blaster.", price: 39.99, quantity: 230, category: "Toys & Games", shipping: true, sold: 156 },
    { name: "Funko Pop! Collection", description: "Set of 5 random Funko Pops.", price: 59.99, quantity: 350, category: "Toys & Games", shipping: true, sold: 289 },
    { name: "Rubik's Cube Speed Cube", description: "Professional speed cube.", price: 24.99, quantity: 250, category: "Toys & Games", shipping: true, sold: 189 },

    // Health & Beauty
    { name: "Theragun Prime", description: "Percussive therapy device.", price: 299.99, quantity: 100, category: "Health & Beauty", shipping: true, sold: 45 },
    { name: "Oral-B iO Series 9", description: "Electric toothbrush with AI.", price: 299.99, quantity: 120, category: "Health & Beauty", shipping: true, sold: 56 },
    { name: "Philips Sonicare DiamondClean", description: "Smart electric toothbrush.", price: 199.99, quantity: 150, category: "Health & Beauty", shipping: true, sold: 89 },
    { name: "Olay Regenerist Retinol24", description: "Night moisturizer set.", price: 39.99, quantity: 450, category: "Health & Beauty", shipping: true, sold: 345 },
    { name: "CeraVe Skincare Bundle", description: "Cleanser and moisturizer set.", price: 29.99, quantity: 550, category: "Health & Beauty", shipping: true, sold: 456 },
    { name: "Dyson Airwrap Styler", description: "Multi-styler for multiple hair types.", price: 599.99, quantity: 75, category: "Health & Beauty", shipping: true, sold: 23 },
    { name: "ghd Platinum+ Styler", description: "Professional hair straightener.", price: 249.99, quantity: 100, category: "Health & Beauty", shipping: true, sold: 45 },
    { name: "Foreo Luna 3", description: "Facial cleansing device.", price: 219.99, quantity: 90, category: "Health & Beauty", shipping: true, sold: 34 },
    { name: "NuFACE Trinity", description: "Microcurrent facial device.", price: 339.99, quantity: 80, category: "Health & Beauty", shipping: true, sold: 28 },
    { name: "Vitamins & Supplements Pack", description: "30-day multivitamin supply.", price: 49.99, quantity: 650, category: "Health & Beauty", shipping: true, sold: 567 },

    // Remaining categories with sample products
    { name: "Blue Buffalo Dog Food 30lb", description: "Life protection formula.", price: 54.99, quantity: 300, category: "Pet Supplies", shipping: false, sold: 234 },
    { name: "Cat Tree Tower", description: "Multi-level cat furniture.", price: 89.99, quantity: 130, category: "Pet Supplies", shipping: false, sold: 67 },
    { name: "Brother Laser Printer", description: "Wireless monochrome printer.", price: 199.99, quantity: 100, category: "Office Supplies", shipping: true, sold: 45 },
    { name: "Standing Desk Converter", description: "Adjustable desk riser.", price: 299.99, quantity: 90, category: "Office Supplies", shipping: false, sold: 34 },
    { name: "DeWalt 20V Drill Set", description: "Cordless drill with accessories.", price: 159.99, quantity: 150, category: "Tools & Hardware", shipping: true, sold: 78 },
    { name: "Craftsman Tool Set 450pc", description: "Mechanics tool set.", price: 299.99, quantity: 75, category: "Tools & Hardware", shipping: false, sold: 23 },
    { name: "Graco 4Ever Car Seat", description: "4-in-1 convertible car seat.", price: 299.99, quantity: 90, category: "Baby & Kids", shipping: false, sold: 34 },
    { name: "Baby Jogger City Mini GT2", description: "All-terrain stroller.", price: 399.99, quantity: 75, category: "Baby & Kids", shipping: false, sold: 23 },
    { name: "Diamond Stud Earrings 1ct", description: "14k white gold earrings.", price: 1999.99, quantity: 55, category: "Jewelry & Watches", shipping: true, sold: 3 },
    { name: "Seiko Automatic Watch", description: "Prospex diver's watch.", price: 495.99, quantity: 60, category: "Jewelry & Watches", shipping: true, sold: 8 },
    { name: "Cricut Maker 3", description: "Smart cutting machine.", price: 399.99, quantity: 90, category: "Arts & Crafts", shipping: true, sold: 34 },
    { name: "Prismacolor Premier Set 150", description: "Colored pencils set.", price: 169.99, quantity: 100, category: "Arts & Crafts", shipping: true, sold: 45 },
    { name: "Michelin Defender Tires Set", description: "Set of 4 all-season tires.", price: 599.99, quantity: 60, category: "Automotive", shipping: false, sold: 8 },
    { name: "Bosch ICON Wiper Blades", description: "Premium wiper blade set.", price: 49.99, quantity: 200, category: "Automotive", shipping: true, sold: 123 },
    { name: "Organic Coffee Beans 5lb", description: "Single origin arabica beans.", price: 79.99, quantity: 230, category: "Food & Beverages", shipping: true, sold: 156 },
    { name: "Japanese Green Tea Set", description: "Premium matcha and sencha.", price: 59.99, quantity: 150, category: "Food & Beverages", shipping: true, sold: 89 }
];

async function seedDatabase() {
    try {
        logger.info('Starting database seeding process...');

        // Initialize the database connection
        if (!AppDataSource.isInitialized) {
            logger.info('Initializing database connection...');
            await AppDataSource.initialize();
        }

        // Get repositories
        const userRepository = AppDataSource.getRepository(User);
        const categoryRepository = AppDataSource.getRepository(Category);
        const productRepository = AppDataSource.getRepository(Product);

        // Seed Categories
        logger.info('Seeding categories...');
        const savedCategories: Category[] = [];
        for (const categoryData of categories) {
            const category = categoryRepository.create(categoryData);
            const savedCategory = await categoryRepository.save(category);
            savedCategories.push(savedCategory);
            logger.info(`Created category: ${savedCategory.name}`);
        }
        logger.info(`✅ Created ${savedCategories.length} categories`);

        // Seed Users
        logger.info('Seeding users...');
        const savedUsers: User[] = [];
        for (const userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = userRepository.create({
                ...userData,
                password: hashedPassword
            });
            const savedUser = await userRepository.save(user);
            savedUsers.push(savedUser);
            logger.info(`Created user: ${savedUser.email} (Role: ${savedUser.role === 1 ? 'Admin' : 'User'})`);
        }
        logger.info(`✅ Created ${savedUsers.length} users`);

        // Seed Products
        logger.info('Seeding products...');
        const savedProducts: Product[] = [];
        for (const productData of productTemplates) {
            // Find the category
            const category = savedCategories.find(c => c.name === productData.category);
            if (!category) {
                logger.warn(`Category not found: ${productData.category}`);
                continue;
            }

            // Generate slug from product name
            const slug = slugify(productData.name, { lower: true, strict: true });

            // Create product with category reference - Fixed TypeScript issue
            const product = productRepository.create({
                name: productData.name,
                slug: slug,
                description: productData.description,
                price: productData.price,
                quantity: productData.quantity,
                categoryId: category.id,
                shipping: productData.shipping,
                sold: productData.sold
            });

            const savedProduct = await productRepository.save(product);
            savedProducts.push(savedProduct);
            logger.info(`Created product: ${savedProduct.name} in category ${category.name}`);
        }
        logger.info(`✅ Created ${savedProducts.length} products`);

        // Create sample orders (15-20 orders)
        logger.info('Creating sample orders...');
        const orderRepository = AppDataSource.getRepository(Order);

        // Create orders for non-admin users
        const regularUsers = savedUsers.filter(u => u.role === 0);
        let orderCount = 0;

        for (let i = 0; i < Math.min(20, regularUsers.length); i++) {
            const user = regularUsers[i];
            const numProducts = Math.floor(Math.random() * 5) + 1; // 1-5 products per order
            const orderProducts = [];

            // Select random products
            for (let j = 0; j < numProducts; j++) {
                const randomProduct = savedProducts[Math.floor(Math.random() * savedProducts.length)];
                orderProducts.push(randomProduct);
            }

            const order = orderRepository.create({
                products: orderProducts,
                payment: { transaction_id: `PAY_${Date.now()}_${i}` },
                buyer: user,
                buyerId: user.id,
                status: OrderStatus.NOT_PROCESSED
            });

            await orderRepository.save(order);
            orderCount++;
            logger.info(`Created order for user: ${user.email}`);
        }
        logger.info(`✅ Created ${orderCount} sample orders`);

        // Summary
        logger.info('=================================');
        logger.info('🎉 Database Seeding Complete!');
        logger.info('=================================');
        logger.info(`📦 Categories: ${savedCategories.length}`);
        logger.info(`👥 Users: ${savedUsers.length} (2 Admins, ${savedUsers.length - 2} Regular Users)`);
        logger.info(`🛍️ Products: ${savedProducts.length}`);
        logger.info(`📋 Orders: ${orderCount}`);
        logger.info('=================================');
        logger.info('🔐 Admin Credentials:');
        logger.info('📧 Email: admin@shophub.com');
        logger.info('🔑 Password: admin123456');
        logger.info('=================================');
        logger.info('🔐 Manager Credentials:');
        logger.info('📧 Email: manager@shophub.com');
        logger.info('🔑 Password: manager123456');
        logger.info('=================================');

        // Close the database connection
        await AppDataSource.destroy();
        logger.info('Database connection closed.');

    } catch (error) {
        logger.error('Failed to seed database', error as Error);
        process.exit(1);
    }
}

// Run the script
seedDatabase()
    .then(() => {
        logger.info('Database seeding script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        logger.error('Database seeding script failed', error);
        process.exit(1);
    });