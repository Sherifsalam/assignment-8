import express from "express";
import { connectDB } from "./DB/connection.js";
import collectionController from "./Modules/Collections/collections.controller.js";
import booksController from "./Modules/Books/books.controller.js";

export const bootstrap = async () => {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  await connectDB();

  app.use("/collection", collectionController);
  app.use("/books", booksController);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};



