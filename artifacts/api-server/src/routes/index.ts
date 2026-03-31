import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import attendanceRouter from "./attendance";
import messagesRouter from "./messages";
import musicRouter from "./music";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(attendanceRouter);
router.use(messagesRouter);
router.use(musicRouter);

export default router;
