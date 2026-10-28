import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// ─────────────────────────────────────────────────────────────
// GET /api/threads?search=<term>&sort=<newest|oldest>
//
// ⚠️  THIS IS THE STARTER (BROKEN) VERSION.
// It reads req.query correctly, but it filters and sorts an
// IN-MEMORY ARRAY with JavaScript after loading every row.
// Your job: replace the array logic with a real Prisma
// `where` + `orderBy` so the DATABASE does the filtering.
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    // Loads EVERY thread into memory, every request. 🚫
    let threads = await prisma.thread.findMany({
      include: {
        author: { select: { name: true, avatarUrl: true } },
        _count: { select: { comments: true } },
      },
    });

    // TODO: remove this in-memory filter — build a Prisma `where` instead.
    if (search) {
      threads = threads.filter((t) =>
        t.title.toLowerCase().includes(String(search).toLowerCase())
      );
    }

    // TODO: remove this in-memory sort — build a Prisma `orderBy` instead.
    if (sort === "oldest") {
      threads.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ threads });
  } catch (error) {
    next(error);
  }
});

export default router;
