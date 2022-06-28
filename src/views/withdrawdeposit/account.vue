<template>
	<div>
		<el-card shadow="hover">
			<div style="margin-bottom: 10px"><el-button type="primary" @click="handleAdd">添加提现账户</el-button></div>

			<el-table :data="tableData" border style="width: 100%" v-loading="loading">
				<el-table-column prop="id" label="编号" width="220" align="center"></el-table-column>
				<el-table-column prop="supplierName" label="提现账户名" width="220" align="center"></el-table-column>
				<el-table-column label="账户类型" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.supplierType == 'PERSON'">个人</span>
						<span v-else-if="scope.row.supplierType == 'BUSINESS'">企业</span>
					</template>
				</el-table-column>
				<el-table-column label="账户状态" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.stats == 1101">审核中</span>
						<span v-else-if="scope.row.stats == 1102">审核失败</span>
						<span v-else-if="scope.row.stats == 1103">已审核</span>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
						<el-button type="text" v-if="scope.row.stats == 1102" @click="handleClick(scope.row)">再次提交</el-button>
						<el-button type="text" v-if="scope.row.stats == 1102" @click="handleDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<add-dialog :show.sync="show" @change="change" ref="child" :disabled="disabled"></add-dialog>
	</div>
</template>
<script>
import { allow_or_not, getmerList, deleteUser, submit_again } from '@/api/withdrawdeposit';
import AddDialog from './components/AddDialog';

export default {
	components: {
		AddDialog,
	},
	data() {
		return {
			show: false,
			tableData: [],
			disabled: false,
			loading: false,
		};
	},
	created() {
		this.init();
	},
	methods: {
		async init() {
			this.loading = true;
			const res = await getmerList({merchantId: sessionStorage.getItem("merchantId")});
			this.loading = false;
			if (res.code == 0) {
				this.tableData = res.data.sort( (a, b) => {return b.stats - a.stats });
			}
		},
		handleAdd() {
			allow_or_not({merchantId: sessionStorage.getItem("merchantId")}).then( res => {
				if (res.code == 0) {
					if (res.data) {
						this.show = true;
						this.disabled = false;
					}
				} else {
					this.$message({
						type: 'error',
						message: '最多添加3个对公、5个对私账户!'
					});
				}
			})
		},
		handleClick(row) {
			submit_again({id: row.id}).then( res => {
				if (res.code == 0) {
					this.$message({
						type: 'success',
						message: '提交成功!'
					});
					this.init();
				}
			})
		},
		handleDelete(row) {
			this.$confirm('确定删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteUser({id: row.id}).then( res => {
					if (res.code == 0) {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.init();
					}
				})
			})
		},
		handleDetail(row) {
			this.show = true;
			this.disabled = true;
			this.$refs.child.getDetail(row.id);
		},
		change() {
			this.init();
		}
	},
};
</script>
<style scoped>
::v-deep .el-dialog .el-dialog__body {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
