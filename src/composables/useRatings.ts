import { ref, type Ref } from 'vue'
import { supabase } from '../services/supabase'

const userRatings: Ref<Map<number, number>> = ref(new Map())

export function useRatings() {
  async function loadUserRatings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      userRatings.value = new Map()
      return
    }

    const { data, error } = await supabase
      .from('user_ratings')
      .select('movie_id, rating')
      .eq('user_id', user.id)

    if (error) return

    const map = new Map<number, number>()
    for (const row of data as { movie_id: number; rating: number }[]) {
      map.set(row.movie_id, row.rating)
    }
    userRatings.value = map
  }

  async function rateMovie(movieId: number, rating: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('user_ratings')
      .upsert({
        user_id: user.id,
        movie_id: movieId,
        rating,
      })

    if (error) throw error

    userRatings.value.set(movieId, rating)
    userRatings.value = new Map(userRatings.value)
  }

  async function getAggregateRating(movieId: number): Promise<{ average: number; count: number } | null> {
    const { data, error } = await supabase
      .from('user_ratings')
      .select('rating')
      .eq('movie_id', movieId)

    if (error || !data || data.length === 0) return null

    const ratings = (data as { rating: number }[]).map((r) => r.rating)
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length
    return { average, count: ratings.length }
  }

  function getUserRating(movieId: number): number | null {
    return userRatings.value.get(movieId) ?? null
  }

  return { userRatings, loadUserRatings, rateMovie, getAggregateRating, getUserRating }
}
