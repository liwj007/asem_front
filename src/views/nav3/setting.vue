<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column prop="typeName" label="类型">
            </el-table-column>
            <el-table-column prop="date" label="创建日期">
                <template scope="scope">
                    {{formatDate(scope.row.date)}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button @click="handleDetail(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="currentPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float:right;">
            </el-pagination>
        </el-col>


        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" size="tiny">
            <div style="min-height: 260px;">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="13">
                        <el-steps :space="100" :active="active" finish-status="success">
                            <el-step title="奖学金类型"></el-step>
                            <el-step title="年级审核"></el-step>
                            <el-step title="学院审核"></el-step>
                            <el-step title="学校审核" v-if="newForm.type === 'SCHOOL'"></el-step>
                        </el-steps>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="18">
                        <div v-if="active === 0">
                            <el-form ref="form1" :model="newForm" label-width="140px" :rules="addFormRules">
                                <el-form-item label="选择类型：" prop="type">
                                    <el-radio-group v-model="newForm.type">
                                        <el-radio label="SCHOOL">校级及以上</el-radio>
                                        <el-radio label="COLLEGE">学院</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="模板名称：" prop="name">
                                    <el-input v-model="newForm.name" :maxlength="20" placeholder="20字以内"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div v-else-if="active === 1">
                            <el-form ref="form2" :model="newForm" label-width="140px">
                                <el-form-item label="需要年级审核环节：" prop="needGradeCheck">
                                    <el-radio-group v-model="newForm.needGradeCheck" @change="changeGradePoint">
                                        <el-radio :label="true">是</el-radio>
                                        <el-radio :label="false">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="该环节审核人员：">
                                    <el-checkbox v-model="newForm.gradeInstructor" disabled>年级辅导员</el-checkbox>
                                    <br/>
                                    <el-checkbox v-model="newForm.gradeStudent" :disabled="!newForm.needGradeCheck">
                                        学生工作助理（管年级）
                                    </el-checkbox>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div v-else-if="active === 2">
                            <el-form ref="form3" :model="newForm" label-width="140px">
                                <el-form-item label="该环节审核人员：" prop="specialInstructor">
                                    <el-checkbox v-model="newForm.specialInstructor" disabled>专项辅导员</el-checkbox>
                                    <br/>
                                    <el-checkbox v-model="newForm.collegeStudent">学生工作助理（管学院）</el-checkbox>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div v-else-if="active === 3 && newForm.type === 'SCHOOL'">
                            <el-form ref="form" :model="newForm" label-width="140px">
                                <el-form-item label="该环节审核人员：" prop="schoolUser">
                                    <el-checkbox v-model="newForm.schoolUser" disabled>学校用户</el-checkbox>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button style="margin-top: 12px;" @click="before" :disabled="active <= 0">上一步</el-button>
                <el-button style="margin-top: 12px;" @click="next" :disabled=" (newForm.type === 'SCHOOL'&& active >= 3) || (newForm.type === 'COLLEGE' && active >= 2)">下一步</el-button>
                <el-button @click.native="cancelSubmit">取消</el-button>
                <el-button type="primary" @click="addSubmit" :disabled="(newForm.type === 'SCHOOL'&& active !== 3) || (newForm.type === 'COLLEGE' && active !== 2)">提交</el-button>
            </div>
        </el-dialog>

        <!--详情界面-->
        <el-dialog title="模板详情" v-model="detailVisible" :close-on-click-modal="false" size="tiny">
            <div style="min-height: 260px;">
                <el-form ref="form" :model="detailForm" label-width="170px">
                    <el-form-item label="奖学金类型：">
                        <span>{{detailForm.typeName}}</span>
                    </el-form-item>
                    <el-form-item label="模板名称：">
                        <span>{{detailForm.name}}</span>
                    </el-form-item>
                    <el-form-item label="需要年级审核环节：">
                       <span>{{detailForm.needGradeCheck === true?'是':'否'}}</span>
                    </el-form-item>
                    <el-form-item label="年级审核环节审核人员：" v-if="detailForm.needGradeCheck === true">
                        <span v-if="detailForm.gradeInstructor" style="margin-right: 30px;">
                            年级辅导员
                        </span>
                        <span v-if="detailForm.gradeStudent">
                            学生工作助理（管年级）
                        </span>
                    </el-form-item>

                    <el-form-item label="学院审核环节审核人员：">
                        <span v-if="detailForm.specialInstructor" style="margin-right: 30px;">
                            专项辅导员
                        </span>
                        <span v-if="detailForm.collegeStudent">
                            学生工作助理（管学院）
                        </span>
                    </el-form-item>

                    <el-form-item label="学校审核环节审核人员：" v-if="detailForm.typeName === 'SCHOOL'">
                        <span v-if="detailForm.schoolUser" >
                            学校用户
                        </span>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import {createFlowTemplate, getFlowTemplateListPage, deleteFlowTemplate} from '../../api/api';
    import moment from 'moment'

    export default {
        data() {
            return {
                addFormRules: {
                    name: [
                        {required: true, message: '请输入模板名称', trigger: 'blur'}
                    ]
                },
                detailForm: {

                },
                detailVisible: false,
                currentPage: 1,
                currentPageSize: 10,
                total: 0,
                gradeStudentCheck: true,
                newForm: {
                    name: '',
                    type: 'SCHOOL',
                    needGradeCheck: true,
                    gradeInstructor: true,
                    gradeStudent: false,
                    specialInstructor: true,
                    collegeStudent: false,
                    schoolUser: true
                },
                active: 0,
                tableData: [],
                addFormVisible: false
            }
        },
        methods: {
            changeGradePoint: function (val) {
                if (val === false) {
                    this.newForm.gradeInstructor = false
                    this.newForm.gradeStudent = false
                } else if (val === true) {
                    this.newForm.gradeInstructor = true
                }
            },
            formatDate: function (date) {
                return moment(date).format('YYYY-MM-DD')
            },
            handleAdd: function () {
                this.addFormVisible = true
            },
            handleDelete: function (item) {
                this.$confirm('此操作将删除该流程模板, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let para = {
                        id: item.id
                    }
                    deleteFlowTemplate(para).then(res => {

                        let user = res
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDatas()
                        this.cancelSubmit()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            next: function () {
                if (this.active <= 2) {
                    if (this.active === 0){
                        this.$refs['form1'].validate((valid) => {
                            if (valid) {
                                this.active++
                            } else {
                                return false
                            }
                        })
                    }else {
                        this.active++
                    }
                };
            },
            before: function () {
                if (this.active > 0) this.active--;
            },
            handleDetail: function (item) {
              this.detailVisible = true
              this.detailForm = item
            },
            handleSizeChange(val) {
                this.currentPageSize = val;
                this.getDatas()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getDatas()
            },
            getDatas: function () {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                }
                getFlowTemplateListPage(para).then(res => {
                    let data = res
                    this.tableData = data.list
                    this.total = data.total
                })
            },
            cancelSubmit: function () {
                this.addFormVisible = false
                this.newForm = {
                    id: '',
                    name: '',
                    type: 'SCHOOL',
                    needGradeCheck: true,
                    gradeInstructor: true,
                    gradeStudent: false,
                    specialInstructor: true,
                    collegeStudent: false,
                    schoolUser: true
                }
                this.active = 0
            },
            addSubmit: function () {
                let para = this.newForm
                createFlowTemplate(para).then(res => {
                    let user = res
                    this.$message({
                        message: '添加模板成功',
                        type: 'success'
                    })
                    this.getDatas()
                    this.cancelSubmit()
                })
            }
        },
        mounted() {
            this.getDatas()
        },
        created() {
            this.$emit('viewIn', [{
                name: '初始设置',
                url: '/school/setting'
            }]);
        },
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .row-bg {
        padding: 10px 0;
    }
</style>
