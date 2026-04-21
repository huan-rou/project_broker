<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'

const adminStore = useAdminStore()

onMounted(() => {
  void adminStore.loadAll()
})
</script>

<template>
  <div class="audit-grid">
    <section class="page-card audit-panel">
      <p class="eyebrow">Audit Trail</p>
      <h2 class="section-title">Recent actions across brokers, system jobs and admin changes</h2>
      <div class="audit-list">
        <article v-for="event in adminStore.auditEvents" :key="event.id" class="audit-row">
          <div>
            <strong>{{ event.action }}</strong>
            <p>{{ event.actor }} · {{ event.resourceType }} · {{ event.resourceId }}</p>
          </div>
          <div class="audit-side">
            <span class="pill" :class="event.severity === 'critical' ? 'danger' : event.severity === 'warning' ? 'warning' : 'info'">{{ event.severity }}</span>
            <span>{{ new Date(event.createdAt).toLocaleString() }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="page-card alerts-panel">
      <p class="eyebrow">File Audit</p>
      <h2 class="section-title">Masking alerts and external-send visibility</h2>
      <div class="audit-list">
        <article v-for="alert in adminStore.leakageAlerts" :key="alert.id" class="audit-row">
          <div>
            <strong>{{ alert.documentName }}</strong>
            <p>{{ alert.caseName }} · sent to {{ alert.destination }}</p>
          </div>
          <div class="audit-side">
            <span class="pill" :class="alert.flagged ? 'danger' : 'success'">
              {{ alert.flagged ? 'flagged' : 'masked' }}
            </span>
            <span>{{ alert.actor }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.audit-grid {
  display: grid;
  gap: 1rem;
}

.audit-panel,
.alerts-panel {
  padding: 1.25rem;
}

.audit-list {
  display: grid;
  gap: 0.8rem;
}

.audit-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
}

.audit-row p {
  margin: 0.2rem 0 0;
  color: var(--ink-soft);
}

.audit-side {
  display: grid;
  gap: 0.45rem;
  justify-items: end;
}

@media (max-width: 720px) {
  .audit-row {
    flex-direction: column;
  }

  .audit-side {
    justify-items: start;
  }
}
</style>
