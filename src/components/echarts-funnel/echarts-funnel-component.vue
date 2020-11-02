<style lang="scss" src="./echarts-funnel-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="echarts-funnel-component">
        <!-- filter -->
        <div class="echarts-funnel-filter">
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
let theme = require("@components/echarts/theme.default.json").echartsFunnel;

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
            //         text: '漏斗图'
            //     },
            //     legend: {
            //         data: [
            //             '教育',
            //             '理财',
            //             '旅行'
            //         ]
            //     },
            //     series: [
            //         {
            //             data: [
            //                 { name: '教育', value: 20 },
            //                 { name: '理财', value: 30 },
            //                 { name: '旅行', value: 50 }
            //             ]
            //         }
            //     ]
            // }
            type: Object
        }
    },

    computed: {
        mixOption() {
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
                series: [
                    {
                        type: "funnel",
                        left: "center",
                        top: 72,
                        bottom: 92,
                        maxWidth: 400,
                        width: "40%",
                        label: {
                            normal: {
                                position: "right"
                            }
                        }
                    }
                ]
            }
        };
    }
};
</script>
