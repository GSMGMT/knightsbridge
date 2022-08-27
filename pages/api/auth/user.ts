import { db } from '@utils/gunDB';

export const user = db.user().recall({ sessionStorage: true });

db.on('auth', async () => {
  console.log(`signed in as $(user)`);
});
