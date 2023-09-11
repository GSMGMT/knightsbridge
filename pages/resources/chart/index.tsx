import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';

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

export const getServerSideProps: GetServerSideProps<Props> = async () => ({
  props: {
    quotes: [],
  },
});

const Chart: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ quotes }) => <ChartComponent quotes={quotes} />;
export default Chart;
