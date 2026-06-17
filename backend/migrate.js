const mongoose = require("mongoose");

// We need to define the schema exactly as it is in your models.js
const conceptSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  metadata: {
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    concept: { type: String, required: true },
    question_type: { type: String, required: true },
    generated_at: { type: Date, required: true },
    views: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    language: { type: String, default: "" },
    difficulty: { type: String, default: "" },
    design_pattern: { type: String, default: "" },
  },
  summary: { type: String },
  history: [{ updatedAt: { type: Date, default: Date.now }, changeLog: String }],
  isArchived: { type: Boolean, default: false },
  isBookmarked: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
});

async function runMigration() {
  console.log("🚀 Starting Data Migration...");

  try {
    // 1. Connect to Local Database
    console.log("📡 Connecting to LOCAL database...");
    const localDb = await mongoose.createConnection("mongodb://localhost:27017/system_desing").asPromise();
    const LocalModel = localDb.model("Concept", conceptSchema, "designs");

    // 2. Fetch local data
    const localData = await LocalModel.find().lean();
    console.log(`✅ Found ${localData.length} concepts in your local laptop database.`);

    if (localData.length === 0) {
        console.log("No data found locally. Nothing to migrate.");
        process.exit(0);
    }

    // 3. Connect to Atlas (Cloud) Database
    console.log("☁️  Connecting to CLOUD (Atlas) database...");
    const atlasDb = await mongoose.createConnection("mongodb+srv://mahi19:mahi93@cluster0.301oyok.mongodb.net/designs").asPromise();
    const AtlasModel = atlasDb.model("Concept", conceptSchema, "designs");

    // 4. Save data to Atlas
    console.log("⏳ Uploading data to cloud. Please wait...");
    let successCount = 0;
    
    for (const doc of localData) {
      try {
        // We delete the local _id so MongoDB Atlas creates a fresh one for the cloud
        delete doc._id;
        delete doc.__v;
        
        await AtlasModel.create(doc);
        successCount++;
      } catch (err) {
        console.error("Error saving a document:", err.message);
      }
    }

    console.log(`\n🎉 DONE! Successfully uploaded ${successCount} concepts to Atlas!`);
    console.log("Refresh your website, and your data should now be visible! 🚀");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
