import { connectToDatabase } from "@/lib/db/mongodb";
import { Project } from "@/lib/models";

const UPDATES: Record<string, { category: string; client: "mobile" | "web" }> = {
  "meditouch": { category: "Mobile App", client: "mobile" },
  "cosmos-its": { category: "Full-Stack Web App", client: "web" },
  "gadgetwizard": { category: "Full-Stack E-Commerce", client: "web" },
  "aven-ai-career-workspace": { category: "Full-Stack Web App", client: "web" },
  "portfolio-website": { category: "Full-Stack Web App", client: "web" },
  "dorm-of-decents": { category: "Full-Stack Web App", client: "web" },
  "viae": { category: "Full-Stack Web App", client: "web" },
  "neuroweb": { category: "Landing Page", client: "web" },
  "nex": { category: "Mobile App", client: "mobile" },
  "quran-companion": { category: "Mobile App", client: "mobile" },
  "melbourne-acid-washing": { category: "Mobile App", client: "mobile" },
  "uiu-cgpa-calculator": { category: "Web Tool", client: "web" },
  "pharmbrew": { category: "Flutter Web App", client: "web" },
};

async function main() {
  console.log("Connecting to MongoDB...");
  const db = await connectToDatabase();
  if (!db) {
    console.error("Failed to connect to database");
    process.exit(1);
  }

  const projects = await Project.find({});
  console.log(`Found ${projects.length} projects in MongoDB.`);

  for (const p of projects) {
    const slug = p.slug;
    const update = UPDATES[slug];
    if (update) {
      p.category = update.category;
      p.client = update.client;
      await p.save();
      console.log(`Updated "${p.title || p.name}" (${slug}) -> category: "${update.category}", client: "${update.client}"`);
    } else {
      console.warn(`No mapping found for slug "${slug}"`);
    }
  }

  console.log("All projects updated successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error updating project categories:", err);
  process.exit(1);
});
