import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function getInitialUserId() {
  return crypto.randomUUID();
}

export const useUserStore = create(
  persist(
    (set) => ({
      userId: getInitialUserId(),
      name: '',
      isRegistered: false,
      setUser: (user) =>
        set({
          name: user?.name || '',
          isRegistered: Boolean(user?.isRegistered)
        }),
      signOutLocal: () =>
        set({
          userId: getInitialUserId(),
          name: '',
          isRegistered: false
        })
    }),
    {
      name: 'currency-converter-user'
    }
  )
);
