<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'

const adminStore = useAdminStore()

onMounted(() => {
  void adminStore.loadAll()
})
</script>

<template>
  <section class="page-card user-panel">
    <div class="panel-head">
      <div>
        <p class="eyebrow">User Management</p>
        <h2 class="section-title">Demo identities and access posture</h2>
      </div>
    </div>

    <div class="user-list">
      <article v-for="user in adminStore.users" :key="user.id" class="user-row">
        <div>
          <strong>{{ user.displayName }}</strong>
          <p>{{ user.username }} · {{ user.teamName }}</p>
        </div>
        <div class="user-meta">
          <span class="pill" :class="user.status === 'active' ? 'success' : user.status === 'disabled' ? 'danger' : 'warning'">{{ user.status }}</span>
          <button class="btn-secondary" @click="adminStore.toggleStatus(user.id)">Toggle Status</button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.user-panel {
  padding: 1.25rem;
}

.user-list {
  display: grid;
  gap: 0.8rem;
}

.user-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
}

.user-row p {
  margin: 0.2rem 0 0;
  color: var(--ink-soft);
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .user-row {
    flex-direction: column;
  }
}
</style>
