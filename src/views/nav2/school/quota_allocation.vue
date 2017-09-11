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
                    <el-button type="primary" @click="handleAdd">名额分配</el-button>
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
            <el-table-column prop="number" label="名额">
            </el-table-column>
            <el-table-column prop="restNumber" label="预留名额">
            </el-table-column>
            <el-table-column prop="availableNumber" label="可分配名额">
            </el-table-column>
            <el-table-column prop="usedNumber" label="已分配名额">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button @click="showInfo(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
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


        <AllocationNumberAddModal :formVisible="addFormVisible" :unitType="unitType"
                               @close="closeAllocationNumberModal" @created="successAllocation">
        </AllocationNumberAddModal>

        <AllocationNumberInfoModal :detailVisible="detailVisible" :id="prizeId"
                                   @close="closeAllocationNumberInfoModal">

        </AllocationNumberInfoModal>

        <AllocationNumberEditModal :editFormVisible="editFormVisible" :id="prizeId"
                                   @close="closeAllocationNumberEditModal" @updated="successUpdate">
        </AllocationNumberEditModal>

    </section>
</template>
<script>
    import {
        getAllocatedNumberPrizeListPage,
        getAllocatedNumberDetail
    } from '../../../api/api';
    import AllocationNumberAddModal from '../../components/AllocationNumberAddModal.vue'
    import AllocationNumberInfoModal from '../../components/AllocationNumberInfoModal.vue'
    import AllocationNumberEditModal from '../../components/AllocationNumberEditModal.vue'
    export default {
        name: 'QuotaAllocation',
        components: {
            AllocationNumberAddModal,
            AllocationNumberInfoModal,
            AllocationNumberEditModal
        },
        data() {
            return {
                unitType: 'SCHOOL',
                editFormVisible: false,
                currentInfoPage: 0,
                detail: {
                    list: []
                },
                tmpData: [],
                selectAwards: [],
                filters: {
                    name: ''
                },
                active: 0,
                addLoading: false,
                listLoading: false,
                currentPage: 1,
                currentPageSize: 10,
                detailVisible: false,
                prizeId: '',
                tableData: [],
                total: 0,
                addFormVisible: false
            }
        },
        mounted() {
            this.getScholarships()
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
        methods: {
            successUpdate: function () {
                this.editFormVisible = false
                this.getScholarships()
            },
            closeAllocationNumberEditModal: function () {
                this.editFormVisible = false
            },
            closeAllocationNumberInfoModal: function () {
                this.detailVisible = false
            },
            closeAllocationNumberModal: function () {
                this.addFormVisible = false
            },
            successAllocation: function () {
                this.addFormVisible = false
                this.getScholarships()
            },
            getScholarships() {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;

                getAllocatedNumberPrizeListPage(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            },
            handleAdd: function () {
                this.unitType = 'SCHOOL'
                this.addFormVisible = true
            },

            showInfo: function (index, row) {
                this.prizeId = row.id
                this.detailVisible = true
            },
            handleEdit: function (index, row) {
                this.prizeId = row.id
                this.editFormVisible = true
            },

            handleSizeChange(val) {
                this.currentPageSize = val;
                this.getScholarships()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getScholarships()
            }

        }
    }
</script>

<style scoped lang="scss">

    .row-bg {
        padding: 10px 0;
    }
</style>
