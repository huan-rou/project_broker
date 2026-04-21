<script setup lang="ts">
import { useInputStore } from '../../stores/input'
import { EntityType } from '../../types'

const store = useInputStore()
const entityTypes = Object.values(EntityType)

const addbackFields = [
  { key: 'addback_director_salary', label: 'Director/Partner Salary' },
  { key: 'addback_interest', label: 'Interest Expense' },
  { key: 'addback_super', label: 'Superannuation (excess)' },
  { key: 'addback_depreciation', label: 'Depreciation/Amortisation' },
  { key: 'addback_other_non_cash', label: 'Other Non-Cash Expenses' },
  { key: 'addback_other', label: 'Other' },
] as const
</script>

<template>
  <div class="tab-section">
    <div class="section-header">
      <h3>Self-Employed Entities</h3>
      <button class="btn-sm btn-add" @click="store.addSelfEmployedEntity()">+ Add Entity</button>
    </div>

    <div v-if="!store.selfEmployedEntities.length" class="empty">
      No self-employed entities. Click "Add Entity" if applicable.
    </div>

    <div v-for="(entity, idx) in store.selfEmployedEntities" :key="idx" class="entity-card">
      <div class="card-header">
        <strong>Entity {{ idx + 1 }}</strong>
        <button class="btn-sm btn-danger" @click="store.removeSelfEmployedEntity(idx)">Remove</button>
      </div>

      <div class="form-grid-2">
        <div class="field span-full">
          <label>Entity Type</label>
          <select v-model="entity.entity_type">
            <option v-for="t in entityTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <h4>Profit & Loss</h4>
      <div class="pl-grid">
        <div></div><div class="col-header">Year 1</div><div class="col-header">Year 2</div>
        <div class="row-label">Net Profit Before Tax</div>
        <div><input v-model.number="entity.year1_npbt" type="number" /></div>
        <div><input v-model.number="entity.year2_npbt" type="number" /></div>
        <div class="row-label">Less Non-Recurring</div>
        <div><input v-model.number="entity.year1_non_recurring" type="number" /></div>
        <div><input v-model.number="entity.year2_non_recurring" type="number" /></div>
      </div>

      <h4>Addbacks</h4>
      <div class="addback-toggle">
        <label>
          <input type="checkbox" v-model="entity.use_detailed_addbacks" />
          Use detailed addback breakdown
        </label>
      </div>

      <!-- Total addbacks (simple mode) -->
      <div v-if="!entity.use_detailed_addbacks" class="pl-grid">
        <div></div><div class="col-header">Year 1</div><div class="col-header">Year 2</div>
        <div class="row-label">Total Addbacks</div>
        <div><input v-model.number="entity.total_addbacks_yr1" type="number" /></div>
        <div><input v-model.number="entity.total_addbacks_yr2" type="number" /></div>
      </div>

      <!-- Detailed addbacks (breakdown mode) -->
      <div v-else class="pl-grid">
        <div></div><div class="col-header">Year 1</div><div class="col-header">Year 2</div>
        <template v-for="ab in addbackFields" :key="ab.key">
          <div class="row-label">{{ ab.label }}</div>
          <div><input v-model.number="(entity as any)[ab.key][0]" type="number" /></div>
          <div><input v-model.number="(entity as any)[ab.key][1]" type="number" /></div>
        </template>
      </div>

      <h4>Business Debt</h4>
      <div class="form-grid-2">
        <div class="field">
          <label>Limit ($)</label>
          <input v-model.number="entity.business_debt_limit" type="number" />
        </div>
        <div class="field">
          <label>Term (Years)</label>
          <input v-model.number="entity.business_debt_term_years" type="number" />
        </div>
        <div class="field">
          <label>Rate (%)</label>
          <input v-model.number="entity.business_debt_rate" type="number" step="0.01" />
        </div>
        <div class="field">
          <label>Declared Repayment (annual)</label>
          <input v-model.number="entity.business_debt_declared_repayment" type="number" />
        </div>
      </div>

      <h4>Allocation to Applicants (%)</h4>
      <div class="alloc-grid">
        <div v-for="(app, i) in store.applicants" :key="i" class="field">
          <label>{{ app.name }}</label>
          <input v-model.number="entity.allocation_pct[i]" type="number" min="0" max="1" step="0.01" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-section h3 { margin: 0; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.entity-card {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;
}
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
h4 { font-size: 0.875rem; color: #334155; margin: 1rem 0 0.5rem; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.span-full { grid-column: span 2; }
.pl-grid { display: grid; grid-template-columns: 200px 1fr 1fr; gap: 0.35rem 0.5rem; align-items: center; }
.col-header { font-size: 0.75rem; font-weight: 600; color: #64748b; text-align: center; }
.row-label { font-size: 0.8rem; color: #334155; }
.alloc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
.field label { display: block; font-size: 0.8rem; color: #475569; margin-bottom: 0.2rem; font-weight: 500; }
.field input, .field select {
  width: 100%; padding: 0.35rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;
  font-size: 0.85rem; box-sizing: border-box;
}
.pl-grid input { padding: 0.35rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.85rem; width: 100%; box-sizing: border-box; }
.addback-toggle { margin-bottom: 0.5rem; }
.addback-toggle label {
  font-size: 0.85rem; color: #334155; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
}
.empty { color: #94a3b8; padding: 1rem 0; font-size: 0.875rem; }
.btn-sm { padding: 0.25rem 0.625rem; font-size: 0.75rem; border-radius: 4px; cursor: pointer; border: none; }
.btn-add { background: #dbeafe; color: #1e40af; }
.btn-danger { background: #fee2e2; color: #dc2626; }
</style>
