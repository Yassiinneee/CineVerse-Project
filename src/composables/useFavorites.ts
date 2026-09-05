import { ref, type Ref } from 'vue'
import { supabase } from '../services/supabase'

const favoriteIds: Ref<Set<number>> = ref(new Set())
const favoritesLoaded = ref(false)

export function useFavorites() {
  async function loadFavorites() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      favoriteIds.value = new Set()
      favoritesLoaded.value = true
      return
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('movie_id')
      .eq('user_id', user.id)

    if (error) {
      favoritesLoaded.value = true
      return
    }

    favoriteIds.value = new Set((data as { movie_id: number }[]).map((f) => f.movie_id))
    favoritesLoaded.value = true
  }

  async function toggleFavorite(movieId: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    if (favoriteIds.value.has(movieId)) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
      if (error) throw error
      favoriteIds.value.delete(movieId)
      favoriteIds.value = new Set(favoriteIds.value)
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, movie_id: movieId })
      if (error) throw error
      favoriteIds.value.add(movieId)
      favoriteIds.value = new Set(favoriteIds.value)
    }
  }

  function isFavorite(movieId: number): boolean {
    return favoriteIds.value.has(movieId)
  }

  return { favoriteIds, favoritesLoaded, loadFavorites, toggleFavorite, isFavorite }
}
