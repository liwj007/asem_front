<template>
	<section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-select v-model="filters.year" placeholder="请选择学年" style=" width: 100%;">
                        <el-option
                                v-for="item in years"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.collegeId" placeholder="请选择学院" style=" width: 100%;"  @change="loadMajors">
                        <el-option
                                v-for="item in colleges"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.majorId" placeholder="请选择专业" style=" width: 100%;" @change="loadGrades">
                        <el-option
                                v-for="item in majors"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.gradeId" placeholder="请选择年级" style=" width: 100%;">
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
                    <!--<el-button type="primary" @click="handleImport" :disabled="true">导入</el-button>-->
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="70" label="序号">
                <template slot-scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
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

        <el-dialog title="上传综合评测文件" :visible.sync="addFormVisible" :close-on-click-modal="false"
                   :show-close="false" :close-on-press-escape="false"
                   @close="cancelAdd">
            <el-form label-width="130px">
                <el-form-item label="上传文件">
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
        getColleges,
        getMajorsByCollege,
        getGradesByMajor
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
                    collegeId: '0',
                    majorId: '0',
                    gradeId: '0'
                },
                years: [{
                    "id" : '0',
                    "name" : "不限学年"
                }],
                colleges: [{
                    "id" : '0',
                    "name" : "不限学院"
                }],
                majors: [{
                    "id" : '0',
                    "name" : "不限专业"
                }],
                grades: [{
                    "id" : '0',
                    "name" : "不限年级"
                }],
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
                this.$refs.uploadComp.clearFiles()
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
                this.files = []
                this.$refs.uploadComp.clearFiles()
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
                    college: this.filters.collegeId,
                    major: this.filters.majorId,
                    grade: this.filters.gradeId
                };
                this.listLoading = true;
                getComprehensiveEvaluationList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            },
            loadColleges: function () {
                getColleges().then((res) => {
                    this.colleges = res;
                    this.colleges.splice(0,0,{
                        "id" : '0',
                        "name" : "不限学院"
                    })
                    this.filters.collegeId = '0'
                }).catch((error)=>{
                });
            },
            loadMajors: function () {
                let para = {
                    id: this.filters.collegeId
                }
                getMajorsByCollege(para).then((res) => {
                    this.majors = res;
                    this.majors.splice(0,0,{
                        "id" : '0',
                        "name" : "不限专业"
                    })
                    this.filters.majorId = '0'
                }).catch((error)=>{
                });
            },
            loadGrades: function () {
                let para = {
                    id: this.filters.majorId
                }
                getGradesByMajor(para).then((res) => {
                    this.grades = res;
                    this.grades.splice(0,0,{
                        "id" : '0',
                        "name" : "不限年级"
                    })
                    this.filters.gradeId = '0'
                }).catch((error)=>{
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
            this.$emit('activeTab', '1');
            getYearSelections().then((res) => {
                this.years = res;
                if (this.years.length>0) {
                    this.filters.year = this.years[0].id
                    this.getDatas()
                } else {
                    this.years.splice(0,0,{
                        "id" : 0,
                        "name" : "不限学年"
                    })
                    this.filters.year = 0
                }
            }).catch((error)=>{
            });
            this.loadColleges()

        }
    }
</script>