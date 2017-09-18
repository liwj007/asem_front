<template>
    <section>
        <FixCollegeSearchBar @search="search" :collegeId="getManageUnit">
            <template slot="other">
                <el-form-item>
                    <el-select v-model="filters.scholarshipId" style="width: 150px;" @change="getPrizes">
                        <el-option
                                v-for="item in scholarships"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.prizeId" style="width: 150px;">
                        <el-option
                                v-for="item in prizes"
                                :key="item.id"
                                :label="item.prizeName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
        </FixCollegeSearchBar>

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%" >
            <el-table-column type="index" width="70" label="序号">
                <template scope="scope">
                    {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                </template>
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称">
            </el-table-column>
            <el-table-column prop="prizeName" label="等级">
                <template scope="scope">
                    <span v-if="scope.row.prizeName!==''">{{scope.row.prizeName}}</span>
                    <span v-else>无</span>
                </template>
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
            <el-table-column prop="records" label="获奖数">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p v-for="item in scope.row.records">
                            {{item}}
                        </p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.records===null?0:scope.row.records.length }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="documents" label="申请材料">
                <template scope="scope">
                    <el-button type="text" size="small" @click="showDetail(scope.row.applicationId)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="primary" @click="$router.push('/scholarship/check/award/publicity_manage')" :disabled="tableData.length===0">下一步</el-button>


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
        getCollegePublicityList,
        getCollegePublicityScholarshipList,
        getPrizesByScholarship
    } from '../../../api/api';
    import {mapGetters} from 'vuex'
    import ApplicationInfoModal from '../../components/ApplicationInfoModal.vue'
    import FixCollegeSearchBar from  '../../components/FixCollegeSearch.vue'
    export default {
        name: 'AwardCheckPublicity',
        components: {ApplicationInfoModal,FixCollegeSearchBar},
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            return {
                infoVisible: false,
                applicationId: '',
                filters: {
                    content: '',
                    collegeId: '0',
                    majorId: '0',
                    gradeId: '0',
                    classId: '0',
                    scholarshipId: '',
                    prizeId: ''
                },
                currentPage: 1,
                currentPageSize: 10,
                tableData: [],
                total: 0,
                listLoading: false,
                scholarships: [],
                prizes: []
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
            search: function (val) {
                this.filters.collegeId = val.collegeId
                this.filters.majorId = val.majorId
                this.filters.gradeId = val.gradeId
                this.filters.classId = val.classId
                this.filters.content = val.content
                this.getDatas()
            },
            getDatas: function (val) {
                let para = {
                    pageNum: this.currentPage,
                    pageSize: this.currentPageSize,
                    manageUnit:this.getManageUnit,
                    collegeId: this.filters.collegeId,
                    majorId: this.filters.majorId,
                    gradeId: this.filters.gradeId,
                    classId: this.filters.classId,
                    content: this.filters.content,
                    prizeId: this.filters.prizeId,
                    scholarshipId: this.filters.scholarshipId
                };
                this.listLoading = true;
                getCollegePublicityList(para).then((res) => {
                    this.total = res.total;
                    this.tableData = res.list===null?[]:res.list;
                    this.listLoading = false;
                }).catch((error)=>{
                    this.listLoading = false;
                });
            },
            getScholarships() {
                let para = {
                    manageUnit: this.getManageUnit
                };
                getCollegePublicityScholarshipList(para).then((res) => {
                    this.scholarships = res;
                    this.scholarships.splice(0, 0, {
                        "id": 0,
                        "name": "不限奖学金"
                    })
                    this.filters.scholarshipId = 0
                }).catch((error) => {
                    this.listLoading = false;
                });
            },
            getPrizes: function () {
                let para = {
                    scholarshipId: this.filters.scholarshipId
                };
                getPrizesByScholarship(para).then((res) => {
                    this.prizes = res;
                    this.prizes.splice(0, 0, {
                        "id": 0,
                        "prizeName": "不限奖学金等级"
                    })
                    this.filters.prizeId = 0
                }).catch((error) => {
                    this.listLoading = false;
                });
            }
        },

        mounted() {
            this.getDatas()
            this.getScholarships()
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>