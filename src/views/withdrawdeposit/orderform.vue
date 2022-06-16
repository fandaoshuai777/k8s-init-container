<template>
	<div>
		<el-card shadow="hover">
			<el-form  :model="form"  :inline="true" size="small" >
				<el-form-item label="提现编码" >
					<el-input></el-input>
				</el-form-item>
				<el-form-item label="发起时间" >
					<el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>

				<el-form-item label="提现账户" >
					<el-select  >
						<el-option label="汽油" :value="1" />
						<el-option label="柴油" :value="2" />
						<el-option label="天然气" :value="3" />
					</el-select>
				</el-form-item>
				<el-form-item label="提现账号" >
					<el-input></el-input>
				</el-form-item>
				<el-form-item >
					<el-button type="primary" size="small" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>

			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="date" label="编号" width="180" align="center"> </el-table-column>
				<el-table-column prop="name" label="提现账户名" width="180" align="center"> </el-table-column>
				<el-table-column prop="address" label="账户类型" align="center"> </el-table-column>
				<el-table-column prop="address" label="账户状态" align="center"> </el-table-column>
				<el-table-column prop="address" label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="editForm(scope.row)"> 详情 </el-button>
						<el-button type="text" @click="editForm(scope.row)"> 再次提交 </el-button>
						<el-button type="text" @click="editForm(scope.row)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="right">
				<el-pagination
					class="mt15"
					:pager-count="5"
					:page-sizes="[10, 20, 30]"
					background
					layout="total, sizes, prev, pager, next, jumper"
					:current-page.sync="pagination.pageNum"
					@size-change="pageSizeChange"
					@current-change="paginationChange"
					:total="total"
				></el-pagination>
			</div>
		</el-card>
	</div>
</template>
<script>
import SysDialgoEdit from '@/components/system/SysDialogEdit.vue';

export default {
	components: {
		SysDialgoEdit,
	},
	data() {
		return {
			tableData: [
				{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄',
				},
			],
			checked: false,
			form: {},
      			pagination: {
				//分页
				pageSize: 10,
				pageNum: 1,
			},
      total:0
		};
	},
	methods: {
		onSubmit() {
			console.log(123)
		},


	},
};
</script>
<style scoped>
.right{
  text-align: right;
}
</style>
