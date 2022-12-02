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
      crypto: '/app/deposit/crypto',
    },
    wallet: '/app/wallet',
    presale: {
      token: '/app/presale/coin',
      nft: {
        store: '/app/presale/nft',
        item: '/app/presale/nft/i/',
        collection: '/app/presale/nft/my-collection',
        create: '/app/presale/nft/create',
        list: '/app/presale/nft/list',
        history: '/app/presale/nft/history/',
      },
    },
    orders: {
      fiat: '/app/orders/fiat',
      crypto: '/app/orders/crypto',
      buySell: '/app/orders/buy-sell',
    },
    equities: {
      list: '/app/equities/list',
      get register() {
        return `${this.list}?register=true`;
      },
    },
    coin: {
      list: '/app/coin/list',
      get register() {
        return `${this.list}?register=true`;
      },
    },
    buySell: '/app/buy-sell',
  },
  resources: {
    chart: '/resources/chart',
  },
  soon: '/soon',
};
