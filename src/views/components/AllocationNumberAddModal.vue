<template>
    <el-dialog title="名额分配" v-model="formVisible" :close-on-click-modal="false"
               :show-close="false" :close-on-press-escape="false"
               @close="cancelAdd" @open="getSelections">
        <el-row style="min-height: 300px;">
            <el-col :span="4" :offset="1">
                <el-steps :space="150" :active="active" finish-status="success" direction="vertical">
                    <el-step title="分配规则确认"></el-step>
                    <el-step title="分配名额调整"></el-step>
                </el-steps>
            </el-col>
            <el-col :span="19">
                <div v-if="active === 0">
                    <el-form :model="addForm" label-width="100px" ref="addForm">
                        <el-form-item label="分配奖项" prop="prizes">
                            <el-select v-model="addForm.prizes" multiple placeholder="请选择" style="width: 500px;"
                            @change="selectPrize">
                                <el-option
                                        v-for="item in selectPrizes"
                                        :key="item.id"
                                        :label="item.fullName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分配方法" prop="allocationMethod">
                            <el-radio-group v-model="allocationMethod">
                                <el-radio label="COLLEGE" :disabled="unitType==='COLLEGE'">按学院分配</el-radio>
                                <el-radio label="GRADE" :disabled="unitType==='SCHOOL'">按年级分配</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="预留名额" prop="restNum">
                            <el-input-number v-model="addForm.restNum" :min="0" :max="maxRestNum"></el-input-number>
                        </el-form-item>
                        <el-form-item label="分配规则">
                            <el-radio-group v-model="addForm.allocationRule">
                                <el-radio label="PERCENT">按群体人数比例分配</el-radio>
                                <el-radio label="AVG">平均分配</el-radio>
                            </el-radio-group>
                        </el-form-item>

                    </el-form>
                </div>
                <div v-else-if="active === 1">
                    <el-table :data="tmpData" stripe style="width: 100%">
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
                        <el-table-column prop="unitName" label="学院" v-if="allocationMethod === 'COLLEGE'">
                        </el-table-column>
                        <el-table-column prop="unitName" label="年级"
                                         v-else-if="allocationMethod === 'GRADE'">
                        </el-table-column>
                        <el-table-column prop="number" label="分配名额(候选)">
                            <template scope="scope">
                                <el-input-number size="small" v-model="scope.row.number" :step="1" :min="0"
                                                 :max="scope.row.max"></el-input-number>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--工具条-->
                    <el-row type="flex" class="page-tool" justify="center">
                        <el-col :span="12">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-sizes="[currentPageSize]"
                                    :page-size="currentPageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="total">
                            </el-pagination>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
            <el-button style="margin-top: 12px;" @click.native="active = 0" :disabled="active === 0">上一步</el-button>
            <el-button style="margin-top: 12px;" @click="nextStep" :disabled="active === 1 || this.addForm.prizes.length<=0 ">下一步</el-button>
            <el-button @click="closeModal">取消</el-button>
            <el-button type="primary" @click="addSubmit" :loading="addLoading" :disabled="active === 0">提交
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        getUnAllocationNumberPrizeForSelect,
        getUnitForAllocation,
        allocationNumber
    } from '../../api/api';

    import {mapGetters} from 'vuex'
    export default {
        name: 'AllocationNumberModal',
        props: ['formVisible',"unitType"],
        computed: {
            allocationMethod:{
                get:function(){
                    if (this.unitType === 'SCHOOL'){
                        return 'COLLEGE'
                    } else if (this.unitType === 'COLLEGE') {
                        return 'GRADE'
                    }
                },
                set:function(value){

                }
            },
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            return {
                maxRestNum: 20,
                currentPage: 1,
                currentPageSize: 5,
                total: 0,
                active: 0,
                addForm: {
                    restNum: 0,
                    allocationRule: 'PERCENT',
                    prizes: []
                },
                selectPrizes: [],
                allocationData: [],
                tmpData: [],
                prizesMap: {},
                addLoading: false
            }
        },
        methods: {
            selectPrize: function () {
                this.maxRestNum = Infinity
                let items = this.addForm.prizes
                for (let index in items){
                    let id = items[index]
                    if (this.prizesMap[id].number < this.maxRestNum) {
                        this.maxRestNum = this.prizesMap[id].number
                    }
                }
                if (this.addForm.restNum > this.maxRestNum) {
                    this.addForm.restNum = this.maxRestNum
                }
            },
            cancelAdd: function () {
                this.prizesMap = {}
                this.addForm = {
                    restNum: 0,
                    allocationRule: 'PERCENT',
                    prizes: []
                }
                this.allocationData=[]
                this.active = 0
            },
            handleSizeChange: function (val) {
                this.currentPageSize = val;
                this.tmpData = this.allocationData.slice((this.currentPage - 1) * this.currentPageSize,
                    this.currentPage * this.currentPageSize)
            },
            handleCurrentChange: function (val) {
                this.currentPage = val
                this.tmpData = this.allocationData.slice((this.currentPage - 1) * this.currentPageSize,
                    this.currentPage * this.currentPageSize)
            },
            nextStep: function () {
                this.active = 1
                this.allocationData = []
                getUnitForAllocation({
                    type: this.unitType
                }).then((res) => {
                    let units = res
                    for (let index in this.addForm.prizes) {
                        let tmp = this.prizesMap[this.addForm.prizes[index]]
                        //循环单位
                        if (this.addForm.allocationRule === 'AVG') {
                            let total = units.length
                            let number = Math.floor((tmp.number - this.addForm.restNum) / total)
                            for (let idx in units) {
                                let unit = units[idx]

                                this.allocationData.push({
                                    prizeId: tmp.id,
                                    scholarshipId: tmp.scholarshipId,
                                    unitId: unit.id,
                                    scholarshipName: tmp.scholarshipName,
                                    prizeName: tmp.prizeName,
                                    unitName: unit.name,
                                    number: number,
                                    max: tmp.number - this.addForm.restNum
                                })
                            }
//                            tmp.restNum = tmp.number - number * units.length
                        } else if (this.addForm.allocationRule === 'PERCENT') {
                            let userTotalNumber = 0
                            for (let idx in units) {
                                let unit = units[idx]
                                userTotalNumber += unit.number
                            }
                            let number = (tmp.number - this.addForm.restNum) / userTotalNumber
                            let usedNum = 0
                            for (let idx in units) {
                                let unit = units[idx]
                                let num = Math.floor(number * unit.number)
                                this.allocationData.push({
                                    prizeId: tmp.id,
                                    unitId: unit.id,
                                    scholarshipId: tmp.scholarshipId,
                                    scholarshipName: tmp.scholarshipName,
                                    prizeName: tmp.prizeName,
                                    unitName: unit.name,
                                    number: num,
                                    max: tmp.number - this.addForm.restNum
                                })
                                usedNum += num
                            }
//                            tmp.restNum = tmp.number - usedNum
                        }

                    }
                    this.currentPage = 0
                    this.total = this.allocationData.length
                    this.tmpData = this.allocationData.slice(0, 5)

                }).catch(()=>{});
            },
            addSubmit: function () {
                let list = []
                for (let index in this.allocationData) {
                    let tmp = this.allocationData[index]
                    list.push({
                        prizeId: tmp.prizeId,
                        unitId: tmp.unitId,
                        number: tmp.number
                    })
                }
                let para = {
                    restNumber: this.addForm.restNum,
                    allocationRule: this.addForm.allocationRule,
                    allocationMethod: this.allocationMethod,
                    list: list
                }
                allocationNumber(para).then((res) => {
                    this.$message({
                        message: '分配成功',
                        type: 'success'
                    });
                    this.$emit('created');

                }).catch(()=>{});
            },
            closeModal: function () {
                this.$emit('close');
            },
            getSelections: function () {
                let para = {
                    manageUnit: this.getManageUnit,
                }
                getUnAllocationNumberPrizeForSelect(para).then((res) => {
                    if (res !== null){
                        this.selectPrizes = res
                        this.prizesMap = {}
                        let data = res
                        for (let index in data) {
                            let tmp = data[index]
                            this.prizesMap[tmp.id] = {
                                scholarshipName: tmp.scholarshipName,
                                prizeName: tmp.prizeName,
                                money: tmp.money,
                                number: tmp.number,
                                id: tmp.id,
                                scholarshipId: tmp.scholarshipId
                            }
                        }
                    }
                }).catch(()=>{})
            }
        }
    }
</script>