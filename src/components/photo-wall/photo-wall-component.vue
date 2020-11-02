<style lang="scss" src="./photo-wall-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="photo-wall-component">
        <div class="photo-wall-title">
            {{ title }}
        </div>
        <div class="photo-wall-container" :style="{ 'max-width': maxWidth }">
            <div v-for="(people, i) in data" :key="i" class="photo-wall-people">

                <div class="photo-wall-people_photo">
                    <img :src="people.photo"/>
                </div>

                <div class="photo-wall-people_sex">
                    <i class="vic-icon" :class="'@base-' + people.sex"></i>
                </div>

                <div class="photo-wall-people_name">
                    {{ people.name }}
                </div>

            </div>
        </div>
    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            title: {
                type: String
            },

            data: {
                // {
                //     name: 'rain',
                //     sex: 'male',
                //     photo: 'http:...'
                // }
                type: Array
            }

        },

        methods: {

            handlerResize() {

                this.maxWidth = (Math.floor((this.$el.offsetWidth - 64) / 110) * 110) + 'px';

            }

        },

        mounted() {

            window.addEventListener('resize', this.handlerResize), this.handlerResize();

        },

        beforeDestroy() {

            window.removeEventListener('resize', this.handlerResize);

        },

        data() {

            return {
                maxWidth: 0
            };

        }

    }

</script>
