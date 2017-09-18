<template>
    <el-dialog title="名额分配" v-model="editFormVisible"  @close="closeModal" @open="getDetail"
               :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-row style="min-height: 300px;">
            <el-form :model="detail" label-width="100px" ref="editForm">
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
                <el-form-item label="预留名额" prop="restNumber">
                    <el-input-number v-model="detail.restNumber" :min="0" :max="detail.number"
                                     @change="changeNumber"></el-input-number>
                </el-form-item>
                <el-form-item label="分配规则">
                    <el-radio-group v-model="detail.allocationRule" @change="changeNumber">
                        <el-radio label="PERCENT">按群体人数比例分配</el-radio>
                        <el-radio label="AVG">平均分配</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <el-table :data="detail.tableData" stripe style="width: 100%">
                <el-table-column type="index" width="70" label="序号">
                    <template scope="scope">
                        {{(scope.$index+1)+ (currentPage -1) * currentPageSize}}
                    </template>
                </el-table-column>
                <el-table-column prop="unitName" label="学院">
                </el-table-column>
                <el-table-column prop="number" label="分配名额(候选)">
                    <template scope="scope">
                        <el-input-number size="small" v-model="scope.row.number" :step="1" :min="0"
                                         :max="scope.row.max">
                        </el-input-number>
                    </template>
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
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="editSubmit">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        getAllocatedNumberDetail,
        updateAllocationNumberAward
    } from '../../api/api';

    export default {
        name: 'AllocationNumberEditModal',
        props: ['editFormVisible', 'id'],
        data() {
            return {
                detail: {
                    list: []
                },
                currentPage: 1,
                currentPageSize: 5,
                isLoaded: false
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
                    prizeId: this.id
                }
                getAllocatedNumberDetail(para).then((res) => {
                    this.detail = res
                    this.isLoaded = false
                    this.handleInfoCurrentChange(1)
                }).catch(()=>{});
            },
            closeModal: function () {
                this.detail = {
                    list:[]
                }
            },
            handleClose: function () {
                this.$emit('close');
            },
            editSubmit: function () {
                let para = this.detail
                updateAllocationNumberAward(para).then((res) => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.$emit('updated');
                }).catch(()=>{});
            },
            changeNumber: function () {
                if (this.isLoaded === true){
                    let availableNumber = this.detail.number - this.detail.restNumber
                    if (this.detail.allocationRule === 'AVG'){
                        let total = this.detail.list.length
                        let number = Math.floor(availableNumber / total);
                        for (let index in this.detail.list){
                            let unit = this.detail.list[index]
                            unit.number = number
                        }
                    }else if (this.detail.allocationRule == 'PERCENT'){
                        let userTotalNumber = 0
                        for (let index in this.detail.list){
                            let unit = this.detail.list[index]
                            userTotalNumber += unit.unitNumber
                        }
                        let number = availableNumber / userTotalNumber
                        for (let index in this.detail.list){
                            let unit = this.detail.list[index]
                            unit.number = Math.floor(number * unit.unitNumber)
                        }
                    }
                }else {
                    this.isLoaded = true
                }

            }
        }
    }
</script>