<style lang="scss" src="./task-template.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="page-component">
        <header-component>标注任务模板管理</header-component>
        <div class="wrapper-container">
            <div class="content-container @max" style="padding: 24px 24px 20px 24px;">
                <div style="text-align:right;">
                    <el-button class="@light-colour" size="medium" @click="handlerNew">新建模板</el-button>
                </div>
                <!-- 表格 -->
                <div style="margin-top:20px;">
                    <el-table :data="elTable" border stripe>
                        <el-table-column prop="name" label="模板名称"></el-table-column>

                        <el-table-column prop="pic_tag_count" label="图片标签"></el-table-column>

                        <el-table-column prop="element_tag_count" label="元素标签"></el-table-column>
                        <el-table-column prop="data_count" label="关联数据集"></el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <div style="text-align: center;">
                    <el-pagination
                        :layout="$v.paging.layout"
                        :page-sizes="$v.paging.pageSizes"
                        :pagerCount="$v.paging.pagerCount"
                        :current-page="elPagination.page"
                        :page-size="elPagination.pageSize"
                        :total="elPagination.total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <!-- 右侧对话框 -->
        <add-template :dialogopt="rightDialog"
            @ok="handlerRightDialog($event)"
            @cancel="rightDialog.visible = false;"
        ></add-template>
    </div>
</template>

<script type="text/jsx">
import Service from "./service";
import addTemplate from "./add-template/add-template";

export default {
    components: {
        addTemplate
    },

    computed: {},

    watch: {},

    methods: {
        handlerNew() {
            this.rightDialog.closeOnPressEscape = false;
            this.rightDialog.closeOnClickModal = true;
            this.rightDialog.width = "large";
            this.rightDialog.visible = true;
        },
        handlerRightDialog(date) {
            this.rightDialog.visible = false
            this.initData();
        },
        initData() {
            let param = {
                page_num: this.elPagination.page,
                num: this.elPagination.pageSize
            };
            this.$http.get(this.$api.taskTemplate, param, true).then($res => {
                if($res.data.code == 0){
                    let res = $res.data;
                    this.elTable = res.data.mession_template_list;
                    this.elPagination.total = res.data.count;
                }else{
                    this.$message({ type: "warning", message: "列表查询失败!" });
                }
            });
        },
        handleCurrentChange (val) {
            this.elPagination.page = val;
            this.initData();
        },
        handleSizeChange (val) {
            this.elPagination.pageSize  = val;
            this.elPagination.page = 1;
            this.initData();
        }
    },
    mounted() {
       this.initData();
    },

    data() {
        return {
            lists: [
                {
                    value: 1,
                    option: [
                        {
                            label: "进行中",
                            value: 1
                        },
                        {
                            label: "待验收",
                            value: 2
                        },
                        {
                            label: "已验收",
                            value: 3
                        }
                    ]
                }
            ],
            elTable: [],
            elPagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            rightDialog: {
                visible: false,
                closeOnPressEscape: null,
                closeOnClickModal: null,
                width: "large",
                value: {}
            }
        };
    }
};
</script>
