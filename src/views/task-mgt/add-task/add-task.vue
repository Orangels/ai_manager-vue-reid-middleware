<style lang="scss" scoped src="./add-task.scss"></style>
<i18n>
    {
        "zh-CN": {
            "title":"新建任务"
        }
    }
</i18n>
<template>
    <div v-if="visibleLater" class="right-dialog-wrapper" ref="right-dialog-wrapper">
        <transition name="right-dialog" appear>
            <dialog-right-component v-if="rightDialog.visible" :dialog="rightDialog">
                <!-- top -->
                <template v-if="visibleTop" slot="top">
                    <div style="width: 240px; height: 240px;">
                        <el-button size="large" class="@normal" @click="() => { visibleTop = false; }">关闭顶层</el-button>
                    </div>
                </template>

                <!-- left -->
                <template slot="left"></template>

                <!-- header -->
                <template slot="header">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>{{ $t('title') }}</el-breadcrumb-item>
                    </el-breadcrumb>

                    <el-button type="text" class="close" @click="cancelForm">
                        <i class="vic-icon @base-close"></i>
                    </el-button>
                </template>

                <!-- content -->
                <template slot="content">
                    <el-form :model="ruleForm" :rules="rules"
                        ref="ruleForm" label-width="65px" class="demo-ruleForm"
                    >
                        <el-form-item label="任务名称：" prop="mession_name">
                            <el-input v-model="ruleForm.mession_name " style="width:31%" placeholder="请输入任务名称"></el-input>
                        </el-form-item>
                        <el-form-item label="数据集：" prop="data_id">
                            <el-select v-model="ruleForm.data_id" placeholder="请选择数据集">
                                <el-option v-for="item in task.data_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <span  style="display:inline-block;margin-left:20px;">共计{{count}}张</span>
                        </el-form-item>
                        <el-form-item label="标注任务模板：" prop="mession_template_id">
                            <el-select v-model="ruleForm.mession_template_id	" placeholder="请选择任务模板">
                                <el-option v-for="item in task.mession_template_list" :key='item.id' :label='item.name' :value='item.id'></el-option>
                            </el-select>
                            <el-button class="@light-colour" size="medium" style="margin-left:20px;" @click='handlerNew'>新增</el-button>
                        </el-form-item>
                        <el-form-item label="分配给标注人员：" required>
                            <template>
                                <el-table :data="ruleForm.staff_list" border stripe>
                                    <el-table-column  label="标注人员">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'staff_list.' + scope.$index + '.' +'id'" 
                                                :rules="[{ required: true, message: '请输入', trigger: ['blur','change'] }]" 
                                            >
                                                <el-select v-model="scope.row.id" @change='labBoxChange'>
                                                    <el-option v-for="item in task.staff_list" :key="item.id" :label="item.user_name" :value="item.id" :disabled="item.disabled"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  label="任务总数量"  prop='total'>
                                    </el-table-column>
                                    <el-table-column  label="分配数量">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'staff_list.' + scope.$index + '.'+'count'" 
                                                :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
                                            >
                                                 <el-input v-model.number="scope.row.count" ></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button @click.native.prevent="deleteRow(scope.$index, ruleForm.staff_list)" type="text" size="small">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template> 
                            <el-button class="@light-colour" size="medium" style="margin-left:20px;" @click="addDate">增加人员</el-button>
                        </el-form-item>
                        <el-form-item label="任务截止时间：" prop='deadline' required >
                            <el-date-picker  v-model="ruleForm.deadline" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss"  default-time="12:00:00">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </template>

                <!-- footer -->
                <template slot="footer">
                    <el-button size="large" class="@normal" @click="cancelForm"> 取消 </el-button>
                    <el-button size="large" class="@normal" @click="submitForm"> 确定 </el-button>
                </template>
            </dialog-right-component>
        </transition>
    </div>
</template>

