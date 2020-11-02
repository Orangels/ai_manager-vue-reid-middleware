<style lang="scss" src="./header-filter-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="header-filter-component">

        <div class="header-filter-left">
            <slot></slot>
        </div>

        <div class="header-filter-right">
            <slot name="right"></slot>
        </div>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

        },

        data() {

            return {};

        }

    }

</script>
