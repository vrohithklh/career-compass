import { z } from 'zod';
import { insertRoadmapSchema, insertSkillSchema, roadmaps, skills, resources, careerPaths } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  roadmaps: {
    generate: {
      method: 'POST' as const,
      path: '/api/roadmaps/generate' as const,
      input: z.object({
        role: z.string(),
        goal: z.string(),
        currentLevel: z.string(),
      }),
      responses: {
        201: z.custom<any>(), // Returns FullRoadmap, but complex to type exactly in Zod right now
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/roadmaps' as const,
      responses: {
        200: z.array(z.custom<typeof roadmaps.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/roadmaps/:id' as const,
      responses: {
        200: z.custom<typeof roadmaps.$inferSelect & { skills: (typeof skills.$inferSelect & { resources: typeof resources.$inferSelect[] })[] }>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/roadmaps/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  skills: {
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/skills/:id/status' as const,
      input: z.object({
        status: z.enum(['pending', 'in-progress', 'completed']),
      }),
      responses: {
        200: z.custom<typeof skills.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  careerPaths: {
    list: {
      method: 'GET' as const,
      path: '/api/career-paths' as const,
      responses: {
        200: z.array(z.custom<typeof careerPaths.$inferSelect>()),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
