<template>
	<section>
		欢迎登录奖学金评定系统
	</section>
</template>

<script>
	export default {
	    mounted() {
            var user = sessionStorage.getItem('user');
            user = JSON.parse(user);
            if (user.userType === 'SCHOOL_USER') {
                this.$router.push('/school/manage')
			} else if (user.userType === 'SPECIAL_ADVISER') {
                this.$router.push('/college/manage')
            }else if (user.userType === 'ADMIN') {
                this.$router.push('/admin/basic_setting')
            }else if (user.userType === 'STUDENT') {
                this.$router.push('/student/apply')
            }else if (user.userType === 'GRADE_ADVISER') {
                this.$router.push('/scholarship/application_check')
            }
        }
	}

</script>

<style scoped>

</style>