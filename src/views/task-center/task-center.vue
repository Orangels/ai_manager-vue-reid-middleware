<style lang="scss" src="./task-center.scss" scoped></style>
<template>
    <div class="page-component">
        <header-component>标注任务中心</header-component>
        <div class="wrapper-container">
            <div class="content-container @max" style="padding: 24px 24px 20px 24px;">
                <header-filter-component style="clear:both">
                    <el-select v-model='mark_state' placeholder="请选择审核状态">
                        <el-option
                            v-for="(item,index) in lists"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button class="@light-colour" size="medium"  @click='handlerQuery'>查询</el-button>
                </header-filter-component>

                <!-- 表格 -->
                    <el-table :data="elTable" border stripe>
                        <el-table-column prop="mession_name" label="任务名称"></el-table-column>

                        <el-table-column prop="deadline" label="任务截止时间"></el-table-column>

                        <el-table-column label="任务进度">
                            <template slot-scope="scope">
                                {{scope.row.complete_num+'/'+ scope.row.count}}
                            </template>
                        </el-table-column>
                        <el-table-column label="任务收藏数量">
                            <template slot-scope="scope">
                                <el-button 
                                    @click="handleClick(scope.row, 'collection')" 
                                    type="text" size="small" :disabled="scope.row.collection_num <= 0"
                                >{{scope.row.collection_num}}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="personal_mession_status" label="审核状态">
                            <template slot-scope='scope'>
                                {{ scope.row.personal_mession_status === "marking" ? '待标注' : '已验收' }}
                            </template>
                        </el-table-column>
                        <el-table-column  label="操作">
                            <template slot-scope="scope">
                                <el-button v-if='scope.row.personal_mession_status === "marking"' 
                                    @click="handleClick(scope.row, 'operation')" type="text" size="small"
                                >开始标注</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

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
    </div>
</template>

<script type="text/jsx">
import Service from "./service";
export default {
    components: {
    },

    computed: {},

    watch: {},

    methods: {
        aisleChange(e) {},
        handleClick(row, flag) {
            // if (flag === 'collection') {
            //     this.$router.push({
            //         path: '/mark-mgt',
            //         query: {
            //             id:            row.id,
            //             data_id:       row.data_id,
            //             mession_id:    row.mession_id,
            //             is_collection: "true"
            //         }
            //     });
            // } else {
            //     this.$router.push({
            //         path: '/mark-mgt',
            //         query: {
            //             id:            row.id,
            //             data_id:       row.data_id,
            //             mession_id:    row.mession_id,
            //             is_collection: "false"
            //         }
            //     });
            // }

            let is_collection = flag === 'collection' ? "true" : "false"
            let USER_MARK = localStorage.getItem('USER_MARK');
            let mark_router_data = {
                id:            row.id,
                data_id:       row.data_id,
                mession_id:    row.mession_id,
                is_collection: is_collection,
                user_name: USER_MARK
            }

            window.location.href=`http://localhost:3000/test?id=${row.id}&data_id=${row.data_id}&mession_id=${row.mession_id}&is_collection=${is_collection}&user_name=${USER_MARK}`

        },
        handlerQuery(){
            this.elPagination.page = 1;
            this.initData();
        },
        initData() {
            let param = {
                status:this.mark_state,
                page_num: this.elPagination.page,
                num: this.elPagination.pageSize
            };
            this.$http.get(this.$api.taskList, param, true).then($res => {
                if($res.data.code == 0){
                    let res = $res.data;
                    this.elTable = res.data.personal_mession_list;
                    this.elPagination.total = res.data.count;
                }else{
                    this.$message({ type: "warning", message: "列表查询失败!" });
                }
            });
        },
        handleSizeChange(val){
            this.elPagination.pageSize = val;
            this.elPagination.page=1;
            this.initData();
        },
        handleCurrentChange(val){
            this.elPagination.page=val;
            this.initData();
        }
    },

    mounted() {
        this.initData();
    },

    data() {
        return {
            mark_state:'',
            lists: [{
                    label: "待标注",
                    value: 'marking'
                },
                {
                    label: "已验收",
                    value: 'accept'
            }],
            elTable: [],
            elPagination: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    }
};
</script>
