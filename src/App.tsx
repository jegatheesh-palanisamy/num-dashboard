import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';

import StatisticCard from './components/statisticCard';
import { fetchDataSetByIndex } from './service';

import styles from './App.module.scss';
import { AxiosError } from 'axios';

const useAsyncReq:
  <resultType>(...args: any[]) => [
    ((...args: any[]) => Promise<void>),
    boolean,
    resultType | undefined,
    AxiosError | null,
    Dispatch<SetStateAction<resultType | null>>
  ]
  = (apiReq: (...args: any[]) => Promise<any>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<any>();
    const [error, setError] = useState<AxiosError | null>(null);
    const asyncReq = async (...args: any[]) => {
      try {
        setLoading(true);
        const { data } = await apiReq(...args);
        setResult(data || undefined);
        setLoading(false);
      } catch (e) {
        setError(e as AxiosError);
        setLoading(false);
      }
    }
    return [asyncReq, loading, result, error, setResult];
  }

function App() {
  const defaultDatasetVal = useRef<number[]>([]);
  const [fetchDatasetReq, loading, dataSet = defaultDatasetVal.current, error, setDataset] = useAsyncReq<number[]>(fetchDataSetByIndex);
  const [inputVal, setInputVal] = useState('');
  const [datasetIndex, setDatasetIndex] = useState(0);

  const handleDataSetSelect = (index: number) => {
    setDatasetIndex(index);
    fetchDatasetReq(index);
  };

  const submitIfPressedEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addNumberToDataset();
    }
  }

  const addNumberToDataset = () => {
    if (inputVal) {
      setDataset([...dataSet, Number(inputVal)]);
      setInputVal('');
    }
  }

  const onInputvalChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(value))) {
      setInputVal(value);
    }
  }

  const [mean, median, sd, mode] = useMemo(() => {
    if (!dataSet?.length) {
      return [0, 0, 0, 0];
    }
    const occuranceMap: { [key: number]: number } = {};
    let sum = 0;
    dataSet.forEach((num) => {
      occuranceMap[num] = (occuranceMap[num] || 0) + 1;
      sum = sum + num;
    });
    const sorted = dataSet.sort((a, b) => a - b);
    const length = dataSet.length;
    const mean = sum / length;
    const mode = Object.keys(occuranceMap).reduce((a, b) => (occuranceMap as any)[b] > (occuranceMap as any)[a] ? b : a)
    const median = (sorted[Math.ceil(length / 2)] + sorted[Math.floor(length / 2)]) / 2;
    const sd = Math.sqrt(dataSet.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / length);
    return [
      mean.toFixed(6),
      median.toFixed(6),
      sd.toFixed(6),
      Number(mode).toFixed(6),
    ]
  }, [dataSet]);

  useEffect(() => {
    fetchDatasetReq(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      window.alert((error as any).message);
    }
  }, [error])

  return (
    <div className={styles.dashboard}>
      <div className={styles.statistics}>
        <StatisticCard value={mean} label='Mean' className={styles.statisticsSpace} />
        <StatisticCard value={mode} label='Mode' className={styles.statisticsSpace} />
        <StatisticCard value={sd} label='Std Deviation' className={styles.statisticsSpace} />
        <StatisticCard value={median} label='Median' className={styles.statisticsSpace} />
      </div>
      <div className={styles.control}>
        <div className={styles.inputContainer}>
          <input value={inputVal} type='text' placeholder='Enter Number' onChange={onInputvalChange} onKeyPress={submitIfPressedEnter} />
          <button className={styles.submitBtn} onClick={addNumberToDataset}>Submit</button>
        </div>
        <div>
          {[0, 1, 2].map((i) => (
            <button className={`${styles.changeBtn} ${i === datasetIndex ? styles.active : ''}`} onClick={() => handleDataSetSelect(i)}>Dataset {i + 1}</button>
          ))}
        </div>
      </div>
      {loading &&
        <div className={styles.loaderContainer}>
          <div>Loading...</div>
        </div>}
    </div>
  );
}

export default App;
