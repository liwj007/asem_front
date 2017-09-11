<template>
    <el-row class="container">
        <el-row class="header">
            <el-col class="logo">
                <img src='../assets/logo.png' alt='logo'>
                <div class='txt'>
                    <p>寻道科技</p>
                    <p>{{sysName}}</p>
                </div>
            </el-col>
            <el-col class="welcome">
                欢迎登录{{sysName}}
            </el-col>
            <el-col class="userinfo">
                <el-select v-model="manageUnit" v-if="$store.state.manageUnits.length>0"
                           placeholder="请选择" size="small" style="width:120px;" @change="changeManageCollege">
                    <el-option
                            v-for="item in $store.state.manageUnits"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <span class="el-dropdown-link userinfo-inner">{{sysUserName}}({{sysUserTypeName}})</span>
                <el-tooltip content="退出" placement="top" effect="light">
                    <el-button type="text" @click.native="logout" style="color: #000000"><i
                            class="el-icon-circle-close"></i></el-button>
                </el-tooltip>
            </el-col>
        </el-row>

        <el-col :span="24" class="main">
            <aside class='menu-expanded'>
                <!--导航菜单-->
                <el-menu mode="vertical" class="el-menu-vertical-demo" router
                         theme="dark">
                    <!--<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">-->
                    <template v-for="(item,index) in $store.state.menus" v-if="!item.hidden">
                        <el-menu-item-group :title="item.name" :index="index+''">
                            <el-menu-item v-for="child in item.children" :index="item.path + '/' + child.path"
                                          :key="item.path + '/' +child.path"
                                          v-if="!child.hidden"
                                          style="padding-left: 40px;">
                                {{child.name}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </template>
                </el-menu>
            </aside>

            <section class="content-container">
                <div>
                    <el-menu default-active="1" class="el-menu-demo sub-header" mode="horizontal" @select="">
                        <template v-for="(item,index) in subHeaders">
                            <el-menu-item :index="''+(index+1)" @click="$router.push(item.url)">{{item.name}}
                            </el-menu-item>
                        </template>

                    </el-menu>
                </div>
                <section class="main-content">
                    <div class="grid-content bg-purple-light">
                        <el-row class="breadcrumb-container" style="padding-bottom: 20px;">
                            <el-breadcrumb separator=">" class="breadcrumb-inner">
                                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                    {{ item.name }}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-row>
                        <el-row class="content-wrapper">
                            <transition name="fade" mode="out-in">
                                <router-view @viewIn="changeSubHeaders"></router-view>
                            </transition>
                        </el-row>
                    </div>
                </section>

            </section>
        </el-col>
    </el-row>
</template>

<script>
    import axios from 'axios'
    import Bus from '../bus'
    import {
        getManageColleges
    } from '../api/api';

    export default {
        data() {
            return {
                subHeaders: [],
                sysName: '奖学金评定系统',
                collapsed: false,
                sysUserName: '',
                sysUserType: '',
                sysUserTypeName: '',
                manageUnit: ''
            }
        },
        methods: {
            changeManageCollege: function (val) {
                sessionStorage.setItem("manageUnit", val)
                this.$router.go(0);
            },
            changeSubHeaders(val) {
                this.subHeaders = val
            },
            //退出登录
            logout: function () {
                this.$confirm('确认退出吗?', '提示', {}).then(() => {
                    sessionStorage.removeItem('user');
                    this.$store.commit('CLEAR_MENU')
                    this.$router.go(0);
                }).catch(() => {

                });
            }
        },
        beforeMount() {
            var user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.name || ''
                if (user.userType === 'SCHOOL_USER') {
                    this.sysUserTypeName = '学校用户'
                } else if (user.userType === 'STUDENT') {
                    this.sysUserTypeName = '学生用户'
                } else if (user.userType === 'SPECIAL_ADVISER') {
                    this.sysUserTypeName = '专项辅导员'
                    this.$store.commit('SET_MANAGE_UNITS', user.managePrimaryTeachingInstitutions)
                    this.$store.commit('SET_MANAGE_UNIT', parseInt(sessionStorage.getItem("manageUnit")))
                } else if (user.userType === 'GRADE_ADVISER') {
                    this.sysUserTypeName = '年级辅导员'
//                    this.$store.commit('SET_MANAGE_UNITS', user.manageGrades)
//                    this.$store.commit('SET_MANAGE_UNIT', parseInt(sessionStorage.getItem("manageUnit")))
                } else if (user.userType === 'ADMIN') {
                    this.sysUserTypeName = '管理员'
                }

                this.manageUnit = parseInt(sessionStorage.getItem("manageUnit"))
            }
        },
        created() {
            Bus.$on('showError', data => {
                switch (data.code) {
                    case 10001:
                        this.$Modal.warning({
                            title: '您的登录身份无效',
                            content: data.message,
                            onOk: function () {
                            }
                        })
                    default :
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                }
            })
        }
    }

</script>

<style lang="scss">
    .sub-header {
        background-color: white;
        border-bottom: 1px solid #d1dbe5;
        position: absolute;
        top: 0px;
        width: 100%;
        z-index: 999;
    }

    .page-tool {
        padding: 10px 0;
    }

    .el-menu-item {
        height: 40px;
        line-height: 40px;
    }

    .main-content {
        margin: 20px 30px;
        padding: 20px;
        height: 100%;
        background-color: #fff;
        position: relative;
        top: 60px;
        /*width: 100%;*/
    }
</style>

<style scoped lang="scss">
    @import '~scss_vars';

    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: white;
            border-bottom: 1px solid #d2d2d2;
            color: #fff;
            .userinfo {
                text-align: right;
                box-sizing: border-box;
                padding-right: 35px;
                width: 500px;
                float: right;
                .userinfo-inner {
                    color: #000000;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                width: 230px;
                float: left;
                box-sizing: border-box;
                background-color: #20303C;

                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                img {
                    width: 35px;
                    float: left;
                    margin: 15px 10px 10px 0px;
                }
                .txt {
                    color: #fff;
                    margin: 15px 0 10px 0;
                    p {
                        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
                        font-size: 12px;
                        margin: 0;
                        line-height: 20px;
                    }
                }
            }
            .welcome {
                width: 400px;
                float: left;
                box-sizing: border-box;
                color: #000000;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
            }
            .logo-width {
                width: 230px;
            }
            .logo-collapse-width {
                width: 60px
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex;
            // background: #324057;
            position: absolute;
            top: 60px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex: 0 0 230px;
                width: 230px;
                // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu {
                    height: 100%;
                }

                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }

                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 230px;
                width: 230px;
                height: 100%;

                .el-menu {
                    background-color: #20303C;
                }

                .el-menu-item {
                    color: #ffffff;
                    :hover {
                        background-color: #3ebcf4 !important;
                    }

                }
                .is-active {
                    background-color: #3ebcf4;
                }

                .el-menu-item:first-child {
                    margin-top: 12px;
                }
            }

            .content-container {
                background: #f1f2f7;
                flex: 1;
                // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                /*padding: 20px;*/
                .breadcrumb-container {
                    //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: left;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }
</style>