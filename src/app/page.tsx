'use client';

import Image from "next/image";
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

interface Movie {
    id: number;
    title: string;
    poster_path: string | null; // Allow null values
    vote_average: number;
    release_date: string;
}

interface ApiResponse {
    results: Movie[];
    total_pages: number;
}

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    let [movies, setMovies] = useState<Movie[]>([]);
    let [page, setPage] = useState<number>(initialPage);
    let [error, setError] = useState<Error | null>(null);
    let [loading, setLoading] = useState<boolean>(false);
    let [search, setSearch] = useState<string>(initialSearch);
    let [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        setLoading(true);

        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
            setError(new Error("API key is missing"));
            setLoading(false);
            return;
        }

        const params = new URLSearchParams({
            api_key: apiKey,
            page: page.toString(),
        });

        if (search) {
            params.append('query', search);
        }

        const url = search
            ? `https://api.themoviedb.org/3/search/movie?${params.toString()}`
            : `https://api.themoviedb.org/3/movie/popular?${params.toString()}`;

        fetch(url)
            .then(response => response.json())
            .then((data: ApiResponse) => {
                setMovies(data.results);
                setTotalPages(data.total_pages);
                setLoading(false);
            })
            .catch((error: Error) => {
                setError(error);
                setLoading(false);
            });

        // Update the URL with search and page parameters
        router.push(`/?search=${search}&page=${page}`);

    }, [page, search]); // Add search to dependency array

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset page to 1 when search changes
    };

    const handleNextPage = () => setPage(prevPage => prevPage + 1);
    const handlePrevPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-center my-4">
                <div className="relative w-full max-w-md py-10">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search for movies..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-500" data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            {error ? (
                <div className="text-red-500 text-center">An error occurred: {error.message}</div>
            ) : loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader"></div>
                </div>
            ) : (
                <>
                    <div></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4">
                        {movies.map(movie => (
                            <div key={movie.id} className="overflow-hidden">
                                <div className="relative w-full h-80 bg-gray-800 rounded-md">
                                    {movie.poster_path ? (
                                        <Image
                                            className="w-full h-80 object-cover rounded-md"
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title}
                                            width={150}
                                            height={225}
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-80 flex items-center justify-center bg-gray-700 text-white">
                                            No Image Available
                                        </div>
                                    )}
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
                                    <p className="mb-2 text-md">{new Date(movie.release_date).toLocaleDateString('de-DE')}</p>
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
                            disabled={page >= totalPages} // Disable if on the last page
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}