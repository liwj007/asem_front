<template>
    <section>
        <!--工具条-->
        <FullSearchBar @search="search">
            <template slot="other">

            </template>
        </FullSearchBar>


        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="70" label="序号">
                <template scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="sn" label="学号">
            </el-table-column>
            <el-table-column prop="collegeName" label="学院">
            </el-table-column>
            <el-table-column prop="majorName" label="专业">
            </el-table-column>
            <el-table-column prop="gradeName" label="年级">
            </el-table-column>
            <el-table-column prop="className" label="班级">
            </el-table-column>
            <el-table-column prop="records" label="获奖数">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p v-for="item in scope.row.records">
                            {{item}}
                        </p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.records.length }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="documents" label="申请材料">
                <template scope="scope">
                    <el-button type="text" size="small" @click="showDetail(scope.row.applicationId)">查看</el-button>
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
                    :page-size="100"
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
        getAwardApplicationsByScholarship
    } from '../../../api/api';
    import ApplicationInfoModal from '../../components/ApplicationInfoModal.vue'
    import FullSearchBar from  '../../components/FullSearch.vue'
    export default {
        name: 'AwardCheckDetail',
        props: ['itemId'],
        components: {ApplicationInfoModal,FullSearchBar},
        data() {
            return {
                infoVisible: false,
                dialogFormVisible: false,
                applicationId: '',
                formLabelWidth: '100px',
                filters: {
                    content: '',
                    collegeId: '0',
                    majorId: '0',
                    gradeId: '0',
                    classId: '0',
                },
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                listLoading: false
            }
        },
        methods: {
            closeInfoModal: function () {
                this.infoVisible = false
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDatas()
            },
            handleSizeChange(val) {
                this.currentPageSize = val
                this.getDatas()
            },
            getDatas: function (val) {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    id: this.$route.params.id,
                    collegeId: this.filters.collegeId,
                    majorId: this.filters.majorId,
                    gradeId: this.filters.gradeId,
                    classId: this.filters.classId,
                    content: this.filters.content
                };
                this.listLoading = true;
                getAwardApplicationsByScholarship(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error) => {
                    this.listLoading = false;
                });
            },
            showDetail: function (id) {
                this.applicationId = id
                this.infoVisible = true
            },
            search: function (val) {
                this.filters.collegeId = val.collegeId
                this.filters.majorId = val.majorId
                this.filters.gradeId = val.gradeId
                this.filters.classId = val.classId
                this.filters.content = val.content
                this.getDatas()
            }
        },
        mounted() {
            this.getDatas()
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>