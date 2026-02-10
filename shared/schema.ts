export * from "./models/auth";
export * from "./models/chat";

import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

export const careerPaths = pgTable("career_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  avgSalary: text("avg_salary"),
  demandLevel: text("demand_level"), // High, Medium, Low
  skillsKeywords: text("skills_keywords").array(),
});

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Matches users.id
  role: text("role").notNull(),
  goal: text("goal"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  roadmapId: integer("roadmap_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // Technical, Soft Skill, Tools
  status: text("status").default("pending"), // pending, in-progress, completed
  level: text("level"), // beginner, intermediate, advanced
  order: integer("order").default(0),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  skillId: integer("skill_id").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  type: text("type"), // course, article, video, book
});

// RELATIONS
export const roadmapsRelations = relations(roadmaps, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  roadmap: one(roadmaps, {
    fields: [skills.roadmapId],
    references: [roadmaps.id],
  }),
  resources: many(resources),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  skill: one(skills, {
    fields: [resources.skillId],
    references: [skills.id],
  }),
}));

// SCHEMAS
export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({ id: true, userId: true, createdAt: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });
export const insertCareerPathSchema = createInsertSchema(careerPaths).omit({ id: true });

export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Skill = typeof skills.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type CareerPath = typeof careerPaths.$inferSelect;

export type GenerateRoadmapRequest = {
  role: string;
  goal: string;
  currentLevel: string; // Beginner, Intermediate, etc.
};

export type FullRoadmap = Roadmap & {
  skills: (Skill & { resources: Resource[] })[];
};
