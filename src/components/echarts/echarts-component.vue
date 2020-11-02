<style lang="scss" src="./echarts-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="echarts-component" :style="{ 'width': width, 'height': height }"></div>
</template>

<script type="text/jsx">
import extend from "extend";
import echarts from "echarts";

// 定义皮肤
// 只会执行一次
echarts.registerTheme("default", require("./theme.default.json").echarts);

export default {
    props: {
        width: {
            type: String
        },

        height: {
            type: String
        },

        option: {
            type: Array
        },

        on: {
            type: Array
        }
    },

    watch: {
        width() {
            this.handlerResize();
        },

        height() {
            this.handlerResize();
        },

        option: {
            handler() {
                this.echartsInstance.setOption(
                    extend(true, {}, ...this.option),
                    true
                );
            },

            deep: true
        }
    },

    methods: {
        handlerInit() {
            let a, i;

            let rendered = () => {
                if (
                    this.elWidth !== this.$el.offsetWidth ||
                    this.elHeight !== this.$el.offsetHeight
                ) {
                    this.$emit(
                        "rendered",
                        (this.elWidth = this.$el.offsetWidth),
                        (this.elHeight = this.$el.offsetHeight)
                    );
                }
            };

            // 第 1 步
            // 实例化
            this.echartsInstance = echarts.init(this.$el, this.$v.theme);

            // 第 2 步
            // 写入、合并 option
            this.echartsInstance.setOption(
                extend(true, {}, ...this.option),
                true,
                true
            );

            // 第 3 步
            // 绑定 finished 事件
            this.echartsInstance.on("finished", rendered);

            // 第 4 步
            // 绑定事件
            if (this.on)
                for (i = 0; (a = this.on[i]); i++)
                    this.echartsInstance.on(a.event, a.query, a.handler);
        },

        handlerResize() {
            this.$el.children[0].style.width = this.$el.style.width;

            window.setTimeout(() => this.echartsInstance.resize(), 0);
        }
    },

    mounted() {
        this.handlerInit();

        window.addEventListener("resize", this.handlerResize);
    },

    beforeDestroy() {
        window.removeEventListener("resize", this.handlerResize);
    },

    data() {
        return {
            elWidth: null,
            elHeight: null,
            echartsInstance: null
        };
    }
};
</script>
