import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { advanceDocumentWorkflow, getCaseDocuments, organizeCaseDocuments, uploadCaseDocuments } from '../services/demoApi'
import type { DemoDocument, OrganizedDocumentGroup } from '../types'

export const useDocumentsStore = defineStore('documents', () => {
  const items = ref<DemoDocument[]>([])
  const organized = ref<OrganizedDocumentGroup | null>(null)
  const loading = ref(false)
  const workflowTimers = new Map<number, number[]>()

  const completion = computed(() => {
    if (!items.value.length) return 0
    const score = items.value.reduce((total, item) => total + (item.status === 'validated' ? 1 : item.status === 'extracted' ? 0.8 : item.status === 'classified' ? 0.6 : item.status === 'ocr_processing' ? 0.3 : 0.1), 0)
    return Math.round((score / items.value.length) * 100)
  })

  function clearTimers(caseId: number) {
    const timers = workflowTimers.get(caseId) || []
    timers.forEach((id) => window.clearTimeout(id))
    workflowTimers.delete(caseId)
  }

  async function load(caseId: number) {
    loading.value = true
    try {
      items.value = await getCaseDocuments(caseId)
    } finally {
      loading.value = false
    }
  }

  async function upload(caseId: number, filenames: string[]) {
    const uploaded = await uploadCaseDocuments(caseId, filenames)
    items.value = [...uploaded, ...items.value]
    uploaded.forEach((doc, index) => startWorkflow(caseId, doc.id, index * 800))
  }

  function startWorkflow(caseId: number, documentId: number, offsetMs = 0) {
    const steps = [1200, 2600, 4000, 5600]
    const ids = steps.map((delayMs) =>
      window.setTimeout(async () => {
        const next = await advanceDocumentWorkflow(caseId, documentId)
        const idx = items.value.findIndex((item) => item.id === documentId)
        if (idx >= 0) items.value.splice(idx, 1, next)
      }, delayMs + offsetMs),
    )
    workflowTimers.set(caseId, [...(workflowTimers.get(caseId) || []), ...ids])
  }

  async function stepDocument(caseId: number, documentId: number) {
    const next = await advanceDocumentWorkflow(caseId, documentId)
    const idx = items.value.findIndex((item) => item.id === documentId)
    if (idx >= 0) items.value.splice(idx, 1, next)
  }

  async function organize(caseId: number) {
    organized.value = await organizeCaseDocuments(caseId)
  }

  return {
    items,
    organized,
    loading,
    completion,
    load,
    upload,
    organize,
    stepDocument,
    clearTimers,
  }
})
