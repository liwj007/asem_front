<template>
    <el-dialog title="奖学金详情" v-model="detailVisible" @close="closeDetail" @open="getDetail"
               :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
        <el-form :model="detail" label-width="100px" ref="addScholarshipForm">
            <el-form-item label="奖学金名称" prop="name">
                <el-input v-model="detail.name" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="奖学金类型" prop="type">
                <el-input v-model="detail.scholarshipTypeName" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="申请条件" prop="requirement">
                <el-input type="textarea" v-model="detail.requirement" :readonly="true" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="附件">
                <template v-for="file in detail.files">
                    <el-row>
                        <span>{{file.originalName}}</span>
                        <el-button type="text" @click="download(file.name)">下载</el-button>
                    </el-row>
                </template>
            </el-form-item>
            <el-form-item label="奖学金等级">
                <el-radio-group v-model="detail.levelType">
                    <el-radio label="MULTI" :disabled="detail.levelType === 'AVG'">多个等级</el-radio>
                    <el-radio label="AVG" :disabled="detail.levelType === 'MULTI'">均等</el-radio>
                </el-radio-group>
            </el-form-item>

            <div v-if="detail.levelType === 'MULTI'">
                <el-form-item v-for="(item, index) in detail.prizes" :key="index">
                    <el-input v-model="item.prizeName" style="width:100px;" :readonly="true"></el-input>
                    <el-input v-model.number="item.money" style="width: 200px;"
                              :readonly="true"></el-input>
                    <el-input v-model.number="item.number" style="width: 200px;"
                              　:readonly="true"></el-input>
                </el-form-item>
            </div>
            <div v-else>
                <el-form-item>
                    <el-input v-model="detail.avgMoney" style="width: 200px;"
                              　:readonly="true"></el-input>
                    <el-input v-model="detail.avgNumber" style="width: 200px;"
                              　:readonly="true"></el-input>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDetail">关闭</el-button>
            <el-button type="danger" @click="handleDel(detail.id)" :loading="editLoading" v-if="deleteItem===true">删除</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        downloadFile,
        deleteScholarship
    } from '../../api/api';
    export default {
        name: 'ScholarshipInfoModal',
        props: ['detailVisible', 'id', 'deleteItem','info', 'isSchool'],
        data() {
            return {
                editLoading: false,
                detail: {}
            }
        },
        methods: {
            handleDel: function (itemId) {
                this.$confirm('确认删除该记录吗?该操作将删除该奖学金关联的全部奖项，如只想删除该奖项请进行编辑操作！', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.editLoading = true;
                    let para = {id: itemId};
                    deleteScholarship(para).then((res) => {
                        this.editLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.$emit('deleted')
                    }).catch((error)=>{
                        this.editLoading = false;
                    });
                }).catch(() => {

                });
            },
            download: function (name) {
                downloadFile(name)
            },
            getDetail: function () {
                this.detail = this.info;
            },
            closeDetail: function () {
                this.detail = {}
                this.$emit('close');
            }
        }
    }
</script>