const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'coy',
  user: 'postgres',
  password: 'admin@123',
});

// Curated high quality portrait images for dating profiles
const MOCK_PROFILES = [
  {
    name: 'You (Demo User)',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'This is you — the logged-in demo user.',
    city: 'Mumbai',
    college: 'IIT Bombay',
    interests: ['coding', 'music', 'travel']
  },
  {
    name: 'Ananya Sharma',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Coffee enthusiast ☕ | Book lover 📚 | Sunset chaser 🌅',
    city: 'Delhi',
    college: 'Delhi University',
    interests: ['reading', 'photography', 'yoga']
  },
  {
    name: 'Rohan Mehta',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Fitness fanatic 💪 | Aspiring filmmaker 🎬 | Vinyl collector',
    city: 'Mumbai',
    college: 'IIT Bombay',
    interests: ['fitness', 'movies', 'music']
  },
  {
    name: 'Priya Patel',
    age: 20,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Dancing through life 💃 | Golden retriever mom 🐕',
    city: 'Bangalore',
    college: 'Christ University',
    interests: ['dance', 'pets', 'travel']
  },
  {
    name: 'Arjun Reddy',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Building early-stage startups 🚀 | Filter coffee over tea',
    city: 'Hyderabad',
    college: 'BITS Pilani',
    interests: ['startups', 'tech', 'cricket']
  },
  {
    name: 'Kavya Nair',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Watercolor artist 🎨 | Chai lover | Weekend road trips',
    city: 'Kochi',
    college: 'NIT Calicut',
    interests: ['art', 'travel', 'cooking']
  },
  {
    name: 'Aditya Singh',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Electronic music producer 🎵 | Night owl 🦉 | Mechanical keyboard nerd',
    city: 'Pune',
    college: 'COEP',
    interests: ['music', 'gaming', 'photography']
  },
  {
    name: 'Sneha Gupta',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Med student 🩺 | Always searching for the best sourdough pizza 🍕',
    city: 'Lucknow',
    college: 'KGMU',
    interests: ['medicine', 'food', 'travel']
  },
  {
    name: 'Vikram Joshi',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Himalayan trek leader 🏔️ | Analog photography | Campfire stories',
    city: 'Dehradun',
    college: 'IIT Roorkee',
    interests: ['trekking', 'photography', 'camping']
  },
  {
    name: 'Ishita Verma',
    age: 20,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Sustainable fashion designer 👗 | Two cats & too many plants 🌿',
    city: 'Jaipur',
    college: 'NIFT Jaipur',
    interests: ['fashion', 'design', 'cats']
  },
  {
    name: 'Rahul Kumar',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Cricket buff 🏏 | Street photography enthusiast | Podcast host',
    city: 'Chennai',
    college: 'IIT Madras',
    interests: ['cricket', 'photography', 'podcasts']
  },
  {
    name: 'Meera Krishnan',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    bio: 'Bharatanatyam dancer 💃 | Neuroscience researcher 🧠',
    city: 'Chennai',
    college: 'IIT Madras',
    interests: ['dance', 'research', 'classical']
  },
  {
    name: 'Karan Malhotra',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Indie acoustic guitarist 🎸 | Road trip lover | Dog whisperer',
    city: 'Chandigarh',
    college: 'PEC Chandigarh',
    interests: ['music', 'travel', 'dogs']
  },
  {
    name: 'Diya Banerjee',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Literature student 📝 | Monsoon lover ☔ | Film geek',
    city: 'Kolkata',
    college: 'Jadavpur University',
    interests: ['writing', 'poetry', 'cinema']
  },
  {
    name: 'Siddharth Rao',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    bio: 'Full-stack builder 💻 | Anime lover 🎌 | Formula 1 fan 🏎️',
    city: 'Bangalore',
    college: 'RVCE',
    interests: ['coding', 'anime', 'f1']
  },
  {
    name: 'Nisha Agarwal',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Vinyasa yoga coach 🧘 | Plant-based kitchen experiments 🥑',
    city: 'Rishikesh',
    college: 'Delhi University',
    interests: ['yoga', 'wellness', 'cooking']
  },
  {
    name: 'Amit Chopra',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    bio: 'Venture analyst 📈 | Weekend squash champion 🎾 | Espresso nerd',
    city: 'Mumbai',
    college: 'IIM Ahmedabad',
    interests: ['finance', 'squash', 'coffee']
  },
  {
    name: 'Riya Saxena',
    age: 20,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Acoustic vocalist 🎤 | Thrift store hunter | Late-night drives',
    city: 'Delhi',
    college: 'Lady Shri Ram College',
    interests: ['singing', 'music', 'fashion']
  },
  {
    name: 'Harsh Pandey',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    bio: 'Marathon finisher 🏃 | Specialty coffee brewer ☕',
    city: 'Pune',
    college: 'VJTI Mumbai',
    interests: ['running', 'coffee', 'fitness']
  },
  {
    name: 'Tanya Bhatt',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Cognitive psychology researcher 🧠 | Contemporary art enthusiast',
    city: 'Ahmedabad',
    college: 'CEPT University',
    interests: ['psychology', 'art', 'reading']
  },
  {
    name: 'Nikhil Desai',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Open water swimmer 🏊 | Tech meme connoisseur 😂',
    city: 'Surat',
    college: 'SVNIT',
    interests: ['swimming', 'gaming', 'tech']
  },
  {
    name: 'Pooja Kulkarni',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Civil architect 🏛️ | Solo backpacker across 12 countries ✈️',
    city: 'Nagpur',
    college: 'VNIT Nagpur',
    interests: ['architecture', 'travel', 'hiking']
  },
  {
    name: 'Dev Sharma',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Open-mic stand-up 🎭 | Biryani purist | Sci-fi collector',
    city: 'Hyderabad',
    college: 'IIIT Hyderabad',
    interests: ['comedy', 'writing', 'food']
  },
  {
    name: 'Saanvi Iyer',
    age: 20,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Carnatic violinist 🎶 | Ancient architecture nerd 📜',
    city: 'Mysore',
    college: 'SJCE Mysore',
    interests: ['music', 'history', 'art']
  },
  {
    name: 'Manish Tiwari',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'AI researcher 📊 | Rapid chess player ♟️ | Sci-fi reader',
    city: 'Noida',
    college: 'NSUT Delhi',
    interests: ['ai', 'chess', 'books']
  },
  {
    name: 'Aarohi Jain',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Urban designer 🌿 | Pottery lover 🏺 | Sunset sketches',
    city: 'Indore',
    college: 'IIT Indore',
    interests: ['design', 'pottery', 'plants']
  },
  {
    name: 'Pranav Menon',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Travel filmmaker 📸 | Surf lessons in South Goa 🏄',
    city: 'Goa',
    college: 'BITS Goa',
    interests: ['surfing', 'photography', 'filmmaking']
  },
  {
    name: 'Shreya Das',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Stage actor 🎭 | Chai over everything ☕ | Rabindra Sangeet',
    city: 'Kolkata',
    college: 'Presidency University',
    interests: ['theatre', 'chai', 'writing']
  },
  {
    name: 'Varun Kapoor',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Automotive engineer ⚙️ | Point guard 🏀 | Classic rock',
    city: 'Ludhiana',
    college: 'Thapar Institute',
    interests: ['engineering', 'basketball', 'music']
  },
  {
    name: 'Aisha Khan',
    age: 20,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    bio: 'Investigative reporter 📰 | Documentaries & deep conversations',
    city: 'Lucknow',
    college: 'Aligarh Muslim University',
    interests: ['journalism', 'politics', 'travel']
  },
  {
    name: 'Tejas Garg',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Deep learning researcher 🤖 | State badminton player 🏸',
    city: 'Bangalore',
    college: 'IISc Bangalore',
    interests: ['ai', 'badminton', 'hiking']
  }
];

