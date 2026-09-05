<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits<{ close: [] }>()

const { signIn, signUp, authError } = useAuth()

const mode = ref<'signin' | 'signup'>('signin')
const email = ref('')
const password = ref('')
const username = ref('')
const localError = ref<string | null>(null)
const submitting = ref(false)

async function handleSubmit() {
  localError.value = null
  if (!email.value || !password.value) {
    localError.value = 'Please enter both email and password.'
    return
  }
  if (mode.value === 'signup' && !username.value.trim()) {
    localError.value = 'Please enter a username.'
    return
  }
  if (password.value.length < 6) {
    localError.value = 'Password must be at least 6 characters.'
    return
  }

  submitting.value = true
  try {
    if (mode.value === 'signin') {
      await signIn(email.value, password.value)
      emit('close')
    } else {
      await signUp(email.value, password.value, username.value.trim())
      mode.value = 'signin'
      username.value = ''
      localError.value = null
      password.value = ''
      localError.value = 'Account created! Please sign in.'
    }
  } catch {
    localError.value = authError.value || 'Authentication failed.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="auth-backdrop" @click="$emit('close')">
        <div class="auth-modal" @click.stop>
          <button class="close-btn" @click="$emit('close')">&#10005;</button>
          <h2>{{ mode === 'signin' ? 'Welcome back' : 'Create account' }}</h2>
          <p class="auth-subtitle">
            {{ mode === 'signin' ? 'Sign in to manage your watchlist and ratings' : 'Join CineVerse to save favorites and rate movies' }}
          </p>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <div v-if="mode === 'signup'" class="field">
              <label>Username</label>
              <input
                v-model="username"
                type="text"
                placeholder="Choose a username"
                :disabled="submitting"
              />
            </div>
            <div class="field">
              <label>Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="you@example.com"
                :disabled="submitting"
              />
            </div>
            <div class="field">
              <label>Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="At least 6 characters"
                :disabled="submitting"
              />
            </div>

            <p v-if="localError" :class="['auth-message', { success: mode === 'signin' && localError.includes('Account created') }]">{{ localError }}</p>

            <button type="submit" class="auth-submit" :disabled="submitting">
              {{ submitting ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Sign up' }}
            </button>
          </form>

          <p class="auth-switch">
            {{ mode === 'signin' ? "Don't have an account?" : 'Already have an account?' }}
            <button type="button" class="switch-btn" @click="mode = mode === 'signin' ? 'signup' : 'signin'">
              {{ mode === 'signin' ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.auth-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
}

.auth-modal {
  background: var(--bg-surface);
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  padding: 32px;
  position: relative;
  border: 1px solid var(--border-color);
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--bg-hover);
  border: none;
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 0, 0, 0.3);
  color: #fff;
}

.auth-modal h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.auth-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 24px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.field input {
  padding: 12px 14px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.field input::placeholder {
  color: var(--text-faint);
}

.field input:focus {
  outline: none;
  border-color: #4facfe;
}

.auth-message {
  font-size: 0.85rem;
  margin: 0;
  color: #ef4444;
}

.auth-message.success {
  color: #22c55e;
}

.auth-submit {
  padding: 12px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  border-radius: 10px;
  color: #0f0f1e;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.auth-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.auth-submit:active:not(:disabled) {
  transform: scale(0.98);
}

.auth-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-switch {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 20px 0 0;
}

.switch-btn {
  background: none;
  border: none;
  color: #4facfe;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0 0 0 4px;
}

.switch-btn:hover {
  text-decoration: underline;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .auth-modal,
.modal-leave-active .auth-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .auth-modal,
.modal-leave-to .auth-modal {
  transform: scale(0.95) translateY(20px);
}
</style>
