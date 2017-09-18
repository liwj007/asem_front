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

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="70" label="序号">
                <template scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称">
            </el-table-column>
            <el-table-column prop="studentBeginDate" label="学生开始申请时间">
            </el-table-column>
            <el-table-column prop="collegeEndDate" label="学院截止提交时间">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.row)" :disabled="scope.row.startTime < nowTime">编辑</el-button>
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

        <AllocationTimeAddModal :addFormVisible="addFormVisible" @close="closeAddModal"
                                @created="successCreated"></AllocationTimeAddModal>

        <AllocationTimeEditModal :editFormVisible="editFormVisible" :scholarshipId="scholarshipId"
                                 @close="closeEditModal" @updated="successUpdated"></AllocationTimeEditModal>
    </section>
</template>
<script>
    import {getAllocatedTimePrizeListPage} from '../../../api/api';
    import moment from 'moment'
    import AllocationTimeAddModal from '../../components/AllocationTimeAddModal.vue'
    import AllocationTimeEditModal from '../../components/AllocationTimeEditModal.vue'

    export default {
        name: 'EvaluationTime',
        components: {AllocationTimeAddModal, AllocationTimeEditModal},
        data() {
            return {
                editFormVisible: false,
                filters: {
                    name: ''
                },
                listLoading: false,
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                addFormVisible: false,
                scholarshipId: ''
            }
        },
        computed: {
          nowTime: function () {
              let tmp = new Date()
              return tmp.getTime()
          }
        },
        mounted() {
            this.getDatas()
        },
        created() {
            this.$emit('viewIn', [{
                name: '评定时间',
                url: '/school/time'
            }]);
        },
        methods: {
            getDatas() {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;
                getAllocatedTimePrizeListPage(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    for (let index in this.tableData){
                        this.tableData[index].startTime = moment(this.tableData[index].studentBeginDate).toDate().getTime()
                    }
                    this.listLoading = false;
                }).catch((error) => {
                    this.listLoading = false;
                });
            },
            handleSizeChange(val) {
                this.currentPageSize = val;
                this.getDatas()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getDatas()
            },
            handleAdd: function () {
                this.addFormVisible = true
            },
            closeAddModal: function () {
                this.addFormVisible = false
            },
            successCreated: function () {
                this.addFormVisible = false
                this.getDatas()
            },
            closeEditModal: function () {
                this.editFormVisible = false
            },
            successUpdated: function () {
                this.editFormVisible = false
                this.getDatas()
            },
            handleEdit: function (item) {
                this.scholarshipId = item.id
                this.editFormVisible = true
            }
        }

    }
</script>

<style scoped lang="scss">
    .row-bg {
        padding: 10px 0;
    }
</style>
