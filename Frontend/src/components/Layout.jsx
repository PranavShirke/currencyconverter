import { NavLink, Outlet } from 'react-router-dom';
import { Coins, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '../api/auth.js';
import { useUserStore } from '../store/useUserStore.js';
import SignInModal from './SignInModal.jsx';

export default function Layout() {
  const [isSignInOpen, setSignInOpen] = useState(false);
  const { name, isRegistered, setUser } = useUserStore((state) => ({
    name: state.name,
    isRegistered: state.isRegistered,
    setUser: state.setUser
  }));

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe
  });

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser]);

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink className="flex min-w-0 items-center gap-3 text-ink" to="/">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-white">
              <Coins size={21} />
            </span>
            <span className="truncate text-lg font-semibold">Currency Converter</span>
          </NavLink>

          <nav className="flex items-center gap-2">
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-emerald-50 text-accent' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
              to="/favorites"
            >
              <span className="inline-flex items-center gap-2">
                <Star size={16} />
                Favorites
              </span>
            </NavLink>
            <button
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
              type="button"
              onClick={() => setSignInOpen(true)}
            >
              {isRegistered ? name : 'Sign in'}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <Outlet context={{ openSignIn: () => setSignInOpen(true) }} />
      </main>
      <SignInModal isOpen={isSignInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
