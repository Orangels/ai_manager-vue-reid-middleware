<style lang="scss" src="./p-dialog-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "button_ok"     : "确定",
            "button_cancel" : "取消"
        }
    }
</i18n>

<template>
    <el-dialog
        :visible="visible"
        :title="title"
        :close-on-press-escape="closeOnPressEscape"
        :close-on-click-modal="closeOnClickModal"
        :width="width"
        :append-to-body="true"
        @open="handlerVisible"
        @closed="handlerVisible"
        @close="handlerCancel">

        <!-- content -->
        <template v-if="content">

            <!-- 需要缓存的视图 -->
            <keep-alive>
                <router-view v-if="$route.meta.isKeepAlive" ref="content" @title="title = $event"></router-view>
            </keep-alive>

            <!-- 正常的视图 -->
            <router-view v-if="!$route.meta.isKeepAlive" ref="content" @title="title = $event"></router-view>

        </template>

        <!-- footer -->
        <template slot="footer">

            <el-button size="small" class="@light-gray-colour" @click="handlerCancel">
                {{ $t('button_cancel') }}
            </el-button>

            <el-button size="small" class="@normal" @click="handlerOk">
                {{ $t('button_ok') }}
            </el-button>

        </template>
    </el-dialog>
</template>

<script>

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

        methods: {

            handlerVisible() {

                if (this.content = this.visible) {

                    window.postMessage({ type: 'frozen' }, window.location.origin);

                    this.$router.push('/_/hello/p-dialog/index');

                    this.$store.commit('/_/hello/p-dialog/write', this.value);

                }

                else {

                    window.postMessage({ type: 'unfrozen' }, window.location.origin);

                    this.$router.push('/_/hello');

                }

            },

            handlerOk() {

                this.$refs.content.confirm(($value) => this.$emit('ok', $value));

            },

            handlerCancel() {

                if (this.visible) this.$emit('cancel');

            }

        },

        data() {

            return {
                title: '',
                content: false
            };

        }

    }

</script>
