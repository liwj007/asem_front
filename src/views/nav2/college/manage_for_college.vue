<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">添加院级奖项</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!--列表-->
        <el-table :data="dataList" v-loading="listLoading" style="width: 100%;">
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
            <!--<el-table-column prop="status" label="状态" sortable>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="350">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="handleDetail(scope.$index, scope.row)">查看
                    </el-button>
                    <el-button :disabled="scope.row.scholarshipType !=='COLLEGE'" size="small" type="text" @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button :disabled="scope.row.scholarshipType !=='COLLEGE'" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                    <el-button :disabled="scope.row.scholarshipType !=='COLLEGE'" type="text" size="small" @click="closeScholarships(scope.$index, scope.row)">关闭奖学金
                    </el-button>
                </template>
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

        <ScholarshipAddModal :addFormVisible="addFormVisible" :isSchool="false"
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
        openToStudent,
        closeScholarship
    } from '../../../api/api';
    import {mapGetters} from 'vuex'
    import ScholarshipAddModal from '../../components/ScholarshipAddModal.vue'
    import ScholarshipInfoModal from '../../components/ScholarshipInfoModal.vue'
    import ScholarshipEditModal from '../../components/ScholarshipEditModal.vue'

    export default {
        components: {
            ScholarshipAddModal,
            ScholarshipInfoModal,
            ScholarshipEditModal
        },
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            return {
                activeName: 'SCHOOL',
                addFormVisible: false,
                detailVisible: false,
                editFormVisible: false,
                scholarshipId: '',
                currentPage: 1,
                currentPageSize: 10,
                filters: {
                    name: ''
                },
                dataList: [],
                total: 0,
                listLoading: false,
                deleteItem: false,
                info: {}
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDatas();
            },
            handleSizeChange(val) {
                this.currentPageSize = val
                this.getDatas();
            },
            //获取列表
            getDatas() {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    manageUnit: this.getManageUnit
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

            closeAddModal: function () {
                this.addFormVisible = false
            },
            handleAdd: function (index, row) {
                this.addFormVisible = true;
            },
            successSubmit: function () {
                this.getDatas()
                this.addFormVisible = false
            },
            handleDetail: function (index, row) {
                let para = {
                    id: row.scholarshipId,
                    manageUnit: this.getManageUnit
                }
                getScholarshipInfo(para).then((res) => {
                    this.info = res;
                    this.scholarshipId = row.scholarshipId
                    this.detailVisible = true
                });
            },
            closeInfoModal: function () {
                this.detailVisible = false
                this.deleteItem = false
                this.scholarshipId = ''
            },
            successDelete: function () {
                this.detailVisible = false
                this.deleteItem = false
                this.scholarshipId = ''
                this.getDatas();
            },
            handleDelete: function (index, row) {
                this.deleteItem = true
                this.handleDetail(index, row)
            },
            successUpdate: function () {
                this.editFormVisible = false
                this.scholarshipId = ''
                this.currentPage = 1
                this.getDatas();
            },
            closeEditModal: function () {
                this.editFormVisible = false
                this.scholarshipId = ''
            },
            handleEdit: function (index, row) {
                this.scholarshipId = row.scholarshipId
                this.editFormVisible = true;
            },
            closeScholarships: function (index, row) {
                this.$confirm('确认关闭该奖学金吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = {
                        id: row.scholarshipId
                    }
                    closeScholarship(para).then((res) => {
                        this.getDatas()
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
            this.$emit('activeTab', '1');

            this.getDatas();
        },
        created() {
            this.$emit('viewIn', [{
                name: '奖学金维护',
                url: '/college/manage'
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