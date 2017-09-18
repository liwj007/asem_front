<template>
    <el-dialog title="评定时间" v-model="addFormVisible" @close="closeModal" @open="getData"
               :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" size="tiny">
        <el-row>
            <el-col :span="24">
                <el-form :model="addForm" label-width="150px" ref="addForm" :rules="addFormRules">
                    <el-form-item label="分配奖项" prop="prizes" :required="true">
                        <el-select v-model="addForm.prizes" multiple placeholder="请选择" style=" width: 100%;">
                            <el-option
                                    v-for="item in selectPrizes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学生开始申请时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.stuStartDate"
                                            :picker-options="stuDateOptions" style="width: 100%;"
                                            :editable="false" :clearable="false"></el-date-picker>
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
                                            :clearable="false" :default-value="addForm.stuStartDate"
                                            style="width: 100%;"></el-date-picker>
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
            <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        getSelectOfUnAllocationTime,
        allocationTime
    } from '../../api/api';
    import moment from 'moment'
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

    export default {
        components: {ElFormItem},
        name: 'AllocationTimeAddModal',
        props: ['addFormVisible'],
        computed: {
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
            var checkPrizes = (rule, value, callback) => {
                if (!value || value.length === 0) {
                    return callback(new Error('请选择奖学金'));
                }
                callback();
            };
            return {
                addFormRules: {
                    prizes: [
                        {validator: checkPrizes, trigger: 'change'}
                    ]
                },
                stuDateOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7 || time.getTime() > new Date(_this.addForm.collegeEndDate).getTime();
                    }
                },
                collegeDateOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7 || time.getTime() < new Date(_this.addForm.stuStartDate).getTime() - 8.64e7;
                    }
                },
                addLoading: false,
                addForm: {
                    stuStartDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                    stuStartTime: '00:00',
                    collegeEndDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() + 8.64e7 * 7,
                    collegeEndTime: '00:00',
                    prizes: [],
                    name: '',
                    id: ''
                },
                selectPrizes: []
            }
        },
        methods: {
            getData: function () {
                getSelectOfUnAllocationTime().then((res) => {
                    this.selectPrizes = res
                });
            },
            closeModal: function () {
                this.addForm = {
                    stuStartDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                    stuStartTime: '00:00',
                    collegeEndDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() + 8.64e7 * 7,
                    collegeEndTime: '00:00',
                    prizes: [],
                    name: '',
                    id: ''
                }
                this.selectPrizes = []
            },
            handleClose: function () {
                this.$emit('close')
            },
            addSubmit: function () {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        let studentStart = moment(this.addForm.stuStartDate)
                        let tmp = this.addForm.stuStartTime.split(':')
                        studentStart.hour(tmp[0])
                        studentStart.minute(tmp[1])
                        let collegeEnd = moment(this.addForm.collegeEndDate)
                        tmp = this.addForm.collegeEndTime.split(':')
                        collegeEnd.hour(tmp[0])
                        collegeEnd.minute(tmp[1])
                        if (studentStart > collegeEnd) {
                            this.$message({
                                message: '学生开始时间不能晚于学院截止时间',
                                type: 'error'
                            });
                            return
                        }
                        let list = []
                        for (let index in this.addForm.prizes) {
                            list.push({
                                scholarshipId: this.addForm.prizes[index],
                                studentStartDate: studentStart.format('YYYY-MM-DD HH:mm:00'),
                                collegeEndDate: collegeEnd.format('YYYY-MM-DD HH:mm:00')
                            })
                        }
                        let para = list
                        allocationTime(para).then((res) => {
                            this.$message({
                                message: '分配成功',
                                type: 'success'
                            });
                            this.$emit('created')
                        }).catch(() => {
                        })
                    } else {
                        return false
                    }
                })

            }
        }
    }
</script>