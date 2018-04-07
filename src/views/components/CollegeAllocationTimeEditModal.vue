<template>
    <el-dialog title="评定时间" :visible.sync="editFormVisible" @close="closeModal" @open="getDetail"
               :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-row>
            <el-col :span="24">
                <el-form :model="addForm" label-width="150px" ref="addForm">

                    <el-form-item label="分配奖项" prop="prizes">
                        {{addForm.scholarshipName}}
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
                                            :editable="false" :clearable="false" style="width: 100%;"
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
                            <el-time-select placeholder="选择时间" v-model="addForm.collegeEndTime"
                                            style="width: 100%;" :disabled="true"></el-time-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="学生截止申请时间" :required="true">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.studentEndDate"
                                            style="width: 100%;" :editable="false" :clearable="false"
                                            :picker-options="studentEndDateOptions"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select type="fixed-time" placeholder="选择时间" v-model="addForm.studentEndTime"
                                            style="width: 100%;" :editable="false" :clearable="false"
                                            :picker-options="studentEndTimeOptions"></el-time-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="年级截止提交时间" v-if="needGrade">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.gradeEndDate"
                                            style="width: 100%;" :editable="false"
                                            :picker-options="gradeEndDateOptions"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select type="fixed-time" placeholder="选择时间" v-model="addForm.gradeEndTime"
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
        updateAllocationTime,
        getAllocatedTimeDetail
    } from '../../api/api';
    import moment from 'moment'
    import {mapGetters} from 'vuex'
    export default {
        name: 'AllocationTimeAddModal',
        props: ['editFormVisible', 'scholarshipId'],
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
                addLoading: false,
                addForm: {
                    studentBeginDate: '',
                    studentBeginTime: '',
                    studentEndDate: '',
                    studentEndTime: '',
                    gradeEndDate: '',
                    gradeEndTime: '',
                    collegeEndDate: '',
                    collegeEndTime: '',
                    scholarshipName: '',
                    scholarshipType: '',
                    needGrade: true,
                    id: ''
                },
                selectPrizes: [],
                scholarshipType: 'SCHOOL',
                needGrade: true
            }
        },
        methods: {
            getDetail: function () {
                let para = {
                    scholarshipId: this.scholarshipId,
                    manageUnit: this.getManageUnit
                }
                getAllocatedTimeDetail(para).then((res) => {
                    let stuStart = res.studentStartDate
                    let tmp = stuStart.split(' ')
                    let stuStartDate = tmp[0]
                    let stuStartTime = tmp[1].substr(0, 5)

                    let collegeEndDate = ''
                    let collegeEndTime = ''
                    if (res.scholarshipType === 'SCHOOL'){
                        let collegeEnd = res.collegeEndDate
                        tmp = collegeEnd.split(' ')
                         collegeEndDate = tmp[0]
                         collegeEndTime = tmp[1].substr(0, 5)
                    }

                    let stuEnd = res.studentEndDate
                    tmp = stuEnd.split(' ')
                    let studentEndDate = tmp[0]
                    let studentEndTime = tmp[1].substr(0, 5)

                    let gradeEnd = res.gradeEndDate
                    let gradeEndDate = ''
                    let gradeEndTime = ''
                    if (gradeEnd !== null) {
                        tmp = gradeEnd.split(' ')
                        gradeEndDate = tmp[0]
                        gradeEndTime = tmp[1].substr(0, 5)
                    }


                    this.addForm = {
                        studentBeginDate: stuStartDate,
                        studentBeginTime: stuStartTime,
                        collegeEndDate: collegeEndDate,
                        collegeEndTime: collegeEndTime,
                        studentEndDate: studentEndDate,
                        studentEndTime: studentEndTime,
                        gradeEndDate: gradeEndDate,
                        gradeEndTime: gradeEndTime,
                        scholarshipName: res.scholarshipName,
                        id: res.id
                    }
                    this.needGrade = res.needGrade
                    this.scholarshipType = res.scholarshipType

                }).catch(() => {
                });
            },
            closeModal: function () {
                this.clearDate()
                this.addForm.scholarshipName = ''
            },
            handleClose: function () {
                this.$emit('close')
            },
            addSubmit: function () {
                console.log(this.addForm.gradeEndDate)
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
                let gradeEnd = null
                if (this.needGrade && this.addForm.gradeEndDate !== undefined
                    && this.addForm.gradeEndDate !== '') {
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

                let para = {
                    scholarshipId: this.scholarshipId,
                    studentStartDate: studentStart.format('YYYY-MM-DD HH:mm:00'),
                    studentEndDate: studentEnd.format('YYYY-MM-DD HH:mm:00'),
                    gradeEndDate: gradeEnd !== null ? gradeEnd.format('YYYY-MM-DD HH:mm:00') : null,
                    id: this.addForm.id
                }
                updateAllocationTime(para).then((res) => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.$emit('updated')
                }).catch(() => {
                });
            },
            clearDate: function () {
                this.addForm.studentBeginDate = ''
                this.addForm.studentBeginTime = ''
                this.addForm.studentEndDate = ''
                this.addForm.studentEndTime = ''
                this.addForm.gradeEndDate = ''
                this.addForm.gradeEndTime = ''
                this.addForm.collegeEndDate = ''
                this.addForm.collegeEndTime = ''
            },
            splitDate: function (date) {
                let tmp = date.split(' ')
                return [tmp[0], tmp[1].substr(0, 5)]
            }
        }
    }
</script>