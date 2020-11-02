<style lang="scss" src="./input-cascader-component.global.scss"></style>
<style lang="scss" src="./input-cascader-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "button_ok"     : "确定",
            "button_cancel" : "取消"
        }
    }
</i18n>

<template>
    <el-popover v-model="visiblePopover" class="input-cascader-component" :class="{ '@disabled': disabled }" :popper-class="'input-cascader-popover ' + popperClass" placement="bottom-start" trigger="click" @mouseenter.native="() => { if (!disabled && clearable && value.length) visibleClear = true; }" @mouseleave.native="() => { visibleClear = false; }" @show="() => { $emit('selection', (selection = [ ...value ])); }">

        <!-- input -->
        <template slot="reference">

            <!-- input -->
            <el-input ref="input" :class="{ 'is-focus': visiblePopover }" :value="selectedLabel.join(labelSeparator)" :placeholder="placeholder" :disabled="disabled" readonly></el-input>

            <!-- icon -->
            <div class="el-input__suffix">
                <span class="el-input__suffix-inner">

                    <!-- arrow -->
                    <i v-show="!visibleClear" class="el-input__icon el-icon-arrow-up" :class="{ 'is-reverse': visiblePopover }" @click="() => { visiblePopover = !visiblePopover; }"></i>

                    <!-- clear -->
                    <i v-show="visibleClear" class="el-input__icon el-icon-circle-close" @click="() => { visiblePopover = false; $nextTick(() => { $emit('input', []); $nextTick(() => $emit('change', value)); }); }"></i>

                </span>
            </div>
        </template>

        <!-- popover -->
        <template>

            <!-- content -->
            <div class="input-cascader-popover_content">

                <!-- column -->
                <div v-for="(dataColumn, i) in data" :key="i" class="input-cascader-popover_column">
                    <el-scrollbar>

                        <!-- cell -->
                        <div v-for="(dataCell, j) in dataColumn" :key="j" class="input-cascader-popover_cell">
                            <el-radio v-model="selection[i]" :label="dataCell.value" @change="() => { selection.splice(i + 1); $emit('selection', selection); }">
                                {{ dataCell.label }}
                            </el-radio>
                        </div>
                    </el-scrollbar>
                </div>
            </div>

            <!-- footer -->
            <div class="input-cascader-popover_footer">

                <el-button type="text" @click="() => { visiblePopover = false; }">
                    {{ $t('button_cancel') }}
                </el-button>

                <el-button size="small" class="@normal" @click="handlerOk">
                    {{ $t('button_ok') }}
                </el-button>

            </div>
        </template>
    </el-popover>
</template>

<script type="text/jsx">

    import equals from 'equals';



    export default {

        props: {

            data: {
                type: Array
            },

            value: {
                type: Array
            },

            popperClass: {
                type: String,
                default: ''
            },

            placeholder: {
                type: String
            },

            labelSeparator: {
                type: String
            },

            clearable: {
                type: Boolean
            },

            disabled: {
                type: Boolean
            }

        },

        watch: {

            data: {

                handler($data) {

                    let h = () => {

                        this.$nextTick(() => window.dispatchEvent(new Event('resize', { bubbles: true, cancelable: true })));

                    };

                    if (this.visiblePopover) window.setTimeout(h, 300);

                },

                deep: true

            },

            value: {

                handler($value) {

                    let a, b, i, j;

                    outer: for (this.selectedLabel = [], i = 0; (a = $value[i]) !== undefined; i++) {

                        for (j = 0; b = this.data[i][j]; j++) {

                            if (a === b.value) { this.selectedLabel[i] = b.label; continue outer; }

                        }

                    }

                },

                deep: true

            }

        },

        methods: {

            handlerOk() {

                let h = () => {

                    if (!equals(this.selection, this.value)) {

                        this.$emit('input', this.selection);
                        this.$emit('change', this.selection);

                    }

                };

                this.visiblePopover = false, this.$nextTick(h);

            },

            handlerPopoverHide($event) {

                let inPopover = () => {

                    for (let a = $event.target; a = a.parentNode;) {

                        if (a === this.$children[0].popperElm) return true;

                    }

                };

                if ($event.target.tagName === 'INPUT' && $event.target.parentNode !== this.$refs.input.$el && !inPopover()) this.visiblePopover = false;

            }

        },

        mounted() {

            if (this.value.length) {

                this.$emit('selection', this.value);

                this._watchers[1].cb.call(this, this.value);

            }

            window.addEventListener('focusin', this.handlerPopoverHide);

        },

        beforeDestroy() {

            window.removeEventListener('focusin', this.handlerPopoverHide);

        },

        data() {

            return {
                visiblePopover: false,
                visibleClear: false,
                selection: [],
                selectedLabel: []
            };

        }

    }

</script>
