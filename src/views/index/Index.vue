<template>
    <div class="wrapper">
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content">
                <!-- <transition name="move" mode="out-in"> -->
                <!-- <keep-alive> -->
                    <router-view></router-view>
                <!-- </keep-alive> -->
                <!-- </transition> -->
            </div>
        </div>
    </div>
</template>

<script>
import vSidebar from "./Sidebar";
export default {
    name: "home",
    components: { vSidebar },
    data() {
        return {};
    },
    computed: {
        collapse() {
            return this.$store.state.collapse;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
