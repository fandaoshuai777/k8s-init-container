<template>
  <div class="diolog" v-if="show">
    <el-dialog title="收货地址" :visible.sync="dialogVisible" :before-close="onClose">
      <el-form ref="formInfo" :rules="rules" :model="formInfo" label-width="100px" size="small">
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
          <el-input v-model="formInfo.supplierLicenceNo" clearable />
        </el-form-item>
        <el-form-item label="身份证正面" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="riskSuccess"
            :action="actionUrl"
            :headers="{ token: token }"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formInfo.imageUrl" :src="formInfo.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="color: red">请上传JPG、PNG格式文件</div>
        </el-form-item>
        <el-form-item prop="checked">
          <el-checkbox v-model="formInfo.checked">最多添加3个对公、5个对私账户（添加成功后，暂不支持修改与删除，请谨慎操作！）</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formInfo')">立即创建</el-button>
          <el-button @click="resetForm('formInfo')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import { Local } from '@/utils/storage';
  export default {
    data() {
      return {
        dialogVisible: true,
        token: Local.get('token'),
        actionUrl: process.env.VUE_APP_BASE_API2 + 'oilStation/upOssImg',
        dialogFormVisible: true,
        formInfo: {
          supplierName: '', // 账户名
          supplierType: 'PERSON', // 账户类型 PERSON：个人, BUSINESS:企业
          supplierLicenceNo: '',  // 身份证号
          supplierLicenceUrlL: '', // 身份证图片地址
          channelType: '',  // 渠道类型
          imageUrl: '',
          checked: false,
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
          imageUrl: [
           { required: true, message: '请选择图片', trigger: 'change' }
          ]
        }
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onClose() {
        this.$emit('update:show', false)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            this.$emit('update:show', false)
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