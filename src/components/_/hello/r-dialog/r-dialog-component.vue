<style lang="scss" src="./r-dialog-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div v-if="visible" class="right-dialog-wrapper" :class="{ '@enter': transition === 'enter', '@leave': transition === 'leave' }">

        <!-- 需要缓存的视图 -->
        <transition>
            <keep-alive>
                <router-view
                    v-if="$route.meta.isKeepAlive"
                    @enter="transition = 'enter', $router.push($event)"
                    @leave="transition = 'leave', $router.push($event)"
                    @ok="$emit('ok', $event)"
                    @cancel="$emit('cancel')">
                </router-view>
            </keep-alive>
        </transition>

        <!-- 正常的视图 -->
        <transition>
            <router-view
                v-if="!$route.meta.isKeepAlive"
                @enter="transition = 'enter', $router.push($event)"
                @leave="transition = 'leave', $router.push($event)"
                @ok="$emit('ok', $event)"
                @cancel="$emit('cancel')">
            </router-view>
        </transition>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            visible: {
                type: Boolean
            },

            closeOnPressEscape: {
                type: Boolean
            },

            closeOnClickModal: {
                type: Boolean
            },

            width: {
                type: String
            },

            value: {
                type: Object
            }

        },

        watch: {

            visible($visible) {

                if ($visible) {

                    window.postMessage({ type: 'frozen' }, window.location.origin);

                    this.$router.push('/_/hello/r-dialog/index');

                    this.$store.commit('/_/hello/r-dialog/write', this.value);

                }

                else {

                    window.postMessage({ type: 'unfrozen' }, window.location.origin);

                    this.$router.push('/_/hello');

                }

                this.plugInBodyStyle();

            }

        },

        methods: {

            plugInBodyStyle() {

                if (this.visible) {

                    document.body.style.overflow = 'hidden';
                    document.body.style.paddingRight = (window.innerHeight < document.body.scrollHeight ? 8 : 0) + 'px';

                }

                else document.body.style.overflow = document.body.style.paddingRight = '';

            }

        },

        data() {

            return { transition: null };

        }

    }

</script>
