import { useLazyGetSalesPredictionQuery } from '@/store/api/adminApi';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

export interface SalesPredictionData {
    prediction: number;
    regressionData: [number, number][];
    slope: number;
    intercept: number;
}

const SalesPredictionChart: React.FC = () => {
    const [getSalesPrediction,] = useLazyGetSalesPredictionQuery()
    const [chartData, setChartData] = useState<{ series: any[]; options: any }>({
        series: [],
        options: {
            chart: {
                type: 'line',
                height: 350,
            },
            xaxis: {
                title: {
                    text: 'Transaction Index',
                },
            },
            yaxis: {
                title: {
                    text: 'Total Amount',
                },
            },
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getSalesPrediction(undefined)
                console.log('data', data.data)
                const { prediction, regressionData, slope, intercept }: SalesPredictionData = data.data

                // Create forecast function
                const forecastFunction = (x: number) => slope * x + intercept;

                // Prepare the data for the chart
                const seriesData = regressionData.map(([x, y]) => ({ x, y }));
                const forecastData = regressionData.map(([x]) => ({ x, y: forecastFunction(x) }));
                forecastData.push({ x: regressionData.length, y: prediction });

                setChartData({
                    series: [
                        {
                            name: 'Actual Sales',
                            data: seriesData,
                        },
                        {
                            name: 'Forecasted Sales',
                            data: forecastData,
                        },
                    ],
                    options: {
                        ...chartData.options,
                        title: {
                            text: 'Sales Prediction',
                        },
                    },
                });
            } catch (error) {
                console.error('Error fetching sales prediction data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='border rounded-md p-5 bg-blue-100'>
            <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
            <div className='text-xs text-slate-500'>
                <p>
                    This chart shows past sales data and predicts future sales trends based on historical transaction records.
                </p>

                <br />

                <ul className='list-disc list-inside'>
                    <li>
                        Blue Line: Represents actual sales data from previous transactions.

                    </li>
                    <li>
                        Red Line: Predicts future sales trends using advanced analytics.

                    </li>
                </ul>

                <br />
                <p>
                    What it Tells You:
                </p>
                <ul className='list-disc list-inside'>
                    <li>Get insights into past sales performance.</li>
                    <li>Anticipate future sales trends for better planning.</li>
                    <li>Make informed decisions based on data-driven predictions.</li>
                </ul>


            </div>
        </div>
    );
};

export default SalesPredictionChart;
