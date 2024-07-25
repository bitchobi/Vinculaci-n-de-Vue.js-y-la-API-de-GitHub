<template>
  <div>
    <el-col :span="12">
      <el-card class="box-card" shadow="hover" style="margin: 5px 0;">
        <el-row :gutter="12">
          <el-col :span="21">{{ isTodo ? item : item.title }}</el-col>
          <el-col :span="3">
            <el-button @click="removeItem" type="success" icon="el-icon-check" circle></el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    item: {
      type: [String, Object],
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isTodo: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    removeItem() {
      this.$emit('remove-item', this.index);
    }
  }
}
</script>
