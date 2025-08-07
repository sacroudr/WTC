// hooks/useCurrentUser.ts
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/voyageScreenApi';
import { Utilisateur } from '../types/utilisateur';

export const useCurrentUser = () => {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        setUser(fetchedUser);
      } catch (err) {
        console.error('Erreur récupération utilisateur', err);
      } finally {
        setLoadingUser(false);
      }
    };

    load();
  }, []);

  return { user, loadingUser };
};
