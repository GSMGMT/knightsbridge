export const navigation = {
  api: {
    auth: {
      password: {
        forgot: '/api/auth/password/forgot',
        reset: '/api/auth/password/reset',
      },
    },
    fiat: {
      bank: {
        insert: {
          url: '/api/fiat/bank/',
          method: 'POST',
        },
        list: {
          url: '/api/fiat/bank/',
          method: 'GET',
        },
      },
      currency: {
        insert: {
          url: '/api/fiat/currency/',
          method: 'POST',
        },
        list: {
          url: '/api/fiat/currency/',
          method: 'GET',
        },
      },
      deposit: {
        insert: {
          url: '/api/fiat/deposit/',
          method: 'POST',
        },
        list: {
          url: '/api/fiat/deposit/',
          method: 'GET',
        },
        confirm: {
          url: '/api/fiat/deposit/confirm/[:id]',
          method: 'PUT',
        },
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
    wallet: '/app/wallet',
    orders: {
      fiat: '/app/orders/fiat',
    },
  },
  soon: '/soon',
};
