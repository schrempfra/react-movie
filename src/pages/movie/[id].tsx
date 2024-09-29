import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../app/layout';

export default function MovieDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    setMovie(data);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg text-white">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-extrabold mb-2">{movie.title}</h1>
                    <p className="italic text-gray-400 text-lg">{movie.tagline}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full md:w-1/2 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1 space-y-4">
                        <p className="text-lg"><strong>Release Date:</strong> {movie.release_date}</p>
                        <p className="text-lg"><strong>Rating:</strong> {movie.vote_average} / 10</p>
                        <p className="text-lg"><strong>Overview:</strong> {movie.overview}</p>
                        <p className="text-lg"><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
                        <p className="text-lg"><strong>Runtime:</strong> {movie.runtime} minutes</p>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
                        Add to Watchlist
                    </button>
                </div>
            </div>
        </Layout>
    );
};