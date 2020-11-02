<i18n>
    {
        "zh-CN": {
            "title":"标题"
        }
    }
</i18n>
<template>
    <div v-if="visibleLater" class="right-dialog-wrapper">
        <transition name="right-dialog" appear>
            <dialog-right-component v-if="rightDialog.visible" :dialog="rightDialog">
                <!-- top -->
                <template v-if="visibleTop" slot="top">
                    <div style="width: 240px; height: 240px;">
                        <el-button size="large" class="@normal" @click="() => { visibleTop = false; }">关闭顶层</el-button>
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
                    <el-button size="large" class="@normal" @click="() => { visibleTop = true; }"> 顶层 </el-button>
                    <el-button size="large" class="@normal" @click="() => { $emit('cancel'); }"> 取消 </el-button>
                    <el-button size="large" class="@normal" @click="() => { $emit('ok'); }"> 确定 </el-button>
                </template>
            </dialog-right-component>
        </transition>
    </div>
</template>

<script type="text/jsx">
import dialogRightComponent from "@components/dialog-right/dialog-right-component";
export default {
    components:{ dialogRightComponent },
    props: {
        options: {
            type: Object
        }
    },
    computed: { },

    watch: {
        options: {
            handler(newVal, oldVal) {
                this.rightDialog = newVal;
            },
            immediate: true
        },
        'rightDialog.visible': {
            handler(newVal, oldVal) {
                if(newVal){
                    this.visibleLater = true;
                }else{
                    setTimeout(() => {
                        this.visibleLater = false;
                    }, 1000);
                }
            },
            immediate: true
        }
    },

    methods: {
    },

    mounted() {
    },

    data() {
        return {
            rightDialog: {},
            visibleTop: false,
            visibleLater: false,
        };
    }
};
</script>
