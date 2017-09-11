<template>
    <!--新增界面-->
    <el-dialog title="申请详情" v-model="infoVisible" :close-on-click-modal="false" :show-close="false"
               :close-on-press-escape="false"
               @close="closeModal" @open="openModal" size="tiny">
        <el-form :model="detail" label-width="100px" ref="addForm">
            <el-form-item label="申请奖学金">
                <el-input v-model="detail.scholarshipName" style="width: 210px;" :readonly="true"></el-input>
                <el-input v-model="detail.prizeName" style="width: 210px;" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item label="综合评测" prop="name">
                <el-input v-model="detail.evaluation" type="textarea" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item  label="申请理由">
                <template v-for="(item, index) in detail.reasons" >
                    <el-input v-model="item.reason" style="width: 350px;margin-bottom: 10px;" :readonly="true"></el-input>
                </template>
            </el-form-item>

            <el-form-item label="证明材料">
                <template v-for="file in detail.files">
                    <el-row>
                        <span>{{file.originalName}}</span>
                        <el-button type="text" @click="download(file.name)">下载</el-button>
                    </el-row>
                </template>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button  @click="closeInfo">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {
        downloadFile,
        getApplicationDetail
    } from '../../api/api';

    export default {
        name: 'ApplicationInfoModal',
        props: ['infoVisible', 'id'],
        data() {
            return {
                detail: {}
            }
        },
        methods: {
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
            closeInfo: function () {
                this.$emit('close');
            },
            closeModal: function () {
                this.detail = {}
            }

        }
    }
</script>