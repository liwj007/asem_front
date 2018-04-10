<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="openObjection">提出异议</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="70" label="序号">
                <template slot-scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称">
            </el-table-column>
            <el-table-column prop="unitName" label="公示人">
            </el-table-column>
            <el-table-column prop="date" label="公示起止日期">
                <template slot-scope="scope">
                    {{scope.row.beginDate}}~~{{scope.row.endDate}}
                </template>
            </el-table-column>
            <el-table-column prop="id" label="公示名单">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showDetail(scope.row.id)">查看</el-button>
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

        <el-dialog title="提出异议" :visible.sync="formVisible" @close="closeModal">
            <el-form :model="addForm" label-width="100px" ref="addForm">
                <el-form-item label="相关奖项" prop="prizes">
                    <el-select v-model="addForm.publicityId" placeholder="请选择" style=" width: 100%;">
                        <el-option
                                v-for="item in publicityList"
                                :key="item.id"
                                :label="item.scholarshipName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="异议内容" prop="name">
                    <el-input v-model="addForm.content" type="textarea" :maxlength="200" placeholder="200字以内" :rows="5"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="addLoading" :disabled="!addForm.publicityId || !addForm.content ">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getStudentMangePublicityList,
        addObjection,
        getAllStudentMangePublicityList
    } from '../../../api/api';
    import {mapGetters} from 'vuex'
    import moment from 'moment'

    export default {
        name: 'PublicityScholarshipList',
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            return {
                publicityList: [],
                addForm: {
                    publicityId: '',
                    content: ''
                },
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                listLoading: false,
                formVisible: false,
                addLoading: false
            }
        },
        methods: {
            openObjection: function () {
                getAllStudentMangePublicityList().then((res) => {
                    this.publicityList = res;
                }).catch((error) => {
                });
                this.formVisible = true
            },
            closeModal: function () {
                this.addForm.publicityId = ''
                this.addForm.content = ''
            },
            cancelAdd: function () {
                this.formVisible = false
            },
            addSubmit: function () {
                let para = {
                    publicityId: this.addForm.publicityId,
                    content: this.addForm.content
                }
                addObjection(para).then((res) => {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.cancelAdd();
                }).catch((error) => {
                });
            },
            showDetail: function (id) {
                this.$router.push('/student/publicity_detail/' + id)
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
                    manageUnit: this.getManageUnit
                };
                this.listLoading = true;
                getStudentMangePublicityList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error) => {
                    this.listLoading = false;
                });
            }

        },
        created() {
            this.$emit('viewIn', [{
                name: '奖学金公示',
                url: '/student/publicity_list'
            },{
                name: '异议反馈',
                url: '/student/publicity_objection'
            }]);
        },
        mounted() {
            this.$emit('activeTab', '1');
            this.getDatas()
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>