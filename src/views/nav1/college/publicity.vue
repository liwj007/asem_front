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
            <el-table-column prop="prizeName" label="等级">
                <template slot-scope="scope">
                    <span v-if="scope.row.prizeName!==''">{{scope.row.prizeName}}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="sn" label="学号">
            </el-table-column>
            <el-table-column prop="collegeName" label="学院">
            </el-table-column>
            <el-table-column prop="majorName" label="专业">
            </el-table-column>
            <el-table-column prop="gradeName" label="年级">
            </el-table-column>
            <el-table-column prop="className" label="班级">
            </el-table-column>
            <el-table-column prop="records" label="获奖数">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" v-if="scope.row.records.length>0">
                        <p v-for="item in scope.row.records">
                            {{item}}
                        </p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.records.length }}</el-tag>
                        </div>
                    </el-popover>
                    <!--<el-tag v-else>0</el-tag>-->
                </template>
            </el-table-column>
            <el-table-column prop="documents" label="申请材料">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showDetail(scope.row.applicationId)" v-if="scope.row.applicationId !== null">查看</el-button>
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

        <ApplicationInfoModal :infoVisible="infoVisible" :id="applicationId"
                              @close="closeInfoModal">
        </ApplicationInfoModal>
    </section>
</template>

<script>
    import {
        getMangePublicityDetailList
    } from '../../../api/api';
    import {mapGetters} from 'vuex'
    import ApplicationInfoModal from '../../components/ApplicationInfoModal.vue'
    export default {
        name: 'PublicityScholarshipDetailList',
        components: {ApplicationInfoModal},
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            return {
                infoVisible: false,
                applicationId: '',
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                listLoading: false
            }
        },
        methods: {
            showDetail: function (id) {
                this.applicationId = id
                this.infoVisible = true
            },
            closeInfoModal: function () {
                this.infoVisible = false
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
                    manageUnit:this.getManageUnit,
                    publicityId: this.$route.params.id
                };
                this.listLoading = true;
                getMangePublicityDetailList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            }

        },
        created (){

        },
        mounted() {
            this.getDatas()
        }
    }

</script>

<style scoped lang="scss">

</style>