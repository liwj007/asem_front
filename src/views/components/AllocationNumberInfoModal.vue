<template>
    <el-dialog title="名额分配" :visible.sync="detailVisible" @close="closeDetail" @open="getDetail"
               :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-row style="min-height: 300px;">
            <el-form :model="detail" label-width="100px">
                <el-form-item label="奖项">
                    <span v-if="detail.prizeName!=='无'">{{detail.scholarshipName}} {{detail.prizeName}}</span>
                    <span v-else>{{detail.scholarshipName}}</span>
                </el-form-item>
                <el-form-item label="分配方法" prop="allocationMethod">
                    <el-radio-group v-model="detail.allocationMethod">
                        <el-radio label="COLLEGE" :disabled="detail.allocationMethod === 'GRADE'">按学院分配</el-radio>
                        <el-radio label="GRADE" :disabled="detail.allocationMethod === 'COLLEGE'">按年级分配</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="预留名额" prop="restNum">
                    {{detail.restNumber}}
                </el-form-item>
                <el-form-item label="分配规则">
                    <el-radio-group v-model="detail.allocationRule">
                        <el-radio label="PERCENT" :disabled="detail.allocationRule === 'AVG'">按群体人数比例分配</el-radio>
                        <el-radio label="AVG" :disabled="detail.allocationRule === 'PERCENT'">平均分配</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <el-table :data="detail.tableData" stripe style="width: 100%">
                <el-table-column type="index" width="70" label="序号">
                    <template slot-scope="scope">
                        {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                    </template>
                </el-table-column>
                <el-table-column prop="unitName" label="学院" v-if="detail.allocationMethod === 'COLLEGE'">
                </el-table-column>
                <el-table-column prop="unitName" label="年级"
                                 v-else-if="detail.allocationMethod === 'GRADE'">
                </el-table-column>
                <el-table-column prop="number" label="已分配名额">
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-row type="flex" class="page-tool" justify="center">
                <el-col :span="12">
                    <el-pagination
                            @current-change="handleInfoCurrentChange"
                            :current-page="currentPage"
                            :page-size="currentPageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="detail.list.length" style="text-align: center;">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-row>

        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        getAllocatedNumberDetail
    } from '../../api/api';
    export default {
        name: 'AllocationNumberInfoModal',
        props: ['detailVisible', 'id'],
        data() {
            return {
                detail: {
                    scholarshipName: '正在读取中，请稍等......',
                    list:[]
                },
                currentPage: 1,
                currentPageSize: 5
            }
        },
        methods: {
            handleInfoCurrentChange: function (val) {
                this.currentPage = val
                this.detail.tableData = this.detail.list.slice((this.currentPage - 1) * this.currentPageSize,
                    this.currentPage * this.currentPageSize)
            },
            getDetail: function () {
                let para = {
                    prizeId: this.id,
                }
                getAllocatedNumberDetail(para).then((res) => {
                    this.detail = res
                    this.handleInfoCurrentChange(1)
                });
            },
            closeDetail: function () {
                this.detail = {
                    scholarshipName: '正在读取中，请稍等......',
                    list:[]
                }
            },
            handleClose: function () {
                this.$emit('close');
            }
        }
    }
</script>