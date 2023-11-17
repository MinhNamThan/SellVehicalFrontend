export const chartOptions = {
    chart: {
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        },
        animations: {
            easing: 'linear'
        }
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    legend: {
        position: 'top'
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        size: 0,
        style: 'hollow'
    },
    xaxis: {
        type: 'datetime',
        labels: {
            datetimeUTC: false
        }
    },
    yaxis: [
        {
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: '#008FFB'
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed();
                },
                style: {
                    colors: '#008FFB'
                }
            }
        },
        {
            opposite: true,
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: '#00E396'
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed();
                },
                style: {
                    colors: '#00E396'
                }
            }
        }
    ],
    tooltip: {
        x: {
            format: 'dd/MM/yyyy HH:mm:ss'
        },
        y: {
            formatter: function (value, { seriesIndex }) {
                if (typeof value !== 'undefined' && seriesIndex === 0) {
                    return value.toFixed(0) + ' thiết bị';
                } else if (typeof value !== 'undefined' && seriesIndex === 1) {
                    return value.toFixed(0) + ' người';
                }
                return value;
            }
        }
    }
};

export const ranges = [
    { name: '5 phút', value: 5, unit: 'minutes' },
    { name: '15 phút', value: 15, unit: 'minutes' },
    { name: '30 phút', value: 30, unit: 'minutes' },
    { name: '1 giờ', value: 1, unit: 'hours' },
    { name: '6 giờ', value: 6, unit: 'hours' },
    { name: '12 giờ', value: 12, unit: 'hours' },
    { name: '1 ngày', value: 1, unit: 'days' },
    { name: '2 ngày', value: 2, unit: 'days' },
    { name: '7 ngày', value: 7, unit: 'days' },
    { name: '30 ngày', value: 30, unit: 'days' }
];
