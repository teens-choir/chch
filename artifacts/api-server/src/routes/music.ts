import { Router, type IRouter } from "express";
import { db, usersTable, musicTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

async function requireAdmin(req: any, res: any): Promise<boolean> {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return false;
  }
  return true;
}

router.get("/music", async (req, res): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [currentUser] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  if (!currentUser) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const files = await db.select().from(musicTable).orderBy(musicTable.createdAt);

  const filtered = currentUser.role === "admin"
    ? files
    : files.filter(f => f.targetVoicePart === null || f.targetVoicePart === currentUser.voicePart);

  res.json(filtered.map(f => ({
    id: f.id,
    title: f.title,
    url: f.url,
    fileType: f.fileType,
    targetVoicePart: f.targetVoicePart,
    createdAt: f.createdAt.toISOString(),
  })));
});

router.post("/music", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const { title, url, fileType, targetVoicePart } = req.body;
  if (!title || !url) {
    res.status(400).json({ error: "Title and URL required" });
    return;
  }

  const [music] = await db.insert(musicTable).values({
    title,
    url,
    fileType: fileType || "other",
    targetVoicePart: targetVoicePart || null,
    authorId: req.session.userId!,
  }).returning();

  res.status(201).json({
    id: music.id,
    title: music.title,
    url: music.url,
    fileType: music.fileType,
    targetVoicePart: music.targetVoicePart,
    createdAt: music.createdAt.toISOString(),
  });
});

router.delete("/music/:id", async (req, res): Promise<void> => {
  if (!await requireAdmin(req, res)) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  await db.delete(musicTable).where(eq(musicTable.id, id));
  res.sendStatus(204);
});

export default router;
