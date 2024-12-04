import axios from 'axios';
import useTokenStore, {
  getAccessTokenWithoutObservingChange,
  getRefreshTokenWithoutObservingChange,
} from '../stores/TokenStore';
import { TOKEN_RESOURCE_PATH } from './resources';
import { GenerateTokenResponse } from '../models/GenerateTokenResponse';
import { API_BASE_URL } from '../config';

const restClient = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

const callRefreshToken = async (
  refreshToken: string
): Promise<GenerateTokenResponse> => {
  try {
    const response = await restClient.post<GenerateTokenResponse>(
      TOKEN_RESOURCE_PATH + '/refresh',
      { refreshToken },
      { withCredentials: false }
    );
    return response.data;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
};

export const useAxiosInterceptors = () => {
  const { setAccessToken, setRefreshToken, clearTokens } = useTokenStore();

  restClient.interceptors.request.use(
    (config) => {
      if (getAccessTokenWithoutObservingChange()) {
        config.headers.Authorization = `Bearer ${getAccessTokenWithoutObservingChange()}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  restClient.interceptors.response.use(
    (response) => {
      // If the response is successful, just return it
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Check if the error is due to an expired token
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest.url.includes(`${TOKEN_RESOURCE_PATH}/refresh`) &&
        getRefreshTokenWithoutObservingChange() &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Mark the request as retried to prevent infinite loops

        try {
          const tokens = await callRefreshToken(
            getRefreshTokenWithoutObservingChange()
          ); // Refresh the token
          setAccessToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken);

          // Retry the original request
          return restClient(originalRequest);
        } catch (refreshError) {
          console.error('Re-authentication failed', refreshError);
          // Optionally redirect to login page or show an error
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // If the error is not related to token expiration, reject it
      return Promise.reject(error);
    }
  );
};

export const extractErrorMessage = (
  error: any,
  errorMessageCallback: (message: string) => void
) => {
  if (axios.isAxiosError(error) && error.response) {
    errorMessageCallback(
      `${error.response.status}: ${
        error.response.data?.message || error.response.data
      }`
    );
  } else {
    errorMessageCallback('Unexpected error');
  }
};

export default restClient;
