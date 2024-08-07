
import React, { FC } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { Chart, ArcElement } from 'chart.js'
import { useEffect } from 'react';
Chart.register(ArcElement);

interface Props {
  data: any
}
const DetectDonutChart: FC<Props> = ({ data }) => {

  useEffect(() => {
    console.log('data: ', data);


  }, [])

  const chartData = {
    labels: data.map((item: any) => item.label),
    datasets: [{
      data: data.map((item: any) => item.percentage),
      backgroundColor: ['green', 'red'],
    }],
  };

  return (
    <div className='flex justify-center'>
      <Doughnut data={chartData} />
    </div>
  );
};

export default DetectDonutChart


export const PlagDonutChart: FC<Props> = ({ data }) => {

  useEffect(() => {
    console.log('data: ', data);


  }, [])

  const chartData = {
    labels: data.map((item: any) => item.label),
    datasets: [{
      data: data.map((item: any) => item.percentage),
      backgroundColor: ['green', 'yellow'],
    }],
  };

  return (
    <div className='flex justify-center'>
      <Doughnut data={chartData} />
    </div>
  );
};

