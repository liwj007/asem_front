<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="text" icon="arrow-left" @click="$router.go(-1)">返回 </el-button>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.name" style="width: 200px">
                        <el-option label="不限班级" value="0"></el-option>
                        <el-option label="2" value="1"></el-option>
                        <el-option label="3" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="tableData"  v-loading="listLoading" stripe  style="width: 100%" >
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="unitName" label="学院"  >
            </el-table-column>
            <el-table-column  prop="applyNumber" label="申请人数"  >
            </el-table-column>
            <el-table-column prop="availableNumber" label="可用名额" >
            </el-table-column>
            <el-table-column prop="usedNumber" label="已用名额" >
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
        getCollegePrizeForAwardCheck
    } from '../../../api/api';
    export default {
        name: 'QuotaBack',
        props: ['itemId'],
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
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDatas()
            },
            handleSizeChange(val) {
                this.currentPageSize  = val
                this.getDatas()
            },
            changeToDetail(val) {
                this.$router.push('/school/check/award/detail/' + val)
            },
            getDatas() {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    prizeId: this.$route.params.id
                };
                this.listLoading = true;
                getCollegePrizeForAwardCheck(para).then((res) => {
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