// Profiles that have already liked demo user (user ID 1)
const PROFILES_THAT_LIKED_USER = [2, 4, 7, 11, 14, 18, 24, 27];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS matches CASCADE');
    await client.query('DROP TABLE IF EXISTS swipes CASCADE');
    await client.query('DROP TABLE IF EXISTS profiles CASCADE');

    await client.query(`
      CREATE TABLE profiles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        photo TEXT,
        bio TEXT,
        city VARCHAR(100),
        college VARCHAR(200),
        interests TEXT[] DEFAULT '{}'
      )
    `);

    await client.query(`
      CREATE TABLE swipes (
        id SERIAL PRIMARY KEY,
        swiper_id INTEGER NOT NULL REFERENCES profiles(id),
        target_id INTEGER NOT NULL REFERENCES profiles(id),
        action VARCHAR(10) NOT NULL CHECK (action IN ('like', 'pass')),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(swiper_id, target_id)
      )
    `);

    await client.query(`
      CREATE TABLE matches (
        id SERIAL PRIMARY KEY,
        user1_id INTEGER NOT NULL REFERENCES profiles(id),
        user2_id INTEGER NOT NULL REFERENCES profiles(id),
        matched_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user1_id, user2_id)
      )
    `);

    for (const p of MOCK_PROFILES) {
      await client.query(
        `INSERT INTO profiles (name, age, photo, bio, city, college, interests)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [p.name, p.age, p.photo, p.bio, p.city, p.college, p.interests]
      );
    }

    for (const profileId of PROFILES_THAT_LIKED_USER) {
      await client.query(
        `INSERT INTO swipes (swiper_id, target_id, action) VALUES ($1, 1, 'like')`,
        [profileId]
      );
    }

    await client.query('COMMIT');

    console.log(`✅ Seeded ${MOCK_PROFILES.length} high-quality profiles`);
    console.log(`✅ ${PROFILES_THAT_LIKED_USER.length} profiles have pre-liked the demo user`);
    console.log('✅ Database ready!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
