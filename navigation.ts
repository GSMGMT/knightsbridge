export const navigation = {
  api: {
    auth: {
      password: {
        forgot: '/api/auth/password/forgot',
        reset: '/api/auth/password/reset',
      },
    },
  },
  auth: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    password: {
      forgot: '/auth/password/forgot',
      reset: '/auth/password/reset',
    },
    verify: '/auth/verify',
  },
  app: {
    discover: '/app/discover',
    deposit: {
      fiat: '/app/deposit/fiat',
    },
  },
};
