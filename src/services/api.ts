import { supabase } from './supabase'
import type { Movie } from '../types/movie'

export async function fetchMovies(params?: {
  search?: string
  genre?: string
  sort?: string
}): Promise<Movie[]> {
  let query = supabase.from('movies').select('*')

  if (params?.search) {
    query = query.or(`title.ilike.%${params.search}%,director.ilike.%${params.search}%,cast.ilike.%${params.search}%`)
  }

  if (params?.genre && params.genre !== 'All') {
    query = query.eq('genre', params.genre)
  }

  if (params?.sort === 'year') {
    query = query.order('year', { ascending: false })
  } else if (params?.sort === 'title') {
    query = query.order('title', { ascending: true })
  } else {
    query = query.order('rating', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as Movie[]
}

export async function fetchMovieById(id: number): Promise<Movie> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Movie not found')
  return data as Movie
}

export async function fetchGenres(): Promise<string[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('genre')
    .order('genre', { ascending: true })
  if (error) throw new Error(error.message)
  const genres = [...new Set((data as { genre: string }[]).map((m) => m.genre))]
  return genres
}

export async function createMovie(data: Omit<Movie, 'id' | 'created_at' | 'updated_at'>): Promise<Movie> {
  const { data: result, error } = await supabase
    .from('movies')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return result as Movie
}

export async function updateMovie(id: number, data: Partial<Movie>): Promise<Movie> {
  const { data: result, error } = await supabase
    .from('movies')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return result as Movie
}

export async function deleteMovie(id: number): Promise<void> {
  const { error } = await supabase
    .from('movies')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}
