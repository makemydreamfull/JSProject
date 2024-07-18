import "./chart.js"

export class Pie {
    constructor() {
        const ctx = document.getElementById('myChart');
        const DATA_COUNT = 5;
        const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};
        Chart.defaults.font.size = 11;
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Blue',
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [140, 70, 30, 50, 160],
                    backgroundColor: [
                        '#DC3545',
                        '#20C997',
                        '#0D6EFD',
                        '#FFC107',
                        '#FD7E14',
                    ],
                    hoverOffset: 4
                }],
            },
            options: {

                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',

                    },
                    title: {
                        display: true,
                        text: 'Доходы',
                        padding: {
                            bottom: 10,

                        },
                        font: {
                            size: '28px',
                            family: 'RobotoMedium',
                            color: '#290661',
                        },
                    }
                }
            },
        });
        const ctx2 = document.getElementById('myChart2');
        const DATA_COUNT2 = 5;
        const NUMBER_CFG2 = {count: DATA_COUNT2, min: 0, max: 100};
        Chart.defaults.font.size = 11;
        new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: [
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Blue',
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [10, 70, 70, 30, 50],
                    backgroundColor: [
                        '#DC3545',
                        '#20C997',
                        '#0D6EFD',
                        '#FFC107',
                        '#FD7E14',
                    ],
                    hoverOffset: 4,

                }],
            },
            options: {

                responsive: true,

                plugins: {
                    legend: {
                        position: 'top',

                    },
                    title: {
                        display: true,
                        text: 'Расходы',
                        padding: {
                            bottom: 10
                        },
                        font: {
                            size: '28px',
                            family: 'RobotoMedium',
                            color: '#290661',
                        }
                    },



                },
            },
        });
    }

}
