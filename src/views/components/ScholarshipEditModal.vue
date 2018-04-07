<template>
    <el-dialog title="编辑奖项" :visible.sync="editFormVisible" :close-on-click-modal="false"
               :show-close="false" :close-on-press-escape="false"
               @close="cancelEdit" @open="initData" >
        <el-form :model="editForm" label-width="200px" :rules="addFormRules" ref="editScholarshipForm">
            <el-form-item label="奖学金名称(30字以内" prop="name">
                <el-input v-model="editForm.name" auto-complete="off" :maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="奖学金类型" prop="templateId">
                <el-select v-model="editForm.templateId" placeholder="请选择奖学金类型模板">
                    <el-option v-for="item in scholarTemplates" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="奖学金归属学院" prop="type" v-if="editForm.scholarshipType ==='COLLEGE'">
                <el-input v-model="editForm.unitName" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="申请条件(200字以内)" prop="requirement">
                <el-input type="textarea" v-model="editForm.requirement" :rows="5" :maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="上传附件">
                <template v-for="(file, index) in editForm.files">
                    <el-row>
                        <span>{{file.originalName}}</span>
                        <el-button type="text" @click="deleteFile(index)">删除</el-button>
                    </el-row>
                </template>
                <el-upload
                        class="upload-demo"
                        accept=".doc,.docx,.pdf"
                        :action="uploadURL"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :before-upload="beforeUpload"
                        :file-list="files">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传doc,docx,pdf文件，且不超过1m</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="奖学金等级" :required="true">
                <el-radio-group v-model="editForm.levelType">
                    <el-radio label="MULTI">多个等级</el-radio>
                    <el-radio label="AVG">均等</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item  prop="prizes">
                <div v-if="editForm.levelType === 'MULTI'">
                    <el-form-item v-for="(item, index) in editForm.prizes" :key="index" style="padding-bottom: 5px;">
                        <el-input v-model="item.prizeName" style="width: 100px;" ></el-input>
                        奖励金额：<el-input-number v-model.number="item.money" style="width: 200px;"
                                              :min="1" :max="1000000" @blur="check"></el-input-number>元
                        奖励人数：<el-input-number v-model.number="item.number" style="width: 200px;"
                                              :min="1" @blur="check"></el-input-number>人
                        <el-button @click.prevent="removeLevelItemEdit(item)"
                                   v-show="index === editForm.prizes.length-1">
                            删除
                        </el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="addLevelItemEdit" :disabled="!canAddLevel" type="text">添加等级</el-button>
                    </el-form-item>
                </div>
                <div v-else>
                    奖励金额：<el-input-number v-model="editForm.avgMoney" style="width: 200px;"
                                          :min="100" :max="1000000" @blur="check"></el-input-number>元
                    奖励人数：<el-input-number v-model="editForm.avgNumber" style="width: 200px;"
                                          :min="1"  @blur="check"></el-input-number>人
                </div>
            </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="$emit('close')">取消</el-button>
            <el-button type="primary" @click="editSubmit" :loading="editLoading">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        getScholarshipInfo,
        downloadFile,
        deleteScholarship,
        uploadFileURL,
        getFlowTemplateList,
        updateScholarship
    } from '../../api/api';
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

    export default {
        components: {ElFormItem},
        name: 'EditScholarshipModal',
        props: ['editFormVisible', 'id'],
        computed: {
            uploadURL: function () {
                let user = JSON.parse(sessionStorage.getItem('user'));
                return uploadFileURL + '?token=' + user.token
            }
        },
        data() {
            var checkTemplate = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择奖学金审核流程模板'));
                }
                callback();
            };
            var checkPrizes = (rule, value, callback) => {
                if (this.editForm.levelType === 'AVG') {
                    if (!this.editForm.avgMoney || !this.editForm.avgNumber){
                        return callback(new Error('请输入奖学金金额和名额数量'));
                    }
                }else if (this.editForm.levelType === 'MULTI'){
                    if (this.editForm.prizes.length==0){
                        return callback(new Error('请输入奖学金金额和名额数量'));
                    }else {
                        for (let index in this.editForm.prizes){
                            let item = this.editForm.prizes[index]
                            if (!item.money || !item.number){
                                return callback(new Error('请输入奖学金金额和名额数量'));
                            }
                        }
                    }
                }
                callback();
            };
            return {
                addFormRules: {
                    name: [
                        {required: true, message: '请输入奖学金名称', trigger: 'blur', whitespace: true}
                    ],
                    requirement: [
                        {required: true, message: '请输入申请条件', trigger: 'blur', whitespace: true}
                    ],
                    templateId: [
                        {required: true, message: '请选择奖学金类型模板'},
                        {validator: checkTemplate, trigger: 'change'}
                    ],
                    prizes: [
                        {validator: checkPrizes, trigger: 'change'}
                    ]
                },
                editLoading: false,
                files: [],
                editForm: {
                    name: '',
                    requirement: '',
                    levelType: 'MULTI',
                    templateId: '',
                    prizes: [],
                    files: [],
                    avgMoney: '',
                    avgNumber: ''
                },
                scholarTemplates: [],
                levelSizeLimit: 5,
                canAddLevel: true
            }
        },
        methods: {
            beforeUpload: function (uploadFile) {
                let tmp = []
                for (let index in this.files) {
                    let file = this.files[index]
                    tmp.push(file.name)
                }
                for (let index in this.editForm.files) {
                    let file = this.editForm.files[index]
                    tmp.push(file.originalName)
                }
                for (let index in tmp) {
                    if (uploadFile.name === tmp[index]) {
                        this.$message({
                            message: '已包含选择的文件，请选择其他文件',
                            type: 'error'
                        });
                        return false
                    }
                }
            },
            _convert: function (str) {
                var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
                for (var i = 0; i < arr.length; i++) {
                    str = str.replace(new RegExp(i + 1, "g"), arr[i]);
                }
                return str;
            },
            check: function () {
                this.$refs['editScholarshipForm'].validate((valid) => {
                });
            },
            deleteFile: function (index) {
                this.editForm.files.splice(index, 1)
            },
            initData() {
                getFlowTemplateList().then((res) => {
                    this.scholarTemplates = res;
                });
                let para = {
                    id: this.id
                }
                getScholarshipInfo(para).then((res) => {
                    this.editForm = res;
                }).catch((error)=>{
                });
            },
            handleRemove(file, fileList) {
                this.files = fileList;
            },
            handleSuccess: function (response, file, fileList) {
                if (response.status === true) {
                    this.files = fileList;
                } else {
                    this.files = fileList.slice(0,-1)
                    this.$message({
                        message: response.message,
                        type: 'error'
                    });
                }
            },
            cancelEdit: function () {
                this.$refs['editScholarshipForm'].resetFields()
                this.editForm.prizes = []
                this.files = []
                this.canAddLevel = true
                this.editLoading = false
            },
            addLevelItemEdit: function () {
                if (this.editForm.prizes.length < this.levelSizeLimit) {
                    this.editForm.prizes.push({
                        prizeName: this._convert(this.editForm.prizes.length + 1 + '等奖'),
                        number: '',
                        money: ''
                    });
                    if (this.editForm.prizes.length === this.levelSizeLimit) {
                        this.canAddLevel = false
                    }
                }
            },
            removeLevelItemEdit: function (item) {
                let index = this.editForm.prizes.indexOf(item)
                if (index !== -1) {
                    this.editForm.prizes.splice(index, 1)
                    if (this.editForm.prizes.length < this.levelSizeLimit) {
                        this.canAddLevel = true
                    }
                }
            },
            editSubmit: function () {
                this.editLoading = true
                this.$refs['editScholarshipForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交修改吗？', '提示', {}).then(() => {
                            this.editLoading = true;

                            for (let index in this.files) {
                                let file = this.files[index]
                                this.editForm.files.push({
                                    originalName: file.name,
                                    name: file.response.data
                                })
                            }
                            let para = {
                                id: this.id,
                                files: this.editForm.files,
                                name: this.editForm.name,
                                requirement: this.editForm.requirement,
                                levelType: this.editForm.levelType,
                                templateId: this.editForm.templateId,
                                prizes: this.editForm.prizes,
                                avgMoney: this.editForm.avgMoney,
                                avgNumber: this.editForm.avgNumber,
                                primaryTeachingInstitutionId: this.editForm.primaryTeachingInstitutionId
                            }
                            updateScholarship(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$emit('updated');
                            }).catch((error)=>{
                                this.editLoading = false;
                            });
                        }).catch(()=>{
                            this.editLoading = false
                        });
                    } else {
                        this.editLoading = false
                    }
                });
                this.editLoading = false
            }
        }
    }
</script>