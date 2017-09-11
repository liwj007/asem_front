<template>
    <section>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织设置" name="first" >
                <Organization ref="first"></Organization>
            </el-tab-pane>
            <el-tab-pane label="用户管理" name="second" >
                <UserSetting ref="second"></UserSetting>
            </el-tab-pane>
            <!--<el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>-->
        </el-tabs>
    </section>
</template>
<script>
    import Organization from './organization'
    import UserSetting from './user'
    export default {
        components: {
            Organization,
            UserSetting
        },
        data() {
            return {
                activeName: 'first'
            };
        },
        methods: {
            handleClick(tab, event) {
                let name = tab.name
                this.$refs[name].loadData()
            }
        },
        created (){
            this.$emit('viewIn',[{
                name: '基础设置',
                url: '/admin/basic_setting'
            }]);
        },
        mounted() {
            this.$refs.first.loadData()
        }
    };
</script>
