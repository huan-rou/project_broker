<script setup lang="ts">
import { useInputStore } from '../../stores/input'

const store = useInputStore()
</script>

<template>
  <div class="tab-section">
    <h3>Advanced Options</h3>
    <p class="description">
      These settings affect specific calculators. Most users can leave them at their defaults.
    </p>

    <div class="options-grid">
      <div class="option-card">
        <h4>Resimac Options</h4>
        <div class="checkbox-row">
          <label>
            <input type="checkbox" v-model="store.advanced.essential_services" />
            <span class="option-label">
              <strong>Essential Services Worker</strong>
              <span class="option-hint">Boosts overtime haircut multiplier (Resimac only)</span>
            </span>
          </label>
        </div>
        <div class="checkbox-row">
          <label>
            <input type="checkbox" v-model="store.advanced.simple_refinance" />
            <span class="option-label">
              <strong>Simple Refinance</strong>
              <span class="option-hint">Uses 1% buffer instead of 2% for existing loan refinancing (Resimac only)</span>
            </span>
          </label>
        </div>
      </div>

      <div class="option-card">
        <h4>Calculator Selection</h4>
        <div class="calculator-list">
          <label class="checkbox-row">
            <input
              type="checkbox"
              :checked="store.selectedCalculators.includes('bocal')"
              @change="
                store.selectedCalculators.includes('bocal')
                  ? store.selectedCalculators.splice(store.selectedCalculators.indexOf('bocal'), 1)
                  : store.selectedCalculators.push('bocal')
              "
            />
            <span class="option-label">
              <strong>BOCAL</strong>
              <span class="option-hint">Bank of China Australia Limited - NIS-based serviceability</span>
            </span>
          </label>
          <label class="checkbox-row">
            <input
              type="checkbox"
              :checked="store.selectedCalculators.includes('brighten')"
              @change="
                store.selectedCalculators.includes('brighten')
                  ? store.selectedCalculators.splice(store.selectedCalculators.indexOf('brighten'), 1)
                  : store.selectedCalculators.push('brighten')
              "
            />
            <span class="option-label">
              <strong>Brighten</strong>
              <span class="option-hint">Brighten Home Loans - NSI/NSR-based serviceability (v23)</span>
            </span>
          </label>
          <label class="checkbox-row disabled">
            <input type="checkbox" disabled />
            <span class="option-label">
              <strong>Resimac</strong>
              <span class="option-hint">Coming soon - DSR + NSR dual-metric</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-section h3 { margin: 0 0 0.5rem; }
.description { font-size: 0.85rem; color: #64748b; margin-bottom: 1.25rem; }

.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.option-card {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem;
}
.option-card h4 {
  font-size: 0.875rem; color: #334155; margin: 0 0 0.75rem;
  padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9;
}

.checkbox-row {
  display: flex; align-items: flex-start; gap: 0.5rem;
  padding: 0.5rem 0; cursor: pointer;
}
.checkbox-row input[type="checkbox"] { margin-top: 0.15rem; }
.checkbox-row.disabled { opacity: 0.5; cursor: not-allowed; }

.option-label { display: flex; flex-direction: column; }
.option-label strong { font-size: 0.85rem; color: #1e293b; }
.option-hint { font-size: 0.75rem; color: #94a3b8; margin-top: 0.1rem; }

.calculator-list { display: flex; flex-direction: column; gap: 0.25rem; }
</style>
