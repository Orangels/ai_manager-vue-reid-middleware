<style lang="scss" src="./echarts-pie-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="echarts-pie-component">
        <!-- filter -->
        <div class="echarts-pie-filter">
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
            //         text: '饼图'
            //     },
            //     legend: {
            //         data: [
            //             '21-30 岁',
            //             '31-40 岁',
            //             '41-50 岁',
            //             '51-99 岁'
            //         ]
            //     },
            //     series: [
            //         {
            //             data: [
            //                 { name: '21-30 岁', value: 2130 },
            //                 { name: '31-40 岁', value: 3140 },
            //                 { name: '41-50 岁', value: 4150 },
            //                 { name: '51-99 岁', value: 1199 }
            //             ]
            //         }
            //     ]
            // }
            type: Object
        }
    },

    computed: {
        mixOption() {
            let h = parseInt(this.height);

            this.baseOption.series[0].center[1] = (h - 170) / 2 + 80;
            this.baseOption.series[0].radius[0] = (h - 170) / 2 - 28;
            this.baseOption.series[0].radius[1] = (h - 170) / 2;

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
                series: [
                    {
                        type: "pie",
                        center: ["50%"],
                        radius: [],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }
                ]
            }
        };
    }
};
</script>
