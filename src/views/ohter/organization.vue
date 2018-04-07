<template>
    <section>
        <el-row>
            <el-col :span="4">
                <el-row>
                    <el-col :span="24" style="padding: 5px;">
                        <span>年级设置</span>
                        <el-button size="small" type="primary" @click="createNewItem('grade')" style="">添加年级</el-button>
                    </el-col>
                </el-row>
                <el-row style="padding: 5px">
                    <el-table :data="grades" style="width: 100%">
                        <el-table-column prop="name" label="年级名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="deleteOrganization(scope.row.id, 'grade')">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-col>
            <el-col :span="4">
                <el-row>
                    <el-col :span="24" style="padding: 5px;">
                        <span>学院设置</span>
                        <el-button size="small" type="primary" @click="createNewItem('college')">添加学院</el-button>
                    </el-col>
                </el-row>
                <el-row style="padding: 5px">
                    <el-table :data="colleges" style="width: 100%">
                        <el-table-column prop="name" label="学院名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="small"
                                           @click="deleteOrganization(scope.row.id, 'college')">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>

            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="24" style="padding: 5px;">
                        <span>专业设置</span>
                        <el-button size="small" type="primary" @click="createNewItem('major')">添加专业</el-button>
                    </el-col>
                </el-row>
                <el-row style="padding: 5px">
                    <el-table :data="majors" style="width: 100%">
                        <el-table-column prop="majorName" label="专业名称">
                        </el-table-column>
                        <el-table-column prop="collegeName" label="学院">
                        </el-table-column>
                        <el-table-column prop="gradeName" label="年级">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="deleteOrganization(scope.row.id, 'major')">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>

            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="24" style="padding: 5px;">
                        <span>班级设置</span>
                        <el-button size="small" type="primary" @click="createNewItem('class')">添加班级</el-button>
                    </el-col>
                </el-row>
                <el-row style="padding: 5px">
                    <el-table :data="classes" style="width: 100%">
                        <el-table-column prop="className" label="班级名称">
                        </el-table-column>
                        <el-table-column prop="collegeName" label="学院">
                        </el-table-column>
                        <el-table-column prop="gradeName" label="年级">
                        </el-table-column>
                        <el-table-column prop="majorName" label="专业">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="deleteOrganization(scope.row.id, 'class')">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>

            </el-col>
        </el-row>

        <el-dialog title="新建专业" :visible.sync="majorFormVisible">
            <el-form :model="form" label-width="100px" ref="majorForm">
                <el-form-item label="年级" prop="gradeId">
                    <el-select v-model="form.gradeId">
                        <el-option v-for="item in grades" :value="item.id" :label="item.name"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学院" prop="collegeId">
                    <el-select v-model="form.collegeId">
                        <el-option v-for="item in colleges" :value="item.id" :label="item.name"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入专业名称" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelNewMajor">取 消</el-button>
                <el-button type="primary" @click="sumbitNewMajor">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="新建班级" :visible.sync="classFormVisible">
            <el-form :model="form" label-width="100px" ref="classForm">
                <el-form-item label="年级" prop="gradeId">
                    <el-select v-model="form.gradeId" @change="loadSelectMajors">
                        <el-option v-for="item in grades" :value="item.id" :label="item.name"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学院">
                    <el-select v-model="form.collegeId" @change="loadSelectMajors">
                        <el-option v-for="item in colleges" :value="item.id" :label="item.name"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="majorId">
                    <el-select v-model="form.majorId">
                        <el-option v-for="item in selectMajors" :value="item.id" :label="item.name"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入班级名称" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelNewClass">取 消</el-button>
                <el-button type="primary" @click="sumbitNewClass">确 定</el-button>
            </div>
        </el-dialog>


    </section>
</template>
<script>
    import {
        createOrganization,
        getOrganization,
        deleteOrganization,
        loadSelectMajors
    } from '../../api/api';

    export default {
        data() {
            return {
                majorFormVisible: false,
                classFormVisible: false,
                grades: [],
                colleges: [],
                majors: [],
                classes: [],
                selectMajors: [],
                form: {
                    name: '',
                    gradeId: '',
                    collegeId: '',
                    majorId: '',
                    type: ''
                }
            };
        },
        mounted() {
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            deleteOrganization: function (id, type) {
                let para = {
                    id: id,
                    type: type
                }
                deleteOrganization(para).then((res) => {
                    this.loadData()
                });
            },
            loadData: function () {
                getOrganization().then((res) => {
                    this.grades = res.grades
                    this.colleges = res.colleges
                    this.majors = res.majors
                    this.classes = res.classes
                });
            },
            sumbitNewMajor: function () {
                this.form.type = 'major'
                let para = this.form
                createOrganization(para).then((res) => {
                    this.loadData()
                    this.cancelNewMajor()
                });
            },
            cancelNewMajor: function () {
                this.majorFormVisible = false
                this.$refs.majorForm.resetFields()
            },
            cancelNewClass: function () {
                this.classFormVisible = false
                this.$refs.classForm.resetFields()
            },
            sumbitNewClass: function () {
                this.form.type = 'class'
                let para = this.form
                createOrganization(para).then((res) => {
                    this.loadData()
                    this.cancelNewClass()
                });
            },
            loadSelectMajors: function () {
                this.selectMajors = []
                if (this.form.collegeId != '' && this.form.gradeId != '') {
                    let para = {
                        collegeId: this.form.collegeId,
                        gradeId: this.form.gradeId
                    }
                    loadSelectMajors(para).then((res) => {
                        this.selectMajors = res
                    });
                }
            },
            createNewItem: function (val) {
                if (val === 'grade' || val === 'college') {
                    this.$prompt('请输入名称', '新建', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(({value}) => {
                        let para = {
                            name: value,
                            type: val
                        }
                        createOrganization(para).then((res) => {
                            this.loadData()
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消输入'
                        });
                    });
                } else if (val === 'major') {
                    this.majorFormVisible = true
                } else if (val === 'class') {
                    this.classFormVisible = true
                }
            }
        }
    };
</script>