<script type="text/jsx">
import dialogRightComponent from "@components/dialog-right/dialog-right-component";
export default {
    components:{ dialogRightComponent },
    props: {
        dialogopt: {
            type: Object
        }
    },
    computed: { 
        total(){
            return this.ruleForm.staff_list.map(row=>row.count).reduce((acc,cur)=>(acc+cur),0)
        }
    },
    watch: {
        dialogopt: {
            handler(newVal, oldVal) {
                this.rightDialog = newVal;
            },
            immediate: true
        },
        'rightDialog.visible': {
            handler(newVal, oldVal) {
                if(newVal){
                    this.visibleLater = true;
                }else{
                    setTimeout(() => {
                        this.visibleLater = false;
                    }, 500);
                }
            },
            immediate: true
        },
        'ruleForm.data_id':{
            handler(newVal,oldVal){
                    this.data_list.forEach((item,index)=>{
                    if(item.id == newVal){
                        this.count = item.count;
                    }
                })
            },
            immediate: true
        },
        'count':{
            handler(newVal,oldVal){
                this.ruleForm.staff_list.forEach((item,index)=>{
                    item.total = newVal;
                })
            },
            immediate: true
        }
    },
    methods: {
        init(){
            this.$http.get(this.$api.taskNew, {}, true).then($res=>{
                this.$set(this.$data, 'task', $res.data.data);
                this.$set(this.$data, 'data_list', $res.data.data.data_list);
            })
        },
        //避免重复选择标注人员
        labBoxChange(){
            let labBox=[];
            for(let i=0;i<this.ruleForm.staff_list.length;i++){
                if(labBox.indexOf(this.ruleForm.staff_list[i].id)==-1){
                    labBox.push(this.ruleForm.staff_list[i].id);
                }
            }
            for(let i=0;i<this.task.staff_list.length;i++){
                if(labBox.indexOf(this.task.staff_list[i].id)==-1){
                    this.task.staff_list[i].disabled = false;
                    
                }else{
                    this.task.staff_list[i].disabled = true;
                }
            }
        },
        addDate() {
            this.ruleForm.staff_list.push({
                id: "",
                total: this.count, //任务总量
                count:'',  //分配数量
            })
        },
        handlerNew(){
            this.$router.push({path:"/task-template"})
        },
        deleteRow(index, rows) {
            if(this.ruleForm.staff_list.length==1) {this.$message.warning('分配给标注人员为必选项');return false;}
            rows.splice(index, 1);
        },
        cancelForm(){
            this.$refs.ruleForm.resetFields();
            this.ruleForm.staff_list=[{
                    total:0
            }],
            this.count=0;
            this.$emit('cancel');
        },
        submitForm() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.ruleForm));
                    if(this.total !== this.count) {
                        this.$message.warning('分配数量之和需要等于任务总数量');
                        return false;
                    }
                    this.$http.post(this.$api.taskNew, params, true).then($res=>{
                        if ($res.data.code == 0) {
                            this.$notify({
                                title:"成功",
                                message:'创建任务成功',
                                duration:2000
                            })
                        } 
                        this.visibleLater = false; 
                        this.$refs.ruleForm.resetFields();
                        this.ruleForm.staff_list=[{total:0}]
                        this.$emit('ok');   
                    })
                }
            });
        }
    },

    mounted() {
        this.init();
    },

    data() {
        return {
            dateA:[],
            count: 0,
            data_list:[],
            rightDialog: {},
            visibleTop: false,
            visibleLater: false,
            ruleForm: {
                mession_name: "",
                data_id: "",
                deadline: '',
                staff_list:[{
                    total:0
                }],
            },
            task:{},
            rules: {
                mession_name: [
                    {
                       required:true, 
                        message: "请输入任务名称",
                        trigger: "blur"
                    }
                ],
                mession_template_id: [
                    {
                        required: true,
                        message: "请选择数据集",
                        trigger: "change"
                    }
                ],
                data_id: [
                    {
                        required: true,
                        message: "请选择数据集",
                        trigger: "change"
                    }
                ],
                deadline: [
                    {
                        required: true,
                        message: "请选择截止日期",
                        trigger: "change"
                    }
                ]
            }
        };
    }
};
</script>
