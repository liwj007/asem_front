<template>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-radio-group v-model="ruleForm2.type">
                <el-radio label="1">学生</el-radio>
                <el-radio label="３">学校用户</el-radio>
                <el-radio label="4">年级辅导员</el-radio>
                <el-radio label="5">学院用户</el-radio>
            </el-radio-group>
        </el-form-item>
        <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click="handleSubmit2" :loading="logining">登录
            </el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
    </el-form>
</template>

<script>
    import {userLogin} from '../api/api';
    import School from '../school_routes'
    import College from '../college_routes'
    import Admin from '../admin_routes'
    import Student from '../student_routes'
    import Grade from '../grade_routes'
    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    account: '',
                    checkPass: '',
                    type: '1'
                },
                rules2: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]
                },
                checked: true
            };
        },
        methods: {
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        var loginParams = {
                            username: _this.Trim(this.ruleForm2.account),
                            password: this.ruleForm2.checkPass,
                            type: this.ruleForm2.type
                        };
                        userLogin(loginParams).then(res => {
                            this.logining = false;
                            let user = res
                            sessionStorage.setItem('user', JSON.stringify(user));

                            if (user !== null) {
                                if (user.userType === 'SCHOOL') {
                                    this.$store.commit('SET_MENU',School)
                                    this.$router.addRoutes(School)
                                } else if (user.userType === 'COLLEGE') {
                                    this.$store.commit('SET_MANAGE_UNITS', user.manageColleges)
                                    if (user.manageColleges.length>0){
                                        sessionStorage.setItem('manageUnit',user.manageColleges[0].id)
                                        this.$store.commit('SET_MANAGE_UNIT', user.manageColleges[0].id)
                                    }
                                    this.$store.commit('SET_MENU',College)
                                    this.$router.addRoutes(College)
                                }else if (user.userType === 'ADMIN') {
                                    this.$store.commit('SET_MENU',Admin)
                                    this.$router.addRoutes(Admin)
                                }else if (user.userType === 'STUDENT'){
                                    this.$store.commit('SET_MENU',Student)
                                    this.$router.addRoutes(Student)
                                }else if (user.userType === 'GRADE'){
                                    if (user.manageColleges.length>0){
                                        sessionStorage.setItem('manageUnit',user.manageColleges[0].id)
                                        this.$store.commit('SET_MANAGE_UNIT', user.manageColleges[0].id)
                                    }
                                    this.$store.commit('SET_MENU',Grade)
                                    this.$router.addRoutes(Grade)
                                }
                            }
                            this.$router.push({path: '/'});
                        }).catch((error)=>{
                            this.logining = false;
                            this.$message({
                                message: error.message,
                                type: 'error'
                            });
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            Trim: function(str,is_global)
            {
                var result;
                result = str.replace(/(^\s+)|(\s+$)/g,"");
                result = result.replace(/\s/g,"");
                return result;
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 400px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>