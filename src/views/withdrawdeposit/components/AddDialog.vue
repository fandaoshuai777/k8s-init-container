<template>
  <div class="diolog" v-if="show">
    <el-dialog title="收货地址" :visible.sync="dialogVisible" :before-close="onClose" :close-on-click-modal="false">
      <el-form ref="formInfo" :rules="rules" :model="formInfo" label-width="100px" size="small" :disabled="disabled">
        <el-form-item label="账户名" prop="supplierName">
          <el-input v-model="formInfo.supplierName" clearable />
        </el-form-item>
        <el-form-item label="账户类型" prop="supplierType">
          <el-select v-model="formInfo.supplierType" placeholder="请选择活动区域">
            <el-option label="个人" value="PERSON"></el-option>
            <el-option label="企业" value="BUSINESS"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="supplierLicenceNo">
          <el-input v-model="formInfo.supplierLicenceNo" clearable  maxlength="18" />
        </el-form-item>
        <el-form-item label="身份证正面" prop="supplierLicenceUrlL">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="riskSuccess"
            :action="actionUrl"
            :headers="{ token: token }"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formInfo.supplierLicenceUrlL" :src="formInfo.supplierLicenceUrlL" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="color: red">请上传JPG、PNG格式文件</div>
        </el-form-item>
        <el-form-item label="描述" prop="type">
          <el-checkbox-group v-model="formInfo.type">
            <el-checkbox label="A" name="type">最多添加3个对公、5个对私账户（添加成功后，暂不支持修改与删除，请谨慎操作！）</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formInfo')">确定</el-button>
        <el-button @click="resetForm('formInfo')">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { Local } from '@/utils/storage';
  import { createUser, detailUser } from '@/api/withdrawdeposit';

  export default {
    data() {
      return {
        dialogVisible: true,
        token: Local.get('token'),
        actionUrl: 'http://operation-server.ciecdev.com/oilStation/upOssImg',
        dialogFormVisible: true,
        formInfo: {
          supplierName: '', // 账户名
          supplierType: 'PERSON', // 账户类型 PERSON：个人, BUSINESS:企业
          supplierLicenceNo: '',  // 身份证号
          supplierLicenceUrlL: 'https://oil-chain-oss-001.oss-cn-hangzhou.aliyuncs.com/fefe70ea94a24b20aa1b75a338d69f53.png', // 身份证图片地址
          type: [],
        },
        rules: {
          supplierName: [
            { required: true, message: '请输入账户名', trigger: 'blur' }
          ],
          supplierLicenceNo: [
            { required: true, message: '请输入身份证号', trigger: 'blur' }
          ],
          supplierType: [
            { required: true, message: '请选择账户类型', trigger: 'change' }
          ],
          supplierLicenceUrlL: [
           { required: true, message: '请选择图片', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请选择', trigger: 'change' }
          ],
        },
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      getDetail(id) {
        detailUser({id: id}).then( res => {
          if (res.code == 0) {
            this.formInfo = {
              supplierName: res.data.supplierName, // 账户名
              supplierType: res.data.supplierType, // 账户类型 PERSON：个人, BUSINESS:企业
              supplierLicenceNo: res.data.supplierLicenceNo,  // 身份证号
              supplierLicenceUrlL: res.data.supplierLicenceUrlL, // 身份证图片地址
              type: ['A'],
            }
          }
        })
      },
      onClose() {
        this.$emit('update:show', false)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const { enterpriseId, userId, userName } = JSON.parse(sessionStorage.getItem("loginUser"));
            const { supplierLicenceNo, supplierLicenceUrlL, supplierName, supplierType, } = this.formInfo;
            let data = {
              merchantId: enterpriseId,         // 商户ID
              operatorId: userId,         // 操作人ID
              operatorName: userName,       // 操作人姓名
              supplierLicenceNo: supplierLicenceNo,  // 身份证号
              supplierLicenceUrl: supplierLicenceUrlL, //身份证地址
              supplierName: supplierName, // 账户名称
              supplierType: supplierType, // 账户类型 PERSON：个人, BUSINESS:企业
            }
            createUser(data).then( res => {
              console.log(res, 'resresres');
              if (res.code == 0) {
                this.$message.success('添加成功');
                this.$emit('update:show', false);
                this.$emit('change');
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$emit('update:show', false)
      },
      riskSuccess(file) {
        console.log(file, 'file')
        // if (file.code === 1) {
        //   this.$message.success('上传成功')
        //   this.oilList.chemicalsBusinessLicense = file.data.name
        // }
      },
      beforeAvatarUpload(file) {
        const isTypeTrue = /^image\/(jpeg|png|jpg)$/.test(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isTypeTrue) {
          this.$message.error('上传头像图片只能是 JPG 格式和PNG 格式')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isTypeTrue && isLt2M
      },
    },
  }
</script>
<style>
 .el-upload {
    border: 1px dashed #d9d9d9!important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>