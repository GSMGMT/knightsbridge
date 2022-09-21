import { firestore } from '@libs/firebase/admin-config';

import { Address } from '@contracts/Addres';
import { Currency } from '@contracts/Currency';
import { FirebaseCollections } from '@libs/firebase/collections';
import { CurrencyConverter } from '@libs/firebase/converters/currencyConverter';
import { AddressConverter } from '@libs/firebase/converters/addressConverter';

interface ListCurrencies {
  size: number;
}

const listCurrenciesWithAddresses = async ({
  size,
}: ListCurrencies): Promise<Currency[]> => {
  const CurrencyCollection = firestore()
    .collection(FirebaseCollections.CURRENCIES)
    .limit(size)
    .where('type', '==', 'crypto')
    .where('deposit', '==', true)
    .withConverter(CurrencyConverter);

  const querySnapshot = await CurrencyCollection.get();

  const currencies: Currency[] = [];

  for await (const doc of querySnapshot.docs) {
    const data = doc.data();

    if (data.type === 'crypto' && data.deposit) {
      const addressesCollection = doc.ref
        .collection(FirebaseCollections.ADDRESSES)
        .withConverter(AddressConverter);

      const addressesSnapshot = await addressesCollection.get();

      const walletAddresses: Address[] = [];

      addressesSnapshot.forEach((addressDoc) =>
        walletAddresses.push(addressDoc.data())
      );

      if (walletAddresses.length > 0) {
        currencies.push({ ...data, walletAddresses });
      }
    }
  }

  return currencies;
};

export default listCurrenciesWithAddresses;
