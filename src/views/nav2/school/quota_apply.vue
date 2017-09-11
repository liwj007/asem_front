<template>
    <section>

        <!--工具条-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">-->
            <!--<el-form :inline="true" :model="filters">-->
                <!--<el-form-item>-->
                    <!--<el-input v-model="filters.name" placeholder="奖学金名称"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-button type="primary" v-on:click="">查询</el-button>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
        <!--</el-col>-->

        <el-table :data="tableData"  v-loading="listLoading" stripe  style="width: 100%" @selection-change="selsChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="unitName" label="申请人"  >
            </el-table-column>
            <el-table-column  prop="scholarshipName" label="奖学金名称"  >
            </el-table-column>
            <el-table-column prop="prizeName" label="等级" >
            </el-table-column>
            <el-table-column prop="allocationNumber" label="分配名额" >
            </el-table-column>
            <el-table-column prop="applyNumber" label="申请名额" >
            </el-table-column>
            <el-table-column  label="申请审核状态">
                <template scope="scope">
                    <template v-if="scope.row.status === '申请中'">
                        <el-button type="text" size="small" @click="pass(scope.row.id)">通过</el-button>
                        <el-button type="text" size="small" style="color:red;" @click="reject(scope.row.id)">不通过</el-button>
                    </template>
                    <template v-else>
                        {{scope.row.status}}
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="primary" @click="passBatch" :disabled="this.sels.length===0">批量通过</el-button>
            <el-button type="danger" @click="rejectBatch" :disabled="this.sels.length===0">批量不通过</el-button>

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


    </section>
</template>

<script>
    import {
        getAllQuotaApplyList,
        checkQuotaApply
    } from '../../../api/api';
    export default {
        name: 'QuotaApply',
        data() {
            return {
                filters: {
                    name: ''
                },
                sels: [],
                currentPage: 1,
                currentPageSize: 10,
                tableData: [{
                    college: 'xxx',
                    name: 'xxx',
                    allocationNum: 10,
                    applyNum: 5,
                    level: '一等奖'
                }],
                total: 1,
                listLoading: false,
            }
        },
        methods: {
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData()
            },
            handleSizeChange(val) {
                this.currentPageSize  = val
                this.getData()
            },
            pass(id) {
                this.$confirm('是否确认通过学院名额申请？', '确认提醒 ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sels = [id]
                    this.passBatch()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '操作已取消'
                    });
                });
            },
            reject(id) {
                this.$confirm('是否确认不通过学院申请？', '确认提醒 ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sels = [id]
                    this.rejectBatch()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '操作已取消'
                    });
                });
            },
            passBatch: function () {
                let para = {
                    ids: this.sels,
                    result: 'PASS'
                }
                checkQuotaApply(para).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.sels = []
                    this.getData()
                }).catch((error)=>{});
            },
            rejectBatch: function () {
                let para = {
                    ids: this.sels,
                    result: 'REJECT'
                }
                checkQuotaApply(para).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.sels = []
                    this.getData()
                }).catch((error)=>{});
            },
            getData: function () {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;
                getAllQuotaApplyList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            }
        },
        mounted() {
            this.getData()
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>