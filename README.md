# Notest

## Setup

For the app to work, you need to create a `.env.local` file at the project root directory and copy and paste the following:

```
NEXT_PUBLIC_OPENAI_API_KEY=
MONGODB_URI=mongodb+srv://testuser:HlmE6UHlLWNu6j5P@notesttest.sss54.mongodb.net/Notest?retryWrites=true&w=majority
```

You can obtain your API key at https://beta.openai.com/account/api-keys, and paste it as the value of `NEXT_PUBLIC_OPENAI_API_KEY` in the above environment file.

The `MONGODB_URI` has already been provided to you (the TA) in order to locally run the project (testuser made just for this purpose). We each have our own URI. **For those simply wanting to view the latest deployment, simply go to http://notest-hyper.vercel.app.**

## Getting Started

First, install the dependencies:

```
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
