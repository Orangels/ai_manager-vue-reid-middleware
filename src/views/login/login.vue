<i18n>
    {
        "zh-CN": {
            "login_title"               : "登 录",
            "login_labelAccount"        : "账号",
            "login_labelPassword"       : "密码",
            "login_labelKeepPassword"   : "记住密码",
            "login_error_11"            : "请输入账号",
            "login_error_21"            : "请输入密码",
            "button_login"              : "登 录"
        }
    }
</i18n>

<template>
    <div id="login">
        <div class="header-container">
            <i class="vic-icon @logo_text"></i>
        </div>

        <!-- 播放器 -->
        <div class="player-container">
            <video class="h5-video" src="../../assets/login.mp4" autoplay="autoplay" loop="loop" muted="muted" height="100%" width="100%"></video>
        </div>

        <!-- 登录框 -->
        <div class="login-container">
            <el-form ref="login" :model="login.value" :rules="login.rule">
                <div class="el-form-title">{{ $t('login_title') }}</div>

                <!-- 账号 -->
                <el-form-item :label="$t('login_labelAccount')" class="@title-line" prop="account">
                    <el-input v-model="login.value.account" type="text"></el-input>
                </el-form-item>

                <!-- 密码 -->
                <el-form-item :label="$t('login_labelPassword')" class="@title-line" prop="password">
                    <el-input v-model="login.value.password" type="password"></el-input>
                </el-form-item>

                <!-- 记住密码、登录 -->
                <el-form-item>
                    <el-checkbox v-model="login.value.keepPassword">{{ $t('login_labelKeepPassword') }}</el-checkbox>
                    <el-button size="large" class="login @normal" @click="handlerLogin">{{ $t('button_login') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/jsx">
export default {
    methods: {
        // 处理登录
        handlerLogin() {
            let valid;
            this.$refs.login.validate($valid => {
                valid = $valid;
            });

            if (valid) {
                let success = $res => {
                    this.handlerKeepPassword(this.login.value.keepPassword);
                    window.localStorage.setItem("TOKEN_MARK", '1fd399bdd9774831baf555ae5979c66b');// 等后台添加了token后再改
                    window.localStorage.setItem("USER_MARK", this.login.value.account);
                    window.localStorage.setItem("is_admin", $res.is_admin);
                    window.location.href = "/";
                };

                let error = $error => {
                    if ($error.type === 'error') {
                        this.$message({ type: "error", message: $error.text });
                    } else {
                        this.login.error[$error.type] = $error;
                        this.$refs.login.validateField($error.type);
                    }
                };
                
                let params = {
                    username: this.login.value.account, 
                    password: this.login.value.password
                };
                this.$http.post(this.$api.login, params, true).then($res => {
                    let res = $res.data;
                    switch (res.code) {
                        case 0:
                            success(res.data);
                            break;
                        case 201002:
                            error({ type: "account", text: "账号错误" });
                            break;
                        case 201003:
                            error({ type: "password", text: "密码错误" });
                            break;
                        default:
                            error({ type: "error", text: "登录失败，请联系管理员!" });
                            break;
                    }
                }).catch($res => {
                    error({ type: "error", text: "登录失败，请联系管理员!" });
                });
            }
        },
        // 处理验证 -- 账号  
        handlerValidatorAccount($rule, $value, $callback) {
            switch (true) {
                case Boolean(Object.keys(this.login.error.account).length != 0):
                    $callback(new Error(this.login.error.account.text)),
                        delete this.login.error.account;
                    break;
                case Boolean(!$value || !$value.trim()):
                    $callback(new Error(this.$t("login_error_11")));
                    break;
                default:
                    $callback();
            }
        },
        // 处理验证 -- 密码
        handlerValidatorPassword($rule, $value, $callback) {
            switch (true) {
                case Boolean(Object.keys(this.login.error.password).length != 0):
                    $callback(new Error(this.login.error.password.text)),
                        delete this.login.error.password;
                    break;
                case Boolean(!$value):
                    $callback(new Error(this.$t("login_error_21")));
                    break;
                default:
                    $callback();
            }
        },
        // 处理记住密码
        handlerKeepPassword($keep) {
            switch ($keep) {
                case true:
                    window.localStorage.setItem("login-account", this.login.value.account);
                    window.localStorage.setItem("login-password", this.login.value.password);
                    break;
                case false:
                    window.localStorage.removeItem("login-account");
                    window.localStorage.removeItem("login-password");
                    window.localStorage.removeItem("USER_MARK");
                    break;
                default:
                    this.login.value.account = window.localStorage.getItem("login-account");
                    this.login.value.password = window.localStorage.getItem("login-password");
                    window.localStorage.removeItem("USER_MARK");
                    this.login.value.keepPassword = Boolean(this.login.value.account);
            }
        },
    },

    mounted() {
        this.handlerKeepPassword();
    },

    data() {
        return {
            login: {
                value: {
                    account: "",
                    password: "",
                    keepPassword: false
                },
                rule: {
                    account: {
                        validator: this.handlerValidatorAccount,
                        trigger: "blur"
                    },
                    password: {
                        validator: this.handlerValidatorPassword,
                        trigger: "blur"
                    }
                },
                error: {
                    account: {},
                    password: {},
                }
            }
        };
    }
};
</script>
<style lang="scss" scoped>
#login {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #292c39;

    *::-webkit-scrollbar {
        display: none;
    }

    *:hover::-webkit-scrollbar {
        display: block;
    }
}

/**
     * 头部、播放器、登录框
     */

.header-container {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;

    .vic-icon.\@logo_text {
        position: absolute;
        left: 60px;
        top: 30px;
        font-size: 36px;
        line-height: 36px;
        color: #e3ecf3;
    }
}

.player-container {
    position: absolute;
    left: 0;
    top: 10%;
    width: calc(100% - 400px);
    height: 80%;
    .h5-video {
        width: 100% !important;
        height: 100% !important;
        background-color: transparent;
    }
}

.login-container {
    position: absolute;
    right: 122px;
    top: calc(50% - 212px);
    z-index: 1;
    width: 400px;
    border: 1px solid #e4e3e9;
    border-radius: 6px;
    box-shadow: 0 0 18px rgba(12, 15, 20, 0.5);
    background-color: #ffffff;

    .el-form {
        padding: 44px;

        .el-form-title {
            font-weight: 400;
            font-size: 34px;
            line-height: 34px;
            text-align: center;
            color: #2288fc;
        }

        .el-form-item {
            .el-form-item__label {
                font-size: 16px;
                color: #999999;
            }

            .el-form-item__content {
                white-space: normal;

                .login {
                    position: relative;
                    top: 24px;
                    width: 100%;
                }
            }
        }
    }
}
</style>
