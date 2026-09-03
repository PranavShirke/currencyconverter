import { X } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn } from '../api/auth.js';
import { getApiError } from '../api/client.js';
import { useUserStore } from '../store/useUserStore.js';

export default function SignInModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      setName('');
      setError('');
      onClose();
    },
    onError: (mutationError) => setError(getApiError(mutationError, 'Could not sign in'))
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Sign in</h2>
          <button
            className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-ink"
            type="button"
            onClick={onClose}
            aria-label="Close sign in modal"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({ name });
          }}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Display name</span>
            <input
              className="h-12 w-full rounded-md border border-slate-200 px-3 text-base shadow-sm"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            className="h-11 w-full rounded-md bg-accent px-4 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Signing in...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
