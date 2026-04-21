<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PricingModal from '../PricingModal.vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const isAdminArea = computed(() => route.path.startsWith('/admin'))
const brokerLinks = [
  { label: 'Broker Dashboard', to: '/', icon: 'pi pi-home' },
  { label: 'Active Case', to: '/cases/101/documents', icon: 'pi pi-briefcase' },
]
const adminLinks = [
  { label: 'Overview', to: '/admin/overview', icon: 'pi pi-chart-bar' },
  { label: 'Users', to: '/admin/users', icon: 'pi pi-users' },
  { label: 'Audit', to: '/admin/audit', icon: 'pi pi-shield' },
  { label: 'Config', to: '/admin/config', icon: 'pi pi-cog' },
]
const showPricing = ref(false)

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell" :class="{ admin: isAdminArea }">
    <button class="pricing-trigger" @click="showPricing = true">
      <i class="pi pi-tags"></i>
      <span>Pricing</span>
    </button>

    <template v-if="auth.isAuthenticated">
      <aside class="shell-sidebar">
        <div class="brand-block">
          <p class="eyebrow">{{ isAdminArea ? 'Operations Console' : 'Unified Broker Demo' }}</p>
          <router-link class="brand" :to="isAdminArea ? '/admin/overview' : '/'">
            Harbourline
          </router-link>
          <p class="brand-copy">
            {{ isAdminArea ? 'Config, audit and privacy controls' : 'End-to-end mortgage workflow showcase' }}
          </p>
        </div>

        <nav class="side-nav">
          <router-link
            v-for="link in isAdminArea ? adminLinks : brokerLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
          >
            <i :class="link.icon"></i>
            <span>{{ link.label }}</span>
          </router-link>
        </nav>

        <div class="sidebar-foot">
          <div class="profile-chip">
            <strong>{{ auth.displayName }}</strong>
            <span>{{ auth.role === 'admin' ? 'Admin access' : 'Broker access' }}</span>
          </div>
          <button class="logout-btn" @click="logout">Logout</button>
        </div>
      </aside>

      <div class="shell-main">
        <header class="shell-header">
          <div>
            <p class="eyebrow">{{ isAdminArea ? 'Admin Workspace' : 'Broker Workspace' }}</p>
            <h1>{{ isAdminArea ? 'Control Visibility And Risk' : 'Guide The Case From Intake To Capacity' }}</h1>
          </div>
          <div class="header-actions">
            <router-link v-if="auth.isAdmin && !isAdminArea" class="ghost-link" to="/admin/overview">Open Admin</router-link>
            <router-link v-if="auth.isAdmin && isAdminArea" class="ghost-link" to="/">Back To Broker</router-link>
          </div>
        </header>
        <main class="shell-content">
          <router-view />
        </main>
      </div>
    </template>

    <main v-else class="auth-shell">
      <router-view />
    </main>

    <PricingModal :visible="showPricing" @close="showPricing = false" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
}

.pricing-trigger {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(162, 23, 55, 0.14);
  background: linear-gradient(135deg, #cf1d48, #e13f65);
  color: white;
  box-shadow: 0 18px 30px rgba(207, 29, 72, 0.24);
  font-weight: 700;
}

.auth-shell {
  min-height: 100vh;
}

.shell-sidebar {
  padding: 2rem 1.3rem;
  border-right: 1px solid rgba(26, 60, 53, 0.12);
  background:
    radial-gradient(circle at top, rgba(53, 111, 98, 0.16), transparent 38%),
    linear-gradient(180deg, rgba(248, 244, 235, 0.96), rgba(242, 236, 226, 0.98));
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 0;
  height: 100vh;
}

.app-shell.admin .shell-sidebar {
  background:
    radial-gradient(circle at top, rgba(22, 54, 83, 0.2), transparent 42%),
    linear-gradient(180deg, rgba(240, 245, 248, 0.98), rgba(234, 239, 242, 0.98));
}

.brand-block {
  display: grid;
  gap: 0.45rem;
}

.eyebrow {
  margin: 0;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--accent-strong);
}

.brand {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2rem;
  color: var(--ink-strong);
  text-decoration: none;
  letter-spacing: -0.03em;
}

.brand-copy {
  margin: 0;
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 1.55;
}

.side-nav {
  display: grid;
  gap: 0.45rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
  border-radius: 1rem;
  text-decoration: none;
  color: var(--ink-soft);
  border: 1px solid transparent;
  transition: 0.18s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.72);
  color: var(--ink-strong);
  border-color: rgba(26, 60, 53, 0.12);
  transform: translateX(2px);
}

.sidebar-foot {
  margin-top: auto;
  display: grid;
  gap: 0.85rem;
}

.profile-chip {
  display: grid;
  gap: 0.2rem;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(26, 60, 53, 0.1);
  color: var(--ink-soft);
}

.profile-chip strong {
  color: var(--ink-strong);
}

.logout-btn,
.ghost-link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(26, 60, 53, 0.14);
  background: white;
  color: var(--ink-strong);
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
}

.ghost-link {
  appearance: none;
}

.shell-main {
  min-width: 0;
  padding: 1.4rem 1.6rem 2rem;
}

.shell-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.4rem;
}

.shell-header h1 {
  margin: 0.2rem 0 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.8rem, 3vw, 3rem);
  color: var(--ink-strong);
  letter-spacing: -0.03em;
}

.shell-content {
  min-width: 0;
}

@media (max-width: 1080px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .shell-sidebar {
    position: relative;
    height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(26, 60, 53, 0.12);
  }
}

@media (max-width: 720px) {
  .shell-main {
    padding: 1rem;
  }

  .shell-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .pricing-trigger {
    padding: 0.72rem 0.9rem;
  }
}
</style>
