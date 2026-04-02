import BookCard from "@/components/BookCard";
import HeroSection from "@/components/Hero";
import { getAllBooks } from "@/lib/actions/book.actions";

const Home = async () => {
  const bookResult = await getAllBooks();
  const books = bookResult?.success ? (bookResult?.data ?? []) : [];
  return (
    <div className="wrapper container">
      <HeroSection />
      <div className="library-books-grid">
        {books?.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
