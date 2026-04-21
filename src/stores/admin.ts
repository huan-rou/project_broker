import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getProviderConfig, listAuditEvents, listLeakageAlerts, listUsers, toggleUserStatus, updateProviderConfig } from '../services/demoApi'
import type { AdminAuditEvent, DemoUser, LeakageAlert, ProviderConfigState } from '../types'

export const useAdminStore = defineStore('admin', () => {
  const users = ref<DemoUser[]>([])
  const auditEvents = ref<AdminAuditEvent[]>([])
  const leakageAlerts = ref<LeakageAlert[]>([])
  const providerConfig = ref<ProviderConfigState | null>(null)
  const loading = ref(false)

  async function loadAll() {
    loading.value = true
    try {
      const [nextUsers, nextEvents, nextAlerts, nextConfig] = await Promise.all([
        listUsers(),
        listAuditEvents(),
        listLeakageAlerts(),
        getProviderConfig(),
      ])
      users.value = nextUsers
      auditEvents.value = nextEvents
      leakageAlerts.value = nextAlerts
      providerConfig.value = nextConfig
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(userId: number) {
    const updated = await toggleUserStatus(userId)
    const index = users.value.findIndex((item) => item.id === userId)
    if (index >= 0) users.value.splice(index, 1, updated)
  }

  async function saveConfig() {
    if (!providerConfig.value) return
    providerConfig.value = await updateProviderConfig(providerConfig.value)
  }

  return {
    users,
    auditEvents,
    leakageAlerts,
    providerConfig,
    loading,
    loadAll,
    toggleStatus,
    saveConfig,
  }
})
