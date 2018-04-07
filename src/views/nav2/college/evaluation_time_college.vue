<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <!--<el-form-item>-->
                    <!--<el-input v-model="filters.name" placeholder="奖学金名称"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-button type="primary" v-on:click="">查询</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">添加</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="tableData"  v-loading="listLoading" stripe  style="width: 100%">
            <el-table-column type="index" width="70" label="序号">
                <template slot-scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称"  >
            </el-table-column>
            <el-table-column  prop="studentBeginDate" label="学生开始申请时间"  >
            </el-table-column>
            <el-table-column  prop="studentEndDate" label="学生截止申请时间"  >
            </el-table-column>
            <el-table-column  prop="gradeEndDate" label="年级截止申请时间"  >
                <template slot-scope="scope">
                    <span v-if="scope.row.gradeEndDate === null">无</span>
                    <span v-else>{{scope.row.gradeEndDate}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="collegeEndDate" label="学院截止提交时间" >
                <template slot-scope="scope">
                    <span v-if="scope.row.collegeEndDate === null">无</span>
                    <span v-else>{{scope.row.collegeEndDate}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <!--<el-button type="text" size="small" style="color: red;">删除</el-button>-->
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


        <CollegeAllocationTimeAddModal :addFormVisible="addFormVisible" @close="closeAddModal"
                                @created="successCreated"></CollegeAllocationTimeAddModal>

        <CollegeAllocationTimeEditModal :editFormVisible="editFormVisible" :scholarshipId="scholarshipId"
                                        @close="closeEditModal" @updated="successUpdated">
        </CollegeAllocationTimeEditModal>
    </section>
</template>
<script>
    import {getAllocatedTimePrizeListPage} from '../../../api/api';
    import CollegeAllocationTimeAddModal from '../../components/CollegeAllocationTimeAddModal.vue'
    import CollegeAllocationTimeEditModal from '../../components/CollegeAllocationTimeEditModal.vue'
    import {mapGetters} from 'vuex'
    export default {
        name: 'EvaluationTime',
        components: {
            CollegeAllocationTimeAddModal,
            CollegeAllocationTimeEditModal
        },
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            return {
                filters: {
                    name: ''
                },
                listLoading: false,
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                addFormVisible: false,
                scholarshipId: '',
                editFormVisible: false
            }
        },
        mounted() {
            this.getScholarships()
        },
        created (){
            this.$emit('viewIn',[{
                name: '评定时间',
                url: '/time_college'
            }]);
        },
        methods: {
            successCreated: function () {
                this.addFormVisible = false
                this.getScholarships()
            },
            closeAddModal: function () {
                this.addFormVisible = false
            },
            successUpdated: function () {
                this.editFormVisible = false
                this.getScholarships()
            },
            closeEditModal: function () {
                this.editFormVisible = false
            },
            getScholarships() {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    manageUnit: this.getManageUnit
                };
                this.listLoading = true;
                getAllocatedTimePrizeListPage(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch(()=>{
                    this.listLoading = false;
                });
            },
            handleAdd: function () {
                this.addFormVisible = true
            },
            handleEdit: function (item) {
                this.scholarshipId = item.id
                this.editFormVisible = true
            },
            handleSizeChange(val) {
                this.currentPageSize = val;
                this.getScholarships()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getScholarships()
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .row-bg {
        padding: 10px 0;
    }
</style>
