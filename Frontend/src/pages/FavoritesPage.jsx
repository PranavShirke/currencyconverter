import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import FavoritesList from '../components/FavoritesList.jsx';
import { useUserStore } from '../store/useUserStore.js';

export default function FavoritesPage() {
  const { openSignIn } = useOutletContext();
  const isRegistered = useUserStore((state) => state.isRegistered);

  useEffect(() => {
    if (!isRegistered) {
      openSignIn();
    }
  }, [isRegistered, openSignIn]);

  if (!isRegistered) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-ink">Favorites</h1>
          <p className="mt-2 text-slate-600">Your saved currency pairs.</p>
        </div>
        <Link
          className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-accent"
          to="/"
        >
          <ArrowLeft size={17} />
          Back to converter
        </Link>
      </div>
      <FavoritesList />
    </div>
  );
}
