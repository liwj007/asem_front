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
                    <el-button type="primary" @click="handleAddCollege">名额分配</el-button>
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
                    @size-change="handleCollegeSizeChange"
                    @current-change="handleCollegeCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="currentPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <AllocationNumberAddModal :formVisible="addFormVisible" unitType="COLLEGE"
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
    import {mapGetters} from 'vuex'
    export default {
        name: 'QuotaAllocation',
        components: {
            AllocationNumberAddModal,
            AllocationNumberInfoModal,
            AllocationNumberEditModal
        },
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            return {
                editFormVisible: false,
                awardType: '',
                prizeId: '',
                detailVisible: false,
                addFormVisible: false,
                filters: {
                    name: ''
                },
                listLoading: false,
                tableData: [],
                total: 0,
                currentPage: 1,
                currentPageSize:10
            }
        },
        mounted() {
            this.getDatas()
        },
        created() {
            this.$emit('viewIn', [{
                name: '名额分配',
                url: '/college/quota_college/allocation'
            }, {
                name: '名额申请',
                url: '/college/quota_college/apply'
            }, {
                name: '名额退回',
                url: '/college/quota_college/back'
            }]);
        },
        methods: {
            showInfo: function (index, row) {
                this.prizeId = row.id
                this.detailVisible = true
            },
            handleEdit: function (index,row) {
                this.prizeId = row.id
                this.editFormVisible = true
            },
            successUpdate: function () {
                this.editFormVisible = false
                this.getDatas()
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
                this.getDatas()
            },
            handleClick: function (tab, event) {
                if (tab.name === 'school') {

                } else if (tab.name === 'college') {
                    this.getDatas()
                }
            },
            handleAddCollege: function () {
                this.addFormVisible = true
            },
            showCollegeInfo: function (index, row) {

            },
            handleCollegeSizeChange: function (val) {
                this.currentPage = val
                this.getDatas()
            },
            handleCollegeCurrentChange: function (val) {
                this.currentPageSize = val
                this.getDatas()
            },
            getDatas: function () {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    manageUnit: this.getManageUnit
                };
                this.listLoading = true;
                getAllocatedNumberPrizeListPage(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .row-bg {
        padding: 10px 0;
    }
</style>
