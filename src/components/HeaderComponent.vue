<script setup lang="ts">
import { fetchBranches } from '../utils/branches.utils'
import { Branch } from '../models/branches/branches.interface'
import { onMounted, ref } from 'vue'

const branches = ref([] as Branch[])
const selectedBranch = ref('Выберите отделения')

const getBranches = async () => {
  const result = await fetchBranches()
  branches.value = result
  // console.log(result);
}
onMounted(() => {
  getBranches()
})
</script>
<template>
  <div class="header-container w-full h-full">
    <div class="branch-select h-full float-end">
      <select v-model="selectedBranch" class="form-select" aria-label="Default select example">
        <option selected>Выберите отделения</option>
        <option v-for="branch in branches" :key="branch.id">
          {{ branch.name }}
        </option>
      </select>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.header-container {
  background-color: rgb(169, 170, 171);
}
</style>
