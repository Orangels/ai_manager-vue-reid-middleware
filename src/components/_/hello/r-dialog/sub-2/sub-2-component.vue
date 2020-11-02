<style lang="scss" src="./sub-2-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "breadcrumb_0": "右侧对话框",
            "breadcrumb_1": "子页面 2"
        }
    }
</i18n>

<template>
    <right-dialog-component>

        <!-- header -->
        <template slot="header">

            <el-button type="text" class="back" @click="$emit('leave', '/_/hello/r-dialog/sub-1')">
                <i class="vic-icon @base-back"></i>
            </el-button>

            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{ $t('breadcrumb_0') }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ $t('breadcrumb_1') }}</el-breadcrumb-item>
            </el-breadcrumb>

        </template>

        <!-- content -->
        <template slot="content">
            子页面 2
        </template>

    </right-dialog-component>
</template>

<script type="text/jsx">

    import Service from './sub-2-service';



    export default {

        computed: {

            state() {

                return this.$store.state['/_/hello/r-dialog'];

            }

        },

        watch: {

        },

        methods: {

        },

        mounted() {

        },

        data() {

            return {};

        }

    }

</script>
