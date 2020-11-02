<style lang="scss" src="./echarts-scatter-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="echarts-scatter-component">
        <!-- filter -->
        <div class="echarts-scatter-filter">
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
            //         text: '散点图'
            //     },
            //     xAxis: {
            //         data: [
            //             '教育',
            //             '理财',
            //             '旅行',
            //             '交通',
            //             '娱乐'
            //         ]
            //     },
            //     series: [
            //         { data: [20, 39, 52, 75, 90] },
            //         { data: [27, 39, 54, 69, 82] },
            //         { data: [29, 42, 59, 67, 83] },
            //         { data: [22, 37, 53, 66, 97] },
            //         { data: [24, 33, 48, 62, 75] }
            //     ]
            // }
            type: Object
        }
    },

    computed: {
        mixOption() {
            let max, a, i, j, k;

            for (
                max = this.option.series[0].data[0], i = 0;
                (a = this.option.series[i]);
                i++
            ) {
                for (
                    a.type = "scatter", a.symbolSize = $k => $k[1] / 1.7, j = 0;
                    (k = a.data[j]);
                    j++
                ) {
                    if (max < k) max = k;

                    a.data[j] = [i, k];
                }
            }

            this.baseOption.yAxis.max = Math.ceil(max / 5) * 6;

            return [this.baseOption, this.option];
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
                    bottom: 16,
                    left: 40,
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    axisLabel: {
                        margin: 16
                    },
                    axisLine: {
                        show: true
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        margin: 16
                    },
                    axisLine: {
                        show: true
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true
                    }
                }
            }
        };
    }
};
</script>
