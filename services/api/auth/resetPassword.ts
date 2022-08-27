import axios from 'axios';

import { navigation } from '@navigation';

export const resetPassword: (data: {
  password: string;
  oobCode: string;
}) => Promise<void> = async ({ password, oobCode }) =>
  axios.post(navigation.api.auth.password.reset, { password, oobCode });
