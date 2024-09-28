'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  let [movies, setMovies] = useState([]);
  let [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=833ef3f542ae8104ba9ec504d6bafb1e&page=${page}`)
      .then(response => response.json())
      .then(data => setMovies(data.results)); // Assuming the API returns an array of movies in `data.results`
  }, [page]);

  const handleNextPage = () => setPage(prevPage => prevPage + 1);
  const handlePrevPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map(movie => (
          <div key={movie.id} className="bg-white shadow-md rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
            <Image
              className="w-full h-60 object-cover"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={150}
              height={225}
              priority
            />
            <div className="p-3">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{movie.title}</h2>
              <p className="text-gray-700 mb-2"><strong className="font-semibold">Release Date:</strong> {movie.release_date}</p>
              <p className="text-gray-700 mb-2"><strong className="font-semibold">Runtime:</strong> {movie.runtime} minutes</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePrevPage} disabled={page === 1} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">Previous</button>
        <button onClick={handleNextPage} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}