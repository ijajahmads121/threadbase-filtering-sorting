import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// ─────────────────────────────────────────────────────────────
// GET /api/threads?search=<term>&sort=<newest|oldest>
//
// Search and sort are translated into Prisma query arguments so the
// database returns only matching rows in the requested order.
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    const where =
      typeof search === "string" && search.trim()
        ? { title: { contains: search.trim(), mode: "insensitive" } }
        : {};

    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    const threads = await prisma.thread.findMany({
      where,
      orderBy,
      include: {
        author: { select: { name: true, avatarUrl: true } },
        _count: { select: { comments: true } },
      },
    });

    res.json({ threads });
  } catch (error) {
    next(error);
  }
});

export default router;
