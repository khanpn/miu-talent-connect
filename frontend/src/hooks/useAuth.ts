import useAuthStore from '../stores/AuthStore';
import useTokenStore from '../stores/TokenStore';

export const useAuth = () => {
  const tokenStore = useTokenStore();
  const authStore = useAuthStore();

  return {
    authenticated: !!(authStore.user && tokenStore.accessToken),
    ...authStore,
    ...tokenStore,
  };
};
