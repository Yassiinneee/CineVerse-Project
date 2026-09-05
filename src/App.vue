<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Movie } from './types/movie'
import { fetchMovies, fetchGenres } from './services/api'
import { useAuth } from './composables/useAuth'
import { useFavorites } from './composables/useFavorites'
import { useRatings } from './composables/useRatings'
import { useTheme } from './composables/useTheme'
import MovieCard from './components/MovieCard.vue'
import MovieModal from './components/MovieModal.vue'
import MovieCardSkeleton from './components/MovieCardSkeleton.vue'
import AuthModal from './components/AuthModal.vue'

const { user, authLoading, init, signOut } = useAuth()
const { loadFavorites, favoriteIds } = useFavorites()
const { loadUserRatings } = useRatings()
const { currentTheme, toggleTheme, initTheme } = useTheme()

const movies = ref<Movie[]>([])
const genres = ref<string[]>(['All'])
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = ref('')
const selectedGenre = ref('All')
const sortBy = ref('rating')
const selectedMovie = ref<Movie | null>(null)
const showAuthModal = ref(false)
const activeTab = ref<'browse' | 'favorites'>('browse')

const displayedMovies = computed(() => {
  if (activeTab.value === 'favorites') {
    return movies.value.filter((m) => favoriteIds.value.has(m.id))
  }
  return movies.value
})

async function loadMovies() {
  loading.value = true
  error.value = null
  try {
    movies.value = await fetchMovies({
      search: searchQuery.value || undefined,
      genre: selectedGenre.value,
      sort: sortBy.value,
    })
  } catch {
    error.value = 'Failed to load movies. Is the server running?'
  } finally {
    loading.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchQuery, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(loadMovies, 300)
})
watch([selectedGenre, sortBy], loadMovies)

watch(user, async (newUser) => {
  if (newUser) {
    await Promise.all([loadFavorites(), loadUserRatings()])
  } else {
    favoriteIds.value = new Set()
  }
})

function handleRequireAuth() {
  selectedMovie.value = null
  showAuthModal.value = true
}

async function handleSignOut() {
  await signOut()
  activeTab.value = 'browse'
}

onMounted(async () => {
  initTheme()
  await init()
  if (user.value) {
    await Promise.all([loadFavorites(), loadUserRatings()])
  }
  await loadMovies()
  try {
    genres.value = ['All', ...(await fetchGenres())]
  } catch {
    // genres optional
  }
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-area">
          <h1 class="logo">CineVerse</h1>
          <p class="tagline">Discover great movies</p>
        </div>
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search movies, directors, actors..."
            class="search-input"
          />
        </div>
        <div class="header-actions">
          <button class="icon-btn" @click="toggleTheme" :title="currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg v-if="currentTheme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <template v-if="!authLoading">
            <button v-if="!user" class="auth-btn" @click="showAuthModal = true">Sign In</button>
            <div v-else class="user-area">
              <span class="user-email">{{ user.user_metadata?.username || user.email }}</span>
              <button class="auth-btn outline" @click="handleSignOut">Sign Out</button>
            </div>
          </template>
        </div>
      </div>
    </header>

    <nav class="filter-bar">
      <div class="tab-area">
        <button
          :class="['tab-btn', { active: activeTab === 'browse' }]"
          @click="activeTab = 'browse'"
        >
          Browse
        </button>
        <button
          v-if="user"
          :class="['tab-btn', { active: activeTab === 'favorites' }]"
          @click="activeTab = 'favorites'"
        >
          Favorites ({{ favoriteIds.size }})
        </button>
      </div>
      <div v-if="activeTab === 'browse'" class="genre-filters">
        <button
          v-for="genre in genres"
          :key="genre"
          :class="['genre-btn', { active: selectedGenre === genre }]"
          @click="selectedGenre = genre"
        >
          {{ genre }}
        </button>
      </div>
      <div v-if="activeTab === 'browse'" class="sort-area">
        <label class="sort-label">Sort by</label>
        <select v-model="sortBy" class="sort-select">
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>
      </div>
    </nav>

    <main class="main-content">
      <MovieCardSkeleton v-if="loading" :count="12" />

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="displayedMovies.length === 0" class="empty-state">
        <p v-if="activeTab === 'favorites'">No favorites yet. Star movies to add them here.</p>
        <p v-else>No movies found. Try a different search or filter.</p>
      </div>

      <div v-else class="movie-grid">
        <MovieCard
          v-for="(movie, i) in displayedMovies"
          :key="movie.id"
          :movie="movie"
          :index="i"
          @click="selectedMovie = $event"
        />
      </div>
    </main>

    <footer class="app-footer">
      <p>CineVerse &mdash; Built with Vue &amp; Supabase</p>
    </footer>

    <MovieModal
      :movie="selectedMovie"
      @close="selectedMovie = null"
      @require-auth="handleRequireAuth"
    />
    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--bg-header);
  padding: 28px 24px 20px;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.logo-area {
  flex-shrink: 0;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 2px 0 0;
}

.search-bar {
  position: relative;
  flex: 1;
  min-width: 250px;
  max-width: 450px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-faint);
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s, background 0.2s;
}

.search-input::placeholder {
  color: var(--text-faint);
}

.search-input:focus {
  outline: none;
  border-color: #4facfe;
  background: var(--bg-input-focus);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.icon-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.icon-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.auth-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  color: #0f0f1e;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.auth-btn:hover {
  opacity: 0.9;
}

.auth-btn:active {
  transform: scale(0.97);
}

.auth-btn.outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.auth-btn.outline:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  opacity: 1;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-email {
  font-size: 0.82rem;
  color: var(--text-muted);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-bar {
  background: var(--bg-filter);
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border-color);
}

.tab-area {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.tab-btn.active {
  color: #4facfe;
  background: rgba(79, 172, 254, 0.1);
}

.genre-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.genre-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.genre-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.genre-btn.active {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #0f0f1e;
  border-color: transparent;
  font-weight: 600;
}

.sort-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.sort-select {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: #4facfe;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-muted);
}

.app-footer {
  text-align: center;
  padding: 20px;
  color: var(--text-faint);
  font-size: 0.8rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  .search-bar {
    max-width: none;
  }
  .header-actions {
    justify-content: center;
  }
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 14px;
  }
}
</style>
