<template>
	<div>
		<el-card shadow="hover">
			<el-form :model="formInline" label-width="95px" :inline="true" label-position="right" ref="reset">
				<el-form-item label="报表名称">
					<el-input v-model="formInline.id" @input.native="changeNum" placeholder="请输入报表名称" clearable> </el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="inquire">查询</el-button>
				</el-form-item>
			</el-form>
			<Table
				:loading="loading"
				:colums="colums"
				:data="tableData"
				:pagination-option="paginationOption"
				@currentChange="paginationChange"
				@sizeChange="pageSizeChange"
			>
				<template v-slot:done="{ row }">
					<el-button type="text" @click="download(row)">下载</el-button>
					<el-button style="color: red" type="text" @click="remove(row)">删除</el-button>
				</template>
			</Table>
		</el-card>
	</div>
</template>
<script>
import Table from '@/components/table/index_detail';
export default {
	components: {
		Table,
	},
	data() {
		return {
			formInline: {
				id: '',
			},
			loading: false,
			tableData: [{ a: 1, b: 2, c: 3, d: 4 }],
			colums: [
				{
					label: '报表名称',
					prop: 'a',
				},
				{
					label: '导出时间',
					prop: 'b',
				},
				{
					label: '操作人',
					prop: 'c',
				},
				{
					label: '状态',
					prop: 'd',
				},
				{
					label: '操作',
					prop: 'done',
					fixed: 'right',
				},
			],
		};
	},
	computed: {
		paginationOption: function () {
			return { ...this.pagination, total: this.total };
		},
	},
	methods: {
		// 查询
		inquire() {},
		// 删除
		remove() {},
		// 下载
		download() {},
		// 列表
		downloadList() {},
		// 页码变化
		paginationChange(value) {
			this.pagination.currPage = value.current;
			this.loading = true;
			this.downloadList();
		},
		// 页数变化
		pageSizeChange(value) {
			this.pagination.pageSize = value.size;
			this.pagination.currPage = 1;
			this.loading = true;
			this.downloadList();
		},
	},
};
</script>
