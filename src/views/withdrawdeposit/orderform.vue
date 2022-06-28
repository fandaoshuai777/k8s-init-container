<template>
	<div>
		<el-card shadow="hover">
			<el-form  :model="formInfo"  :inline="true" size="small" >
				<el-form-item label="提现编码" >
					<el-input v-model="formInfo.orderNo" type="number" maxlength="30"></el-input>
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
						<el-option v-for="(item, index) in selectList" :key="index" :label="item.supplierName" :value="item.supplierName"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="交易流水号" >
					<el-input v-model="formInfo.channelOrderNo"></el-input>
				</el-form-item>
				<el-form-item label="提现账号">
					<el-input v-model="formInfo.payeeAccount" type="number"></el-input>
				</el-form-item>
				<el-form-item label="开户行">
					<el-input v-model="formInfo.bankName"></el-input>
				</el-form-item>
				<el-form-item >
					<el-button type="primary" size="small" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>

			<el-table :data="tableData" border style="width: 100%" v-loading="loading" :span-method="objectSpanMethod">
				<el-table-column prop="orderNo" label="提现编码" width="250" align="center"></el-table-column>
				<el-table-column prop="channelOrderNo" label="交易流水号" width="250" align="center"></el-table-column>
				<el-table-column prop="amount" label="提现金额（元）" align="center"></el-table-column>
				<el-table-column prop="payeeAccount" label="提现账户" width="220" align="center"></el-table-column>
				<el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
				<el-table-column prop="orderStatus" label="状态" align="center"></el-table-column>
				<el-table-column prop="orderTime" label="发起时间" width="220" align="center"></el-table-column>
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
import { getList, select_by_merchant_id } from "@/api/withdrawdeposit";

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
			loading: false,
		};
	},
	created() {
		this.init();
		this.getmerList();
	},
	methods: {
		async init() {
			this.loading = true;
			const {time} = this.formInfo;
			let data = {
				...this.formInfo,
				startTime: time && time[0],
				endTime: time && time[1],
				merchantId: sessionStorage.getItem("merchantId"),
			}
			
			const res = await getList(data);
			this.loading = false;
			if (res.code == 0) {
				var arr = [];
				res.data.list.map( item => {
					arr = [...arr, ...item.withdrawaInfoList]
				})
				this.tableData = arr;
				this.total = Number(res.data.total)
			}
		},
		async getmerList() {
			// const res = await getmerList({merchantId: 1111129709});
			const res = await select_by_merchant_id({merchantId: sessionStorage.getItem("merchantId")});
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
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
				let tt = 1;
        let i = rowIndex + 1;
        let strCmp = this.tableData[rowIndex].orderNo;
        if (rowIndex != 0) {
          if (this.tableData[rowIndex - 1].orderNo == strCmp) {
            return {
              rowspan: 0,
              colspan: 0,
            };
          }
        }
        while (i < this.tableData.length) {
          if (this.tableData[i++].orderNo == strCmp) {
            tt++;
          } else {
            break;
          }
        }
        return {
          rowspan: tt,
          colspan: 1,
        };
			}
		}
	},
};
</script>
<style scoped>
.right{
  text-align: right;
}
</style>
