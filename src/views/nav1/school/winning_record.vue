<template>
    <section>
        <!--&lt;!&ndash;工具条&ndash;&gt;-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">-->

        <!--</el-col>-->

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="70" label="序号">
                <template scope="scope">
                    {{(scope.$index + 1) + (currentPage - 1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="year" label="学年">
            </el-table-column>
            <el-table-column prop="name" label="奖学金名称">
            </el-table-column>
            <el-table-column prop="awardNumber" label="获奖人数">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="changeToDetail(scope.row)">查看</el-button>
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
        getScholarshipsOfAward
    } from '../../../api/api';

    export default {
        name: 'WinningRecord',
        data() {
            return {
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
                this.currentPageSize = val
                this.getDatas()
            },
            getDatas: function (val) {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;
                getScholarshipsOfAward(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error) => {
                    this.listLoading = false;
                });
            },
            changeToDetail: function (item) {
                this.$router.push('/school/winning_record_detail/' + item.id)
            }
        },
        created() {
            this.$emit('viewIn', [{
                name: '获奖记录',
                url: '/school/winning_record'
            }]);
        },
        mounted() {
            this.getDatas()
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>