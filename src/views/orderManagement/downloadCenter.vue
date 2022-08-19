<template>
	<div>
		<el-card shadow="hover">
			<el-form :model="formInline" label-width="95px" :inline="true" label-position="right" ref="reset" size="small">
				<el-form-item label="报表名称">
					<el-input v-model="formInline.fileName" placeholder="请输入报表名称" clearable> </el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="inquire" size="small">查询</el-button>
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
import { Session } from '@/utils/storage';
import { selectPage, deleteById } from '@/api/oil/download';
export default {
	components: {
		Table,
	},
	data() {
		return {
			formInline: {
				fileName: '',
			},
			pagination: {
				pageSize: 10,
				currPage: 1,
			},
			total: 0,
			loading: true,
			tableData: [],
			colums: [
				{
					label: '报表名称',
					prop: 'fileName',
				},
				{
					label: '导出时间',
					prop: 'exportTime',
				},
				{
					label: '操作人',
					prop: 'operatorName',
				},
				{
					label: '状态',
					prop: 'stats',
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
	mounted() {
		this.downloadList();
	},
	methods: {
		// 查询
		inquire() {
			this.loading = true;
			this.pagination.currPage = 1;
			this.downloadList();
		},
		// 删除
		remove(row) {
			const data = {
				id: row.id,
				operatorId: Session.get('loginUser').userId,
				operatorName: Session.get('loginUser').userName,
			};
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then( () => {
					 this.deleteList(data);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		deleteList(data) {
			deleteById(data).then((res) => {
				if (res.code === '0') {
					this.$message.success('删除成功');
					this.downloadList();
				} else {
					this.$message.error(res.message);
					this.downloadList();
				}
			});
		},
		// 下载
		download(row) {
			let link = document.createElement('a');
			link.style.display = 'none';
			link.href = row.fileUrl;
			// link.setAttribute('download');
			document.body.appendChild(link);
			link.click();
		},
		// 列表
		downloadList() {
			const data = {
				fileName: this.formInline.fileName,
				merchantId: Session.get('merchantId'),
				pageNo: this.pagination.currPage,
				pageSize: this.pagination.pageSize,
			};
			selectPage(data).then((res) => {
				this.loading = false;
				this.total = Number(res.data.total);
				this.tableData = res.data.list.map((n) => {
					return {
						...n,
						stats:
							n.stats === 1001 ? '未处理' : n.stats === 1002 ? '处理中' : n.stats === 1003 ? '导出失败' : n.stats === 1004 ? '导出成功' : n.stats,
					};
				});
			});
		},
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
