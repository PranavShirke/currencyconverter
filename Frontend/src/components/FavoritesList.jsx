import { Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteFavorite, fetchFavorites } from '../api/favorites.js';
import { getApiError } from '../api/client.js';

export default function FavoritesList() {
  const queryClient = useQueryClient();
  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] })
  });

  if (favoritesQuery.isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-16 animate-pulse rounded-lg bg-white shadow-soft" />
        <div className="h-16 animate-pulse rounded-lg bg-white shadow-soft" />
      </div>
    );
  }

  if (favoritesQuery.error) {
    return <p className="rounded-lg bg-white p-5 text-sm text-red-600 shadow-soft">{getApiError(favoritesQuery.error)}</p>;
  }

  if (!favoritesQuery.data?.length) {
    return <p className="rounded-lg bg-white p-5 text-sm text-slate-500 shadow-soft">Saved currency pairs will appear here.</p>;
  }

  return (
    <ul className="space-y-3">
      {favoritesQuery.data.map((favorite) => (
        <li
          key={favorite.id}
          className="flex items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-soft"
        >
          <div>
            <p className="font-semibold text-ink">
              {favorite.base} to {favorite.target}
            </p>
            <p className="mt-1 text-sm text-slate-500">Saved pair</p>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            type="button"
            onClick={() => deleteMutation.mutate(favorite.id)}
            aria-label={`Delete ${favorite.base} to ${favorite.target}`}
            title="Delete favorite"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
