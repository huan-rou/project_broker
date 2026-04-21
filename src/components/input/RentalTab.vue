<script setup lang="ts">
import { useInputStore } from '../../stores/input'
import { Frequency } from '../../types'

const store = useInputStore()
const frequencies = Object.values(Frequency)
</script>

<template>
  <div class="tab-section">
    <div class="section-header">
      <h3>Rental Properties</h3>
      <button class="btn-sm btn-add" @click="store.addRentalProperty()">+ Add Property</button>
    </div>

    <div v-if="!store.rentalProperties.length" class="empty">
      No rental properties. Click "Add Property" if applicable.
    </div>

    <div v-for="(prop, idx) in store.rentalProperties" :key="idx" class="prop-card">
      <div class="card-header">
        <strong>Property {{ idx + 1 }}</strong>
        <button class="btn-sm btn-danger" @click="store.removeRentalProperty(idx)">Remove</button>
      </div>
      <div class="form-grid">
        <div class="field span-3">
          <label>Address</label>
          <input v-model="prop.address" />
        </div>
        <div class="field">
          <label>Postcode</label>
          <input v-model="prop.postcode" />
        </div>
        <div class="field">
          <label>State</label>
          <input v-model="prop.state" placeholder="NSW, VIC..." />
        </div>
        <div class="field">
          <label>High Density (&gt;35 units)</label>
          <select v-model="prop.high_density">
            <option :value="null">Auto-detect</option>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>
        <div class="field">
          <label>Declared Rent ($)</label>
          <input v-model.number="prop.declared_rent" type="number" min="0" />
        </div>
        <div class="field">
          <label>Frequency</label>
          <select v-model="prop.frequency">
            <option v-for="f in frequencies" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>
      </div>

      <h4>Ownership %</h4>
      <div class="alloc-grid">
        <div v-for="(app, i) in store.applicants" :key="i" class="field">
          <label>{{ app.name }}</label>
          <input v-model.number="prop.ownership_pct[i]" type="number" min="0" max="1" step="0.01" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-section h3 { margin: 0; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.prop-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
h4 { font-size: 0.875rem; color: #334155; margin: 1rem 0 0.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
.span-3 { grid-column: span 3; }
.alloc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
.field label { display: block; font-size: 0.8rem; color: #475569; margin-bottom: 0.2rem; font-weight: 500; }
.field input, .field select {
  width: 100%; padding: 0.4rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;
  font-size: 0.875rem; box-sizing: border-box;
}
.empty { color: #94a3b8; padding: 1rem 0; font-size: 0.875rem; }
.btn-sm { padding: 0.25rem 0.625rem; font-size: 0.75rem; border-radius: 4px; cursor: pointer; border: none; }
.btn-add { background: #dbeafe; color: #1e40af; }
.btn-danger { background: #fee2e2; color: #dc2626; }
</style>
