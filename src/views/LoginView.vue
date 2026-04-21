<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const username = ref('broker.demo')
const password = ref('demo123')
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  loading.value = true
  errorMessage.value = ''
  try {
    await auth.login(username.value, password.value)
    router.push(auth.isAdmin ? '/admin/overview' : '/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Login failed'
  } finally {
    loading.value = false
  }
}

function quickFill(role: 'broker' | 'admin') {
  username.value = role === 'broker' ? 'broker.demo' : 'admin.demo'
  password.value = 'demo123'
}
</script>

<template>
  <div class="login-shell">
    <section class="story-panel">
      <p class="eyebrow">Demo Storyline</p>
      <h1>Show the whole broker workflow in one polished front-end demo.</h1>
      <p>
        Walk from intake, OCR review and Fact Find all the way to lender comparison,
        then pivot into admin controls for privacy, provider config and audit visibility.
      </p>
      <div class="feature-list">
        <article class="feature">
          <strong>Broker path</strong>
          <span>Dashboard, case hub, documents, Fact Find, calculator and results.</span>
        </article>
        <article class="feature">
          <strong>Admin path</strong>
          <span>Users, audit events, masking alerts and provider configuration.</span>
        </article>
      </div>
    </section>

    <section class="login-card page-card">
      <p class="eyebrow">Sign In</p>
      <h2>Harbourline Broker Demo</h2>
      <p class="helper">Use a preset demo identity to jump straight into the experience.</p>

      <div class="preset-row">
        <button class="btn-secondary" @click="quickFill('broker')">Use Broker Demo</button>
        <button class="btn-ghost" @click="quickFill('admin')">Use Admin Demo</button>
      </div>

      <form class="login-form" @submit.prevent="submit">
        <label>
          <span class="field-label">Username</span>
          <input v-model="username" class="field-input" autocomplete="username" />
        </label>
        <label>
          <span class="field-label">Password</span>
          <input v-model="password" class="field-input" type="password" autocomplete="current-password" />
        </label>
        <p v-if="errorMessage" class="error-line">{{ errorMessage }}</p>
        <button class="btn-primary submit-btn" :disabled="loading">
          {{ loading ? 'Signing In...' : 'Enter Demo' }}
        </button>
      </form>

      <div class="credentials">
        <span>`broker.demo / demo123`</span>
        <span>`admin.demo / demo123`</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login-shell {
  min-height: 100vh;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 1.2rem;
}

.story-panel,
.login-card {
  padding: 2rem;
}

.story-panel {
  border-radius: 2rem;
  background:
    linear-gradient(160deg, rgba(20, 41, 35, 0.94), rgba(30, 71, 61, 0.88)),
    radial-gradient(circle at top right, rgba(194, 166, 93, 0.2), transparent 36%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow);
}

.story-panel h1 {
  margin: 0.4rem 0 1rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.2rem, 5vw, 4rem);
  letter-spacing: -0.04em;
  line-height: 1.02;
}

.story-panel p {
  max-width: 44rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.02rem;
}

.feature-list {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.feature {
  padding: 1rem 1.1rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: grid;
  gap: 0.25rem;
}

.feature span {
  color: rgba(255, 255, 255, 0.78);
}

.login-card {
  align-self: center;
  max-width: 34rem;
  width: 100%;
  justify-self: center;
}

.login-card h2 {
  margin: 0.25rem 0 0.5rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2rem;
}

.helper {
  margin: 0 0 1.3rem;
  color: var(--ink-soft);
}

.preset-row,
.credentials {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.login-form {
  margin-top: 1.25rem;
  display: grid;
  gap: 1rem;
}

.submit-btn {
  width: 100%;
  justify-content: center;
}

.credentials {
  margin-top: 1rem;
  color: var(--ink-soft);
  font-size: 0.88rem;
}

.error-line {
  margin: 0;
  color: var(--danger);
  font-weight: 700;
}

@media (max-width: 920px) {
  .login-shell {
    grid-template-columns: 1fr;
  }
}
</style>
