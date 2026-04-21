<script setup lang="ts">
import type { DerivedFieldsPerCalculator } from '../../types'

defineProps<{
  derived: DerivedFieldsPerCalculator[]
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  calculate: []
}>()
</script>

<template>
  <div v-if="visible" class="overlay" @click.self="emit('close')">
    <div class="panel">
      <div class="panel-header">
        <h2>Derived Field Preview</h2>
        <button class="close-btn" @click="emit('close')">&times;</button>
      </div>
      <div class="panel-body">
        <article v-for="calc in derived" :key="calc.calculator_id" class="calc-section">
          <h3>{{ calc.calculator_name }}</h3>
          <p>Assessment rate: {{ (calc.assessment_rate * 100).toFixed(2) }}%</p>
          <p>Location label: {{ calc.location_label }}</p>
          <p>HEM monthly: {{ calc.hem_monthly.toLocaleString() }}</p>
        </article>
      </div>
      <div class="panel-footer">
        <button class="btn-secondary" @click="emit('close')">Close</button>
        <button class="btn-primary" @click="emit('calculate')">Accept & Calculate</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; justify-content: flex-end; z-index: 200;
}
.panel {
  width: 600px; max-width: 90vw; height: 100vh;
  background: white; display: flex; flex-direction: column;
  box-shadow: -4px 0 24px rgba(0,0,0,0.15);
}
.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0;
}
.panel-header h2 { margin: 0; font-size: 1.1rem; color: #1e293b; }
.close-btn {
  border: none; background: none; font-size: 1.5rem; color: #94a3b8;
  cursor: pointer; padding: 0 0.25rem; line-height: 1;
}
.close-btn:hover { color: #475569; }

.panel-body { flex: 1; overflow-y: auto; padding: 1.5rem; }

.calc-section { margin-bottom: 1.5rem; }
.calc-title {
  font-size: 1rem; color: #1e40af; margin: 0 0 1rem;
  padding-bottom: 0.5rem; border-bottom: 2px solid #dbeafe;
}

.section { margin-bottom: 1.25rem; }
.section h4 {
  font-size: 0.85rem; color: #475569; margin: 0 0 0.5rem;
  text-transform: uppercase; letter-spacing: 0.05em;
}

.detail-grid { display: flex; flex-direction: column; gap: 0.25rem; }
.detail-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.3rem 0.5rem; border-radius: 4px;
}
.detail-row:nth-child(even) { background: #f8fafc; }
.detail-row.total { border-top: 1px solid #e2e8f0; margin-top: 0.25rem; padding-top: 0.5rem; }

.label { font-size: 0.85rem; color: #334155; }
.value { font-size: 0.85rem; color: #1e293b; font-weight: 500; font-variant-numeric: tabular-nums; }
.value.highlight { color: #2563eb; font-weight: 600; }
.value.negative { color: #dc2626; }

.applicant-block { margin-bottom: 0.75rem; }
.app-label { font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 0.25rem; }

.haircut-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
.haircut-table th {
  text-align: left; padding: 0.35rem 0.5rem; color: #64748b;
  border-bottom: 1px solid #e2e8f0; font-weight: 600;
}
.haircut-table th.right, .haircut-table td.right { text-align: right; }
.haircut-table td { padding: 0.3rem 0.5rem; border-bottom: 1px solid #f1f5f9; }

.error-msg {
  padding: 0.75rem; background: #fef2f2; border: 1px solid #fecaca;
  border-radius: 6px; color: #dc2626; font-size: 0.85rem;
}
.no-data { color: #94a3b8; font-size: 0.8rem; font-style: italic; }

.panel-footer {
  display: flex; justify-content: flex-end; gap: 0.5rem;
  padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0;
}
.btn-primary {
  padding: 0.5rem 1.25rem; background: #2563eb; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500;
}
.btn-primary:hover { background: #1d4ed8; }
.btn-secondary {
  padding: 0.5rem 1.25rem; background: white; color: #475569;
  border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; font-size: 0.875rem;
}
.btn-secondary:hover { background: #f8fafc; }
</style>
