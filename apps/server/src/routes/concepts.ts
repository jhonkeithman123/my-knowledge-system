import { Router, type Request, type Response } from "express";
import * as api from "@my-knowledge/api";
import { asyncHandler } from "../middleware/asyncHandler";

export const conceptsRouter = Router();

// GET /api/concepts/:id - Get single concept
conceptsRouter.get(
  "/:id",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const concept = await api.getConcept(req.params.id);
    res.json({ success: true, data: concept });
  }),
);

// POST /api/concepts - Create new concept
conceptsRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { topic_id, name, definition } = req.body;

    if (!topic_id || !name || !definition) {
      return res.status(400).json({
        success: false,
        error: "topic_id, name, and definition are required",
      });
    }

    const concept = await api.createConcept({ topic_id, name, definition });
    res.status(201).json({ success: true, data: concept });
  }),
);

// PUT /api/concepts/:id - Update concept
conceptsRouter.put(
  "/:id",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { name, definition } = req.body;
    const concept = await api.updateConcept(req.params.id, {
      name,
      definition,
    });
    res.json({ success: true, data: concept });
  }),
);

// DELETE /api/concepts/:id - Delete concept
conceptsRouter.delete(
  "/:id",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await api.deleteConcept(req.params.id);
    res.json({ success: true, message: "Concept deleted" });
  }),
);
