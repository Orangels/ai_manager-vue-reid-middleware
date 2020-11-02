<style lang="scss" src="../header-input-component.global.scss"></style>
<style lang="scss" src="./header-select-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "placeholder": "列表"
        }
    }
</i18n>

<template>
    <div class="header-select-component" :class="{ '@null': !String(value), '@multiple': multiple, '@clearable': clearable, '@disabled': disabled }">

        <!-- input-value -->
        <div v-if="!String(value)" class="input-value @null">
            {{ mixPlaceholder }}
        </div>

        <div v-else-if="!multiple" class="input-value" :style="{ 'max-width': maxWidth }">
            {{ selectedLabel }}
        </div>

        <!-- el-select -->
        <el-select
            ref="select"
            popper-class="@612be61a-f37e-8321-18de-14b8750ac006"
            :value="value" @input="$emit('input', $event)"
            :multiple="multiple"
            :collapse-tags="collapseTags"
            :clearable="clearable"
            :disabled="disabled"
            @change="($event) => { $emit('change', $event); $nextTick(() => selectedLabel = $refs.select.selectedLabel); }">
            <slot></slot>
        </el-select>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            value: {
                type: String | Number | Boolean | Array
            },

            placeholder: {
                type: String
            },

            maxWidth: {
                type: String
            },

            multiple: {
                type: Boolean
            },

            collapseTags: {
                type: Boolean
            },

            clearable: {
                type: Boolean
            },

            disabled: {
                type: Boolean
            }

        },

        computed: {

            mixPlaceholder() {

                return this.placeholder || this.$t('placeholder');

            }

        },

        watch: {

            value() {

                this.$nextTick(() => this.selectedLabel = this.$refs.select.selectedLabel);

            }

        },

        mounted() {

            this._watchers[1].cb.call(this, this.value);

        },

        data() {

            return { selectedLabel: null };

        }

    }

</script>
