<style lang="scss" src="../header-input-component.global.scss"></style>
<style lang="scss" src="./header-timepicker-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "placeholder"           : "时间",
            "placeholder_separator" : "至"
        }
    }
</i18n>

<template>
    <div class="header-timepicker-component" :class="{ '@null': !String(value), '@clearable': clearable, '@disabled': disabled }">

        <!-- input-value -->
        <div v-if="!String(value)" class="input-value @null">
            {{ mixPlaceholder }}
        </div>

        <div v-else-if="type === 'timerange'" class="input-value">
            {{ value[0].toFormatString('hh:mm') }} {{ mixRangeSeparator }} {{ value[1].toFormatString('hh:mm') }}
        </div>

        <div v-else class="input-value">
            {{ (new Date(value)).toFormatString('hh:mm') }}
        </div>

        <!-- el-time-picker -->
        <el-time-picker
            popper-class="@612be61a-f37e-8321-18de-14b8750ac006"
            :is-range="type === 'timerange'"
            :value="value" @input="$emit('input', ($event || ''))" format="HH:mm"
            :picker-options="pickerOptions"
            :clearable="clearable"
            :disabled="disabled"
            @change="$emit('change', $event)">
        </el-time-picker>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            type: {
                type: String
            },

            value: {
                type: String | Array
            },

            pickerOptions: {
                type: Object
            },

            placeholder: {
                type: String
            },

            rangeSeparator: {
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

            },

            mixRangeSeparator() {

                return this.rangeSeparator || this.$t('placeholder_separator');

            }

        },

        data() {

            return {};

        }

    }

</script>
