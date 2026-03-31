import BookCard from "@/components/BookCard";
import HeroSection from "@/components/Hero";
import { sampleBooks } from "@/lib/constants";

const Home = () => {
  return (
    <div className="wrapper container">
      <HeroSection />
      <div className="library-books-grid">
        {
          sampleBooks.map((book) => (
            <BookCard key={book._id} title={book.title} author={ book.author} coverURL={book.coverURL} slug={book.slug} />
          ))
        }

      </div>
    </div>
  );
};

export default Home;
