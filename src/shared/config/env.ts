export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
};

if (!env.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL nao definida!');
}
