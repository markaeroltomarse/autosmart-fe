// InventoryPredictionChart.tsx

import { useLazyGetInventoryPredictionQuery } from '@/store/api/adminApi';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const InventoryPredictionChart: React.FC = () => {
    const [getInventoryPrediction] = useLazyGetInventoryPredictionQuery()
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
            const categories = Array.from({ length: data.data.length }, (_, i) => `Day ${i + 1}`);

            console.log('categories', categories)
            setOptions((prevOptions: any) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories,
                },
            }));
            setSeries([{ name: 'Inventory Prediction', data: data.data }]);
        } catch (error) {
            console.error('Error fetching inventory prediction data:', error);
        }
    };

    return <div className='border rounded-md p-5 bg-blue-100'>
        <b>Inventory Prediction</b>
        <ReactApexChart options={options} series={series} type="line" height={400} />
        <div className='text-xs text-slate-500'>
            <p>
                The Inventory Prediction Chart displays forecasted inventory levels over time. It helps visualize expected changes in stock availability, assisting in inventory management decisions.
            </p>
        </div>
    </div>
};

export default InventoryPredictionChart;
