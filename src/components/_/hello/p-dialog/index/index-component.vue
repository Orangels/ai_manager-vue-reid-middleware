<style lang="scss" src="./index-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "title": "对话框"
        }
    }
</i18n>

<template>
    <div class="sub-component">
        index-component
    </div>
</template>

<script type="text/jsx">

    import Service from './index-service';



    export default {

        computed: {

            state() {

                return this.$store.state['/_/hello/p-dialog'];

            }

        },

        watch: {

        },

        methods: {

            confirm($next) {

                $next();

            }

        },

        activated() {

            this.$emit('title', this.$t('title'));

        },

        mounted() {

        },

        data() {

            return {};

        }

    }

</script>
