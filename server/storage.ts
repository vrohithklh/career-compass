import { db } from "./db";
import {
  roadmaps,
  skills,
  resources,
  careerPaths,
  type InsertRoadmap,
  type InsertSkill,
  type InsertResource,
  type InsertCareerPath,
  type Roadmap,
  type Skill,
  type Resource,
  type CareerPath,
  type FullRoadmap
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Roadmaps
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  getRoadmap(id: number): Promise<FullRoadmap | undefined>;
  getUserRoadmaps(userId: string): Promise<Roadmap[]>;
  deleteRoadmap(id: number): Promise<void>;

  // Skills
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkillStatus(id: number, status: string): Promise<Skill | undefined>;
  
  // Resources
  createResource(resource: InsertResource): Promise<Resource>;

  // Career Paths
  getCareerPaths(): Promise<CareerPath[]>;
  createCareerPath(path: InsertCareerPath): Promise<CareerPath>;
  seedCareerPaths(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const [newRoadmap] = await db.insert(roadmaps).values(roadmap).returning();
    return newRoadmap;
  }

  async getRoadmap(id: number): Promise<FullRoadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, id));
    if (!roadmap) return undefined;

    const roadmapSkills = await db.select().from(skills).where(eq(skills.roadmapId, id)).orderBy(skills.order);
    
    // Fetch resources for each skill
    const skillsWithResources = await Promise.all(roadmapSkills.map(async (skill) => {
      const skillResources = await db.select().from(resources).where(eq(resources.skillId, skill.id));
      return { ...skill, resources: skillResources };
    }));

    return { ...roadmap, skills: skillsWithResources };
  }

  async getUserRoadmaps(userId: string): Promise<Roadmap[]> {
    return db.select().from(roadmaps).where(eq(roadmaps.userId, userId)).orderBy(roadmaps.createdAt);
  }

  async deleteRoadmap(id: number): Promise<void> {
    // Cascade delete handles skills/resources if configured, but explicit delete is safe
    const roadmapSkills = await db.select().from(skills).where(eq(skills.roadmapId, id));
    for (const skill of roadmapSkills) {
      await db.delete(resources).where(eq(resources.skillId, skill.id));
    }
    await db.delete(skills).where(eq(skills.roadmapId, id));
    await db.delete(roadmaps).where(eq(roadmaps.id, id));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async updateSkillStatus(id: number, status: string): Promise<Skill | undefined> {
    const [updated] = await db.update(skills)
      .set({ status })
      .where(eq(skills.id, id))
      .returning();
    return updated;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async getCareerPaths(): Promise<CareerPath[]> {
    return db.select().from(careerPaths);
  }

  async createCareerPath(path: InsertCareerPath): Promise<CareerPath> {
    const [newPath] = await db.insert(careerPaths).values(path).returning();
    return newPath;
  }

  async seedCareerPaths(): Promise<void> {
    const existing = await this.getCareerPaths();
    if (existing.length > 0) return;

    const paths = [
      {
        title: "Machine Learning Engineer",
        description: "Design and build AI models and systems.",
        avgSalary: "$150,000",
        demandLevel: "High",
        skillsKeywords: ["Python", "TensorFlow", "PyTorch", "Math", "System Design"],
      },
      {
        title: "Data Scientist",
        description: "Analyze complex data to help organizations make better decisions.",
        avgSalary: "$140,000",
        demandLevel: "High",
        skillsKeywords: ["Python", "SQL", "Statistics", "Visualization", "Machine Learning"],
      },
      {
        title: "AI Product Manager",
        description: "Bridge the gap between business needs and AI technology.",
        avgSalary: "$160,000",
        demandLevel: "Medium",
        skillsKeywords: ["Product Management", "AI Ethics", "Strategy", "Communication"],
      },
      {
        title: "NLP Engineer",
        description: "Specialized in teaching machines to understand human language.",
        avgSalary: "$155,000",
        demandLevel: "High",
        skillsKeywords: ["NLP", "Transformers", "Linguistics", "Python", "Deep Learning"],
      }
    ];

    for (const path of paths) {
      await this.createCareerPath(path);
    }
  }
}

export const storage = new DatabaseStorage();
