<template>
	<div class="layout-footer mt15">
		<div class="layout-footer-warp">
			<div>小鹰加油商家端</div>
			<div class="mt5">{{ $t('message.login.copyright.one5') }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'layoutFooter',
	data() {
		return {};
	},
};
</script>

<style scoped lang="scss">
.layout-footer {
	width: 100%;
	display: flex;
	&-warp {
		margin: auto;
		color: #9e9e9e;
		text-align: center;
	}
}
</style>
