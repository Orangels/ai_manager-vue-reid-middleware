<style lang="scss" src="./input-daterange-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "placeholder_start"     : "开始日期",
            "placeholder_end"       : "结束日期",
            "placeholder_separator" : "至",
            "shortcut_yesterday"    : "昨天",
            "shortcut_past7Days"    : "过去 7 天",
            "shortcut_past30Days"   : "过去 30 天",
            "shortcut_past90Days"   : "过去 90 天",
            "shortcut_lastWeek"     : "上周",
            "shortcut_lastMonth"    : "上月",
            "shortcut_thisWeek"     : "本周",
            "shortcut_thisMonth"    : "本月"
        }
    }
</i18n>

<template>
    <el-date-picker
        class="input-daterange-component"
        type="datetimerange"
        :value="value" @input="$emit('input', $event)" format="yyyy-MM-dd"
        :picker-options="mixPickerOptions"
        :popper-class="popperClass"
        :start-placeholder="mixStartPlaceholder"
        :end-placeholder="mixEndPlaceholder"
        :range-separator="mixRangeSeparator"
        :clearable="clearable"
        :disabled="disabled"
        @change="$emit('change', $event)">
    </el-date-picker>
</template>

<script type="text/jsx">

    export default {

        props: {

            value: {
                type: Array
            },

            pickerOptions: {
                type: Object
            },

            popperClass: {
                type: String
            },

            startPlaceholder: {
                type: String
            },

            endPlaceholder: {
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

            mixPickerOptions() {

                let pickerOptions, a, i;

                for (pickerOptions = { ...this.basePickerOptions, ...this.pickerOptions }, i = 0; a = pickerOptions.shortcuts[i]; i++) {

                    if (typeof a === 'string') pickerOptions.shortcuts.splice(i, 1, this.shortcut[a]);

                }

                if (!pickerOptions.shortcuts.length) delete pickerOptions.shortcuts;

                return pickerOptions;

            },

            mixStartPlaceholder() {

                return this.startPlaceholder || this.$t('placeholder_start');

            },

            mixEndPlaceholder() {

                return this.endPlaceholder || this.$t('placeholder_end');

            },

            mixRangeSeparator() {

                return this.rangeSeparator || this.$t('placeholder_separator');

            }

        },

        methods: {

            firstDayByWeek($i) {

                let d;

                return (1 - ((d = new Date).getDay() || 7)) + (7 * $i);

            },

            firstDayByMonth($i) {

                let d;

                return Math.floor(((d = new Date, d.setDate(1), d.setMonth(d.getMonth() + $i), d) - new Date) / 864E5);

            },

            handlerShortcutClick($picker, $i, $j) {

                let d;

                $picker.$emit('pick', [ new Date((d = new Date).valueOf() + (864E5 * $i)), new Date(d.valueOf() + (864E5 * $j)) ]);

            }

        },

        data() {

            return {
                shortcut: {
                    'yesterday': {
                        text: this.$t('shortcut_yesterday'),
                        onClick: ($picker) => this.handlerShortcutClick($picker, -1, -1)
                    },
                    'past 7 days': {
                        text: this.$t('shortcut_past7Days'),
                        onClick: ($picker) => this.handlerShortcutClick($picker, -7, -1)
                    },
                    'past 30 days': {
                        text: this.$t('shortcut_past30Days'),
                        onClick: ($picker) => this.handlerShortcutClick($picker, -30, -1)
                    },
                    'past 90 days': {
                        text: this.$t('shortcut_past90Days'),
                        onClick: ($picker) => this.handlerShortcutClick($picker, -90, -1)
                    },
                    'last week': {
                        text: this.$t('shortcut_lastWeek'),
                        onClick: ($picker) => this.handlerShortcutClick($picker, this.firstDayByWeek(-1), this.firstDayByWeek(-1) + 6)
                    },
                    'last month': {
                        text: this.$t('shortcut_lastMonth'),
                        onClick: ($picker) => this.handlerShortcutClick($picker, this.firstDayByMonth(-1), this.firstDayByMonth(0) - 1)
                    },
                    'this week': {
                        text: this.$t('shortcut_thisWeek'),
                        onClick: ($picker) => this.handlerShortcutClick($picker, this.firstDayByWeek(0), 0)
                    },
                    'this month': {
                        text: this.$t('shortcut_thisMonth'),
                        onClick: ($picker) => this.handlerShortcutClick($picker, this.firstDayByMonth(0), 0)
                    }
                },
                basePickerOptions: {
                    firstDayOfWeek: 1,
                    shortcuts: [
                        'yesterday',
                        'past 7 days',
                        'past 30 days',
                        'past 90 days',
                        'last week',
                        'last month',
                        'this week',
                        'this month'
                    ]
                }
            };

        }

    }

</script>
