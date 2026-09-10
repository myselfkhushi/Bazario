import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://khushikumari882484_db_user:aakash123@cluster0.qizpb53.mongodb.net/?appName=Cluster0";

const DEMO_PRODUCTS = [
    // ── Electronics ──
    {
        title: "Apple MacBook Air 13\" (M2 Chip, 256GB SSD, 8GB RAM) - Midnight",
        description: "Strikingly thin design with incredible battery life up to 18 hours. Powered by the next-generation M2 chip for lightning-fast performance in creative work, multitasking, and entertainment.",
        price: 94990,
        stock: 14,
        category: "Electronics",
        rating: 4.9,
        numReviews: 48,
        images: [{
            public_id: "demo_macbook_air",
            url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
        description: "Industry-leading noise canceling with two processors and eight microphones. Exceptional sound quality with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours of battery life.",
        price: 29990,
        stock: 22,
        category: "Electronics",
        rating: 4.8,
        numReviews: 64,
        images: [{
            public_id: "demo_sony_xm5",
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Apple iPad Pro 11-inch (M4 Chip, OLED Liquid Retina Display, 256GB)",
        description: "Unbelievably thin and powerful. Features breakthrough Ultra Retina XDR OLED display, mind-blowing M4 performance, and all-day battery life for creators, gamers, and professionals.",
        price: 89900,
        stock: 9,
        category: "Electronics",
        rating: 4.9,
        numReviews: 32,
        images: [{
            public_id: "demo_ipad_pro",
            url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Apple Watch Series 9 (GPS 45mm Aluminum Case with Sport Band)",
        description: "Smarter, brighter, mightier. Features Double Tap gesture, brighter always-on display, on-device Siri, and advanced health sensors for blood oxygen and ECG monitoring.",
        price: 41900,
        stock: 18,
        category: "Electronics",
        rating: 4.7,
        numReviews: 53,
        images: [{
            public_id: "demo_apple_watch",
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
        }]
    },

    // ── Fashion ──
    {
        title: "Men's Relaxed Fit 100% Pure French Linen Casual Shirt",
        description: "Crafted from ethically sourced Normandy linen. Naturally breathable, ultra-soft washed texture, and timeless button-down styling suitable for breezy summers and beach evenings.",
        price: 2499,
        stock: 35,
        category: "Fashion",
        rating: 4.6,
        numReviews: 29,
        images: [{
            public_id: "demo_linen_shirt",
            url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Urban Minimalist Classic White Leather Sneakers",
        description: "Handcrafted Italian full-grain leather sneakers with vulcanized rubber sole and memory foam insole. Sleek, versatile, and engineered for maximum all-day walking comfort.",
        price: 4999,
        stock: 20,
        category: "Fashion",
        rating: 4.8,
        numReviews: 41,
        images: [{
            public_id: "demo_white_sneakers",
            url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Vintage Biker Real Lambskin Leather Jacket for Men",
        description: "Tailored from buttery-soft genuine lambskin leather. Features asymmetric YKK zip closure, quilted shoulder padding, and quilted satin lining for iconic timeless ruggedness.",
        price: 11999,
        stock: 12,
        category: "Fashion",
        rating: 4.9,
        numReviews: 37,
        images: [{
            public_id: "demo_leather_jacket",
            url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Women's Floral Tiered Bohemian Maxi Summer Dress",
        description: "Flowing lightweight chiffon with feminine wildflower print, adjustable wrap tie waist, and flutter sleeves. Perfect for daytime brunch or sunset vacations.",
        price: 2899,
        stock: 25,
        category: "Fashion",
        rating: 4.7,
        numReviews: 22,
        images: [{
            public_id: "demo_floral_dress",
            url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop"
        }]
    },

    // ── Books ──
    {
        title: "Atomic Habits: An Easy & Proven Way to Build Good Habits by James Clear",
        description: "Over 15 million copies sold worldwide. The definitive guide on breaking bad habits and creating remarkable lasting changes in tiny, 1% daily increments.",
        price: 549,
        stock: 60,
        category: "Books",
        rating: 5.0,
        numReviews: 120,
        images: [{
            public_id: "demo_atomic_habits",
            url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness",
        description: "Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of life's most important financial decisions.",
        price: 399,
        stock: 45,
        category: "Books",
        rating: 4.9,
        numReviews: 88,
        images: [{
            public_id: "demo_psychology_money",
            url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Deep Work: Rules for Focused Success in a Distracted World by Cal Newport",
        description: "One of the most valuable skills in our economy is becoming increasingly rare. If you master this skill, you'll achieve extraordinary results. A masterclass in high-value productivity.",
        price: 479,
        stock: 30,
        category: "Books",
        rating: 4.8,
        numReviews: 54,
        images: [{
            public_id: "demo_deep_work",
            url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop"
        }]
    },

    // ── Beauty ──
    {
        title: "Advanced Glow Vitamin C 15% Face Serum with Hyaluronic Acid & Ferulic Acid",
        description: "Clinically proven dermatological brightening serum. Fades hyperpigmentation, protects against environmental UV damage, and deeply hydrates for a luminous radiant skin tone.",
        price: 1299,
        stock: 40,
        category: "Beauty",
        rating: 4.8,
        numReviews: 67,
        images: [{
            public_id: "demo_serum",
            url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Velvet Luxe Matte Non-Drying Longwear Lipstick (Ruby Crimson)",
        description: "Enriched with shea butter and jojoba seed oil. Delivers high-impact pigment with one effortless swipe, maintaining a velvety matte finish that lasts 12 hours without feathering.",
        price: 899,
        stock: 30,
        category: "Beauty",
        rating: 4.6,
        numReviews: 38,
        images: [{
            public_id: "demo_lipstick",
            url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Organic French Lavender & Rose Water Hydrating Face Mist (150ml)",
        description: "Steam-distilled botanical mist with pure aloe vera extract. Instantly soothes sensitive skin, balances natural skin pH, and refreshes makeup throughout the day.",
        price: 699,
        stock: 50,
        category: "Beauty",
        rating: 4.7,
        numReviews: 31,
        images: [{
            public_id: "demo_face_mist",
            url: "https://images.unsplash.com/photo-1608248597359-bb4364024b42?q=80&w=1000&auto=format&fit=crop"
        }]
    },

    // ── Sports ──
    {
        title: "Pro Non-Slip Eco-Friendly Natural Rubber Yoga Mat with Alignment Guide",
        description: "Extra-thick 6mm high-density cushioned natural rubber mat. Features laser-etched body alignment lines and sweat-absorbing textured grip for flawless yoga, pilates, and floor workouts.",
        price: 2499,
        stock: 28,
        category: "Sports",
        rating: 4.9,
        numReviews: 45,
        images: [{
            public_id: "demo_yoga_mat",
            url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Solid Cast Iron Competition Kettlebell (16 KG) with Color Coded Handle",
        description: "Single-piece gravity cast iron with smooth textured handle and flat base. Built for swings, snatches, Turkish get-ups, and strength endurance conditioning.",
        price: 3299,
        stock: 15,
        category: "Sports",
        rating: 4.8,
        numReviews: 34,
        images: [{
            public_id: "demo_kettlebell",
            url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Insulated 1 Litre Vacuum Stainless Steel Sports Water Bottle",
        description: "Double-walled copper insulation keeps cold drinks ice-cold for 24 hours and hot coffee steaming for 12 hours. BPA-free, sweat-proof, and fitted with a leakproof chug lid.",
        price: 1199,
        stock: 45,
        category: "Sports",
        rating: 4.9,
        numReviews: 59,
        images: [{
            public_id: "demo_water_bottle",
            url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop"
        }]
    },

    // ── Home ──
    {
        title: "Nordic Minimalist Warm Glow Ceramic Bedside Table Lamp",
        description: "Handmade ceramic base paired with an unbleached linen drum shade. Features a touch-sensitive 3-stage warm dimming switch to create cozy ambiance in any bedroom or living room.",
        price: 3499,
        stock: 18,
        category: "Home",
        rating: 4.8,
        numReviews: 27,
        images: [{
            public_id: "demo_lamp",
            url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Ergonomic Contour Memory Foam Cervical Orthopedic Pillow",
        description: "Therapeutic dual-height butterfly contour aligns your neck and spine to relieve morning neck stiffness and tension headaches. Comes with a cooling bamboo-fiber washable cover.",
        price: 1899,
        stock: 35,
        category: "Home",
        rating: 4.7,
        numReviews: 42,
        images: [{
            public_id: "demo_pillow",
            url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000&auto=format&fit=crop"
        }]
    },
    {
        title: "Artisanal Speckled Stoneware Coffee Mug Set of 4 (350ml)",
        description: "Hand-thrown ceramic mugs with rustic reactive matte glaze and wide comfort-grip handles. Microwave, dishwasher, and oven safe for hot cocoa, specialty espresso, and morning teas.",
        price: 1499,
        stock: 25,
        category: "Home",
        rating: 4.9,
        numReviews: 36,
        images: [{
            public_id: "demo_ceramic_mugs",
            url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop"
        }]
    },
];

async function seedDatabase() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGO_URL);
        console.log("Connected successfully!");

        // 1. Create or Find Demo Seller
        let demoSeller = await User.findOne({ email: "seller@demo.com" });
        if (!demoSeller) {
            demoSeller = await User.create({
                name: "Demo Seller (Bazario Store)",
                email: "seller@demo.com",
                password: "password123",
                role: "seller",
            });
            console.log("Created Demo Seller account: seller@demo.com");
        } else {
            console.log("Found existing Demo Seller: seller@demo.com");
        }

        // 2. Create or Find Demo Buyer
        let demoBuyer = await User.findOne({ email: "buyer@demo.com" });
        if (!demoBuyer) {
            demoBuyer = await User.create({
                name: "Demo Buyer",
                email: "buyer@demo.com",
                password: "password123",
                role: "buyer",
            });
            console.log("Created Demo Buyer account: buyer@demo.com");
        } else {
            console.log("Found existing Demo Buyer: buyer@demo.com");
        }

        // 3. Delete existing products and seed new ones
        console.log("Cleaning up old products...");
        await Product.deleteMany({});
        console.log("Old products removed.");

        console.log(`Seeding ${DEMO_PRODUCTS.length} rich demo products...`);
        const createdProducts = [];
        for (const p of DEMO_PRODUCTS) {
            const product = await Product.create({
                ...p,
                createdBy: demoSeller._id,
            });
            createdProducts.push(product);
        }
        console.log(`Successfully seeded ${createdProducts.length} demo products!`);

        // 4. Seed 2 realistic historical orders for Demo Buyer
        console.log("Seeding demo orders for Demo Buyer...");
        await Order.deleteMany({ user: demoBuyer._id });

        // Order 1: Delivered (Sony Headphones + Atomic Habits)
        const order1 = await Order.create({
            user: demoBuyer._id,
            orderitem: [
                {
                    product: createdProducts[1]._id, // Sony XM5
                    seller: demoSeller._id,
                    quantity: 1,
                    price: createdProducts[1].price,
                },
                {
                    product: createdProducts[8]._id, // Atomic Habits
                    seller: demoSeller._id,
                    quantity: 1,
                    price: createdProducts[8].price,
                }
            ],
            totalamount: createdProducts[1].price + createdProducts[8].price,
            orderstatus: "delivered",
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        });

        // Order 2: Shipped (Linen Shirt + Ceramic Mug Set)
        const order2 = await Order.create({
            user: demoBuyer._id,
            orderitem: [
                {
                    product: createdProducts[4]._id, // Linen Shirt
                    seller: demoSeller._id,
                    quantity: 2,
                    price: createdProducts[4].price,
                },
                {
                    product: createdProducts[19]._id, // Ceramic Mugs
                    seller: demoSeller._id,
                    quantity: 1,
                    price: createdProducts[19].price,
                }
            ],
            totalamount: (createdProducts[4].price * 2) + createdProducts[19].price,
            orderstatus: "shipped",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        });

        console.log("Successfully created 2 demo orders for Demo Buyer!");
        console.log(`Order 1 (Delivered): ₹${order1.totalamount}`);
        console.log(`Order 2 (Shipped): ₹${order2.totalamount}`);

        console.log("\n--- SEED COMPLETED SUCCESSFULLY! ---");
        console.log("Demo Buyer:  buyer@demo.com  / password123");
        console.log("Demo Seller: seller@demo.com / password123");
        console.log(`Total Products: ${createdProducts.length}`);

        process.exit(0);
    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
}

seedDatabase();
