<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'

const adminStore = useAdminStore()

onMounted(() => {
  void adminStore.loadAll()
})
</script>

<template>
  <section v-if="adminStore.providerConfig" class="page-card config-panel">
    <div class="panel-head">
      <div>
        <p class="eyebrow">Provider Configuration</p>
        <h2 class="section-title">Control the demo's LLM, OCR and masking posture</h2>
      </div>
      <button class="btn-primary" @click="adminStore.saveConfig">Save Demo Config</button>
    </div>

    <div class="config-grid">
      <label class="config-block">
        <span class="field-label">Masking Enabled</span>
        <select v-model="adminStore.providerConfig.maskingEnabled" class="field-select">
          <option :value="true">Enabled</option>
          <option :value="false">Disabled</option>
        </select>
      </label>
      <label class="config-block">
        <span class="field-label">Masking Strategy</span>
        <select v-model="adminStore.providerConfig.maskingStrategy" class="field-select">
          <option value="auto">Auto</option>
          <option value="aggressive">Aggressive</option>
          <option value="minimal">Minimal</option>
        </select>
      </label>
      <label class="config-block">
        <span class="field-label">Primary LLM</span>
        <select v-model="adminStore.providerConfig.llmProvider" class="field-select">
          <option v-for="provider in adminStore.providerConfig.llmProviders" :key="provider.key" :value="provider.key">
            {{ provider.label }}
          </option>
        </select>
      </label>
      <label class="config-block">
        <span class="field-label">OCR Dispatch Mode</span>
        <select v-model="adminStore.providerConfig.ocrMode" class="field-select">
          <option value="fallback">Fallback</option>
          <option value="parallel">Parallel</option>
        </select>
      </label>
    </div>

    <div class="toggle-lists">
      <article class="page-card sub-card">
        <p class="eyebrow">LLM Providers</p>
        <label v-for="provider in adminStore.providerConfig.llmProviders" :key="provider.key" class="toggle-row">
          <span>{{ provider.label }}</span>
          <input v-model="provider.enabled" type="checkbox" />
        </label>
      </article>

      <article class="page-card sub-card">
        <p class="eyebrow">OCR Providers</p>
        <label v-for="provider in adminStore.providerConfig.ocrProviders" :key="provider.key" class="toggle-row">
          <span>{{ provider.label }}</span>
          <input v-model="provider.enabled" type="checkbox" />
        </label>
      </article>
    </div>
  </section>
</template>

<style scoped>
.config-panel,
.sub-card {
  padding: 1.25rem;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.config-grid,
.toggle-lists {
  display: grid;
  gap: 1rem;
}

.config-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-bottom: 1rem;
}

.config-block {
  display: grid;
  gap: 0.4rem;
}

.toggle-lists {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--line);
}

@media (max-width: 900px) {
  .panel-head,
  .toggle-lists {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
