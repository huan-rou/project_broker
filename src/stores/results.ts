import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { calculateCase, getCaseResults, listCalculators } from '../services/demoApi'
import type { CalculatorInfo, CalculatorScenarioResult, UnifiedInput } from '../types'

export const useResultsStore = defineStore('results', () => {
  const calculators = ref<CalculatorInfo[]>([])
  const scenario = ref<CalculatorScenarioResult | null>(null)
  const loading = ref(false)
  const error = ref('')

  const results = computed(() => scenario.value?.results || [])

  async function loadCalculators() {
    calculators.value = await listCalculators()
  }

  async function loadCaseResults(caseId: number) {
    loading.value = true
    try {
      scenario.value = await getCaseResults(caseId)
      error.value = ''
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load results'
    } finally {
      loading.value = false
    }
  }

  async function run(caseId: number, input: UnifiedInput) {
    loading.value = true
    try {
      scenario.value = await calculateCase(caseId, input)
      error.value = ''
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Calculation failed'
    } finally {
      loading.value = false
    }
  }

  function clear() {
    scenario.value = null
    error.value = ''
  }

  return {
    calculators,
    scenario,
    results,
    loading,
    error,
    loadCalculators,
    loadCaseResults,
    run,
    clear,
  }
})
