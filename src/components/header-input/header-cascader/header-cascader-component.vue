<style lang="scss" src="../header-input-component.global.scss"></style>
<style lang="scss" src="./header-cascader-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "placeholder": "级联列表"
        }
    }
</i18n>

<template>
    <div class="header-cascader-component" :class="{ '@null': !String(value), '@clearable': clearable, '@disabled': disabled }">

        <!-- input-value -->
        <div v-if="!String(value)" class="input-value @null">
            {{ mixPlaceholder }}
        </div>

        <div v-else class="input-value">
            <span v-for="(selectedLabel, i) in selectedLabel" :key="i" class="input-value_inner" :style="{ 'max-width': labelMaxWidth }" :data-label-separator="labelSeparator">{{ selectedLabel }}</span>
        </div>

        <!-- input-cascader-component -->
        <input-cascader-component
            ref="inputCascader"
            popper-class="@612be61a-f37e-8321-18de-14b8750ac006"
            :data="data"
            :value="value" @input="$emit('input', $event)"
            :clearable="clearable"
            :disabled="disabled"
            @selection="$emit('selection', $event)"
            @change="($event) => { $emit('change', $event); $nextTick(() => selectedLabel = $refs.inputCascader.selectedLabel); }">
        </input-cascader-component>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            data: {
                type: Array
            },

            value: {
                type: Array
            },

            placeholder: {
                type: String
            },

            labelSeparator: {
                type: String
            },

            labelMaxWidth: {
                type: String
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

        mounted() {

            this.selectedLabel = this.$refs.inputCascader.selectedLabel;

        },

        data() {

            return { selectedLabel: [] };

        }

    }

</script>
