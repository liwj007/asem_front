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

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称">
            </el-table-column>
            <el-table-column prop="prizeName" label="等级">
            </el-table-column>
            <el-table-column prop="applyNumber" label="申请人数">
            </el-table-column>
            <el-table-column prop="rejectNumber" label="退回材料人数">
            </el-table-column>
            <el-table-column prop="reSubmitNumber" label="提交修改材料人数">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="changeToDetail(scope.row.prizeId)">审核材料
                    </el-button>
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

    </section>
</template>

<script>
    import {
        getFileCheckList
    } from '../../../api/api';
    import {mapGetters} from 'vuex'
    export default {
        name: 'FileCheck',
        data() {
            return {
                filters: {
                    name: ''
                },
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                listLoading: false
            }
        },
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDatas()
            },
            handleSizeChange(val) {
                this.currentPageSize = val
                this.getDatas()
            },
            changeToDetail(val) {
                this.$router.push('/scholarship/check/file/detail/' + val)
            },
            getDatas() {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;
                getFileCheckList(para).then((res) => {
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
        },
        created() {
            this.$emit('viewIn', [{
                name: '材料审核',
                url: '/scholarship/check/file'
            }, {
                name: '获奖审核',
                url: '/scholarship/check/award'
            }]);
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>