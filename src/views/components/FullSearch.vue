<template>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
            <el-button type="text" icon="arrow-left" @click.native="$router.go(-1)">返回 </el-button>
            <el-form-item>
                <el-select v-model="filters.collegeId" style="width: 150px;" @change="loadMajors">
                    <el-option
                            v-for="item in colleges"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="filters.majorId" style="width: 150px;" @change="loadGrades">
                    <el-option
                            v-for="item in majors"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="filters.gradeId" style="width: 150px;" @change="loadClasses">
                    <el-option
                            v-for="item in grades"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="filters.classId" style="width: 150px;">
                    <el-option
                            v-for="item in classes"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <slot name="other"></slot>
            <el-form-item>
                <el-input v-model="filters.content" placeholder="学号或姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>

        </el-form>
    </el-col>
</template>
<script>
    import {
        getColleges,
        getMajorsByCollege,
        getGradesByMajor,
        getClassByGradeAndMajor
    } from '../../api/api';
    export default {
        name: 'FullSearchBar',
        data() {
            return {
                filters: {
                    content: '',
                    collegeId: '0',
                    majorId: '0',
                    gradeId: '0',
                    classId: '0'
                },
                colleges: [],
                majors: [],
                grades: [],
                classes: []
            }
        },
        methods: {
            loadColleges: function () {
                getColleges().then((res) => {
                    this.colleges = res;
                    this.colleges.splice(0,0,{
                        "id" : 0,
                        "name" : "不限学院"
                    })
                    this.filters.collegeId = 0
                }).catch((error)=>{
                });
            },
            loadMajors: function () {
                let para = {
                    id: this.filters.collegeId
                }
                getMajorsByCollege(para).then((res) => {
                    this.majors = res;
                    this.majors.splice(0,0,{
                        "id" : 0,
                        "name" : "不限专业"
                    })
                    this.filters.majorId = 0
                }).catch((error)=>{
                });
            },
            loadGrades: function () {
                let para = {
                    id: this.filters.majorId
                }
                getGradesByMajor(para).then((res) => {
                    this.grades = res;
                    this.grades.splice(0,0,{
                        "id" : 0,
                        "name" : "不限年级"
                    })
                    this.filters.gradeId = 0
                }).catch((error)=>{
                });
            },
            loadClasses: function () {
                let para = {
                    majorId: this.filters.majorId,
                    gradeId: this.filters.gradeId
                }
                getClassByGradeAndMajor(para).then((res) => {
                    this.classes = res;
                    this.classes.splice(0,0,{
                        "id" : 0,
                        "name" : "不限班级"
                    })
                    this.filters.classId = 0
                }).catch((error)=>{
                });
            },
            search: function () {
                this.$emit('search', this.filters)
            }
        },
        created (){

        },
        mounted() {
            this.loadColleges()
        }
    }
</script>