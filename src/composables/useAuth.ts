import { ref, type Ref } from 'vue'
import { supabase } from '../services/supabase'
import type { User } from '@supabase/supabase-js'

const user: Ref<User | null> = ref(null)
const authLoading = ref(true)
const authError = ref<string | null>(null)

let initialized = false

export function useAuth() {
  async function init() {
    if (initialized) return
    initialized = true

    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    authLoading.value = false

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  async function signUp(email: string, password: string, username: string) {
    authError.value = null
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    if (error) {
      authError.value = error.message
      throw error
    }
    user.value = data.user
    return data.user
  }

  async function signIn(email: string, password: string) {
    authError.value = null
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      authError.value = error.message
      throw error
    }
    user.value = data.user
    return data.user
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  }

  return { user, authLoading, authError, init, signUp, signIn, signOut }
}
