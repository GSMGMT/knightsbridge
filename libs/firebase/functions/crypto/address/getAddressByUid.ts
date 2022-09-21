import { Address } from '@contracts/Addres';
import { FirebaseCollections } from '@libs/firebase/collections';
import { AddressConverter } from '@libs/firebase/converters/addressConverter';
import { firestore } from '@libs/firebase/admin-config';

const getAddressByUid = async (
  currencyUid: string,
  addressUid: string
): Promise<Address | undefined> => {
  const WalletAssetCollection = firestore()
    .collection(FirebaseCollections.CURRENCIES)
    .doc(currencyUid)
    .collection(FirebaseCollections.ADDRESSES)
    .doc(addressUid)
    .withConverter(AddressConverter);

  const querySnapshot = await WalletAssetCollection.get();

  return querySnapshot.data();
};

export default getAddressByUid;
