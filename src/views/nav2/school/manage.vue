<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">添加奖项</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!--列表-->
        <el-table :data="dataList" v-loading="listLoading" style="width: 100%;" @selection-change="selsChange">
            <el-table-column type="selection" width="50" :selectable="canSelect">
            </el-table-column>
            <el-table-column type="index" width="70" label="序号">
                <template slot-scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称" sortable>
            </el-table-column>
            <el-table-column prop="prizeName" label="等级">
                <template slot-scope="scope">
                    <span v-if="scope.row.prizeName!==''">{{scope.row.prizeName}}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column prop="scholarshipTypeName" label="类型" sortable>
            </el-table-column>
            <el-table-column prop="number" label="人数" sortable>
            </el-table-column>
            <el-table-column prop="money" label="金额" sortable>
            </el-table-column>
            <el-table-column prop="allocationStatus" label="名额分配" sortable>
                <template slot-scope="scope">
                    <span v-if="scope.row.allocationStatus===true">已分配</span>
                    <span v-else>未分配</span>
                </template>
            </el-table-column>
            <el-table-column prop="timeStatus" label="评定时间" sortable>
                <template slot-scope="scope">
                    <span v-if="scope.row.timeStatus===true">已安排</span>
                    <span v-else>未安排</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" sortable>
            </el-table-column>
            <el-table-column label="操作" width="350">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.status !== '新建'">编辑</el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)" :disabled="scope.row.status !== '新建'">删除</el-button>

                    <el-button type="text" size="small" @click="closeScholarships(scope.$index, scope.row)">关闭奖学金</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button @click="release" type="primary" :disabled="this.sels.length===0">批量下发至学院</el-button>
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

        <ScholarshipAddModal :addFormVisible="addFormVisible" :isSchool="true"
                             @created="successSubmit" @close="closeAddModal">
        </ScholarshipAddModal>



        <ScholarshipEditModal :editFormVisible="editFormVisible" :id="scholarshipId"
                              @close="closeEditModal" @updated="successUpdate">
        </ScholarshipEditModal>

        <ScholarshipInfoModal :detailVisible="detailVisible" :id="scholarshipId" :info="info"
                              @close="closeInfoModal" :deleteItem="deleteItem" @deleted="successDelete">
        </ScholarshipInfoModal>

    </section>
</template>

<script>

    import {
        getPrizeListPage,
        getScholarshipInfo,
        releaseToCollege,
        openToStudent,
        closeScholarship
    } from '../../../api/api';

    import ScholarshipAddModal from '../../components/ScholarshipAddModal.vue'
    import ScholarshipInfoModal from '../../components/ScholarshipInfoModal.vue'
    import ScholarshipEditModal from '../../components/ScholarshipEditModal.vue'

    export default {
        components: {
            ScholarshipAddModal,
            ScholarshipInfoModal,
            ScholarshipEditModal
        },
        data() {
            return {
                sels: [],
                deleteItem: false,
                scholarshipId: '',
                currentPage: 1,
                currentPageSize: 10,
                filters: {
                    name: ''
                },
                dataList: [],
                total: 0,
                listLoading: false,
                editFormVisible: false,
                info: {},
                addFormVisible: false,
                detailVisible: false
            }
        },
        methods: {
            canSelect: function (row,index) {
                if(row.status === '新建'){
                    return true
                }else{
                    return false
                }
            },
            successSubmit: function () {
                this.getScholarships()
                this.addFormVisible = false
            },
            closeAddModal: function () {
                this.addFormVisible = false
            },
            successDelete: function () {
                this.detailVisible = false
                this.deleteItem = false
                this.scholarshipId = ''
                this.getScholarships();
            },
            successUpdate: function () {
                this.editFormVisible = false
                this.scholarshipId = ''
                this.currentPage = 1
                this.getScholarships();
            },
            closeInfoModal: function () {
                this.detailVisible = false
                this.deleteItem = false
                this.scholarshipId = ''
            },
            closeEditModal: function () {
                this.editFormVisible = false
                this.scholarshipId = ''
            },
            release: function () {
                let para = []
                for (let index in this.sels){
                    if (this.sels[index].allocationStatus === false || this.sels[index].timeStatus === false){
                        this.$message({
                            message: '很抱歉，您选择的奖项中有未进行名额分配或评定时间规划的项目',
                            type: 'error'
                        });
                        para = []
                        return
                    }
                    para.push(this.sels[index].id)
                }
                releaseToCollege(para).then((res) => {
                    this.$message({
                        message: '下发成功',
                        type: 'success'
                    });
                    this.getScholarships()
                }).catch((error)=>{

                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleDelete: function (index, row) {
                if (row.status !== '新建'){
                    this.$message({
                        message: '很抱歉，该奖学金已进入评定流程，无法进行删除',
                        type: 'error'
                    });
                    return
                }
                this.deleteItem = true
                this.handleDetail(index,row)
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getScholarships();
            },
            handleSizeChange(val) {
                this.currentPageSize = val
                this.getScholarships();
            },
            getScholarships() {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;
                getPrizeListPage(para).then((res) => {
                    this.total = res.total;
                    this.dataList = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            },
            handleEdit: function (index, row) {
                if (row.status !== '新建'){
                    this.$message({
                        message: '很抱歉，该奖学金已进入评定流程，无法进行编辑',
                        type: 'error'
                    });
                    return
                }
                this.scholarshipId = row.scholarshipId
                this.editFormVisible = true;
            },
            handleAdd: function (index, row) {
                this.addFormVisible = true;
            },
            handleDetail: function (index, row) {
                let para = {
                    id: row.scholarshipId
                }
                getScholarshipInfo(para).then((res) => {
                    this.info = res;
                    this.scholarshipId = row.scholarshipId
                    this.detailVisible = true
                }).catch((error)=>{
                });
            },
            closeScholarships: function (index, row) {
                this.$confirm('确认关闭该奖学金吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = {
                        id: row.scholarshipId
                    }
                    closeScholarship(para).then((res) => {
                        this.getScholarships()
                        this.$message({
                            message: '关闭成功',
                            type: 'success'
                        });
                    }).catch((error)=>{
                    });
                }).catch(() => {

                })
            }
        },
        mounted() {
            this.getScholarships();
            this.$emit('activeTab', '1');
        },
        created() {
            this.$emit('viewIn', [{
                name: '奖学金维护',
                url: '/school/manage'
            }]);
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .upload-demo {
        width: 360px;
    }
</style>