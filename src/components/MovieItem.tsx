import { Movie } from "../types";
import moviePlaceholder from "../assets/placeholder.jpg";

type Props = {
  movie: Movie;
  addToCart: (data: Movie) => void;
};

const MovieItem: React.FC<Props> = ({ movie, addToCart }) => {
  return (
    <div className="space-y-2 relative">
      <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-[#A35C7A] border-2 border-[#C890A7] flex justify-center items-center text-xs font-bold text-white">
        {movie.vote_average.toPrecision(3)}
      </div>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : moviePlaceholder
        }
        alt={movie.title}
        className="rounded-xl"
      />
      <div className="text-base font-bold text-[#212121]">{movie.title}</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => addToCart(movie)}
          className="text-xs font-bold rounded-xl text-white py-1 px-2 bg-[#A35C7A] hover:opacity-90"
        >
          Add to Cart
        </button>
        <div className="text-sm font-bold text-[#A35C7A]">{(movie.price ?? 0).toLocaleString()} ฿</div>
      </div>
    </div>
  );
};

export default MovieItem;
