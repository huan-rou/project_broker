<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDocumentsStore } from '../../stores/documents'
import type { DemoDocument } from '../../types'

const props = defineProps<{
  caseId: number
}>()

const documentsStore = useDocumentsStore()
const newFiles = ref('Broker_Interview_Notes.pdf, Living_Expenses_Summary.pdf')
const selectedDocument = ref<DemoDocument | null>(null)

const flaggedCount = computed(() => documentsStore.items.filter((item) => item.flagged).length)

onMounted(() => {
  if (!documentsStore.items.length) {
    void documentsStore.load(props.caseId)
  }
})

async function uploadPresetFiles() {
  const names = newFiles.value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  if (!names.length) return
  await documentsStore.upload(props.caseId, names)
}

async function organize() {
  await documentsStore.organize(props.caseId)
}
</script>

<template>
  <div class="documents-grid">
    <section class="workflow-card page-card">
      <div>
        <p class="eyebrow">Workflow Narrative</p>
        <h3 class="section-title">Intake, classify and prepare lender-ready folders.</h3>
        <p class="section-copy">
          This panel simulates uploads, OCR progression, classification, extraction review and
          lender folder organization with timeline feedback.
        </p>
      </div>
      <div class="workflow-metrics">
        <div>
          <span class="field-label">Document Completion</span>
          <strong>{{ documentsStore.completion }}%</strong>
        </div>
        <div>
          <span class="field-label">Flagged Sends</span>
          <strong :class="{ danger: flaggedCount > 0 }">{{ flaggedCount }}</strong>
        </div>
      </div>
    </section>

    <section class="upload-card page-card">
      <label class="upload-field">
        <span class="field-label">Preset Upload Queue</span>
        <textarea v-model="newFiles" class="field-textarea" rows="3"></textarea>
      </label>
      <div class="upload-actions">
        <button class="btn-primary" @click="uploadPresetFiles">Simulate Upload</button>
        <button class="btn-secondary" @click="organize">Organize For Lender</button>
      </div>
    </section>

    <section class="document-list">
      <article
        v-for="item in documentsStore.items"
        :key="item.id"
        class="document-card page-card"
        @click="selectedDocument = item"
      >
        <div class="doc-header">
          <div>
            <p class="eyebrow">{{ item.documentCategory.replace('_', ' ') }}</p>
            <h4>{{ item.originalFilename }}</h4>
          </div>
          <span
            class="pill"
            :class="item.status === 'validated' ? 'success' : item.status === 'classified' ? 'info' : item.flagged ? 'danger' : 'warning'"
          >
            {{ item.status }}
          </span>
        </div>

        <div class="doc-meta">
          <span>{{ item.ocrProvider }}</span>
          <span>{{ Math.round(item.classificationConfidence * 100) }}% confidence</span>
          <span>{{ item.wasMasked ? 'Masked send' : 'Unmasked send' }}</span>
        </div>

        <div class="highlight-list">
          <div v-for="highlight in item.extractedHighlights" :key="highlight.label" class="highlight-row">
            <span>{{ highlight.label }}</span>
            <strong>{{ highlight.value }}</strong>
          </div>
        </div>

        <div class="doc-actions">
          <button class="btn-ghost" @click.stop="documentsStore.stepDocument(props.caseId, item.id)">Advance Stage</button>
          <button class="btn-secondary" @click.stop="selectedDocument = item">Open Detail</button>
        </div>
      </article>
    </section>

    <section v-if="selectedDocument" class="detail-card page-card">
      <div class="detail-head">
        <div>
          <p class="eyebrow">Document Detail</p>
          <h3>{{ selectedDocument.autoRenamedFilename }}</h3>
        </div>
        <button class="btn-ghost" @click="selectedDocument = null">Close</button>
      </div>

      <div class="timeline">
        <article v-for="event in selectedDocument.timeline" :key="event.id" class="timeline-item">
          <span class="pill info">{{ event.label }}</span>
          <div>
            <strong>{{ event.message }}</strong>
            <p>{{ new Date(event.at).toLocaleString() }}</p>
          </div>
        </article>
      </div>

      <div class="validation">
        <span class="field-label">Validation Notes</span>
        <p v-for="message in selectedDocument.validationMessages" :key="message">{{ message }}</p>
      </div>
    </section>

    <section v-if="documentsStore.organized" class="organized-card page-card">
      <div class="detail-head">
        <div>
          <p class="eyebrow">Lender Organization</p>
          <h3>{{ documentsStore.organized.lender }}</h3>
        </div>
        <span class="pill success">ZIP Ready</span>
      </div>

      <div class="folder-list">
        <div v-for="folder in documentsStore.organized.folders" :key="folder.path" class="folder-row">
          <strong>{{ folder.path }}</strong>
          <span>{{ folder.files.join(', ') }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.documents-grid {
  display: grid;
  gap: 1rem;
}

.workflow-card,
.upload-card,
.detail-card,
.organized-card {
  padding: 1.3rem;
}

.workflow-card {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.3fr) minmax(220px, 0.7fr);
}

.workflow-metrics {
  display: grid;
  gap: 0.8rem;
}

.workflow-metrics strong {
  font-size: 1.5rem;
}

.workflow-metrics .danger {
  color: var(--danger);
}

.upload-actions,
.doc-actions {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.document-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.document-card {
  padding: 1.15rem;
  display: grid;
  gap: 0.8rem;
}

.document-card h4,
.detail-card h3,
.organized-card h3 {
  margin: 0.15rem 0 0;
  font-size: 1.15rem;
}

.doc-header,
.detail-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.doc-meta {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  color: var(--ink-soft);
  font-size: 0.88rem;
}

.highlight-list {
  display: grid;
  gap: 0.45rem;
}

.highlight-row,
.folder-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0.85rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
}

.timeline {
  display: grid;
  gap: 0.75rem;
}

.timeline-item {
  display: grid;
  gap: 0.45rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid var(--line);
}

.timeline-item p,
.validation p {
  margin: 0.2rem 0 0;
  color: var(--ink-soft);
}

.folder-list {
  display: grid;
  gap: 0.75rem;
}

@media (max-width: 900px) {
  .workflow-card {
    grid-template-columns: 1fr;
  }

  .highlight-row,
  .folder-row {
    flex-direction: column;
  }
}
</style>
