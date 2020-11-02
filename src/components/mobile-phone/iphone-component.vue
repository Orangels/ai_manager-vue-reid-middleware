<style lang="scss" src="./iphone-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "smsInput_placeholder": "短信/彩信"
        }
    }
</i18n>

<template>
    <div class="iphone-component" :class="{ '@sms': (mode === 'sms') }">

        <!-- 短信机身 -->
        <div v-if="mode === 'sms'" class="iphone-body">

            <!-- [屏幕] 状态栏 -->
            <div class="iphone-screen_status-bar">

                <span class="iphone-time">
                    {{ time }}
                </span>

                <span class="iphone-icon-signal">
                    <i class="vic-icon @base-iphone-signal"></i>
                </span>

                <span class="iphone-icon-wifi">
                    <i class="vic-icon @base-iphone-wifi"></i>
                </span>

                <span class="iphone-icon-battery">
                    <i class="vic-icon @base-iphone-battery"></i>
                </span>

            </div>

            <!-- [屏幕] 页眉 -->
            <div class="iphone-screen_header">

                <span class="iphone-sms_back">
                    <i class="vic-icon @base-iphone-sms_back"></i>
                </span>

                <span v-if="data.sender" class="iphone-sms_sender">
                    <i class="vic-icon @base-iphone-sms_sender"></i> {{ data.sender }}
                </span>

            </div>

            <!-- [屏幕] 内容 -->
            <div class="iphone-screen_content">
                <el-scrollbar ref="$SMSContentScrollbar">
                    <div v-for="(sms, i) in data.sms" :key="i" class="iphone-sms" :class="{ '@received': (sms.type === 'received'), '@send': (sms.type === 'send') }" :data-time="sms.time">
                        {{ sms.content }}
                    </div>
                </el-scrollbar>
            </div>

            <!-- [屏幕] 输入栏 -->
            <div class="iphone-screen_input-bar">

                <span class="iphone-icon-camera">
                    <i class="vic-icon @base-iphone-camera"></i>
                </span>

                <span class="iphone-icon-store">
                    <i class="vic-icon @base-iphone-store"></i>
                </span>

                <span class="iphone-input">
                    <input v-model="input" type="text" maxlength="70" :placeholder="$t('smsInput_placeholder')" @keyup.enter="handlerSMSSent">
                    <i class="vic-icon @base-iphone-sent" @click="handlerSMSSent"></i>
                </span>

            </div>
        </div>
    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            mode: {
                type: String
            },

            data: {
                // sms
                // {
                //     sender: String,
                //     sms: [
                //         {
                //             type: String,
                //             time: String,
                //             content: String
                //         },
                //         ...
                //     ]
                // }
                //
                type: Object
            }

        },

        watch: {

            'data.sms.length' () {

                this.$nextTick(
                    () => {

                        this.$refs.$SMSContentScrollbar.$el.firstChild.scrollTop = this.$refs.$SMSContentScrollbar.$el.firstChild.scrollHeight;

                    }
                );

            }

        },

        methods: {

            handlerSMSSent() {

                this.$emit('sms-sent', this.input);

                this.input = '';

            }

        },

        mounted() {

            this.time = (new Date).toFormatString('hh:mm');

        },

        data() {

            return {
                time: null,
                input: null
            };

        }

    }

</script>
