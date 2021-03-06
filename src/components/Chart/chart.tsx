import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';

import { getDailyData } from '../../api';
import { apiData } from '../../types/apiData';
import { dailyData } from '../../types/dailyData';
import styles from './Chart.module.css';

interface props {
    data: apiData,
    country: string
}

const Chart: React.FC<props> = ({ data: { confirmed, recovered, deaths }, country }: props) => {
    const [dailyApiData, setDailyApiData] = useState<dailyData[]>([]);

    const fetchData = async () => {
        const results = await getDailyData();
        setDailyApiData(results);
    };

    const barChart = (
        confirmed ? (
            <Bar
                data={{
                    labels: ['Infected', 'Recovered', 'Deaths'],
                    datasets: [
                        {
                            label: 'People',
                            backgroundColor: ['rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'],
                            data: [confirmed, recovered, deaths],
                        },
                    ],
                }}
                options={{
                    legend: { display: false },
                    title: { display: true, text: `Current state in ${country}` },
                }}
            />
        ) : null
    );

    const lineChart = (
        dailyApiData.length > 0 ? (
            <Line
                data={{
                    labels: dailyApiData.map(({ reportDate }) => reportDate),
                    datasets: [{
                        data: dailyApiData.map((data) => data.confirmed),
                        label: 'Infected',
                        borderColor: '#3333ff',
                        fill: true,
                    }, {
                        data: dailyApiData.map((data) => data.deaths),
                        label: 'Deaths',
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        fill: true,
                    },
                    ],
                }}
            />
        ) : null
    );

    useEffect(() => { fetchData(); }, []);

    return (
        <div className={styles.container}>
            {country ? barChart : lineChart}
        </div>
    );
};

export default Chart;
