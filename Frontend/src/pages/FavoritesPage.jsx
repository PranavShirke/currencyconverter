import { Navigate, useOutletContext } from 'react-router-dom';
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
      <div>
        <h1 className="text-3xl font-semibold tracking-normal text-ink">Favorites</h1>
        <p className="mt-2 text-slate-600">Your saved currency pairs.</p>
      </div>
      <FavoritesList />
    </div>
  );
}
