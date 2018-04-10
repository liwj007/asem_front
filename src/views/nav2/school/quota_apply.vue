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
            <el-table-column type="selection" width="55"  :selectable="canSelect">
            </el-table-column>
            <el-table-column type="index" width="70" label="序号">
                <template slot-scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="unitName" label="申请人"  >
            </el-table-column>
            <el-table-column  prop="scholarshipName" label="奖学金名称"  >
            </el-table-column>
            <el-table-column prop="prizeName" label="等级">
                <template slot-scope="scope">
                    {{scope.row.prizeName===''?'无':scope.row.prizeName}}
                </template>
            </el-table-column>
            <el-table-column prop="allocationNumber" label="分配名额" >
            </el-table-column>
            <el-table-column prop="applyNumber" label="申请名额" >
            </el-table-column>
            <el-table-column  label="申请审核状态">
                <template slot-scope="scope">
                    <template v-if="scope.row.status === '申请中'">
                        <el-button type="text" size="small" @click="pass(scope.row)">通过</el-button>
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


        <el-dialog title="确认申请名额" :visible.sync="singlePassVisible"
                   :close-on-click-modal="false" :show-close="false"
                   :close-on-press-escape="false"
                   @close="closeModal">
            <el-form :model="singleForm" label-width="100px" ref="singleForm" >
                <el-form-item label="名额数量" prop="number">
                    <el-input-number v-model="singleForm.number"  :min="1" :max="singleForm.max" ></el-input-number>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelPass">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="passLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getAllQuotaApplyList,
        checkQuotaApply,
        checkSingleQuotaApply
    } from '../../../api/api';
    export default {
        name: 'QuotaApply',
        data() {
            return {
                passLoading: false,
                filters: {
                    name: ''
                },
                sels: [],
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                listLoading: false,
                singlePassVisible: false,
                singleForm: {
                    id: '',
                    number: 0,
                    max: 0
                }
            }
        },
        methods: {
            closeModal: function () {
                this.singleForm.id = ''
                this.singleForm.number = 0
                this.singleForm.max = 0
            },
            cancelPass: function () {
                this.singlePassVisible = false
            },
            addSubmit: function () {
                let para = {
                    id: this.singleForm.id,
                    number: this.singleForm.number
                }
                checkSingleQuotaApply(para).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.singlePassVisible = false
                    this.getData()
                }).catch((error)=>{});
            },
            canSelect: function (row,index) {
                return row.status === '申请中'
            },
            selsChange: function (items) {
                this.sels = []
                for (let index in items){
                    this.sels.push(items[index].id)
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData()
            },
            handleSizeChange(val) {
                this.currentPageSize  = val
                this.getData()
            },
            pass(item) {
                this.singleForm.id = item.id
                this.singleForm.number = item.applyNumber
                this.singleForm.max = item.applyNumber
                this.singlePassVisible = true
            },
            reject(id) {
                this.sels = [id]
                this.rejectBatch()
            },
            passBatch: function () {
                this.$confirm('是否确认通过学院名额申请？', '确认提醒 ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tmp = []
                    for (let index in this.sels){
                        tmp.push(this.sels[index])
                    }
                    let para = {
                        ids: tmp,
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
                }).catch(() => {
                    this.sels = []
                    this.$message({
                        type: 'info',
                        message: '操作已取消'
                    });
                });
            },
            rejectBatch: function () {
                this.$confirm('是否确认不通过学院申请？', '确认提醒 ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tmp = []
                    for (let index in this.sels){
                        tmp.push(this.sels[index])
                    }
                    let para = {
                        ids: tmp,
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
                }).catch(() => {
                    this.sels = []
                    this.$message({
                        type: 'info',
                        message: '操作已取消'
                    });
                });
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
            this.$emit('activeTab', '2');
        },
        created() {
            this.$emit('viewIn', [{
                name: '名额分配',
                url: '/school/quota/allocation'
            }, {
                name: '名额申请',
                url: '/school/quota/apply'
            }, {
                name: '名额退回',
                url: '/school/quota/back'
            }]);
        },
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>