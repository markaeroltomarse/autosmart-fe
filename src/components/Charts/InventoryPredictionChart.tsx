// InventoryPredictionChart.tsx

import { useLazyGetInventoryPredictionQuery } from '@/store/api/adminApi';
import moment from 'moment';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const InventoryPredictionChart: React.FC = () => {
    const [getInventoryPrediction] = useLazyGetInventoryPredictionQuery()
    const [data, setData] = useState<{ x: string; y: number }[]>([]);
    const [options, setOptions] = useState<any>({
        chart: {
            id: 'inventory-prediction',
            type: 'line',
            height: 400,
        },
        xaxis: {
            categories: [],
        },
    });

    const [series, setSeries] = useState<any>([
        {
            name: 'Inventory Prediction',
            data: [],
        },
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await getInventoryPrediction(undefined)
            console.log('InventoryPredictionChart', data.data)
            const predictionData: any[] = data.data
            const categories = predictionData.map(item => moment(item.date, 'YYYY-MM-DD').format('ll'));

            setOptions((prevOptions: any) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories,
                },
            }));
            setData(predictionData.map(item => ({
                x: moment(item.date, 'YYYY-MM-DD').format('ll'),
                y: item.quantity
            })));
        } catch (error) {
            console.error('Error fetching inventory prediction data:', error);
        }
    };

    return <div className='border rounded-md p-5 bg-blue-100'>
        <b>Inventory Prediction</b>
        <ReactApexChart options={options} series={[{ name: 'Inventory Prediction', data }]} type="line" height={400} />
        <div className='text-xs text-slate-500'>
            <p>
                The Inventory Prediction Chart displays forecasted inventory levels over time. It helps visualize expected changes in stock availability, assisting in inventory management decisions.
            </p>
        </div>
    </div>
};

export default InventoryPredictionChart;
