<template>
    <section>
        <el-form ref="form" :model="form" label-width="130px">
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
                    <el-radio label="学校公示"></el-radio>
                    <el-radio label="学院公示"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="公示字段">
                <el-checkbox-group v-model="form.fields">
                    <el-checkbox label="奖学金名称" name="type"></el-checkbox>
                    <el-checkbox label="奖学金等级" name="type"></el-checkbox>
                    <el-checkbox label="学号" name="type"></el-checkbox>
                    <el-checkbox label="姓名" name="type"></el-checkbox>
                    <el-checkbox label="班级" name="type"></el-checkbox>
                    <el-checkbox label="年级" name="type"></el-checkbox>
                    <el-checkbox label="专业" name="type"></el-checkbox>
                    <el-checkbox label="学院" name="type"></el-checkbox>
                    <el-checkbox label="学生获奖数" name="type"></el-checkbox>
                    <el-checkbox label="学生申请材料" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="公示时间">
                <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        placeholder="选择时间范围">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="primary" @click="$router.push('/check/award/publicity')" >上一步</el-button>
            <el-button type="primary" @click="" >确定公示</el-button>
        </el-col>
    </section>
</template>

<script>
    import {getScholarshipListPage} from '../../api/api';

    export default {
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    time: '',
                    awards: [],
                    fields: [],
                    scale: ''
                },
                scholarships: []
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            getScholarships() {
                let para = {
                    page: 1,
                    pageSize: 20
                };
                getScholarshipListPage(para).then((res) => {
                    this.scholarships = res.data;
                });
            }
        },
        mounted() {
            this.getScholarships()
        }
    }

</script>