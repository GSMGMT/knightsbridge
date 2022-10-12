import { useRef, useEffect, FunctionComponent } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useSsr } from 'usehooks-ts';
import { useRouter } from 'next/router';

import { Quotes } from '@pages/resources/chart';

const Chart: FunctionComponent<{
  quotes: Quotes;
}> = ({ quotes }) => {
  const { isBrowser } = useSsr();
  const {
    query: { theme = 'light' },
  } = useRouter();

  const chartEl = useRef(null);

  let chart: IChartApi | undefined;
  let candlestickSeries: ISeriesApi<'Candlestick'>;

  const onResize: EventListenerOrEventListenerObject = () => {
    const height = window.innerHeight;
    const width = window.innerWidth;

    chart!.resize(width, height);
  };

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('resize', onResize);
    }

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      chart = createChart(chartEl.current!, {
        width: window.innerWidth,
        height: window.innerHeight,
        layout: {
          backgroundColor: theme === 'light' ? '#fff' : '#000',
          textColor: theme === 'light' ? '#000' : '#fff',
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
          borderVisible: false,
        },
        timeScale: {
          timeVisible: false,
          borderVisible: false,
        },
        grid: {
          horzLines: {
            color: theme === 'light' ? '#f0f3fa' : '#1e2139aa',
            visible: false,
          },
          vertLines: {
            color: theme === 'light' ? '#f0f3fa' : '#1e213999',
          },
        },
        crosshair: {
          horzLine: {
            visible: true,
            labelVisible: true,
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            labelVisible: true,
          },
        },
      });

      candlestickSeries = chart.addCandlestickSeries({
        upColor: 'rgb(38,166,154)',
        downColor: 'rgb(255,82,82)',
        wickUpColor: 'rgb(38,166,154)',
        wickDownColor: 'rgb(255,82,82)',
        borderVisible: false,
      });
      candlestickSeries.setData(quotes);
    }
  }, [isBrowser, quotes]);

  return <div ref={chartEl} className="chart" />;
};
export default Chart;
