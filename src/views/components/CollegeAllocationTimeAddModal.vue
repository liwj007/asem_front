<template>
    <el-dialog title="评定时间" :visible.sync="addFormVisible" @close="closeModal" @open="getData"
               :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-row>
            <el-col :span="24">
                <el-form :model="addForm" label-width="150px" ref="addForm" :rules="addFormRules">
                    <el-form-item label="奖学金类型">
                        <el-radio-group v-model="scholarshipType" @change="getData">
                            <el-radio label="SCHOOL">校级及以上</el-radio>
                            <el-radio label="COLLEGE">院级</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否需要年级审核">
                        <el-radio-group v-model="needGrade" @change="getData">
                            <el-radio :label="true">需要</el-radio>
                            <el-radio :label="false">不需要</el-radio>
                        </el-radio-group>
                    </el-form-item>


                    <el-form-item label="分配奖项" prop="prizes">
                        <el-select v-model="addForm.prizes" placeholder="请选择" style=" width: 100%;"
                                   @change="changePrize">
                            <el-option
                                    v-for="item in selectPrizes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="学生开始申请时间" :required="scholarshipType === 'COLLEGE'">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.studentBeginDate"
                                            style="width: 100%;" :editable="false" :clearable="false"
                                            :picker-options="studentBeginDateOptions"
                                            :disabled="scholarshipType === 'SCHOOL'"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select placeholder="选择时间" v-model="addForm.studentBeginTime"
                                            :editable="false" :clearable="false"  style="width: 100%;"
                                            :picker-options="studentBeginTimeOptions"
                                            :disabled="scholarshipType === 'SCHOOL'"></el-time-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="学院截止提交时间" v-if="scholarshipType === 'SCHOOL'">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.collegeEndDate"
                                            style="width: 100%;" :disabled="true"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select  placeholder="选择时间" v-model="addForm.collegeEndTime"
                                            style="width: 100%;" :disabled="true"></el-time-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="学生截止申请时间" :required="true"  prop="studentEndDate">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.studentEndDate"
                                            style="width: 100%;" :editable="false" :clearable="false"
                                            :picker-options="studentEndDateOptions"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select  placeholder="选择时间" v-model="addForm.studentEndTime"
                                            style="width: 100%;" :editable="false" :clearable="false"
                                            :picker-options="studentEndTimeOptions"></el-time-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="年级截止提交时间" v-if="needGrade" :required="needGrade" prop="gradeEndDate">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.gradeEndDate"
                                            style="width: 100%;" :editable="false"
                                            :picker-options="gradeEndDateOptions"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select placeholder="选择时间" v-model="addForm.gradeEndTime"
                                            style="width: 100%;" :editable="false"
                                            :picker-options="gradeEndTimeOptions"></el-time-select>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>



        <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleClose">取消</el-button>
            <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        getSelectOfUnAllocationTime,
        allocationTime,
        getAllocatedTimeDetail,
        getManageColleges
    } from '../../api/api';
    import moment from 'moment'
    import {mapGetters} from 'vuex'
    export default {
        name: 'AllocationTimeAddModal',
        props: ['addFormVisible'],
        computed: {
            ...mapGetters([
                'getManageUnit'
            ]),
            studentBeginTimeOptions: function () {
                return {
                    start: '00:00',
                    step: '00:30',
                    end: '23:30'
                }
            },
            studentEndTimeOptions: function () {
                return {
                    start: '00:00',
                    step: '00:30',
                    end: '23:30'
                }
            },
            gradeEndTimeOptions: function () {
                return {
                    start: '00:00',
                    step: '00:30',
                    end: '23:30'
                }
            }
        },
        data() {
            let _this = this;
            var checkStudentEndDate = (rule, value, callback) => {
                if (!this.addForm.studentEndDate ||
                    this.addForm.studentEndDate===''||
                    !this.addForm.studentEndTime ||
                    this.addForm.studentEndDate==='') {
                    return callback(new Error('请输入学生截止日期和时间'));
                }
                callback();
            }
            var checkGradeEndDate = (rule, value, callback) => {
                if(this.needGrade){
                    if (!this.addForm.gradeEndDate ||
                        this.addForm.gradeEndDate===''||
                        !this.addForm.gradeEndTime ||
                        this.addForm.gradeEndDate==='') {
                        return callback(new Error('请输入年级截止日期和时间'));
                    }
                }
                callback();
            };
            var checkPrizes = (rule, value, callback) => {
                if (this.addForm.prizes.length === 0 ){
                    return callback(new Error('请选择奖学金'));
                }
                callback();
            };
            return {
                studentBeginDateOptions: {
                    disabledDate(time) {
                        if (_this.needGrade){
                            return new Date(time.toLocaleDateString()).getTime() < new Date(new Date().toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.studentEndDate).toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.gradeEndDate).toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.collegeEndDate).toLocaleDateString()).getTime();
                        } else {
                            return new Date(time.toLocaleDateString()).getTime() < new Date(new Date().toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.studentEndDate).toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.collegeEndDate).toLocaleDateString()).getTime();
                        }
                    }
                },
                studentEndDateOptions: {
                    disabledDate(time) {
                        if (_this.needGrade){
                            return new Date(time.toLocaleDateString()).getTime() < new Date(new Date().toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() < new Date(new Date(_this.addForm.studentBeginDate).toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.gradeEndDate).toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.collegeEndDate).toLocaleDateString()).getTime();
                        }else{
                            return new Date(time.toLocaleDateString()).getTime() < new Date(new Date().toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() < new Date(new Date(_this.addForm.studentBeginDate).toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.collegeEndDate).toLocaleDateString()).getTime();
                        }

                    }
                },
                gradeEndDateOptions: {
                    disabledDate(time) {
                        if (_this.needGrade){
                            return new Date(time.toLocaleDateString()).getTime() < new Date(new Date().toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() < new Date(new Date(_this.addForm.studentBeginDate).toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() < new Date(new Date(_this.addForm.gradeEndDate).toLocaleDateString()).getTime()
                                || new Date(time.toLocaleDateString()).getTime() > new Date(new Date(_this.addForm.collegeEndDate).toLocaleDateString()).getTime();
                        }
                    }
                },
                addFormRules: {
                    prizes: [
                        {validator: checkPrizes, trigger: 'change'}
                    ],
                    studentEndDate: [
                        {validator: checkStudentEndDate, trigger: 'change'}
                    ],
                    gradeEndDate: [
                        {validator: checkGradeEndDate, trigger: 'change'}
                    ]
                },
                addLoading: false,
                addForm: {
                    studentBeginDate: '',
                    studentBeginTime: '00:00',
                    studentEndDate: '',
                    studentEndTime: '00:00',
                    gradeEndDate: '',
                    gradeEndTime: '00:00',
                    collegeEndDate: '',
                    collegeEndTime: '00:00',
                    prizes: '',
                    name: '',
                    id: ''
                },
                selectPrizes: [],
                scholarshipType: 'SCHOOL',
                needGrade: true
            }
        },
        methods: {
            changePrize: function () {
                if (this.scholarshipType === 'SCHOOL' && this.addForm.prizes !== '') {
                    let para = {
                        scholarshipId:this.addForm.prizes,
                        manageUnit:this.getManageUnit
                    }
                    getAllocatedTimeDetail(para).then((res) => {
                        if(res.studentStartDate === null){
                            this.addForm.studentBeginDate = ''
                            this.addForm.studentBeginTime = ''
                        }else {
                            let tmp = this.splitDate(res.studentStartDate)
                            this.addForm.studentBeginDate = tmp[0]
                            this.addForm.studentBeginTime = tmp[1]
                        }
                        if (res.collegeEndDate === null){
                            this.addForm.collegeEndDate = ''
                            this.addForm.collegeEndTime = ''
                        }else{
                            let tmp = this.splitDate(res.collegeEndDate)
                            this.addForm.collegeEndDate = tmp[0]
                            this.addForm.collegeEndTime = tmp[1]
                        }
                    }).catch(()=>{});
                }
            },
            getData: function () {
                this.addForm.prizes = ''
                this.clearDate()
                let para = {
                    scholarshipType: this.scholarshipType,
                    needGrade: this.needGrade,
                    manageUnit:this.getManageUnit
                }
                getSelectOfUnAllocationTime(para).then((res) => {
                    this.selectPrizes = res
                }).catch(()=>{});
            },
            closeModal: function () {
                this.clearDate()
                this.addForm.prizes = ''
                this.addForm.name = ''
                this.addForm.id = ''
                this.addForm.studentEndTime = '00:00'
                this.addForm.gradeEndTime = '00:00'
                this.scholarshipType = 'SCHOOL'
                this.needGrade = true
                this.selectPrizes = []
            },
            handleClose: function () {
                this.$emit('close')
            },
            addSubmit: function () {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        let studentStart = moment(this.addForm.studentBeginDate)
                        let tmp = this.addForm.studentBeginTime.split(':')
                        studentStart.hour(tmp[0])
                        studentStart.minute(tmp[1])
                        let studentEnd = moment(this.addForm.studentEndDate)
                        tmp = this.addForm.studentEndTime.split(':')
                        studentEnd.hour(tmp[0])
                        studentEnd.minute(tmp[1])
                        if (studentStart>studentEnd){
                            this.$message({
                                message: '学生开始时间不能晚于学生截止时间',
                                type: 'error'
                            });
                            return
                        }
                        let gradeEnd =null
                        if (this.needGrade && this.addForm.gradeEndDate !== undefined
                            && this.addForm.gradeEndDate !== ''){
                            gradeEnd = moment(this.addForm.gradeEndDate)
                            tmp = this.addForm.gradeEndTime.split(':')
                            gradeEnd.hour(tmp[0])
                            gradeEnd.minute(tmp[1])
                            if (studentEnd>gradeEnd){
                                this.$message({
                                    message: '学生截止时间不能晚于年级截止时间',
                                    type: 'error'
                                });
                                return
                            }

                            if (studentStart>gradeEnd){
                                this.$message({
                                    message: '学生开始时间不能晚于年级截止时间',
                                    type: 'error'
                                });
                                return
                            }
                        }


                        let para = [{
                            scholarshipId: this.addForm.prizes,
                            studentStartDate: studentStart.format('YYYY-MM-DD HH:mm:00'),
                            studentEndDate: studentEnd.format('YYYY-MM-DD HH:mm:00'),
                            gradeEndDate: gradeEnd!==null?gradeEnd.format('YYYY-MM-DD HH:mm:00'):null,
                            manageUnit:this.getManageUnit
                        }]
                        allocationTime(para).then((res) => {
                            this.$message({
                                message: '分配成功',
                                type: 'success'
                            });
                            this.$emit('created')
                        }).catch(() => {});
                    }
                })

            },
            clearDate: function () {
                this.addForm.studentBeginDate= ''
                this.addForm.studentBeginTime= '00:00'
                this.addForm.studentEndDate= ''
                this.addForm.studentEndTime= '00:00'
                this.addForm.gradeEndDate= ''
                this.addForm.gradeEndTime= '00:00'
                this.addForm.collegeEndDate= ''
                this.addForm.collegeEndTime= '00:00'
            },
            splitDate: function (date) {
                let tmp = date.split(' ')
                return [tmp[0],tmp[1].substr(0, 5)]
            }
        }
    }
</script>