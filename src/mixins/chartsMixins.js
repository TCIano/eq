export const chartsMixin = {
    data() {
        return {
            dataZoom: [
                {
                    type: 'slider',
                    show: false,
                    xAxisIndex: [0],
                },
                {
                    type: 'slider',
                    show: false,
                    yAxisIndex: [0],
                    left: '93%',
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                },
                {
                    type: 'inside',
                    yAxisIndex: [0],
                }
            ],
        }
    },

}
