<style lang="scss" src="./echarts-heatmap-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="echarts-heatmap-component">
        <!-- filter -->
        <div class="echarts-heatmap-filter">
            <slot name="filter"></slot>
        </div>

        <!-- echarts -->
        <echarts-component
            :width="width"
            :height="height"
            :option="mixOption"
            @rendered="($w, $h) => $emit('rendered', $w, $h)"
        ></echarts-component>
    </div>
</template>

<script type="text/jsx">
import EchartsComponent from "@components/echarts/echarts-component";

// 定义皮肤
// 只会执行一次
let theme = require("@components/echarts/theme.default.json").echartsHeatmap;

export default {
    components: {
        EchartsComponent
    },

    props: {
        width: {
            type: String
        },

        height: {
            type: String
        },

        option: {
            // {
            //     title: {
            //         text: '笛卡尔热力图'
            //     },
            //     xAxis: {
            //         data: [
            //             '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
            //             '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
            //         ]
            //     },
            //     yAxis: {
            //         data: [
            //             '2019/1/1',
            //             '2019/1/2',
            //             '2019/1/3',
            //             '2019/1/4',
            //             '2019/1/5',
            //             '2019/1/6',
            //             '2019/1/7'
            //         ]
            //     },
            //     series: [
            //         {
            //             data: [
            //                 5, 1, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 2, 4, 1, 1, 3, 4, 6, 4, 4, 3, 3, 2, 5,
            //                 7, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 5, 2, 2, 6, 9, 11, 6, 7, 8, 12, 5, 5, 7, 2,
            //                 1, 1, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 3, 2, 1, 9, 8, 10, 6, 5, 5, 5, 7, 4, 2, 4,
            //                 7, 3, NaN, NaN, NaN, NaN, NaN, NaN, 1, NaN, 5, 4, 7, 14, 13, 12, 9, 5, 5, 10, 6, 4, 4, 1,
            //                 1, 3, NaN, NaN, NaN, 1, NaN, NaN, NaN, 2, 4, 4, 2, 4, 4, 14, 12, 1, 8, 5, 3, 7, 3, NaN,
            //                 2, 1, NaN, 3, NaN, NaN, NaN, NaN, 2, NaN, 4, 1, 5, 10, 5, 7, 11, 6, NaN, 5, 3, 4, 2, NaN,
            //                 1, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 1, NaN, 2, 1, 3, 4, NaN, NaN, NaN, NaN, 1, 2, 2, 6
            //             ]
            //         }
            //     ]
            // }
            type: Object
        }
    },

    computed: {
        mixOption() {
            let data, max, min, i, j, x, y, z;

            for (
                data = this.option.series[0].data,
                    max = min = data[0],
                    i = 0,
                    j = this.option.xAxis.data.length,
                    y = -1;
                (z = data[i]) !== undefined;
                i++
            ) {
                if (max < z) max = z;

                if (min > z) min = z;

                if (!(x = i % j)) y += 1;
                data[i] = [x, y, z];
            }

            this.baseOption.visualMap.max = max;
            this.baseOption.visualMap.min = min;
            this.baseOption.visualMap.text = [max, min];

            return [theme, this.baseOption, this.option];
        }
    },

    data() {
        return {
            baseOption: {
                title: {
                    left: 24,
                    top: 24,
                    padding: 0
                },
                grid: {
                    top: 72,
                    right: 40,
                    bottom: 44,
                    left: 40,
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    position: "top",
                    axisLabel: {
                        margin: 16
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: "category",
                    inverse: true,
                    axisLabel: {
                        margin: 16
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                visualMap: {
                    orient: "horizontal",
                    left: "center",
                    bottom: 16,
                    padding: 0,
                    itemWidth: 10,
                    itemHeight: 72,
                    textGap: 4
                },
                series: [
                    {
                        type: "heatmap"
                    }
                ]
            }
        };
    }
};
</script>
