<template>
	<section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-select v-model="filters.year" placeholder="请选择" style=" width: 100%;">
                        <el-option
                                v-for="item in years"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.college" placeholder="请选择" style=" width: 100%;">
                        <el-option
                                v-for="item in colleges"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.major" placeholder="请选择" style=" width: 100%;">
                        <el-option
                                v-for="item in majors"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.grade" placeholder="请选择" style=" width: 100%;">
                        <el-option
                                v-for="item in grades"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDatas">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleImport">导入</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="sn" label="学号">
            </el-table-column>
            <el-table-column prop="majorTotal" label="专业人数">
            </el-table-column>
            <el-table-column prop="overallScore" label="综合得分">
            </el-table-column>
            <el-table-column prop="overallRank" label="综合排名">
            </el-table-column>
            <el-table-column prop="intellectualScore" label="智育得分">
            </el-table-column>
            <el-table-column prop="intellectualRank" label="智育排名">
            </el-table-column>
        </el-table>
        <!--工具条-->
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

        <el-dialog title="添加奖项" v-model="addFormVisible" :close-on-click-modal="false"
                   :show-close="false" :close-on-press-escape="false"
                   @close="cancelAdd" size="tiny">
            <el-form label-width="130px">
                <el-form-item label="上传综合评测文件">
                    <el-upload ref="uploadComp"
                               class="upload-demo"
                               accept=".xls,.xlsx"
                               :action="uploadURL"
                               :on-success="handleSuccess"
                               :on-remove="handleRemove">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xls,xlsx文件，且不超过10m</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import {
        getComprehensiveEvaluationList,
        uploadFileURL,
        uploadComprehensiveEvaluation,
        getYearSelections,
        getCollegeSelections,
        getMajorSelections,
        getGradeSelections
    } from '../../api/api';
    export default {
        name: 'ComprehensiveEvaluation',
        computed: {
            uploadURL: function () {
                let user = JSON.parse(sessionStorage.getItem('user'));
                return uploadFileURL + '?token=' + user.token
            }
        },
        data() {
            return {
                filters: {
                    year: '',
                    college: '',
                    major: '',
                    grade: ''
                },
                years: [],
                colleges: [],
                majors: [],
                grades: [],
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 1,
                listLoading: false,
                addLoading: false,
                addFormVisible: false,
                files: []
            }
        },
        methods: {
            cancelAdd: function () {
                this.files = []
            },
            handleImport: function () {
                this.addFormVisible = true
            },
            addSubmit: function () {
                let uploads = []
                for (let index in this.files) {
                    let file = this.files[index]
                    uploads.push({
                        originalName: file.name,
                        name: file.response.data
                    })
                }
                this.addLoading = true
                uploadComprehensiveEvaluation(uploads).then((res) => {
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    this.addFormVisible = false
                    this.addLoading = false
                    getYearSelections().then((res) => {
                        this.years = res;
                        if (this.years.length>0) {
                            this.filters.year = this.years[0].id
                            this.getDatas()
                        }
                    }).catch((error)=>{
                    });
                }).catch((error)=>{
                    this.addLoading = false
                });
            },
            handleRemove(file, fileList) {
                this.files = fileList;
            },
            handleSuccess: function (response, file, fileList) {
                if (response.status === true) {
                    this.files = fileList;
                } else {
                    this.$message({
                        message: response.message,
                        type: 'error'
                    });
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDatas()
            },
            handleSizeChange(val) {
                this.currentPageSize  = val
                this.getDatas()
            },
            getDatas: function () {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    year: this.filters.year,
                    college: this.filters.college,
                    major: this.filters.major,
                    grade: this.filters.grade
                };
                this.listLoading = true;
                getComprehensiveEvaluationList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            }
        },
        created() {
            this.$emit('viewIn', [{
                name: '综合测评',
                url: '/school/evaluation'
            }]);
        },
        mounted() {
            getYearSelections().then((res) => {
                this.years = res;
                if (this.years.length>0) {
                    this.filters.year = this.years[0].id
                    this.getDatas()
                }
            }).catch((error)=>{
            });
            getCollegeSelections().then((res) => {
                this.colleges = res;
                this.colleges.splice(0,0,{
                    "id" : 0,
                    "name" : "不限学院"
                })
                this.filters.college = 0
            }).catch((error)=>{
            });
            getMajorSelections().then((res) => {
                this.majors = res;
                this.majors.splice(0,0,{
                    "id" : 0,
                    "name" : "不限专业"
                })
                this.filters.major = 0
            }).catch((error)=>{
            });
            getGradeSelections().then((res) => {
                this.grades = res;
                this.grades.splice(0,0,{
                    "id" : 0,
                    "name" : "不限年级"
                })
                this.filters.grade = 0
            }).catch((error)=>{
            });
        }
    }
</script>