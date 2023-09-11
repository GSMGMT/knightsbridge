export interface AdminPair {
  uid: string;
  source: {
    name: string;
    logo: string;
  };
  marketPairId: number;
  marketPair: string;
  logo: string;
  enabled: boolean;
}

export const fetchAdminCoins: (args?: {
  pageNumber?: number;
  search?: string;
}) => Promise<{
  pairs: Array<AdminPair>;
  totalCount: number;
}> = async () => ({ pairs: [], totalCount: 0 });
