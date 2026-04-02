"use server";
import connectToDatabase from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/type";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import { revalidatePath } from "next/cache";

export const getAllBooks = async () => {
  try {
    await connectToDatabase();
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    return {
      success: true,
      data: serializeData(books),
    };
  } catch (e) {
    console.log("get all books fetch to failed", e);
    return {
      success: false,
      error: e,
    };
  }
};

export type BookBySlugData = {
  title: string;
  author: string;
  coverURL: string;
  persona: string;
};

export const getBookBySlug = async (slug: string) => {
  try {
    await connectToDatabase();

    const book = await Book.findOne({ slug }).lean();

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (e) {
    console.error("Error fetching book by slug", e);
    return {
      success: false,
      error: e,
    };
  }
};

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(title);
    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }
    return {
      exists: false,
    };
  } catch (error) {
    console.error("Error checking book exists", error);
    return {
      success: false,
      exists: false,
      error:
        error instanceof Error ? error.message : "Failed to check book exists",
    };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(data.title);
    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        success: true,
        // data: JSON.parse(JSON.stringify(existingBook)),
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }
    const book = await Book.create({ ...data, slug, totalSegments: 0 });
    revalidatePath("/");

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    console.error("Error creating a books", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create book",
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectToDatabase();
    console.log("saving book segments...");
    const segmentToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        clerkId,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );
    await BookSegment.insertMany(segmentToInsert);
    await Book.findByIdAndUpdate(bookId, {
      totalSegments: segments.length,
    });
    console.log("Book segment saved successfully");
    return {
      success: true,
      data: { segmentCreated: segments.length },
    };
  } catch (error) {
    console.error("Error saving book segment", error);
    await BookSegment.deleteMany({ bookId });
    await Book.findByIdAndDelete(bookId);
    console.error(
      "Delete book segment and book due to failure to save segments",
    );

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save book segments",
    };
  }
};
