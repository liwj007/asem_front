<template>
    <!--新增界面-->
    <el-dialog title="提交申请" v-model="addFormVisible" :close-on-click-modal="false" :show-close="false"
               :close-on-press-escape="false"
               @close="closeModal" @open="openModal" size="tiny">
        <el-form :model="addForm" label-width="100px" ref="addForm">
            <el-form-item v-for="(item, index) in sels" :key="index" label="申请奖学金">
                <el-input v-model="item.scholarshipName" style="width: 210px;" :readonly="true"></el-input>
                <el-input v-model="item.prizeName" style="width: 210px;" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item label="综合评测" prop="name">
                <el-input v-model="addForm.evaluation" type="textarea"></el-input>
            </el-form-item>

            <el-form-item label="证明材料">
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

            <el-form-item v-for="(item, index) in addForm.reasons" :key="index" label="申请理由">
                <el-input v-model="item.reason" style="width: 350px;"></el-input>
                <el-button @click.prevent="removeItem(item)" :disabled="addForm.reasons.length===1" >删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addItem" type="text" :disabled="addForm.reasons.length===limitSize">添加</el-button>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelAdd">取消</el-button>
            <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        uploadFileURL,
        createApplication,
        getMyselfEvaluation
    } from '../../api/api';

    export default {
        name: 'ApplicationAddModal',
        props: ['addFormVisible', 'sels'],
        computed: {
            uploadURL: function () {
                let user = JSON.parse(sessionStorage.getItem('user'));
                return uploadFileURL + '?token=' + user.token
            }
        },
        data() {
            return {
                files: [],
                addForm: {
                    evaluation: '',
                    reasons: [{
                        reason: ''
                    }]
                },
                addLoading: false,
                limitSize: 5
            }
        },
        methods: {
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
            openModal: function () {
                getMyselfEvaluation().then((res) => {
                    this.addForm.evaluation = res.evaluation;
                }).catch((error)=>{
                });
            },
            cancelAdd: function () {
                this.$emit('close')
            },
            closeModal: function () {
                this.files = []
                this.addForm = {
                    evaluation: '',
                    reasons: [{
                        reason: ''
                    }]
                }
                this.$refs['uploadComp'].clearFiles()
            },
            removeItem(item) {
                var index = this.addForm.reasons.indexOf(item)
                if (index !== -1) {
                    this.addForm.reasons.splice(index, 1)
                }
            },
            addItem: function () {
                if (this.addForm.reasons.length < this.limitSize){
                    this.addForm.reasons.push({
                        reason: ''
                    });
                }

            },
            addSubmit: function () {
                let uploads = []
                for (let index in this.files) {
                    let file = this.files[index]
                    uploads.push({
                        originalName: file.name,
                        name: file.response.data
                    })
                }
                let ids = []
                for (let index in this.sels){
                    ids.push(this.sels[index].prizeId)
                }
                let para = {
                    files: uploads,
                    prizeIds: ids,
                    evaluation: this.addForm.evaluation,
                    reasons: this.addForm.reasons
                }
                createApplication(para).then((res) => {
                    this.$message({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.$emit('created');
                }).catch((error)=>{
                });
            }

        }
    }
</script>