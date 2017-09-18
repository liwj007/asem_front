<template>
    <section>

        <FixMajorSearchBar @search="search">
            <template slot="other">
                <el-form-item>
                    <el-select v-model="filters.status" style="width: 150px;">
                        <el-option label="不限状态" value="0"></el-option>
                        <el-option label="审核中" value="1"></el-option>
                        <el-option label="需修改" value="3"></el-option>
                        <el-option label="重新提交" value="4"></el-option>
                        <el-option label="审核通过" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </template>
        </FixMajorSearchBar>

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%" @selection-change="selsChange">
            <el-table-column type="selection" width="50" :selectable="canSelect">
            </el-table-column>
            <el-table-column type="index" width="70" label="序号">
                <template scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="sn" label="学号">
            </el-table-column>
            <el-table-column prop="majorName" label="专业">
            </el-table-column>
            <el-table-column prop="gradeName" label="年级">
            </el-table-column>
            <el-table-column prop="className" label="班级">
            </el-table-column>
            <el-table-column prop="status" label="材料提交状态">
                <template scope="scope">
                    <span v-if="scope.row.status === 'SUBMIT'">已提交</span>
                    <span v-else-if="scope.row.status === 'PASS'">已提交</span>
                    <span v-else-if="scope.row.status === 'REJECT'">需修改</span>
                    <span v-else-if="scope.row.status === 'RESUBMIT'">重新提交</span>
                </template>
            </el-table-column>
            <el-table-column prop="prizeId" label="申请材料">
                <template scope="scope">
                    <el-button type="text" size="small" @click="showDetail(scope.row.applicationId)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="材料审核状态">
                <template scope="scope">
                    <span v-if="scope.row.status === 'SUBMIT'">审核中</span>
                    <span v-else-if="scope.row.status === 'PASS'">审核通过</span>
                    <span v-else-if="scope.row.status === 'REJECT'">审核不通过</span>
                    <span v-else-if="scope.row.status === 'RESUBMIT'">审核中</span>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="primary" @click="checkFileStatus('PASS')" :disabled="this.sels.length===0">批量通过</el-button>
            <el-button type="danger" @click="checkFileStatus('REJECT')" :disabled="this.sels.length===0">批量不通过
            </el-button>

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

        <ApplicationInfoModal :infoVisible="infoVisible" :id="applicationId"
                              @close="closeInfoModal">
        </ApplicationInfoModal>


    </section>
</template>

<script>
    import {
        getFileCheckDetailList,
        checkFileStatus
    } from '../../../api/api';
    import ApplicationInfoModal from '../../components/ApplicationInfoModal.vue'
    import FixMajorSearchBar from  '../../components/FixMajorSearch.vue'
    export default {
        name: 'FileCheckDetail',
        props: ['itemId'],
        components: {ApplicationInfoModal,FixMajorSearchBar},
        data() {
            return {
                infoVisible: false,
                applicationId: '',
                filters: {
                    content: '',
                    collegeId: '0',
                    majorId: '0',
                    gradeId: '0',
                    classId: '0',
                    status: '0'
                },
                sels: [],
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                listLoading: false
            }
        },
        methods: {
            canSelect: function (row,index) {
                return row.status === 'SUBMIT' || row.status === 'RESUBMIT'
            },
            checkFileStatus: function (result) {
                this.$confirm('是否确认通过已选中学生的材料信息么？', '确认提醒 ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = []
                    for (let index in this.sels){
                        let item = this.sels[index]
                        ids.push(item.applicationId)
                    }
                    let para = {
                        ids: ids,
                        result: result
                    };
                    checkFileStatus(para).then((res) => {
                        this.getDatas()
                    }).catch((error) => {
                    });
                }).catch(() => {
                });
            },
            closeInfoModal: function () {
                this.infoVisible = false
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDatas();
            },
            handleSizeChange(val) {
                this.currentPageSize = val
                this.getDatas();
            },
            showDetail: function (id) {
                this.applicationId = id
                this.infoVisible = true
            },
            search: function (val) {
                this.filters.gradeId = val.gradeId
                this.filters.classId = val.classId
                this.filters.content = val.content
                this.getDatas()
            },
            getDatas: function (val) {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    prizeId: this.$route.params.id,
                    gradeId: this.filters.gradeId,
                    classId: this.filters.classId,
                    content: this.filters.content,
                    status: this.filters.status
                };
                this.listLoading = true;
                getFileCheckDetailList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error) => {
                    this.listLoading = false;
                });
            }
        },
        mounted() {
            this.getDatas();
        }
    }

</script>

<style scoped lang="scss">


</style>