<style lang="scss" src="./index-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "title": "右侧对话框"
        }
    }
</i18n>

<template>
    <right-dialog-component>

        <!-- top -->
        <template v-if="visibleTop" slot="top">
            <div style="width: 240px; height: 240px;">
                <el-button size="large" class="@normal" @click="() => { visibleTop = false; }">
                    关闭顶层
                </el-button>
            </div>
        </template>

        <!-- left -->
        <template slot="left">
            <div style="width: 240px;">
                左边栏
            </div>
        </template>

        <!-- header -->
        <template slot="header">

            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{ $t('title') }}</el-breadcrumb-item>
            </el-breadcrumb>

            <el-button type="text" class="close" @click="$emit('cancel')">
                <i class="vic-icon @base-close"></i>
            </el-button>

        </template>

        <!-- content -->
        <template slot="content">
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
            内容 <br><br><br><br><br><br><br><br><br><br>
        </template>

        <!-- footer -->
        <template slot="footer">

            <el-button size="large" class="@normal" @click="() => { visibleTop = true; }">
                顶层
            </el-button>

            <el-button size="large" class="@normal" @click="() => { $emit('enter', '/_/hello/r-dialog/sub-1'); }">
                子页面 1
            </el-button>

            <el-button size="large" class="@normal" @click="() => { $emit('ok'); }">
                确定
            </el-button>

        </template>

    </right-dialog-component>
</template>

<script type="text/jsx">

    import Service from './index-service';



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

            return { visibleTop: false };

        }

    }

</script>
