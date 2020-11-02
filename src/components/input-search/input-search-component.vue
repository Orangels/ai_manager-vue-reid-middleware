<style lang="scss" src="./input-search-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "placeholder": "请输入关键字"
        }
    }
</i18n>

<template>
    <div class="input-search-component" :class="{ '@input': input }">

        <!-- el-button -->
        <el-button type="text" @click="() => { input = true; $refs.input.focus(); }">
            <i :class="mixPrefixIcon"></i>
        </el-button>

        <!-- el-input -->
        <el-input
            ref="input"
            :value="value"
            :placeholder="mixPlaceholder"
            :clearable="true"
            @input="$emit('input', $event)"
            @keyup.enter.native="$emit('enter', value)"
            @change="$emit('change', $event)"
            @clear="$refs.input.focus()"
            @blur="value || (input = false)">
        </el-input>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            value: {
                type: String
            },

            placeholder: {
                type: String
            },

            prefixIcon: {
                type: String
            }

        },

        computed: {

            mixPlaceholder() {

                return this.placeholder || this.$t('placeholder');

            },

            mixPrefixIcon() {

                return this.prefixIcon || 'vic-icon @top-search';

            }

        },

        data() {

            return { input: false };

        }

    }

</script>
