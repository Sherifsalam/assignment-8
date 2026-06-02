import { Router } from "express";
import {
  InsertBook,
  InsertManyBooks,
  updateBookYear,
  GetBook,
  GetBooksByRangeYear,
  GetBooksByGenre,
  GetBooksSkipLimit,
  GetBooksByIntegerYear,
  GetBooksByExcludeGenre,
  DeleteBooksByYear,
  AggregateBooksAfter2000,
  AggregateBooksTitleAuthorYear,
  AggregateBooksUnwindGenres,
  AggregateBooksWithLogs,
} from "./books.services.js";

const router = Router();

router.post("/", InsertBook);
router.post("/batch", InsertManyBooks);
router.patch("/:title", updateBookYear); 
router.get("/title", GetBook); 
router.get("/year", GetBooksByRangeYear); 
router.get("/genre", GetBooksByGenre);  
router.get("/skip-limit", GetBooksSkipLimit);
router.get("/integer-year", GetBooksByIntegerYear);
router.get("/exclude-genre", GetBooksByExcludeGenre);
router.delete("/before-year", DeleteBooksByYear);
router.get("/aggregate-after-2000", AggregateBooksAfter2000);
router.get("/aggregate-title-author-year", AggregateBooksTitleAuthorYear);
router.get("/aggregate-genres", AggregateBooksUnwindGenres); 
router.get("/aggregate-with-logs", AggregateBooksWithLogs);
export default router;
