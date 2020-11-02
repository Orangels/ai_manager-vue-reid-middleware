<template>
    <div class="sidebar">
        <div class="left-logo" @click="pickUp">
            <i class="logo vic-icon @logo"></i>
            <span v-show="!collapse" class="logo-title">AI数据管理平台</span>
        </div>
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item
                            v-for="(subItem,i) in item.subs"
                            :key="i"
                            :index="subItem.index"
                        >{{ subItem.title }}</el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    icon: "el-icon-tickets",
                    index: "task-center",
                    title: "任务列表",
                },
                {
                    icon: "el-icon-message",
                    index: "task-mgt",
                    title: "任务管理",
                },
                {
                    icon: "el-icon-edit",
                    index: "task-template",
                    title: "任务模板"
                },
                // {
                //     icon: "el-icon-error",
                //     index: "404",
                //     title: "404页面"
                // },
                // {
                //     icon: "el-icon-error",
                //     index: "403",
                //     title: "403页面"
                // },
                // {
                //     icon: "el-icon-setting",
                //     index: "hello",
                //     title: "组件页面"
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        },
        collapse() {
            return this.$store.state.collapse;
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    },
    methods: {
        pickUp() {
            this.$store.commit("collapseChange", !this.collapse);
        }
    }
};
</script>

<style lang="scss" scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    .left-logo {
        position: absolute;
        left: 0;
        top: 0;
        height: 58px;
        width: 240px;
        line-height: 58px;
        padding-left: 16px;
        cursor: pointer;
        background: linear-gradient(90deg, #55a5ff, #2288fc);
        &.logo-collapse {
            width: 65px !important;
        }
        .logo {
            font-size: 28px;
            color: #ffffff;
            float: left;
        }
        .logo-title {
            display: inline-block;
            height: 58px;
            line-height: 58px;
            color: #ffffff;
            font-size: 20px;
            padding-left: 4px;
        }
    }
    .sidebar-el-menu {
        margin-top: 58px;
        height: calc(100% - 58px);
        overflow-y: auto;
        border: none !important;
        &::-webkit-scrollbar {
            width: 0;
        }
        &:not(.el-menu--collapse) {
            width: 240px;
        }
    }
}
</style>
