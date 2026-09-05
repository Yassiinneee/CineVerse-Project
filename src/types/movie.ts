export interface Movie {
  id: number
  title: string
  year: number
  genre: string
  director: string
  cast: string
  plot: string
  rating: number
  duration: number
  poster_url: string
  backdrop_url: string | null
  created_at: string
  updated_at: string
}
