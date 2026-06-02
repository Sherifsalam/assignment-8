import mongoose from "mongoose";

export const InsertBook = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const doc = req.body;

    await db.collection("books").insertOne(doc);

    res.status(201).json({ message: "Book inserted successfully." });
  } catch (error) {
    if (error.code === 121) {
      return res
        .status(400)
        .json({ message: "Validation failed. Title is required." });
    }
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const InsertManyBooks = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const docs = req.body;
    const docsToInsert = Array.isArray(docs) ? docs : [docs];

    await db.collection("books").insertMany(docsToInsert);

    res.status(201).json({ message: "Books inserted successfully." });
  } catch (error) {
    if (error.code === 121) {
      return res
        .status(400)
        .json({ message: "Validation failed. Title is required." });
    }
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const updateBookYear = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { title } = req.params;

    const result = await db
      .collection("books")
      .updateOne({ title: title }, { $set: { year: 2022 } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json({ message: "Book year updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const GetBook = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { title } = req.query; // ✅ keep req.query

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const book = await db.collection("books").findOne({ title: title });

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json({ message: "Book found.", book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const GetBooksByRangeYear = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Year is required." });
    }

    const books = await db
      .collection("books")
      .find({
        year: {
          $gte: Number(from),
          $lte: Number(to),
        },
      })
      .toArray();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.status(200).json({ message: "Books found.", books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const GetBooksByGenre = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { genre } = req.query;
    if (!genre) {
      return res.status(400).json({ message: "Genre is required." });
    }
    const books = await db
      .collection("books")
      .find({
        genres: {
          $in: [genre],
        },
      })
      .toArray();
    res.status(200).json({ message: "Books found.", books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const GetBooksSkipLimit = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const books = await db
      .collection("books")
      .find()
      .sort({ year: -1 })
      .skip(2)
      .limit(3)
      .toArray();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.status(200).json({ message: "Books found.", books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const GetBooksByIntegerYear = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const books = await db
      .collection("books")
      .find({
        year: { $type: "int" },
      })
      .toArray();

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with integer year." });
    }

    res.status(200).json({ message: "Books found.", books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const GetBooksByExcludeGenre = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const books = await db
      .collection("books")
      .find({
        genres: { $nin: ["Horror", "Science Fiction"] },
      })
      .toArray();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.status(200).json({ message: "Books found.", books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const DeleteBooksByYear = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    const result = await db.collection("books").deleteMany({
      year: { $lt: Number(year) },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No books found to delete." });
    }

    res.status(200).json({
      message: "Books deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const AggregateBooksAfter2000 = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const books = await db
      .collection("books")
      .aggregate([
        {
          $match: {
            year: { $gt: 2000 },
          },
        },
        {
          $sort: {
            year: -1,
          },
        },
      ])
      .toArray();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.status(200).json({
      message: "Books found.",
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

export const AggregateBooksTitleAuthorYear = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const books = await db
      .collection("books")
      .aggregate([
        {
          $match: {
            year: { $gt: 2000 },
          },
        },
        {
          $project: {
            _id: 0,
            title: 1,
            author: 1,
            year: 1,
          },
        },
      ])
      .toArray();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.status(200).json({ message: "Books found.", books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const AggregateBooksUnwindGenres = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const books = await db
      .collection("books")
      .aggregate([
        {
          $unwind: "$genres",
        },
      ])
      .toArray();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.status(200).json({
      message: "Books found.",
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

export const AggregateBooksWithLogs = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const books = await db
      .collection("books")
      .aggregate([
        {
          $lookup: {
            from: "logs",
            localField: "_id",
            foreignField: "bookId",
            as: "bookLogs",
          },
        },
      ])
      .toArray();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }

    res.status(200).json({
      message: "Books found.",
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};