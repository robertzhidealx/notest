import { getProviders, getSession, signIn } from 'next-auth/react';

export default function SignIn({ providers }) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/note',
        permanent: false,
      },
    };
  }
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
