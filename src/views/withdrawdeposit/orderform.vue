<template>
	<div>
		<el-card shadow="hover">
			<el-form  :model="formInfo"  :inline="true" size="small" >
				<el-form-item label="提现编码" >
					<el-input v-model="formInfo.orderNo"></el-input>
				</el-form-item>
				<el-form-item label="发起时间" >
					<el-date-picker
						v-model="formInfo.time"
						type="datetimerange"
						value-format="yyyy-MM-dd HH:mm:ss"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>

				<el-form-item label="提现账户" >
					<el-select v-model="formInfo.payee">
						<el-option v-for="(item, index) in selectList" :key="index" :label="item.supplierName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提现账号" >
					<el-input v-model="formInfo.payeeAccount"></el-input>
				</el-form-item>
				<el-form-item label="交易流水号" >
					<el-input v-model="formInfo.channelOrderNo"></el-input>
				</el-form-item>
				<el-form-item label="开户行">
					<el-input v-model="formInfo.bankName"></el-input>
				</el-form-item>
				<el-form-item >
					<el-button type="primary" size="small" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>

			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="orderNo" label="提现编码" width="180" align="center"> </el-table-column>
				<el-table-column prop="channelOrderNo" label="交易流水号" width="180" align="center"> </el-table-column>
				<el-table-column prop="amount" label="提现金额（元）" align="center"> </el-table-column>
				<el-table-column prop="payeeAccount" label="提现账户" align="center"> </el-table-column>
				<el-table-column prop="bankName" label="开户行" align="center"> </el-table-column>
				<el-table-column prop="orderStatus" label="状态" align="center"> </el-table-column>
				<el-table-column prop="orderTime" label="发起时间" align="center"> </el-table-column>
			</el-table>
			<div class="right">
				<el-pagination
					class="mt15"
					:pager-count="5"
					:page-sizes="[10, 20, 30]"
					background
					layout="total, sizes, prev, pager, next, jumper"
					:current-page.sync="formInfo.pageNo"
					@size-change="pageSizeChange"
					@current-change="paginationChange"
					:total="total"
				></el-pagination>
			</div>
		</el-card>
	</div>
</template>
<script>
import { getList, getmerList } from "@/api/withdrawdeposit";

export default {
	data() {
		return {
			tableData: [],
			formInfo: {
				pageNo: 1,
				pageSize: 10,
				orderNo: '',  // 提现编码
				payee: '',  // 提现账户
				payeeAccount: '',  // 提现账号
				channelOrderNo: '',     //交易流水号
				bankName: '', // 开户行
				time: '',
			},
      total: 0,
			selectList: [],
		};
	},
	created() {
		this.init();
		this.getmerList();
	},
	methods: {
		async init() {
			const {time} = this.formInfo;
			let data = {
				...this.formInfo,
				startTime: time && time[0],
				endTime: time && time[1]
			}
			const res = await getList(data);
			if (res.code == 0) {
				this.tableData = res.data.list;
				this.total = Number(res.data.total)
			}
		},
		async getmerList() {
			const res = await getmerList({merchantId: sessionStorage.getItem("enterpriseId")});
			if (res.code == 0) {
				this.selectList = res.data;
			}
		},
		onSubmit() {
			this.formInfo.pageNo = 1;
			this.init();
		},
		paginationChange(value) {
			this.formInfo.pageNo = value;
			this.init();
		},
		pageSizeChange(value) {
			this.formInfo.pageSize = value;
			this.init();
		},
	},
};
</script>
<style scoped>
.right{
  text-align: right;
}
</style>
