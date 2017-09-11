<template>
	<section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-select v-model="filters.year" placeholder="请选择" style=" width: 100%;">
                        <el-option
                                v-for="item in years"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDatas">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="sn" label="学号">
            </el-table-column>
            <el-table-column prop="majorTotal" label="专业人数">
            </el-table-column>
            <el-table-column prop="overallScore" label="综合得分">
            </el-table-column>
            <el-table-column prop="overallRank" label="综合排名">
            </el-table-column>
            <el-table-column prop="intellectualScore" label="智育得分">
            </el-table-column>
            <el-table-column prop="intellectualRank" label="智育排名">
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
        getComprehensiveEvaluationList,
        getYearSelections
    } from '../../api/api';
    export default {
        name: 'ComprehensiveEvaluation',

        data() {
            return {
                filters: {
                    year: ''
                },
                years: [],
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 1,
                listLoading: false,
                files: []
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
            getDatas: function () {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    year: this.filters.year
                };
                this.listLoading = true;
                getComprehensiveEvaluationList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            }
        },
        created() {
            this.$emit('viewIn', [{
                name: '综合测评',
                url: '/student/evaluation'
            }]);
        },
        mounted() {
            getYearSelections().then((res) => {
                this.years = res;
                if (this.years.length>0) {
                    this.filters.year = this.years[0].id
                    this.getDatas()
                }
            }).catch((error)=>{
            });
        }
    }
</script>