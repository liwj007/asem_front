<template>
    <!--新增界面-->
    <el-dialog title="申请详情" v-model="editVisible" :close-on-click-modal="false" :show-close="false"
               :close-on-press-escape="false"
               @close="closeModal" @open="openModal" size="tiny">
        <el-form :model="detail" label-width="100px" ref="addForm">
            <el-form-item label="申请奖学金">
                <el-input v-model="detail.scholarshipName" style="width: 210px;" :readonly="true"></el-input>
                <el-input v-model="detail.prizeName" style="width: 210px;" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item label="综合评测" prop="name">
                <el-input v-model="detail.evaluation" type="textarea"></el-input>
            </el-form-item>


            <el-form-item label="证明材料">
                <template v-for="(file, index) in detail.files">
                    <el-row>
                        <span>{{file.originalName}}</span>
                        <el-button type="text" @click="deleteFile(index)">删除</el-button>
                    </el-row>
                </template>
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


            <el-form-item v-for="(item, index) in detail.reasons" :key="index" label="申请理由">
                <el-input v-model="item.reason" style="width: 350px;"></el-input>
                <el-button @click.prevent="removeItem(item)" :disabled="detail.reasons.length===1" >删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addItem" type="text" :disabled="detail.reasons.length===limitSize">添加</el-button>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="editSubmit" >提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        downloadFile,
        uploadFileURL,
        updateApplicationFile,
        getApplicationDetail
    } from '../../api/api';

    export default {
        name: 'ApplicationEditModal',
        props: ['editVisible', 'id'],
        data() {
            return {
                files: [],
                detail: {
                    evaluation: '',
                    reasons: [{
                        reason: ''
                    }],
                    files: []
                },
                limitSize: 5
            }
        },
        computed: {
            uploadURL: function () {
                let user = JSON.parse(sessionStorage.getItem('user'));
                return uploadFileURL + '?token=' + user.token
            }
        },
        methods: {
            deleteFile: function (index) {
                this.detail.files.splice(index, 1)
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
            removeItem(item) {
                var index = this.detail.reasons.indexOf(item)
                if (index !== -1) {
                    this.detail.reasons.splice(index, 1)
                }
            },
            addItem: function () {
                if (this.detail.reasons.length < this.limitSize){
                    this.detail.reasons.push({
                        reason: ''
                    });
                }

            },
            editSubmit: function () {
                for (let index in this.files) {
                    let file = this.files[index]
                    this.detail.files.push({
                        originalName: file.name,
                        name: file.response.data
                    })
                }
                let para = {
                    files: this.detail.files,
                    id: this.id,
                    evaluation: this.detail.evaluation,
                    reasons: this.detail.reasons
                }
                console.log(para)
                updateApplicationFile(para).then((res) => {
                    this.$message({
                        message: '重新提交成功',
                        type: 'success'
                    });
                    this.$emit('updated');
                }).catch((error)=>{
                });
            },
            download: function (name) {
                downloadFile(name)
            },
            openModal: function () {
                let para ={
                    id: this.id
                }
                getApplicationDetail(para).then((res) => {
                    this.detail = res;
                }).catch((error)=>{
                });
            },
            cancelEdit: function () {
                this.$emit('close');
            },
            closeModal: function () {
                this.detail = {
                    evaluation: '',
                    reasons: [{
                        reason: ''
                    }],
                    files: []
                }
            }

        }
    }
</script>