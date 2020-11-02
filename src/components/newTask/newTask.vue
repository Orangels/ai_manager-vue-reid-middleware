<style lang="scss" src="./newTask.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="page-component">
        <div class="wrapper-container">
            <div class="content-container @max">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="65px"  class="demo-ruleForm">
                    <el-form-item label="任务名称：" prop="name" >
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据集：" prop="region">
                      <el-select v-model="ruleForm.region" placeholder="请选择数据集">
                         <el-option label="人脸数据标注数据—太极" value="shanghai"></el-option>
                         <el-option label="人脸数据标注数据—迈外迪" value="beijing"></el-option>
                      </el-select>
                      <span style='display:inline-block;margin-left:20px;'>共计：1000张</span>
                    </el-form-item>
                    <el-form-item label="标注任务模板：" prop="region">
                      <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                         <el-option label="区域一" value="shanghai"></el-option>
                         <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                      <el-button class="@light-colour" size="medium" style='margin-left:20px;'>新增</el-button>
                    </el-form-item>
                     <el-form-item label="分配给标注人员：">
                         <template>
                            <el-table :data="tableData" border stripe>
                              <el-table-column  prop="date" label="标注人员">
                                  <el-select v-model="tableData.data">
                                     <el-option
                                        v-for="item in personnel"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                      </el-option>
                                  </el-select>
                              </el-table-column>
                              <el-table-column prop="total"  label="任务总数量">
                                  <template slot-scope="scope">
                                      <el-input v-model="scope.row.total"></el-input>
                                  </template>
                              </el-table-column>
                              <el-table-column  prop="allocation" label="分配数量">
                                 <template slot-scope="scope">
                                      <el-input v-model='scope.row.allocation'></el-input>
                                 </template>
                              </el-table-column>
                              <el-table-column  label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                            </el-table>
                          </template>
                          <el-button class="@light-colour" size="medium" style='margin-left:20px;' @click="add">增加人员</el-button>
                    </el-form-item>
                    <el-form-item label="任务截止时间：" required>
                        <el-col :span="5">
                        <el-form-item prop="date1">
                            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 50%;"></el-date-picker>
                        </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                        <el-form-item prop="date2">
                            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 50%;"></el-time-picker>
                        </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">取消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    </el-form-item>
                    </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/jsx">
// import Service from "./service";

export default {
    components: {
    },

    computed: {},

    watch: {},

    methods: {
      add(){
        this.tableData.push({
            date: '',
            total: 0,
            allocation: 0
          })
      },
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },

    mounted() {},

    data() {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        personnel:[
          {
            id:0,
            name:"小李"
          },
          {
            id:1,
            name:'小张'
          }
        ],
        tableData: [{
            date: '',
            total: 100,
            allocation: 20
          }, {
            date: '',
            total: 100,
            allocation: 80
          }, {
           date: '',
            total: 100,
            allocation: 0
          }],
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      };
    },
};
</script>
