import { Router, type Request, type Response } from "express";
import * as api from "@my-knowledge/api";
import { asyncHandler } from "../middleware/asyncHandler";

export const searchRouter = Router();

// Helper to extract string from query param
function getQueryParam(param: any): string | undefined {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && param.length > 0) return String(param[0]);
  return undefined;
}

// GET /api/search?q=query - Search all content
searchRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const query = getQueryParam(req.query.q);

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    const results = await api.searchAll(query);
    res.json({
      success: true,
      data: results,
      meta: {
        query,
        total:
          results.topics.length +
          results.subtopics.length +
          results.concepts.length,
      },
    });
  }),
);

// GET /api/search/concepts?q=query - Search concepts only
searchRouter.get(
  "/concepts",
  asyncHandler(async (req: Request, res: Response) => {
    const query = getQueryParam(req.query.q);

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    const concepts = await api.searchConcepts(query);
    res.json({
      success: true,
      data: concepts,
      meta: { query, total: concepts.length },
    });
  }),
);
