import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

// ✅ Base API config
const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://lark-tech.onrender.com' // deployed backend
      : 'http://localhost:5000',          // local backend
  credentials: 'include', // send cookies
});

// ✅ Handle 401 unauthorized globally
const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

// ✅ This is the ONLY export you need
export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
