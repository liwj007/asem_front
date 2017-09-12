<template>
    <section>
        <!--工具条-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">-->
            <!--<el-form :inline="true" :model="filters">-->

                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.major" style="width: 120px;">-->
                        <!--<el-option label="不限专业" value="0"></el-option>-->
                        <!--<el-option label="专业1" value="1"></el-option>-->
                        <!--<el-option label="专业2" value="2"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.grade" style="width: 120px;">-->
                        <!--<el-option label="不限年级" value="0"></el-option>-->
                        <!--<el-option label="年级1" value="1"></el-option>-->
                        <!--<el-option label="年级2" value="2"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.className" style="width: 120px;">-->
                        <!--<el-option label="不限班级" value="0"></el-option>-->
                        <!--<el-option label="班级1" value="1"></el-option>-->
                        <!--<el-option label="班级2" value="2"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.submitStatus" style="width: 120px;">-->
                        <!--<el-option label="不限奖学金" value="0"></el-option>-->
                        <!--<el-option label="xxx" value="1"></el-option>-->
                        <!--<el-option label="xxx" value="2"></el-option>-->
                        <!--<el-option label="xxxx" value="3"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.checkStatus" style="width: 150px;">-->
                        <!--<el-option label="不限奖学金等级" value="0"></el-option>-->
                        <!--<el-option label="1" value="1"></el-option>-->
                        <!--<el-option label="2" value="2"></el-option>-->
                        <!--<el-option label="3" value="3"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-input v-model="filters.name" placeholder="学号或姓名"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-button type="primary" v-on:click="">查询</el-button>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
        <!--</el-col>-->

        <el-table :data="tableData" v-loading="listLoading" stripe style="width: 100%" >
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="scholarshipName" label="奖学金名称">
            </el-table-column>
            <el-table-column prop="prizeName" label="等级">
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
                            <el-tag>{{ scope.row.records.length }}</el-tag>
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
            <el-button type="primary" @click="$router.push('/school/check/award/publicity_manage')" :disabled="tableData.length===0">下一步</el-button>


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
        getSchoolPublicityList
    } from '../../../api/api';
    import {mapGetters} from 'vuex'
    import ApplicationInfoModal from '../../components/ApplicationInfoModal.vue'

    export default {
        name: 'AwardCheckPublicity',
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
                filters: {
                    name: '',
                    college: '0',
                    major: '0',
                    grade: '0',
                    className: '0',
                    submitStatus: '0',
                    checkStatus: '0'
                },
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
                    pageSize: this.currentPageSize
                };
                this.listLoading = true;
                getSchoolPublicityList(para).then((res) => {
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