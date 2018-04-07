<template>
    <section>


        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%" >
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


    </section>
</template>

<script>
    import {
        getCollegeMangePublicityList
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
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                listLoading: false
            }
        },
        methods: {
            showDetail: function (id) {
                this.$router.push('/scholarship/publicity_detail/' + id)
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
                    manageUnit:this.getManageUnit
                };
                this.listLoading = true;
                getCollegeMangePublicityList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            }

        },
        created (){
            this.$emit('viewIn',[{
                name: '奖学金公示',
                url: '/scholarship/publicity_list'
            },{
                name: '异议反馈',
                url: '/scholarship/publicity_objection'
            }]);
        },
        mounted() {
            this.getDatas()
            this.$emit('activeTab', '1');
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>