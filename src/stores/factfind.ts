import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { applyFactFindPrefill, getFactFind, importInterviewSummary, previewFactFindPrefill, updateFactFindField } from '../services/demoApi'
import type { FactFindSnapshot, PrefillPreviewChange } from '../types'

export const useFactFindStore = defineStore('factfind', () => {
  const snapshot = ref<FactFindSnapshot | null>(null)
  const previewChanges = ref<PrefillPreviewChange[]>([])
  const loading = ref(false)

  const completion = computed(() => {
    if (!snapshot.value?.sections.length) return 0
    return Math.round(snapshot.value.sections.reduce((total, section) => total + section.completion, 0) / snapshot.value.sections.length)
  })

  async function load(caseId: number) {
    loading.value = true
    try {
      snapshot.value = await getFactFind(caseId)
    } finally {
      loading.value = false
    }
  }

  async function updateField(caseId: number, sectionId: string, fieldId: string, value: string) {
    snapshot.value = await updateFactFindField(caseId, sectionId, fieldId, value)
  }

  async function loadPreview(caseId: number) {
    previewChanges.value = await previewFactFindPrefill(caseId)
  }

  async function applyPreview(caseId: number) {
    snapshot.value = await applyFactFindPrefill(caseId, previewChanges.value)
    previewChanges.value = []
  }

  async function importInterview(caseId: number) {
    snapshot.value = await importInterviewSummary(caseId)
  }

  function togglePreview(id: string) {
    const item = previewChanges.value.find((entry) => entry.id === id)
    if (item) item.selected = !item.selected
  }

  return {
    snapshot,
    previewChanges,
    loading,
    completion,
    load,
    updateField,
    loadPreview,
    applyPreview,
    importInterview,
    togglePreview,
  }
})
