<template>
    <!--更新-->
    <el-dialog title="评定时间" :visible.sync="editFormVisible" @close="closeModal" @open="getDetail"
               :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-row>
            <el-col :span="24">
                <el-form :model="addForm" label-width="150px" ref="addForm">
                    <el-form-item label="分配奖项">
                        {{addForm.scholarshipName}}
                    </el-form-item>
                    <el-form-item label="学生开始申请时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.stuStartDate"
                                            :picker-options="stuDateOptions" style="width: 100%;"
                                            :editable="false" :clearable="false" @change=""></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select placeholder="选择时间" v-model="addForm.stuStartTime"
                                            :editable="false" :clearable="false"
                                            style="width: 100%;" :picker-options="stuTimeOptions"></el-time-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="学院截止提交时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.collegeEndDate"
                                            :picker-options="collegeDateOptions" :editable="false"
                                            :clearable="false"  style="width: 100%;" @change=""></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select placeholder="选择时间" v-model="addForm.collegeEndTime"
                                            :editable="false" :clearable="false"
                                            :picker-options="collegeTimeOptions"
                                            style="width: 100%;"></el-time-select>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleClose">取消</el-button>
            <el-button type="primary" @click="editSubmit" :loading="addLoading">提交</el-button>
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
        name: 'AllocationTimeEditModal',
        props: ['editFormVisible','scholarshipId'],
        computed: {
            ...mapGetters([
                'getManageUnit'
            ]),
            collegeTimeOptions: function () {
                if (new Date(this.addForm.stuStartDate).getTime() === new Date(this.addForm.collegeEndDate).getTime()) {
                    return {
                        start: this.addForm.stuStartTime,
                        step: '00:30',
                        end: '23:30'
                    }
                } else {
                    return {
                        start: '00:00',
                        step: '00:30',
                        end: '23:30'
                    }
                }
            },
            stuTimeOptions: function () {
                if (new Date(this.addForm.stuStartDate).getTime() === new Date(this.addForm.collegeEndDate).getTime()) {
                    return {
                        start: '00:00',
                        step: '00:30',
                        end: this.addForm.collegeEndTime
                    }
                } else {
                    return {
                        start: '00:00',
                        step: '00:30',
                        end: '23:30'
                    }
                }
            }
        },
        data() {
            let _this = this;
            return {
                stuDateOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7 || time.getTime() > new Date(_this.addForm.collegeEndDate).getTime() ;
                    }
                },
                collegeDateOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7 || time.getTime() < new Date(_this.addForm.stuStartDate).getTime()- 8.64e7 ;
                    }
                },
                addLoading: false,
                addForm: {
                    stuStartDate: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),
                    stuStartTime: '00:00',
                    collegeEndDate: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime() + 8.64e7 * 7,
                    collegeEndTime: '00:00',
                    scholarshipName: '',
                    scholarshipId: ''
                }
            }
        },
        methods: {
            editSubmit: function () {
                let studentStart = moment(this.addForm.stuStartDate)
                let tmp = this.addForm.stuStartTime.split(':')
                studentStart.hour(tmp[0])
                studentStart.minute(tmp[1])
                let collegeEnd = moment(this.addForm.collegeEndDate)
                tmp = this.addForm.collegeEndTime.split(':')
                collegeEnd.hour(tmp[0])
                collegeEnd.minute(tmp[1])
                if (studentStart>collegeEnd){
                    this.$message({
                        message: '学生开始时间不能晚于学院截止时间',
                        type: 'error'
                    });
                    return
                }
                let para = {
                    scholarshipId: this.addForm.scholarshipId,
                    studentStartDate: studentStart.format('YYYY-MM-DD HH:mm:00'),
                    collegeEndDate: collegeEnd.format('YYYY-MM-DD HH:mm:00')
                }
                updateAllocationTime(para).then((res) => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.$emit('updated')
                }).catch(()=>{});
            },
            closeModal: function () {
                this.addForm = {
                    stuStartDate: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),
                    stuStartTime: '00:00',
                    collegeEndDate: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime() + 8.64e7 * 7,
                    collegeEndTime: '00:00',
                    scholarshipName: '',
                    scholarshipId: ''
                }
            },
            handleClose: function () {
                this.$emit('close')
            },
            getDetail: function () {
                let para = {
                    scholarshipId: this.scholarshipId,
                    manageUnit:this.getManageUnit
                }
                getAllocatedTimeDetail(para).then((res) => {
                    let stuStart = res.studentStartDate
                    let tmp = stuStart.split(' ')
                    let stuStartDate = tmp[0]
                    let stuStartTime = tmp[1].substr(0, 5)

                    let collegeEnd = res.collegeEndDate
                    tmp = collegeEnd.split(' ')
                    let collegeEndDate = tmp[0]
                    let collegeEndTime = tmp[1].substr(0, 5)
                    this.addForm = {
                        stuStartDate: stuStartDate,
                        stuStartTime: stuStartTime,
                        collegeEndDate: collegeEndDate,
                        collegeEndTime: collegeEndTime,
                        scholarshipId: res.scholarshipId,
                        scholarshipName: res.scholarshipName
                    }
                    console.log(this.addForm)

                }).catch(()=>{});
            },
        }
    }
</script>