'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  let [movies, setMovies] = useState([]);
  let [page, setPage] = useState(1);
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    setLoading(true); // Start loading
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMovies(data.results); // Assuming the API returns an array of movies in `data.results`
        setLoading(false); // Stop loading
      })
      .catch(error => {
        setError(error);
        setLoading(false); // Stop loading
      });
  }, [page]);

  const handleNextPage = () => setPage(prevPage => prevPage + 1);
  const handlePrevPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

  return (
    <div className="container mx-auto p-4">
      {error ? (
        <div className="text-red-500 text-center">An error occurred: {error.message}</div>
      ) : loading ? ( // Show loading indicator
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div> {/* Spinner */}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map(movie => (
              <div key={movie.id} className="overflow-hidden">
                <div className="relative w-full h-80 bg-gray-800 rounded-md">
                  <Image
                    className="w-full h-80 object-cover rounded-md "
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={150}
                    height={225}
                    priority
                  />
                  <div className="absolute -bottom-5 right-2 w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700 flex items-center justify-center">
                    <div className="relative w-full h-full rounded-full flex items-center justify-center text-white text-xs">
                      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                        <path
                          className="text-blue-500"
                          strokeDasharray={`${Math.round(movie.vote_average * 10)}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                      {Math.round(movie.vote_average * 10)}%
                    </div>
                  </div>
                </div>

                <div className="p-3 text-white">
                  <h2 className="text-md font-extrabold">{movie.title}</h2>
                  <p className="mb-2 text-md">Release Date: {new Date(movie.release_date).toLocaleDateString('de-DE')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              Next
            </button>
          </div>
        </>
      )
      }
    </div >
  );
}