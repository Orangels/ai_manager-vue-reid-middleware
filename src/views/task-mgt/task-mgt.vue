<style lang="scss" src="./task-mgt.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="page-component">
        <header-component>任务管理</header-component>
        <div class="wrapper-container">
            <div class="content-container @max" style="padding: 24px 24px 20px 24px;">
                <header-filter-component style="clear:both">
                    <el-input v-model='mark_state' placeholder="请输入查询内容" ></el-input>
                    <el-button class="@light-colour" size="medium"  @click='handlerQuery'>查询</el-button>
                    <el-button class="@light-colour float_r" size="medium"  @click="handlerNew" >新建任务</el-button>
                </header-filter-component>
                <!-- 表格 -->
                <div style="margin-top:20px;">
                    <el-table :data="elTable" border stripe>
                        <el-table-column prop="name" label="任务名称"></el-table-column>

                        <el-table-column prop="data_name" label="数据集"></el-table-column>

                        <el-table-column prop="mession_template_name" label="任务模板"></el-table-column>
                        <el-table-column prop="staff_count" label="执行人数"></el-table-column>
                        <el-table-column prop="status" label="任务状态">
                             <template slot-scope='scope'>
                                {{ scope.row.status === "marking" ? '待标注' : '已验收' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="deadline" label="任务截止时间"></el-table-column>
                        <el-table-column  label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click='handlerDetail(scope.row)'>详情</el-button>
                            </template>
                        </el-table-column>
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
        <add-task :dialogopt="rightDialog" ref='childRef'
            @ok="handlerRightDialog($event)"
            @cancel="rightDialog.visible = false;"
        ></add-task>
    </div>
</template>

<script type="text/jsx">
import Service from "./service";
import addTask from "./add-task/add-task";

export default {
    components: {
        addTask
    },

    computed: {},

    watch: {},

    methods: {
        handlerNew() {
            // this.rightDialog.closeOnPressEscape = true;// 默认是false
            this.rightDialog.closeOnClickModal = true;
            this.rightDialog.width = "max";
            this.rightDialog.visible = true;
            this.$refs.childRef.init();
        },
        handlerDetail(row){
            this.$router.push({ path: '/task-process', query: {id: row.id } });
        },
        handlerRightDialog(date) {
            this.rightDialog.visible = false;
            this.initData();
        },
        handlerQuery(){
            this.elPagination.page = 1;
            this.initData();
        },
        initData() {
            let param = {
                search:this.mark_state,
                page_num: this.elPagination.page,
                num: this.elPagination.pageSize
            };
            this.$http.get(this.$api.taskMgt, param, true).then($res => {
                if($res.data.code == 0){
                    let res = $res.data;
                    this.elTable = res.data.mession_list;
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
            isShow: false,
            mark_state:'',
            elTable: [],
            elPagination: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            rightDialog: {
                visible: false,
                value: {}
            }
        };
    }
};
</script>
