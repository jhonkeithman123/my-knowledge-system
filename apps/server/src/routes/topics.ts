import { Router, type Request, type Response } from "express";
import * as api from "@my-knowledge/api";
import { asyncHandler } from "../middleware/asyncHandler";

export const topicsRouter = Router();

// GET /api/topics - List all root topics
topicsRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const topics = await api.getTopics();
    res.json({ success: true, data: topics });
  }),
);

// GET /api/topics/:id - Get single topic
topicsRouter.get(
  "/:id",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const topic = await api.getTopic(req.params.id);
    res.json({ success: true, data: topic });
  }),
);

// GET /api/topics/:id/subtopics - Get subtopics
topicsRouter.get(
  "/:id/subtopics",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const subtopics = await api.getSubtopics(req.params.id);
    res.json({ success: true, data: subtopics });
  }),
);

// GET /api/topics/:id/concepts - Get concepts for a topic
topicsRouter.get(
  "/:id/concepts",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const concepts = await api.getConcepts(req.params.id);
    res.json({ success: true, data: concepts });
  }),
);

// POST /api/topics - Create new topic
topicsRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Name is required",
      });
    }

    const topic = await api.createTopic({ name, description, parent_id });
    res.status(201).json({ success: true, data: topic });
  }),
);

// PUT /api/topics/:id - Update topic
topicsRouter.put(
  "/:id",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { name, description } = req.body;
    const topic = await api.updateTopic(req.params.id, { name, description });
    res.json({ success: true, data: topic });
  }),
);

// DELETE /api/topics/:id - Delete topic
topicsRouter.delete(
  "/:id",
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await api.deleteTopic(req.params.id);
    res.json({ success: true, message: "Topic deleted" });
  }),
);
