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

        <el-table ref="dataTable" :data="tableData" v-loading="listLoading" stripe
                  style="width: 100%" @selection-change="selsChange">
            <el-table-column type="selection" width="50" :selectable="canSelect">
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称">
            </el-table-column>
            <el-table-column prop="prizeName" label="等级">
                <template scope="scope">
                    <span v-if="scope.row.prizeName!==''">{{scope.row.prizeName}}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column prop="applyStatus" label="申请提交状态">
                <template scope="scope">
                    <span v-if="scope.row.status === 'NO'">未提交</span>
                    <span v-else-if="scope.row.status === 'SUBMIT'">已经提交</span>
                    <span v-else-if="scope.row.status === 'RESUBMIT'">重新提交</span>
                    <span v-else-if="scope.row.status === 'REJECT'">审核不通过</span>
                    <span v-else-if="scope.row.status === 'PASS'">审核通过</span>
                </template>
            </el-table-column>
            <el-table-column prop="fileStatus" label="材料审核状态">
                <template scope="scope">
                    <span v-if="scope.row.fileStatus === 'NO'">未提交</span>
                    <span v-else-if="scope.row.fileStatus === 'SUBMIT'">审核中</span>
                    <span v-else-if="scope.row.fileStatus === 'RESUBMIT'">审核中</span>
                    <span v-else-if="scope.row.fileStatus === 'PASS'">通过审核</span>
                    <span v-else-if="scope.row.fileStatus === 'REJECT'">审核不通过</span>
                </template>
            </el-table-column>
            <el-table-column prop="awardStatus" label="获奖审核状态">
                <template scope="scope">
                    <span v-if="scope.row.prizeStatus === 'NO'">未提交</span>
                    <span v-else-if="scope.row.prizeStatus === 'SUBMIT'">审核中</span>
                    <span v-else-if="scope.row.prizeStatus === 'PASS'">通过审核</span>
                    <span v-else-if="scope.row.prizeStatus === 'REJECT'">审核不通过</span>
                </template>
            </el-table-column>
            <el-table-column prop="endDate" label="截止日期">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="apply(scope, scope.row)"
                               v-if="nowTime <= scope.row.endTime && scope.row.status==='NO' && scope.row.applyStatus === true">提交申请
                    </el-button>
                    <el-button type="text" size="small" @click="apply(scope, scope.row)"
                               v-else-if="scope.row.status==='NO' && scope.row.applyStatus === false" :disabled="true">提交申请
                    </el-button>
                    <el-button type="text" size="small" @click="reSubmit(scope, scope.row)"
                               v-else-if="nowTime <= scope.row.endTime && scope.row.fileStatus==='REJECT' && scope.row.prizeStatus !== 'REJECT'">修改材料
                    </el-button>
                    <el-button type="text" size="small" @click="showDetail(scope.row.applicationId)"
                               v-else-if="scope.row.status!=='NO'">查看申请
                    </el-button>
                    <el-button type="text" size="small"
                               v-else-if="nowTime > scope.row.endTime" :disabled="true">提交申请
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button @click="handleApplyBatch" type="primary" :disabled="this.sels.length===0">批量提交申请</el-button>
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


        <ApplicationAddModal :addFormVisible="addFormVisible" :sels="sels"
                             @close="closeAddModal" @created="successAdd">
        </ApplicationAddModal>
        <ApplicationInfoModal :infoVisible="infoVisible" :id="applicationId"
                              @close="closeInfoModal">
        </ApplicationInfoModal>

        <ApplicationEditModal :editVisible="editVisible" :id="applicationId"
                              @close="closeEditModal"  @updated="successUpdate">
        </ApplicationEditModal>
    </section>
</template>

<script>
    import {getPrizeWhichCanSubmit} from '../../../api/api';
    import ApplicationAddModal from '../../components/ApplicationAddModal.vue'
    import ApplicationInfoModal from '../../components/ApplicationInfoModal.vue'
    import ApplicationEditModal from '../../components/ApplicationEditModal.vue'
    import moment from 'moment'
    import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
    export default {
        name: 'ScholarshipApply',
        components: {
            ElButton,
            ApplicationAddModal, ApplicationInfoModal, ApplicationEditModal},
        data() {
            return {
                editVisible: false,
                addFormVisible: false,
                prizeId: '',
                applicationId: '',
                infoVisible: false,
                filters: {
                    name: ''
                },
                sels: [],
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 1,
                listLoading: false
            }
        },
        computed: {
            nowTime: function () {
                let tmp = new Date()
                return tmp.getTime()
            }
        },
        methods: {
            canSelect: function (row,index) {
                return row.prizeStatus === 'NO'
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getScholarshipsForApply()
            },
            handleSizeChange(val) {
                this.currentPageSize = val
                this.getScholarshipsForApply()
            },
            getScholarshipsForApply() {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;
                getPrizeWhichCanSubmit(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    for (let index in this.tableData){
                        this.tableData[index].endTime = moment(this.tableData[index].endDate).toDate().getTime()
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                });
            },

            closeAddModal: function () {
                this.sels = []
                this.$refs.dataTable.clearSelection();
                this.addFormVisible = false
            },
            closeEditModal: function () {
                this.editVisible = false
                this.applicationId = ''
            },
            apply: function (index, val) {
                this.$refs.dataTable.clearSelection();
                this.$refs.dataTable.toggleRowSelection(index);
                this.sels = []
                this.sels.push(val)
                this.addFormVisible = true
            },
            reSubmit: function (index, val) {
                this.applicationId = val.applicationId
                this.editVisible = true
            },
            handleApplyBatch: function () {
//                for(let index in this.sels){
//                    var tmp = this.sels[index]
//                    if(this.nowTime > tmp.endTime || tmp.status!=='NO' || tmp.applyStatus !== true){
//                        this.sels = []
//                        alert('sss')
//                        return
//                    }
//                }
                this.addFormVisible = true
            },
            successAdd: function () {
                this.closeAddModal()
                this.getScholarshipsForApply()
            },
            successUpdate: function () {
                this.closeEditModal()
                this.getScholarshipsForApply()
            },
            showDetail: function (id) {
                this.applicationId = id
                this.infoVisible = true
            },
            closeInfoModal: function () {
                this.infoVisible = false
            }

        },
        mounted() {
            this.getScholarshipsForApply()
        },
        created() {
            this.$emit('viewIn', [{
                name: '奖学金申请',
                url: '/student/apply'
            }]);
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>