<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="text" icon="arrow-left" @click="$router.go(-1)">返回 </el-button>
                </el-form-item>
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.major" style="width: 120px;">-->
                        <!--<el-option label="不限专业" value="0"></el-option>-->
                        <!--<el-option label="专业1" value="1"></el-option>-->
                        <!--<el-option label="专业2" value="2"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.grade" style="width: 120px;">-->
                        <!--<el-option label="不限年级" value="0"></el-option>-->
                        <!--<el-option label="年级1" value="1"></el-option>-->
                        <!--<el-option label="年级2" value="2"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.className" style="width: 120px;">-->
                        <!--<el-option label="不限班级" value="0"></el-option>-->
                        <!--<el-option label="班级1" value="1"></el-option>-->
                        <!--<el-option label="班级2" value="2"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.submitStatus" style="width: 120px;">-->
                        <!--<el-option label="不限提交" value="0"></el-option>-->
                        <!--<el-option label="已提交" value="1"></el-option>-->
                        <!--<el-option label="需修改" value="2"></el-option>-->
                        <!--<el-option label="重新提交" value="3"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.checkStatus" style="width: 120px;">-->
                        <!--<el-option label="不限审核" value="0"></el-option>-->
                        <!--<el-option label="审核中" value="1"></el-option>-->
                        <!--<el-option label="审核通过" value="2"></el-option>-->
                        <!--<el-option label="审核不通过" value="3"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-input v-model="filters.name" placeholder="学号或姓名"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-button type="text" v-on:click="dialogFormVisible=true">高级设置</el-button>-->
                    <!--<el-button type="primary" v-on:click="">查询</el-button>-->
                <!--</el-form-item>-->
            </el-form>
        </el-col>

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%" @selection-change="selsChange">
            <el-table-column type="selection" width="50"  :selectable="canSelect">
            </el-table-column>
            <el-table-column type="index" width="60">
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
            <el-table-column prop="records" label="申请记录">
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
            <el-table-column prop="fileStatus" label="材料提交状态">
                <template scope="scope">
                    <span v-if="scope.row.fileStatus === 'SUBMIT'">已提交</span>
                    <span v-else-if="scope.row.fileStatus === 'PASS'">已提交</span>
                    <span v-else-if="scope.row.fileStatus === 'REJECT'">需修改</span>
                    <span v-else-if="scope.row.fileStatus === 'RESUBMIT'">重新提交</span>
                </template>
            </el-table-column>
            <el-table-column prop="documents" label="申请材料">
                <template scope="scope">
                    <el-button type="text" size="small" @click="showDetail(scope.row.applicationId)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="awardStatus" label="获奖审核状态">
                <template scope="scope">
                    <el-select v-model="scope.row.prizeStatus" size="small" :disabled="scope.row.prizeStatus !== 'SUBMIT'">
                        <el-option label="审核中" value="SUBMIT"></el-option>
                        <el-option label="通过" value="PASS"></el-option>
                        <el-option label="不通过" value="REJECT"></el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="primary" @click="checkPrizeStatus('PASS')" :disabled="this.sels.length===0">批量通过</el-button>
            <el-button type="danger" @click="checkPrizeStatus('REJECT')" :disabled="this.sels.length===0">批量不通过</el-button>
            <!--<span>申请人数 200，可用名额 200，已用名额 0</span>-->
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


        <el-dialog title="高级筛选" :close-on-click-modal="false" v-model="dialogFormVisible">
            <el-form :model="form" :label-width="formLabelWidth" label-position="right">
                <el-form-item label="基本信息">
                    <el-select v-model="form.major" style="width: 200px">
                        <el-option label="不限专业" value="0"></el-option>
                        <el-option label="2" value="1"></el-option>
                        <el-option label="3" value="2"></el-option>
                    </el-select>
                    <el-select v-model="form.grade" style="width: 200px">
                        <el-option label="不限年级" value="0"></el-option>
                        <el-option label="2" value="1"></el-option>
                        <el-option label="3" value="2"></el-option>
                    </el-select>
                    <el-select v-model="form.className" style="width: 200px">
                        <el-option label="不限班级" value="0"></el-option>
                        <el-option label="2" value="1"></el-option>
                        <el-option label="3" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请提交">
                    <el-select v-model="form.submitStatus" style="width: 140px;">
                        <el-option label="不限提交" value="0"></el-option>
                        <el-option label="已提交" value="1"></el-option>
                        <el-option label="需修改" value="2"></el-option>
                        <el-option label="重新提交" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="获奖审核">
                    <el-select v-model="form.awardStatus" style="width: 140px;">
                        <el-option label="不限审核" value="0"></el-option>
                        <el-option label="审核中" value="1"></el-option>
                        <el-option label="审核通过" value="2"></el-option>
                        <el-option label="审核不通过" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排名区间">
                    <el-row v-for="(item, index) in form.ranks" :key="index" style="padding-bottom: 15px;">
                        <el-select v-model="item.rank" style="width: 140px;">
                            <el-option label="综合测评排名" value="1"></el-option>
                            <el-option label="智育排名" value="2"></el-option>
                        </el-select>
                        <span style="padding: 0 10px;">只看排名前</span>
                        <el-input-number :min="0" :max="10" v-model="item.number"></el-input-number>
                        <span style="padding: 0 10px;">的学生</span>
                        <el-button @click.prevent="removeItem(item)">删除</el-button>
                    </el-row>
                    <el-button @click="addItem" type="text">添加限定条件</el-button>
                </el-form-item>

                <el-form-item label="已获奖学金" prop="awards">
                    <el-select v-model="form.awards" multiple placeholder="请选择">
                        <el-option
                                v-for="item in allAwards"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

        <ApplicationInfoModal :infoVisible="infoVisible" :id="applicationId"
                              @close="closeInfoModal">
        </ApplicationInfoModal>
    </section>
</template>

<script>
    import {
        getAwardCheckDetailList,
        checkPrizeStatus
    } from '../../../api/api';
    import ApplicationInfoModal from '../../components/ApplicationInfoModal.vue'

    export default {
        name: 'AwardCheckDetail',
        props: ['itemId'],
        components: {ApplicationInfoModal},
        data() {
            return {
                canSelects: [],
                allAwards: [],
                form: {
                    major: '0',
                    grade: '0',
                    className: '0',
                    submitStatus: '0',
                    awardStatus: '0',
                    awards: [],
                    ranks: []
                },
                infoVisible: false,
                dialogFormVisible: false,
                applicationId: '',
                formLabelWidth: '100px',
                filters: {
                    name: '',
                    college: '0',
                    major: '0',
                    grade: '0',
                    className: '0',
                    submitStatus: '0',
                    checkStatus: '0'
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
                return row.prizeStatus === 'SUBMIT'
            },
            checkPrizeStatus: function (result) {
                let ids = []
                for (let index in this.sels){
                    let item = this.sels[index]
                    ids.push(item.stepId)
                }
                let para = {
                    ids: ids,
                    result: result
                };
                checkPrizeStatus(para).then((res) => {
                    this.getDatas()
                }).catch((error) => {
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
                    prizeId: this.$route.params.id
                };
                this.listLoading = true;
                getAwardCheckDetailList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error) => {
                    this.listLoading = false;
                });
            },
            removeItem(item) {
                var index = this.form.ranks.indexOf(item)
                if (index !== -1) {
                    this.form.ranks.splice(index, 1)
                }
            },
            addItem: function () {
                this.form.ranks.push({
                    number: 0,
                    rank: '1'
                });
            },
            showDetail: function (id) {
                this.applicationId = id
                this.infoVisible = true
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