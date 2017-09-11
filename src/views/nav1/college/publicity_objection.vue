<template>
    <section>


        <div>
            <ul class="objection" v-for="item in tableData">
                <li>
                    <el-row class="head">
                        <el-col :span="1">{{item.name}}</el-col>
                        <el-col :span="2">{{item.sn}}</el-col>
                        <el-col :span="2">{{item.collegeName}}</el-col>
                        <el-col :span="2">{{item.majorName}}</el-col>
                        <el-col :span="2">{{item.gradeName}}</el-col>
                        <el-col :span="3">{{item.className}}</el-col>
                        <el-col :span="3" :offset="8">{{item.createTime}}</el-col>
                        <el-col :span="1">
                            <el-button type="text" @click="addObjection(item.id)" v-if="item.feedback===null">处理</el-button>
                            <el-button type="text" @click="showFeedback(item.feedback)" v-else>查看</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <p>{{item.content}}</p>
                    </el-row>
                </li>
            </ul>
        </div>

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

        <el-dialog title="异议处理" v-model="formVisible" @close="closeModal" size="tiny">
            <el-form :model="addForm" ref="addForm">
                <el-form-item label="处理意见" prop="name">
                    <el-input v-model="addForm.content" type="textarea" :rows="5" :readonly="!edit"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd" v-if="edit">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="addLoading" v-if="edit">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getCollegeObjections,
        feedbackObjection
    } from '../../../api/api';
    import {mapGetters} from 'vuex'
    import moment from 'moment'
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {ElCol},
        name: 'PublicityObjection',
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
                edit: true,
                addLoading: false
            }
        },
        methods: {
            addObjection: function (val) {
                this.addForm.publicityId = val
                this.edit = true
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
                feedbackObjection(para).then((res) => {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.cancelAdd();
                    this.getDatas()
                }).catch((error) => {
                });
            },
            showFeedback: function (val) {
                this.addForm.content = val
                this.edit = false
                this.formVisible = true
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
                getCollegeObjections(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error) => {
                    this.listLoading = false;
                });
            }

        },
        created() {

        },
        mounted() {
            this.getDatas()
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';
    .objection {
        padding-left: 0;
        word-break:break-all;
        li {
            list-style:none;
            margin-bottom: 10px;
            border-top:1px solid #d1dbe5;
            border-bottom: 1px solid #d1dbe5;
            padding-top: 10px;
        }

    }
    .head{
        div{
            line-height: 30px;
        }
    }
</style>