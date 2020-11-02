<style lang="scss" src="../header-input-component.global.scss"></style>
<style lang="scss" src="./header-datepicker-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "placeholder"           : "日期",
            "placeholder_separator" : "至"
        }
    }
</i18n>

<template>
    <div class="header-datepicker-component" :class="{ '@null': !String(value), '@clearable': clearable, '@disabled': disabled }">

        <!-- 日期 -->
        <template v-if="type === 'date'">

            <!-- input-value -->
            <div v-if="!String(value)" class="input-value @null">
                {{ mixPlaceholder }}
            </div>

            <div v-else class="input-value">
                {{ (new Date(value)).toFormatString('YYYY-MM-DD') }}
            </div>

            <!-- el-date-picker -->
            <el-date-picker
                type="date"
                popper-class="@612be61a-f37e-8321-18de-14b8750ac006"
                :value="value" @input="$emit('input', ($event ? $event.toString() : ''))"
                :picker-options="pickerOptions"
                :clearable="clearable"
                :disabled="disabled"
                @change="$emit('change', $event)">
            </el-date-picker>

        </template>

        <!-- 范围日期 -->
        <template v-else-if="type === 'daterange'">

            <!-- input-value -->
            <div v-if="!String(value)" class="input-value @null">
                {{ mixPlaceholder }}
            </div>

            <div v-else class="input-value">
                {{ value[0].toFormatString('YYYY-MM-DD') }} {{ mixRangeSeparator }} {{ value[1].toFormatString('YYYY-MM-DD') }}
            </div>

            <!-- input-daterange-component -->
            <input-daterange-component
                popper-class="@612be61a-f37e-8321-18de-14b8750ac006"
                :value="value" @input="$emit('input', ($event || []))"
                :picker-options="pickerOptions"
                :clearable="clearable"
                :disabled="disabled"
                @change="$emit('change', $event)">
            </input-daterange-component>

        </template>
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
