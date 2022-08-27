import axios from 'axios';

import { navigation } from '@navigation';

type RecoverPasswordByEmail = (data: { email: string }) => Promise<void>;

export const recoverPasswordByEmail: RecoverPasswordByEmail = async ({
  email,
}) => axios.post(navigation.api.auth.password.forgot, { email });
