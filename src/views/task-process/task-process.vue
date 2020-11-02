<style lang="scss" src="./task-process.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="page-component">
        <header-component>标注任务详情</header-component>
        <div class="wrapper-container">
            <div class="content-container @max" style="padding: 24px 24px 20px 24px;">
                <el-form :model="elTable" ref="taggingInfoForm" style="padding-left:0;" disabled>
                    <el-row :gutter="30">
                        <el-col :span="6">
                            <el-form-item label="任务名称：" prop="name">
                                <div>{{elTable.mession_name}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="任务数据集：" prop="data">
                                <div>{{elTable.data_name}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="任务标注模板：" prop="formwork">
                                <div>{{elTable.mession_template_name}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="任务截止时间:" prop="time">
                                <div>{{elTable.deadline}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 表格 -->
                <div style="margin-top:20px;">
                    <el-table :data="elTable.personal_mession_list" border stripe>
                        <el-table-column prop="staff_name" label="标注者"></el-table-column>

                        <el-table-column prop="collection_num" label="收藏数量"></el-table-column>

                        <el-table-column prop="complete_num" label="已完成数量"></el-table-column>

                        <el-table-column  label="未完成数量">
                            <template slot-scope="scope">
                                {{getNum(scope.row.count,scope.row.complete_num)}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/jsx">
import Service from "./service";

export default {
    components: {},

    computed: {},

    watch: {},
    created (){
       let parmas={
           mession_id:this.$route.query.id
       }
       this.$http.get(this.$api.taskprogress, parmas, true).then($res => {
           if($res.data.code == 0){
                let res = $res.data;
                this.elTable = res.data;
            }else{
                this.$message({ type: "warning", message: "列表查询失败!" });
            }
      });
    },
    methods: {
        getNum(count,partNum){
            return count-partNum;
        }
    },

    mounted() {},

    data() {
        return {
            tagging: {
                name: "画框任务",
                data: "人脸数据标注数据",
                formwork: "画人脸",
                time: "2019-09-20 :18:00:00"
            },
            elTable: []
        };
    }
};
</script>
