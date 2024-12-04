import { ReactNode, useEffect, useState } from 'react';
import useAuthStore from '../stores/AuthStore';
import PageLoading from '../components/common/PageLoading/PageLoading';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loadingUser, setLoadingUser] = useState(true);
  const ensureUserLoaded = useAuthStore((state) => state.ensureUserLoaded);

  useEffect(() => {
    ensureUserLoaded().then(() => setLoadingUser(false));
  }, []);

  return (
    <>
      {children}
      <PageLoading open={loadingUser} />
    </>
  );
};

export default AuthProvider;
