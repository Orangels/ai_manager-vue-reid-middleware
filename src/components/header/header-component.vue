<style lang="scss" src="./header-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "button_largeScreen": "大屏"
        }
    }
</i18n>

<template>
    <div class="header-component">
        <!-- title -->
        <div class="header-title">
            <slot></slot>
        </div>

        <!-- right -->
        <div class="header-right">
            <!-- search -->
            <input-search-component
                v-if="mixRight.search"
                v-model="rightSearchKeyword"
                prefix-icon="vic-icon @top-search_solid"
            ></input-search-component>

            <!-- message -->
            <el-button v-if="mixRight.message" type="text">
                <i class="vic-icon @top-message_solid"></i>
                <sup v-if="rightMessageSup">{{ rightMessageSup }}</sup>
            </el-button>

            <!-- logout -->
            <el-button v-if="mixRight.logout" type="text" @click="logout">
                <i class="vic-icon @top-logout_solid"></i>
            </el-button>

            <!-- largeScreen -->
            <el-button
                v-if="mixRight.largeScreen"
                size="small"
                class="@light-gray-colour"
            >{{ $t('button_largeScreen') }}</el-button>
        </div>
    </div>
</template>

<script type="text/jsx">
export default {
    props: {
        right: {
            type: Object
        }
    },

    computed: {
        mixRight() {
            return Object.assign(this.baseRight, this.right);
        }
    },

    data() {
        return {
            baseRight: {
                search: false,
                message: false,
                logout: true,
                largeScreen: false
            },
            rightSearchKeyword: "",
            rightMessageSup: ""
        };
    },

    methods: {
        logout() {
            this.$store.commit('loginOut');
        }
    }
};
</script>
