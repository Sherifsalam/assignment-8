import { Router } from "express";
import {
  createBooksCollection,
  InsertAuthors,
  CreateLogsCollection,
  CreateIndexForTitle,
  Insertlog
} from "./collections.services.js";

const router = Router();

router.post("/books", createBooksCollection);
router.post("/authors", InsertAuthors);
router.post("/logs/capped", CreateLogsCollection);
router.post("/books/index", CreateIndexForTitle);
router.post("/logs", Insertlog);
export default router;