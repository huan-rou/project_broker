<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'

const adminStore = useAdminStore()

const metrics = computed(() => ({
  users: adminStore.users.length,
  flagged: adminStore.leakageAlerts.filter((item) => item.flagged).length,
  audit: adminStore.auditEvents.length,
  masking: adminStore.providerConfig?.maskingEnabled ? 'On' : 'Off',
}))

onMounted(() => {
  void adminStore.loadAll()
})
</script>

<template>
  <div class="admin-grid">
    <section class="summary-grid">
      <article class="metric-card page-card">
        <span>Users</span>
        <strong>{{ metrics.users }}</strong>
      </article>
      <article class="metric-card page-card">
        <span>Audit Events</span>
        <strong>{{ metrics.audit }}</strong>
      </article>
      <article class="metric-card page-card danger">
        <span>Flagged Sends</span>
        <strong>{{ metrics.flagged }}</strong>
      </article>
      <article class="metric-card page-card">
        <span>Masking</span>
        <strong>{{ metrics.masking }}</strong>
      </article>
    </section>

    <section class="page-card panel">
      <p class="eyebrow">Operations Snapshot</p>
      <h2 class="section-title">Privacy posture, provider mix and audit visibility in one admin lane.</h2>
      <p class="section-copy">
        This admin area stays intentionally lightweight, but it surfaces the exact knobs and alerts
        that matter during a product walkthrough: masking, provider mode, user access and leakage risk.
      </p>
    </section>
  </div>
</template>

<style scoped>
.admin-grid,
.summary-grid {
  display: grid;
  gap: 1rem;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card,
.panel {
  padding: 1.25rem;
}

.metric-card span {
  color: var(--ink-soft);
}

.metric-card strong {
  font-size: 1.7rem;
}

.danger strong {
  color: var(--danger);
}

@media (max-width: 960px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
