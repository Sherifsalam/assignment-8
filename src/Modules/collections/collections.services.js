import mongoose from "mongoose";

export const createBooksCollection = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const collections = await db.listCollections({ name: "books" }).toArray();
    if (collections.length > 0) {
      return res
        .status(400)
        .json({ message: "Collection 'books' already exists." });
    }

    await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              description: "Title is required and must be a string.",
            },
          },
        },
      },
    });

    res
      .status(201)
      .json({ message: "Collection 'books' created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const InsertAuthors = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const docs = req.body;
    const docsToInsert = Array.isArray(docs) ? docs : [docs];

    await db.collection("authors").insertMany(docsToInsert);

    res.status(201).json({ message: "Authors inserted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const CreateLogsCollection = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const collections = await db.listCollections({ name: "logs" }).toArray();
    if (collections.length > 0) {
      return res
        .status(400)
        .json({ message: "Collection 'logs' already exists." });
    }

    await db.createCollection("logs", {
      capped: true,
      size: 1024 * 1024,
    });

    res
      .status(201)
      .json({ message: "Collection 'logs' created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const CreateIndexForTitle = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    await db.collection("books").createIndex({ title: 1 });

    res.status(201).json({ message: "Index on 'title' created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

export const Insertlog = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const logEntry = req.body;

    await db.collection("logs").insertOne(logEntry);

    res.status(201).json({ message: "Log entry inserted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};