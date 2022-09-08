import { Fee, FeeType } from '@contracts/Fee';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { FeeConverter } from '@libs/firebase/converters/feeConverter';

const getFeeByType = async (type: FeeType): Promise<Fee | null> => {
  const MarketPairCollection = firestore()
    .collection(FirebaseCollections.FEES)
    .where('type', '==', type)
    .withConverter(FeeConverter);

  const querySnapshot = await MarketPairCollection.get();

  return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
};

export default getFeeByType;
