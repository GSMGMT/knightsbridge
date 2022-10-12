import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';

import { navigation } from '@navigation';

import { fetchHistoricalQuoteById } from '@services/api/coinMarketCap/crypto/fetchHistoricalQuoteById';
import { FunctionComponent } from 'react';

const ChartComponent = dynamic(
  () => import('../../../sections/resources/chart'),
  {
    ssr: false,
  }
);

interface ChartDataTime {
  year: number;
  month: number;
  day: number;
}
interface Quote {
  open: number;
  high: number;
  low: number;
  close: number;
  time: ChartDataTime;
}
export type Quotes = Array<Quote>;
interface Props {
  quotes: Quotes;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const {
    data: { quotes: defaultQuotes },
  } = await fetchHistoricalQuoteById('18696', {
    convertId: '825',
    count: '1000',
    interval: '6h',
  });

  if (!defaultQuotes) {
    return {
      redirect: {
        destination: navigation.app.discover,
        permanent: false,
      },
    };
  }

  const quotes: Array<Quote> = defaultQuotes.map(
    ({
      quote: {
        825: { timestamp, open, high, low, close },
      },
    }) => {
      const data = new Date(timestamp);
      const time: ChartDataTime = {
        year: data.getFullYear(),
        month: data.getMonth() + 1,
        day: data.getDate(),
      };

      return { open, high, low, close, time } as Quote;
    }
  );

  return {
    props: {
      quotes,
    },
  };
};

const Chart: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ quotes }) => <ChartComponent quotes={quotes} />;
export default Chart;
