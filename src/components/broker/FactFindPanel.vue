<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFactFindStore } from '../../stores/factfind'

const props = defineProps<{
  caseId: number
}>()

const factFindStore = useFactFindStore()
const sourceClass: Record<string, string> = {
  manual: 'info',
  ocr: 'success',
  interview: 'warning',
}

const versionLabel = computed(() => factFindStore.snapshot?.version ?? 0)

onMounted(() => {
  if (!factFindStore.snapshot || factFindStore.snapshot.caseId !== props.caseId) {
    void factFindStore.load(props.caseId)
  }
})

function onFieldChange(sectionId: string, fieldId: string, event: Event) {
  const target = event.target as HTMLInputElement
  void factFindStore.updateField(props.caseId, sectionId, fieldId, target.value)
}
</script>

<template>
  <div v-if="factFindStore.snapshot" class="factfind-grid">
    <section class="factfind-hero page-card">
      <div>
        <p class="eyebrow">Versioned Fact Find</p>
        <h3 class="section-title">Human-in-the-loop prefill with clear source badges.</h3>
        <p class="section-copy">
          Each field can be edited manually while preserving where the value came from:
          OCR, interview import or broker adjustment.
        </p>
      </div>
      <div class="hero-side">
        <div>
          <span class="field-label">Current Version</span>
          <strong>v{{ versionLabel }}</strong>
        </div>
        <div>
          <span class="field-label">Completion</span>
          <strong>{{ factFindStore.completion }}%</strong>
        </div>
        <div class="button-row">
          <button class="btn-secondary" @click="factFindStore.loadPreview(props.caseId)">Preview Prefill</button>
          <button class="btn-ghost" @click="factFindStore.importInterview(props.caseId)">Import Interview</button>
        </div>
      </div>
    </section>

    <section v-if="factFindStore.previewChanges.length" class="preview-card page-card">
      <div class="detail-head">
        <div>
          <p class="eyebrow">Prefill Preview</p>
          <h3>Review proposed updates before applying.</h3>
        </div>
        <button class="btn-primary" @click="factFindStore.applyPreview(props.caseId)">Apply Selected</button>
      </div>
      <div class="preview-list">
        <label v-for="change in factFindStore.previewChanges" :key="change.id" class="preview-item">
          <input :checked="change.selected" type="checkbox" @change="factFindStore.togglePreview(change.id)" />
          <div>
            <strong>{{ change.label }}</strong>
            <p>{{ change.currentValue || 'Empty' }} -> {{ change.proposedValue || 'Empty' }}</p>
          </div>
          <span class="pill" :class="sourceClass[change.source.sourceType]">{{ change.source.sourceType }}</span>
        </label>
      </div>
    </section>

    <section class="sections-grid">
      <article v-for="section in factFindStore.snapshot.sections" :key="section.id" class="section-card page-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">{{ section.subtitle }}</p>
            <h4>{{ section.title }}</h4>
          </div>
          <span class="pill info">{{ section.completion }}%</span>
        </div>

        <div class="field-grid">
          <label v-for="field in section.fields" :key="field.id" class="field-block">
            <span class="field-label">{{ field.label }}</span>
            <input
              :value="field.value"
              class="field-input"
              @change="onFieldChange(section.id, field.id, $event)"
            />
            <span class="pill" :class="sourceClass[field.source.sourceType]">
              {{ field.source.sourceType }} {{ Math.round(field.source.confidence * 100) }}%
            </span>
          </label>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.factfind-grid,
.sections-grid {
  display: grid;
  gap: 1rem;
}

.factfind-hero,
.preview-card,
.section-card {
  padding: 1.3rem;
}

.factfind-hero {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.35fr) minmax(240px, 0.65fr);
}

.hero-side {
  display: grid;
  gap: 0.8rem;
  align-content: start;
}

.hero-side strong {
  font-size: 1.45rem;
}

.button-row {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.detail-head,
.section-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.preview-list,
.field-grid {
  display: grid;
  gap: 0.8rem;
}

.preview-item,
.field-block {
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem;
  border-radius: 1rem;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.72);
}

.preview-item {
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
}

.preview-item p {
  margin: 0.15rem 0 0;
  color: var(--ink-soft);
}

.section-head h4 {
  margin: 0.15rem 0 0;
  font-size: 1.2rem;
}

@media (max-width: 900px) {
  .factfind-hero,
  .preview-item {
    grid-template-columns: 1fr;
  }
}
</style>
