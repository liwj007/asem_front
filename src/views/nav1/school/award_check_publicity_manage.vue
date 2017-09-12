<template>
    <section>
        <el-form ref="form" :model="form" label-width="130px" :rules="addFormRules">
            <el-form-item label="公示奖学金">
                <el-select v-model="form.awards" multiple placeholder="请选择" style="width: 700px;">
                    <el-option
                            v-for="item in scholarships"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公示范围">
                <el-radio-group v-model="form.scale">
                    <el-radio label="school" >学校公示</el-radio>
                    <el-radio label="college" :disabled="true">学院公示</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="公示字段"  prop="fields">
                <el-checkbox-group v-model="form.fields">
                    <el-checkbox label="scholarshipName">奖学金名称</el-checkbox>
                    <el-checkbox label="prizeName">奖学金等级</el-checkbox>
                    <el-checkbox label="sn">学号</el-checkbox>
                    <el-checkbox label="name">姓名</el-checkbox>
                    <el-checkbox label="classes">班级</el-checkbox>
                    <el-checkbox label="grade">年级</el-checkbox>
                    <el-checkbox label="major">专业</el-checkbox>
                    <el-checkbox label="college">学院</el-checkbox>
                    <el-checkbox label="prizeNumber">学生获奖数</el-checkbox>
                    <el-checkbox label="files">学生申请材料</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="公示时间" prop="time">
                <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        placeholder="选择时间范围">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--<el-button type="primary" @click="$router.push('/check/award/publicity')" >上一步</el-button>-->
            <el-button type="primary" @click="onSubmit">确定公示</el-button>
        </el-col>
    </section>
</template>

<script>
    import {
        getSchoolPublicityScholarshipList,
        schoolPublicity
    } from '../../../api/api';
    import moment from 'moment'
    import {mapGetters} from 'vuex'

    export default {
        computed: {
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            var checkTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入公示时间'));
                }
                callback();
            };
            var checkFileds = (rule, value, callback) => {
                if (!value || value.length===0) {
                    return callback(new Error('请选择至少一个字段'));
                }
                callback();
            };
            return {
                addFormRules: {
                    time: [
                        {validator: checkTime, trigger: 'change'}
                    ],
                    fields: [
                        {validator: checkFileds, trigger: 'change'}
                    ]
                },
                form: {
                    time: '',
                    awards: [],
                    fields: ['scholarshipName', 'prizeName', 'sn', 'name', 'classes', 'grade', 'major', 'college'],
                    scale: 'school'
                },
                scholarships: []
            }
        },
        methods: {
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let para = {
                            beginDate: moment(this.form.time[0]).format('YYYY-MM-DD HH:mm:ss'),
                            endDate: moment(this.form.time[1]).format('YYYY-MM-DD HH:mm:ss'),
                            scholarshipIds: this.form.awards,
                            scholarshipName: this.form.fields.indexOf('scholarshipName')!==-1,
                            prizeName: this.form.fields.indexOf('prizeNumber')!==-1,
                            sn: this.form.fields.indexOf('sn')!==-1,
                            name: this.form.fields.indexOf('name')!==-1,
                            classes: this.form.fields.indexOf('classes')!==-1,
                            grade: this.form.fields.indexOf('grade')!==-1,
                            major: this.form.fields.indexOf('major')!==-1,
                            college: this.form.fields.indexOf('college')!==-1,
                            prizeNumber: this.form.fields.indexOf('prizeNumber')!==-1,
                            files: this.form.fields.indexOf('files')!==-1
                        }
                        schoolPublicity(para).then((res) => {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$router.push('/school/check/award')
                        }).catch((error) => {
                        });
                    } else {
                        return false
                    }
                })
            },
            getScholarships() {
                let para = {
                    manageUnit: this.getManageUnit
                };
                getSchoolPublicityScholarshipList(para).then((res) => {
                    this.scholarships = res;
                    for (let index in this.scholarships) {
                        this.form.awards.push(this.scholarships[index].id)
                    }
                }).catch((error) => {
                    this.listLoading = false;
                });
            }
        },
        mounted() {
            this.getScholarships()
        }
    }

</script>