<style lang="scss" src="./batch-operation-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "selected_label"    : "已选：",
            "selected_suffix"   : "条",
            "total_label"       : "合计：",
            "total_suffix"      : "条",
            "viewSelected"      : "查看已选",
            "viewAll"           : "查看全部",
            "clearSelected"     : "清空已选",
            "batchExport"       : "批量导出",
            "batchImport"       : "批量导入",
            "batchEdit"         : "批量编辑",
            "batchDelete"       : "批量删除"
        }
    }
</i18n>

<template>
    <div class="batch-operation-component" :class="{ '@hide': hide }">

        <!-- 已选 -->
        <div class="batch-operation_selected">
            <span class="batch-operation_label">{{ $t('selected_label') }}</span>
            <span class="batch-operation_value">{{ selected.toSeparateString() }}</span>
            <span class="batch-operation_suffix">{{ $t('selected_suffix') }}</span>
        </div>

        <!-- 合计 -->
        <div class="batch-operation_total">
            <span class="batch-operation_label">{{ $t('total_label') }}</span>
            <span class="batch-operation_value">{{ total.toSeparateString() }}</span>
            <span class="batch-operation_suffix">{{ $t('total_suffix') }}</span>
        </div>

        <!-- 查看已选 -->
        <div v-if="mixOperation.viewSelected" class="batch-operation_view-selected">
            <el-button type="text" @click="handlerClick('click-view-selected')">
                {{ $t('viewSelected') }}
            </el-button>
        </div>

        <!-- 查看全部 -->
        <div v-if="mixOperation.viewAll" class="batch-operation_view-all">
            <el-button type="text" @click="handlerClick('click-view-all')">
                {{ $t('viewAll') }}
            </el-button>
        </div>

        <!-- 清空已选 -->
        <div v-if="mixOperation.clearSelected" class="batch-operation_clear-selected">
            <el-button type="text" @click="handlerClick('click-clear-selected')">
                {{ $t('clearSelected') }}
            </el-button>
        </div>

        <!-- 批量导出 -->
        <div v-if="mixOperation.batchExport" class="batch-operation_batch-export">
            <el-button size="medium" class="@light-colour" @click="handlerClick('click-batch-export')">
                <i class="vic-icon @base-download"></i> {{ $t('batchExport') }}
            </el-button>
        </div>

        <!-- 批量导入 -->
        <div v-if="mixOperation.batchImport" class="batch-operation_batch-import">
            <el-button size="medium" class="@light-colour" @click="handlerClick('click-batch-import')">
                <i class="vic-icon @base-upload"></i> {{ $t('batchImport') }}
            </el-button>
        </div>

        <!-- 批量编辑 -->
        <div v-if="mixOperation.batchEdit" class="batch-operation_batch-edit">
            <el-button size="medium" class="@light-colour" @click="handlerClick('click-batch-edit')">
                <i class="vic-icon @base-edit"></i> {{ $t('batchEdit') }}
            </el-button>
        </div>

        <!-- 批量删除 -->
        <div v-if="mixOperation.batchDelete" class="batch-operation_batch-delete">
            <el-button size="medium" class="@light-colour" @click="handlerClick('click-batch-delete')">
                <i class="vic-icon @base-delete"></i> {{ $t('batchDelete') }}
            </el-button>
        </div>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            mode: {
                type: String
            },

            operation: {
                type: Object
            },

            selected: {
                type: Number
            },

            total: {
                type: Number
            },

            hide: {
                type: Boolean
            },

            i18n: {
                type: Object
            }

        },

        computed: {

            mixOperation() {

                return Object.assign(this.baseOperation, this.operation);

            }

        },

        methods: {

            initBaseOperation() {

                switch (this.mode) {

                    case '1' :
                        this.baseOperation.viewSelected     = true;
                        this.baseOperation.clearSelected    = true;
                        this.baseOperation.batchEdit        = true;
                        this.baseOperation.batchDelete      = true;
                        break;

                }

            },

            handlerClick($event) {

                switch (this.mode) {

                    case '1' :
                        this.handlerClick_mode1($event); break;

                }

                this.$emit($event);

            },

            handlerClick_mode1($event) {

                if ($event === 'click-view-selected') {

                    this.baseOperation.viewSelected = false;
                    this.baseOperation.viewAll = true;

                }

                else if ($event === 'click-view-all') {

                    this.baseOperation.viewSelected = true;
                    this.baseOperation.viewAll = false;

                }

            }

        },

        mounted() {

            if (this.i18n) Object.assign(this.$i18n._vm.messages[ this.$i18n._vm.locale ], this.i18n[ this.$i18n._vm.locale ]);

            this.initBaseOperation();

        },

        data() {

            return {
                baseOperation: {
                    viewSelected    : false,
                    viewAll         : false,
                    clearSelected   : false,
                    batchExport     : false,
                    batchImport     : false,
                    batchEdit       : false,
                    batchDelete     : false
                }
            };

        }

    }

</script>
