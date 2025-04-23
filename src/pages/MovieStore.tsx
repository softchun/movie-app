import React, { useEffect, useState } from "react";
import axios from "axios";
import { CartItem, Movie } from "../types";
import Cart from "../components/Cart";
import MovieItem from "../components/MovieItem";

const API_KEY = import.meta.env.VITE_API_KEY;
const MOVIE_PRICE = 200; // mock price

const MovieStore: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    setIsLoading(true);
    setCurrentPage(1);
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    setMovies(
      res.data.results.map((m: Movie) => ({
        ...m,
        price: MOVIE_PRICE,
        timestamp: new Date().getTime(),
      }))
    );
    setTotalPages(res.data.total_pages);
    setIsLoading(false);
  };

  const searchMovies = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setCurrentPage(1);
    setSearchKey(query);
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
    );
    setMovies(
      res.data.results.map((m: Movie) => ({
        ...m,
        price: MOVIE_PRICE,
        timestamp: new Date().getTime(),
      }))
    );
    setTotalPages(res.data.total_pages);
    setIsLoading(false);
  };

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const nextPage = currentPage + 1;
    const res = await axios.get(
      query
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${nextPage}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${nextPage}`
    );
    setMovies((prev) => [
      ...prev,
      ...res.data.results.map((m: Movie) => ({
        ...m,
        price: MOVIE_PRICE,
        timestamp: new Date().getTime(),
      })),
    ]);
    setCurrentPage(nextPage);
    setIsLoading(false);
  };

  const addToCart = (movie: Movie) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === movie.id);
      if (existing) {
        return prev.map((item) =>
          item.id === movie.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...movie, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="z-40 h-16 w-full max-w-screen flex items-center justify-between px-4 bg-[#C890A7]">
        <div className="text-xl font-bold text-[#212121]">🍿 Movie App</div>
        <Cart items={cart} clearCart={clearCart} />
      </div>
      <div className="p-6 flex-1 flex flex-col gap-6 w-full overflow-auto">
        <div className="flex gap-2">
          <div className="flex gap-2 w-full max-w-[450px]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchMovies()}
              placeholder="Search movies..."
              className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#A35C7A] text-black"
            />
            <button
              onClick={searchMovies}
              className="text-white px-4 py-2 rounded-xl bg-[#A35C7A] hover:opacity-90"
            >
              Search
            </button>
          </div>
        </div>
        {searchKey && (
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-[#A35C7A]">
              Search result: {searchKey}
            </div>
            <button
              onClick={() => {
                setSearchKey("");
                getMovies();
              }}
              className="text-[#A35C7A] text-sm px-2 py-1 rounded-xl bg-[#FBF5E5] hover:opacity-90 cursor-pointer"
            >
              ✖
            </button>
          </div>
        )}
        {!searchKey && (
          <div className="text-3xl font-bold text-[#A35C7A]">Trending</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieItem
              key={movie.id + "-" + movie.timestamp}
              movie={movie}
              addToCart={addToCart}
            />
          ))}
        </div>
        {movies.length === 0 && !isLoading && (
          <div className="text-base text-gray-500 text-center">
            There are no movies that matched your query.
          </div>
        )}
        {isLoading && (
          <div className="text-base text-gray-500 text-center">Loading...</div>
        )}
        {currentPage < totalPages && !isLoading && (
          <div className="mx-auto w-fit">
            <button
              onClick={loadMore}
              className="text-[#A35C7A] px-4 py-2 rounded-xl bg-[#FBF5E5] hover:opacity-90"
            >
              Click to load more...
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieStore;
