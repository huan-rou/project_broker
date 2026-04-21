import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { createCase, getCaseDetails, listCases } from '../services/demoApi'
import type { DemoCase } from '../types'

export const useCasesStore = defineStore('cases', () => {
  const items = ref<DemoCase[]>([])
  const currentCase = ref<DemoCase | null>(null)
  const loading = ref(false)

  const totalCases = computed(() => items.value.length)
  const activeCases = computed(() => items.value.filter((item) => item.status === 'active'))

  async function loadCases() {
    loading.value = true
    try {
      items.value = await listCases()
    } finally {
      loading.value = false
    }
  }

  async function loadCase(caseId: number) {
    loading.value = true
    try {
      currentCase.value = await getCaseDetails(caseId)
      return currentCase.value
    } finally {
      loading.value = false
    }
  }

  async function quickCreateCase(name: string) {
    const created = await createCase(name)
    items.value = [created, ...items.value]
    currentCase.value = created
    return created
  }

  return {
    items,
    currentCase,
    loading,
    totalCases,
    activeCases,
    loadCases,
    loadCase,
    quickCreateCase,
  }
})
