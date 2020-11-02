<style lang="scss" src="./dialog-right-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="right-dialog-component">
        <!-- top -->
        <el-dialog v-if="$slots.top" :visible="true" :modal="false" :show-close="false" width="auto">
            <slot name="top"></slot>
        </el-dialog>

        <!-- left -->
        <div v-if="$slots.left" class="right-dialog-left">
            <slot name="left"></slot>
        </div>

        <!-- container -->
        <div
            class="right-dialog-container"
            :class="{ 
                '@max-width': (wrapper.width.indexOf('max') !== -1), 
                '@large-width': (wrapper.width.indexOf('large') !== -1), 
                '@small-width': (wrapper.width.indexOf('small') !== -1), 
                '@full-width': (wrapper.width.indexOf('full-') !== -1), 
                '@footer': $slots.footer 
            }"
            @mousewheel="handlerContentScroll"
        >
            <div class="right-dialog-container_header">
                <slot name="header"></slot>
            </div>

            <div class="right-dialog-container_content">
                <el-scrollbar ref="scrollbar">
                    <slot name="content"></slot>
                </el-scrollbar>
            </div>

            <div v-if="$slots.footer" class="right-dialog-container_footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script type="text/jsx">
export default {
    props: {
        dialog: {
            type: Object
        }
    },

    watch: {
        dialog: {
            handler(newVal, oldVal) {
                this.wrapper = {
                    closeOnPressEscape: newVal.closeOnPressEscape || false,
                    closeOnClickModal: newVal.closeOnClickModal || false,
                    width: newVal.width || "large"
                };
            },
            immediate: true
        },
    },

    methods: {
        handlerClose($event) {
            if (
                ($event.type === "keyup" && $event.key === "Escape" && this.wrapper.closeOnPressEscape) ||
                ($event.type === "click" && $event.target.className === "right-dialog-wrapper" && this.wrapper.closeOnClickModal)
            )
                this.$parent.$emit('cancel');
        },

        handlerResize($event) {
            if (this.$refs.scrollbar.update) this.$refs.scrollbar.update();
        },

        handlerContentScroll($event) {
            this.$refs.scrollbar.$el.firstChild.scrollTop += $event.deltaY;
        }
    },

    mounted() {
        window.addEventListener("keyup", this.handlerClose), window.addEventListener("click", this.handlerClose);

        window.addEventListener("resize", this.handlerResize);
    },

    beforeDestroy() {
        window.removeEventListener("keyup", this.handlerClose), window.removeEventListener("click", this.handlerClose);

        window.removeEventListener("resize", this.handlerResize);
    },

    data() {
        return {
            visible: false,
            wrapper: {
                closeOnPressEscape: false,
                closeOnClickModal: false,
                width: "large"
            }
        };
    }
};
</script>
