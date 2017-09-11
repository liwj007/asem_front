<template>
    <section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <!--<el-form-item>-->
                    <!--<el-input v-model="filters.name" placeholder="奖学金名称"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-button type="primary" v-on:click="">查询</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">退回名额</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称">
            </el-table-column>
            <el-table-column prop="prizeName" label="等级">
            </el-table-column>
            <el-table-column prop="allocationNumber" label="原先分配名额">
            </el-table-column>
            <el-table-column prop="applyNumber" label="退回名额">
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


        <!--名额分配-->
        <el-dialog title="退回名额" v-model="addFormVisible" :close-on-click-modal="false" @close="" size="tiny">
            <el-form :model="addForm"  ref="addForm">
                <el-form-item v-for="(item, index) in addForm.options" :key="index">
                    <el-select v-model="item.scholarshipId" placeholder="奖学金名称"  style="width: 170px"
                               @change="changeScholarship(index)">
                        <el-option
                                v-for="scholarship in scholarships"
                                :key="scholarship.id"
                                :label="scholarship.name"
                                :value="scholarship.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="item.prizeId" placeholder="奖学金级别" style="width: 150px">
                        <el-option
                                v-for="prize in item.prizes"
                                :key="prize.id"
                                :label="prize.name"
                                :value="prize.id">
                        </el-option>
                    </el-select>
                    <el-input-number v-model="item.applyNumber" :min="0" :max="1000"  style="width: 130px"></el-input-number>
                    <el-button @click.prevent="removeItem(item)" v-show="addForm.options.length > 1">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addItem" type="text" :disabled="!canAddItem">+添加</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getScholarshipsForSelect,
        backQuota,
        getQuotaBackList
    } from '../../../api/api';
    import {mapGetters} from 'vuex'
    export default {
        name: 'QuotaBack',
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            return {
                addFormVisible: false,
                addForm: {
                    options: []
                },
                filters: {
                    name: ''
                },
                addLoading: false,
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 2,
                listLoading: false,
                scholarships: [],
                helpMap: {},
                sizeLimit: 5,
                canAddItem: true
            }
        },
        methods: {
            handleClose: function () {
                this.addForm.options =[]
                this.addFormVisible = false
            },
            changeScholarship: function (index) {
                this.addForm.options[index].prizes = this.helpMap[this.addForm.options[index].scholarshipId]
                this.addForm.options[index].prizeId = ''
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDatas()
            },
            handleSizeChange(val) {
                this.currentPageSize = val
                this.getDatas()
            },
            removeItem(item) {
                var index = this.addForm.options.indexOf(item)
                if (index !== -1) {
                    this.addForm.options.splice(index, 1)
                }
                this.canAddItem = true
            },
            addItem: function () {
                if(this.addForm.options.length < this.sizeLimit){
                    this.addForm.options.push({
                        scholarshipId: '',
                        prizeId: '',
                        applyNumber: 0,
                        prizes: []
                    });
                    if (this.addForm.options.length == this.sizeLimit){
                        this.canAddItem = false
                    }
                }
            },
            handleAdd: function () {
                this.addForm.options = []
                let para = {
                    manageUnit: this.getManageUnit
                }
                getScholarshipsForSelect(para).then((res) => {
                    let data = [];
                    for (let index in res){
                        let scholarshipId = res[index].id
                        let scholarshipName = res[index].name
                        let prizes = []
                        for (let index2 in res[index].prizes){
                            prizes.push({
                                id: res[index].prizes[index2].id,
                                name: res[index].prizes[index2].prizeName
                            })
                        }
                        data.push({
                            id: scholarshipId,
                            name: scholarshipName
                        })
                        this.helpMap[scholarshipId] = prizes
                    }
                    this.scholarships = data
                    this.addFormVisible = true;
                    this.addItem()
                }).catch((error)=>{
                });
            },
            addSubmit:function () {
                let para = []
                for (let index in this.addForm.options) {
                    let option = this.addForm.options[index]
                    para.push({
                        prizeId: option.prizeId,
                        scholarshipId: option.scholarshipId,
                        applyNumber: option.applyNumber
                    })
                }
                backQuota(para).then((res) => {
                    this.$message({
                        message: '申请成功',
                        type: 'success'
                    });
                    this.handleClose()
                    this.getDatas()
                }).catch(()=>{});
            },
            getDatas: function () {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;
                getQuotaBackList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
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