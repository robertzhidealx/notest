module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api'
        : 'https://notest-hyper.vercel.app/api',
  },
};
