<template>
    <el-dialog title="添加奖项" v-model="addFormVisible" :close-on-click-modal="false"
               :show-close="false" :close-on-press-escape="false"
               @close="cancelAdd" @open="getScholarTemplates">
        <el-form :model="addForm" label-width="200px" :rules="addFormRules" ref="addScholarshipForm">
            <el-form-item label="奖学金名称(30字以内)" prop="name">
                <el-input v-model="addForm.name" auto-complete="off" :maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="奖学金类型" prop="templateId">
                <el-select v-model="addForm.templateId" placeholder="请选择奖学金类型模板">
                    <el-option v-for="item in scholarTemplates" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请条件(200字以内)" prop="requirement">
                <el-input type="textarea" v-model="addForm.requirement" :maxlength="200" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="上传附件">
                <el-upload ref="uploadComp"
                           class="upload-demo"
                           accept=".doc,.docx,.pdf"
                           :action="uploadURL"
                           :on-success="handleSuccess"
                           :on-remove="handleRemove">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传doc,docx,pdf文件，且不超过10m</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="奖学金等级">
                <el-radio-group v-model="addForm.levelType">
                    <el-radio label="MULTI">多个等级</el-radio>
                    <el-radio label="AVG">均等</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="prizes">
                <div v-if="addForm.levelType === 'MULTI'">
                    <el-form-item v-for="(item, index) in addForm.prizes" :key="index" style="padding-bottom: 5px;">
                        <el-input v-model="item.prizeName" style="width: 100px;" :readonly="true"></el-input>
                        <el-input v-model.number="item.money" style="width: 200px;" placeholder="请输入金额"></el-input>
                        <el-input v-model.number="item.number" style="width: 200px;" placeholder="请输入人数"></el-input>
                        <el-button @click.prevent="removeLevelItem(item)" v-show="index === addForm.prizes.length-1">
                            删除
                        </el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="addLevelItem" :disabled="!canAddLevel" type="text">添加等级</el-button>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-input v-model="addForm.avgMoney" style="width: 200px;" placeholder="请输入金额"></el-input>
                    <el-input v-model="addForm.avgNumber" style="width: 200px;" placeholder="请输入人数"></el-input>
                </div>
            </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="$emit('close')">取消</el-button>
            <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        getFlowTemplateList,
        createScholarship,
        uploadFileURL
    } from '../../api/api';
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import {mapGetters} from 'vuex'
    export default {
        components: {ElFormItem},
        name: 'AddScholarshipModal',
        props: ['addFormVisible', 'isSchool'],
        computed: {
            uploadURL: function () {
                let user = JSON.parse(sessionStorage.getItem('user'));
                return uploadFileURL + '?token=' + user.token
            },
            ...mapGetters([
                'getManageUnit'
            ])
        },
        data() {
            var checkTemplate = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择奖学金审核流程模板'));
                }
                callback();
            };
            var checkPrizes = (rule, value, callback) => {
                if (this.addForm.levelType === 'AVG') {
                    if (!this.addForm.avgMoney || !this.addForm.avgNumber) {
                        return callback(new Error('请输入奖学金金额和名额数量1'));
                    }
                } else if (this.addForm.levelType === 'MULTI') {
                    if (this.addForm.prizes.length == 0) {
                        return callback(new Error('请输入奖学金金额和名额数量2'));
                    } else {
                        for (let index in this.addForm.prizes) {
                            let item = this.addForm.prizes[index]
                            if (!item.money || !item.number) {
                                return callback(new Error('请输入奖学金金额和名额数量3'));
                            }
                        }
                    }
                }
                callback();
            };
            return {
                files: [],
                scholarTemplates: [],
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入奖学金名称', trigger: 'blur'}
                    ],
                    requirement: [
                        {required: true, message: '请输入申请条件', trigger: 'blur'}
                    ],
                    templateId: [
                        {validator: checkTemplate, trigger: 'change'}
                    ],
                    prizes: [
                        {validator: checkPrizes, trigger: 'change'}
                    ]
                },
                addForm: {
                    name: '',
                    requirement: '',
                    levelType: 'MULTI',
                    templateId: '',
                    prizes: [],
                    avgMoney: '',
                    avgNumber: '',
                    unitId: ''
                },
                levelSizeLimit: 5,
                canAddLevel: true
            }
        },
        methods: {
            _convert: function (str) {
                var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
                for (var i = 0; i < arr.length; i++) {
                    str = str.replace(new RegExp(i + 1, "g"), arr[i]);
                }
                return str;
            },

            getScholarTemplates() {
                getFlowTemplateList().then((res) => {
                    if (res.length > 0) {
                        this.scholarTemplates = res;
                        if (res.length > 0) {
                            this.addForm.templateId = this.scholarTemplates[0].id
                        }
                    }
                }).catch((error) => {
                });
            },

            //新增
            addSubmit: function () {
                this.$refs['addScholarshipForm'].validate((valid) => {
                    if (valid) {
                        let uploads = []
                        for (let index in this.files) {
                            let file = this.files[index]
                            uploads.push({
                                originalName: file.name,
                                name: file.response.data
                            })
                        }
                        let para = {
                            files: uploads,
                            name: this.addForm.name,
                            requirement: this.addForm.requirement,
                            levelType: this.addForm.levelType,
                            templateId: this.addForm.templateId,
                            prizes: this.addForm.prizes,
                            avgMoney: this.addForm.avgMoney,
                            avgNumber: this.addForm.avgNumber,
                            primaryTeachingInstitutionId: this.getManageUnit
                        }
                        createScholarship(para).then((res) => {
                            this.$message({
                                message: '创建成功',
                                type: 'success'
                            });
                            this.$emit('created');
                        }).catch((error) => {
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleRemove(file, fileList) {
                this.files = fileList;
            },
            handleSuccess: function (response, file, fileList) {
                if (response.status === true) {
                    this.files = fileList;
                } else {
                    this.$message({
                        message: response.message,
                        type: 'error'
                    });
                }
            },
            removeLevelItem(item) {
                let index = this.addForm.prizes.indexOf(item)
                if (index !== -1) {
                    this.addForm.prizes.splice(index, 1)
                    if (this.addForm.prizes.length < this.levelSizeLimit) {
                        this.canAddLevel = true
                    }
                }
            },
            addLevelItem: function () {
                if (this.addForm.prizes.length < this.levelSizeLimit) {
                    this.addForm.prizes.push({
                        prizeName: this._convert(this.addForm.prizes.length + 1 + '等奖'),
                        number: '',
                        money: ''
                    });
                    if (this.addForm.prizes.length === this.levelSizeLimit) {
                        this.canAddLevel = false
                    }
                }
            },
            cancelAdd: function () {
                this.$refs['addScholarshipForm'].resetFields()
                this.addForm.prizes = []
                this.files = []
                this.addForm.levelType = 'MULTI'
                this.addForm.templateId = ''
                this.addForm.avgMoney = ''
                this.addForm.avgNumber = ''
                this.canAddLevel = true
                this.$refs['uploadComp'].clearFiles()
            }
        }
    }

</script>

<style scoped lang="scss">
    .upload-demo {
        width: 360px;
    }
</style>