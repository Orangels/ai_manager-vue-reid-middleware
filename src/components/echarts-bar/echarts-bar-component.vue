<style lang="scss" src="./echarts-bar-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="echarts-bar-component">
        <!-- filter -->
        <div class="echarts-bar-filter">
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
            //         text: '柱状图'
            //     },
            //     legend: {
            //         data: [
            //             '店内顾客',
            //             '周边顾客'
            //         ]
            //     },
            //     xAxis: {
            //         data: [
            //             '21-30 岁',
            //             '21-40 岁',
            //             '41-50 岁',
            //             '51-99 岁'
            //         ]
            //     },
            //     series: [
            //         { name: '店内顾客', data: [2130, 3140, 4150, 1199] },
            //         { name: '周边顾客', data: [4260, 6280, 8300, 1999] }
            //     ]
            // }
            type: Object
        }
    },

    computed: {
        mixOption() {
            let width, a, i;

            for (
                width = this.option.series[0].data.length > 5 ? 10 : 16, i = 0;
                (a = this.option.series[i]);
                i++
            ) {
                a.type = "bar";
                a.barWidth = width;
                a.itemStyle = { barBorderRadius: width };
            }

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
                legend: {
                    type: "scroll",
                    left: "center",
                    bottom: 16,
                    padding: [0, 24],
                    icon: "circle",
                    itemWidth: 10,
                    itemHeight: 10,
                    itemGap: 24,
                    pageIconSize: 8
                },
                grid: {
                    top: 80,
                    right: 40,
                    bottom: 44,
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
