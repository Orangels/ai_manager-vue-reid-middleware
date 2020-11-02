<style lang="scss" src="./echarts-valdistmap-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "国": "中国",
            "京": "北京",
            "沪": "上海",
            "津": "天津",
            "渝": "重庆",
            "云": "云南",
            "冀": "河北",
            "台": "台湾",
            "吉": "吉林",
            "宁": "宁夏",
            "川": "四川",
            "新": "新疆",
            "晋": "山西",
            "桂": "广西",
            "浙": "浙江",
            "港": "香港",
            "湘": "湖南",
            "澳": "澳门",
            "琼": "海南",
            "甘": "甘肃",
            "皖": "安徽",
            "粤": "广东",
            "苏": "江苏",
            "蒙": "内蒙古",
            "藏": "西藏",
            "豫": "河南",
            "贵": "贵州",
            "赣": "江西",
            "辽": "辽宁",
            "鄂": "湖北",
            "闽": "福建",
            "陕": "陕西",
            "青": "青海",
            "鲁": "山东",
            "黑": "黑龙江"
        }
    }
</i18n>

<template>
    <div class="echarts-valdistmap-component">
        <!-- filter -->
        <div class="echarts-valdistmap-filter">
            <slot name="filter"></slot>
        </div>

        <!-- breadcrumb -->
        <el-breadcrumb v-if="breadcrumb.length" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(breadcrumb, i) in breadcrumb" :key="i">
                <span
                    @click="handlerValue({ name: breadcrumb, i: i })"
                >{{ handlerI18n(breadcrumb) }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- echarts -->
        <echarts-component
            :width="width"
            :height="height"
            :option="mixOption"
            :on="on"
            @rendered="($w, $h) => $emit('rendered', $w, $h)"
        ></echarts-component>
    </div>
</template>

<script type="text/jsx">
import "echarts/map/js/china";
import "echarts/map/js/province/beijing";
import "echarts/map/js/province/shanghai";
import "echarts/map/js/province/tianjin";
import "echarts/map/js/province/chongqing";
import "echarts/map/js/province/yunnan";
import "echarts/map/js/province/hebei";
import "echarts/map/js/province/taiwan";
import "echarts/map/js/province/jilin";
import "echarts/map/js/province/ningxia";
import "echarts/map/js/province/sichuan";
import "echarts/map/js/province/xinjiang";
import "echarts/map/js/province/shanxi";
import "echarts/map/js/province/guangxi";
import "echarts/map/js/province/zhejiang";
import "echarts/map/js/province/xianggang";
import "echarts/map/js/province/hunan";
import "echarts/map/js/province/aomen";
import "echarts/map/js/province/hainan";
import "echarts/map/js/province/gansu";
import "echarts/map/js/province/anhui";
import "echarts/map/js/province/guangdong";
import "echarts/map/js/province/jiangsu";
import "echarts/map/js/province/neimenggu";
import "echarts/map/js/province/xizang";
import "echarts/map/js/province/henan";
import "echarts/map/js/province/guizhou";
import "echarts/map/js/province/jiangxi";
import "echarts/map/js/province/liaoning";
import "echarts/map/js/province/hubei";
import "echarts/map/js/province/fujian";
import "echarts/map/js/province/shanxi1";
import "echarts/map/js/province/qinghai";
import "echarts/map/js/province/shandong";
import "echarts/map/js/province/heilongjiang";
import EchartsComponent from "@components/echarts/echarts-component";

// 定义皮肤
// 只会执行一次
let theme = require("@components/echarts/theme.default.json").echartsValdistmap;

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
            //         text: '价值分布地图'
            //     },
            //     geo: {
            //         map: '国'
            //     },
            //     series: [
            //         {
            //             data: [
            //                 { name: '辽', value: 1 },
            //                 { name: '吉', value: 2 },
            //                 { name: '黑', value: 3 },
            //                 { name: '浙', value: 4 },
            //                 { name: '粤', value: 5 },
            //                 { name: '渝', value: 6 },
            //                 { name: '津', value: 8 },
            //                 { name: '沪', value: 11 },
            //                 { name: '京', value: 16 }
            //             ]
            //         }
            //     ]
            // }
            type: Object
        }
    },

    computed: {
        map() {
            // this.option.geo.show = false;

            return {
                map: this.mapName[this.option.geo.map],
                ...this.mapCenter[this.option.geo.map]
            };
        },

        mixOption() {
            this.baseOption.grid.top = this.breadcrumb.length ? 110 : 72;

            if (
                !this.baseOption.yAxis.data ||
                this.handlerI18n(this.option.series[0].data[0].name) !==
                    this.baseOption.yAxis.data
            ) {
                let dataByOption, dataByYAxis, a, i;

                for (
                    dataByOption = this.option.series[0].data,
                        dataByYAxis = this.baseOption.yAxis.data = [],
                        i = 0;
                    (a = dataByOption[i]);
                    i++
                )
                    dataByYAxis.push(this.handlerI18n(a.name));
            }

            if (this.breadcrumb.length < 3) {
                let dataByOption, dataByMap, max, min, a, i;

                for (
                    dataByOption = this.option.series[0].data,
                        dataByMap = this.baseOption.series[1].data = [],
                        max = min = dataByOption[0].value,
                        i = 0;
                    (a = dataByOption[i]);
                    i++
                ) {
                    if (max < a.value) max = a.value;

                    if (min > a.value) min = a.value;

                    dataByMap.push({
                        name: this.handlerI18n(a.name),
                        value: a.value
                    });
                }

                this.baseOption.visualMap.max = max;
                this.baseOption.visualMap.min = min;
                this.baseOption.series[1].map = this.map.map;
                this.baseOption.series[1].zoom = this.map.zoom;
                this.baseOption.series[1].center = this.map.center;

                // 不显示南海诸岛
                if (this.map.map === "china") dataByMap.push(this.scsiOption);
            }

            return [theme, this.baseOption, this.option];
        }
    },

    methods: {
        handlerI18n($key) {
            return this.$i18n.messages[this.$i18n.locale][$key] || $key;
        },

        handlerValue($event) {
            if ($event.name) {
                let key;

                switch (true) {
                    case Boolean(
                        ($event.type === "click") &
                            (this.breadcrumb.length === 0)
                    ):
                        (key = this.mapName[$event.name]),
                            this.breadcrumb.splice(
                                0,
                                this.breadcrumb.length,
                                "国",
                                key
                            );
                        break;

                    case Boolean(
                        ($event.type === "click") &
                            (this.breadcrumb[this.breadcrumb.length - 1] !==
                                $event.name)
                    ):
                        (key = $event.name),
                            this.breadcrumb.splice(
                                2,
                                this.breadcrumb.length,
                                key
                            );
                        break;

                    case Boolean($event.i === 0):
                        (key = $event.name), this.breadcrumb.splice(0);
                        break;

                    case Boolean($event.i < this.breadcrumb.length - 1):
                        (key = $event.name),
                            this.breadcrumb.splice($event.i + 1);
                        break;
                }

                if (key) {
                    if (this.breadcrumb.length < 3) this.option.geo.map = key;

                    this.$emit("value", key);
                }
            }
        }
    },

    data() {
        return {
            breadcrumb: [],

            mapName: {
                国: "china",
                京: "北京",
                北京: "京",
                沪: "上海",
                上海: "沪",
                津: "天津",
                天津: "津",
                渝: "重庆",
                重庆: "渝",
                云: "云南",
                云南: "云",
                冀: "河北",
                河北: "冀",
                台: "台湾",
                台湾: "台",
                吉: "吉林",
                吉林: "吉",
                宁: "宁夏",
                宁夏: "宁",
                川: "四川",
                四川: "川",
                新: "新疆",
                新疆: "新",
                晋: "山西",
                山西: "晋",
                桂: "广西",
                广西: "桂",
                浙: "浙江",
                浙江: "浙",
                港: "香港",
                香港: "港",
                湘: "湖南",
                湖南: "湘",
                澳: "澳门",
                澳门: "澳",
                琼: "海南",
                海南: "琼",
                甘: "甘肃",
                甘肃: "甘",
                皖: "安徽",
                安徽: "皖",
                粤: "广东",
                广东: "粤",
                苏: "江苏",
                江苏: "苏",
                蒙: "内蒙古",
                内蒙古: "蒙",
                藏: "西藏",
                西藏: "藏",
                豫: "河南",
                河南: "豫",
                贵: "贵州",
                贵州: "贵",
                赣: "江西",
                江西: "赣",
                辽: "辽宁",
                辽宁: "辽",
                鄂: "湖北",
                湖北: "鄂",
                闽: "福建",
                福建: "闽",
                陕: "陕西",
                陕西: "陕",
                青: "青海",
                青海: "青",
                鲁: "山东",
                山东: "鲁",
                黑: "黑龙江",
                黑龙江: "黑"
            },

            mapCenter: {
                国: { zoom: 1.0, center: [140.3, 35.9] },
                京: { zoom: 1.0, center: [118.12, 40.26] },
                沪: { zoom: 1.0, center: [122.648, 31.275] },
                津: { zoom: 1.0, center: [118.69, 39.2] },
                渝: { zoom: 1.0, center: [111.85, 30.19] },
                云: { zoom: 1.0, center: [110.07, 25.2] },
                冀: { zoom: 1.0, center: [123.35, 39.35] },
                台: { zoom: 1.33, center: [123.53, 23.6] },
                吉: { zoom: 1.0, center: [132.03, 43.6] },
                宁: { zoom: 1.0, center: [110.18, 37.32] },
                川: { zoom: 1.0, center: [111.32, 30.2] },
                新: { zoom: 1.0, center: [100.0, 41.79] },
                晋: { zoom: 1.0, center: [118.67, 37.68] },
                桂: { zoom: 1.0, center: [113.84, 23.76] },
                浙: { zoom: 1.0, center: [124.55, 29.21] },
                港: { zoom: 1.0, center: [114.56, 22.358] },
                湘: { zoom: 1.0, center: [117.13, 27.4] },
                澳: { zoom: 1.0, center: [113.6788, 22.1608] },
                琼: { zoom: 8.1, center: [111.945, 19.155] },
                甘: { zoom: 1.0, center: [110.9, 37.73] },
                皖: { zoom: 1.0, center: [122.62, 32.05] },
                粤: { zoom: 1.0, center: [118.82, 22.88] },
                苏: { zoom: 1.0, center: [123.6, 32.95] },
                蒙: { zoom: 1.0, center: [127.82, 45.4] },
                藏: { zoom: 1.0, center: [98.55, 31.7] },
                豫: { zoom: 1.0, center: [118.58, 33.88] },
                贵: { zoom: 1.0, center: [111.29, 26.93] },
                赣: { zoom: 1.0, center: [121.73, 27.3] },
                辽: { zoom: 1.0, center: [127.18, 41.12] },
                鄂: { zoom: 1.0, center: [116.58, 31.16] },
                闽: { zoom: 1.0, center: [123.05, 25.95] },
                陕: { zoom: 1.0, center: [116.4, 35.66] },
                青: { zoom: 1.0, center: [103.98, 35.42] },
                鲁: { zoom: 1.0, center: [122.87, 36.4] },
                黑: { zoom: 1.0, center: [138.45, 48.53] }
            },

            baseOption: {
                title: {
                    left: 24,
                    top: 24,
                    padding: 0
                },
                grid: {
                    left: "54%",
                    bottom: 16,
                    width: 440,
                    containLabel: true
                },
                xAxis: {
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
                        show: false
                    }
                },
                yAxis: {
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
                visualMap: {
                    orient: "horizontal",
                    right: "50%",
                    bottom: 16,
                    padding: [0, 242, 0, 0],
                    itemWidth: 12,
                    itemHeight: 72,
                    seriesIndex: 1
                },
                series: [
                    {
                        type: "bar",
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 10
                            }
                        }
                    },
                    {
                        type: "map",
                        top: 72,
                        bottom: 44,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        }
                    }
                ]
            },

            scsiOption: {
                name: "南海诸岛",
                itemStyle: {
                    normal: {
                        opacity: 0
                    }
                }
            },

            on: [
                {
                    event: "click",
                    query: "series.map",
                    handler: this.handlerValue
                }
            ]
        };
    }
};
</script>
