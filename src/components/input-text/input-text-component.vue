<style lang="scss" src="./input-text-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="input-text-component" :class="{ '@textarea': (type === 'textarea'), '@maxlength': maxlength }">

        <!-- maxlength -->
        <div v-if="maxlength" class="input-text-length">
            {{ value.length + keyValueLengthDiff }}/{{ maxlength }}
        </div>

        <!-- el-input -->
        <el-input
            :type="type"
            :value="value" @input="($event) => { $emit('input', $event); handlerInputScroll(); }"
            :placeholder="placeholder"
            :prefix-icon="prefixIcon"
            :maxlength="maxlength + keyValueLengthDiff"
            :rows="rows"
            :resize="resize"
            :autosize="autosize"
            :clearable="clearable"
            :disabled="disabled"
            @change="$emit('change', $event)">
        </el-input>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            type: {
                type: String
            },

            value: {
                type: String
            },

            placeholder: {
                type: String
            },

            prefixIcon: {
                type: String
            },

            keylength: {
                type: Object
            },

            maxlength: {
                type: Number
            },

            rows: {
                type: Number
            },

            resize: {
                type: String
            },

            autosize: {
                type: Boolean | Object
            },

            clearable: {
                type: Boolean
            },

            disabled: {
                type: Boolean
            }

        },

        computed: {

            keyValueLengthDiff() {

                let lengthDiff, diff, key, i;

                for (key in lengthDiff = 0, this.keylength) {

                    // 1
                    diff = this.keylength[key] - key.length;

                    // 2
                    for (i = -1; (i = this.value.indexOf(key, i + 1)) !== -1;) lengthDiff += diff;

                }

                return lengthDiff;

            }

        },

        methods: {

            handlerInputScroll() {

                if (this.type === 'textarea') {

                    let input;

                    (input = this.$children[0].$el.firstChild).scrollTop = input.scrollHeight;

                }

            }

        },

        data() {

            return {};

        }

    }

</script>
