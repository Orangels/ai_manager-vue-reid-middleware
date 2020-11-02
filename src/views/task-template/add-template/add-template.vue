<style lang="scss" scoped src="./add-template.scss"></style>
<i18n>
    {
        "zh-CN": {
            "title":"新建模板"
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

                    <el-button type="text" class="close"  @click="handlerCancel">
                        <i class="vic-icon @base-close"></i>
                    </el-button>
                </template>

                <!-- content -->
                <template slot="content">
                    <el-form :model="ruleForm" :rules="rules"
                        ref="ruleForm" label-width="65px" class="demo-ruleForm"
                    >
                        <el-form-item label="模板名称：" prop="name">
                            <el-input v-model="ruleForm.name" style="width:31%"></el-input>
                        </el-form-item>
                        <el-form-item label="图片元素标签" :required="!isCheck">
                            <template>
                                <el-table :data="ruleForm.element_tag_list"  border stripe>
                                    <el-table-column  label="标注对象">
                                        <template slot-scope="scope">
                                            <el-form-item >
                                                <el-input type='color' v-model='scope.row.color'></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  label="中文">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'element_tag_list.' + scope.$index + '.'+'name'" :rules="[{required:!isCheck,message:'请输入',trigger:'blur'}]">
                                                 <el-input v-model="scope.row.name"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column> 
                                    <el-table-column  label="英文">
                                        <template slot-scope="scope">
                                            <el-form-item :prop="'element_tag_list.' + scope.$index + '.'+'key'" :rules="[{required:!isCheck,message:'请输入',trigger:'blur'}]">
                                                  <el-input v-model="scope.row.key"></el-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column> 
                                    <el-table-column  label="标注工具">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.tool">
                                                <el-option v-for="item in markTool" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button @click.native.prevent="deleteRow(scope.$index, ruleForm.element_tag_list)" type="text" size="small">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <el-button class="@light-colour" size="medium" style="margin-left:20px;" @click="add">添加标签</el-button>
                        </el-form-item>
                        <el-form-item class='pic_tag' label='图片标签设置' :required="isCheck">
                            <div v-for="(item,index) in ruleForm.pic_tag_list" :key="index" class='pic_tag_list'>
                                <el-row :gutter="10">
                                    <el-col :span='10'>
                                    <el-form-item :label="'标签'+(index+1)" :prop="'pic_tag_list.'+index+'.name'"  
                                        :rules="[{ required:isCheck,message: '请输入中文', trigger: 'blur' }]"
                                    >
                                        <el-input class='pic_CN' placeholder="中文" v-model="item.name"></el-input>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span='6'>
                                        <el-form-item :prop="'pic_tag_list.'+index+'.key'" :rules="[{required:isCheck,message:'请输入英文',trigger:'blur'}]">
                                            <el-input class='pic_CN' placeholder="英文" v-model="item.key"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span='4'>
                                        <el-form-item>
                                            <el-select v-model='item.operation' class='pic_CN'>
                                                <el-option
                                                    v-for="(item,index) in listOptions"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                        </el-select> 
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row> 
                                    <el-form-item class='labelspacing' v-for="(domain, index1) in item.option_list" 
                                        :label="'选项' + index1" :key="domain.index1"
                                    >
                                    <el-col :span='12'>
                                        <el-form-item :prop="'pic_tag_list.'+index+'.option_list.'+index1+'.name'"  :rules="[{required:isCheck,message:'请输入',trigger:['blur','change']}]">
                                        <el-input placeholder="请输入中文" v-model="domain.name" class='pic_EN'></el-input>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span='12'>
                                        <el-form-item :prop="'pic_tag_list.'+index+'.option_list.'+index1+'.key'" :rules="[{required:isCheck,message:'请输入',trigger:['blur','change']}]">
                                        <el-input placeholder="请输入英文" v-model="domain.key" class='pic_EN' style="margin-left:5px;"></el-input>
                                    </el-form-item>
                                    </el-col>
                                </el-form-item>
                                </el-row>
                                <el-form-item>
                                    <el-button class="@light-colour" size="medium" @click="addDomain(index)" style='margin:10px 0 30px 35px;'>添加选项</el-button>
                                    <el-button class='@light-colour' size="medium" @click.native.prevent="deleteRow(index, ruleForm.pic_tag_list)" v-if='ruleForm.pic_tag_list.length>1'>删除</el-button> 
                                </el-form-item>
                            </div>
                        </el-form-item>
                        <div class='line'></div>
                        <el-button class='@light-colour gap' size="medium" @click="addDomain1">添加标签</el-button>
                    </el-form>
                </template>

                <!-- footer -->
                <template slot="footer">
                    <el-button size="large" class="@normal" @click="handlerCancel"> 取消 </el-button>
                    <el-button size="large" class="@normal" @click='submitForm'> 确定 </el-button>
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
        'ruleForm.pic_tag_list':{
            deep:true,
            handler(newVal,oldVal){
                newVal.filter((item,index)=>{
                    if(item.key !='' && item.name!=''){
                        item.option_list.filter((val,i)=>{
                            if(val.key !=''&&val.name !=''){
                                this.isCheck = true;
                            }else{
                                this.isCheck=false;
                            }
                        })
                    }
                })
            },
            immediate:true
        }
    },

    methods: {
        add() {
            this.ruleForm.element_tag_list.push({
                "key":"",
                "name": "",
                "tool": "bndbox",
                "color": "#400000"
            });
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        addDomain(index) {
            this.ruleForm.pic_tag_list[index].option_list.push({
                'key':'',
                'name':''
            });
        },
        addDomain1() {
            this.ruleForm.pic_tag_list.push({
                'operation':'single',
                'key':'',
                'name':"",
                'option_list':[
                    {
                        'key':'',
                        'name':''
                    }
                ]
            });
        },
        submitForm() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.ruleForm.pic_tag_list = this.ruleForm.pic_tag_list.filter((item, index)=>{
                        if(item.key != '' && item.name != ''){
                            item.option_list = item.option_list.filter((val, i)=>{
                                if(val.key != '' && val.name != ''){
                                    return val;
                                }else{
                                    item='';
                                }
                            })
                            return item;
                        }
                    })
                   
                    let params = JSON.parse(JSON.stringify(this.ruleForm));
                    this.$http.post(this.$api.newTemplate, params, true).then($res=>{
                        if ($res.data.code == 0) {
                            this.$notify({
                                title: '成功',
                                message: '创建成功',
                                duration: 2000
                                });
                        }
                        this.visibleLater = false;
                        this.$refs.ruleForm.resetFields();
                        this.$emit('ok'); 
                        this.ruleForm['pic_tag_list']= [{'operation':'single',
                            'option_list':[{ 'key':'','name':''}]
                        }]
                    }) 
                } 
            });
        },
        handlerCancel(){
           this.$refs.ruleForm.resetFields();
            this.$emit('cancel');
        }
    },

    mounted() {
    },

    data() {
        return {
            rightDialog: {}, 
            visibleTop: false, 
            visibleLater: false, 
            isCheck:false,
            listOptions: [{
                    label: "单选项",
                    value: 'single'
                },
                {
                    label: "多选项",
                    value:'multi'
            }],
            ruleForm: {
                'name': "",
                'element_tag_list': [{
                    "key":"",
					"name": "",
					"tool": "bndbox",
					"color": "#ff461f"
                }],
                'pic_tag_list': [{
                    'operation':'single',
                    'key':'',
                    'name':"",
                    'option_list':[
                        {
                            'key':'',
                            'name':''
                        }
                    ]
                }]
            },
            markTool: [
                {
                    id: 'bndbox',
                    name: "矩形"
                },
                // {
                //     id: 'labelpoints',
                //     name: "极点"
                // }
            ],
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入模板名称",
                        trigger: "blur"
                    }
                ]
            }
        };
    }
};
</script>
