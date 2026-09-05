<script setup lang="ts">
import type { Movie } from '../types/movie'
import { useFavorites } from '../composables/useFavorites'

const props = defineProps<{ movie: Movie; index?: number }>()
const emit = defineEmits<{ click: [movie: Movie] }>()

const { isFavorite, toggleFavorite } = useFavorites()

async function handleFavoriteClick(e: Event) {
  e.stopPropagation()
  try {
    await toggleFavorite(props.movie.id)
  } catch {
    // user not authenticated — parent will handle
  }
}
</script>

<template>
  <div
    class="movie-card"
    :style="index !== undefined ? { animationDelay: `${index * 60}ms` } : {}"
    @click="emit('click', movie)"
  >
    <div class="poster-wrapper">
      <img :src="movie.poster_url" :alt="movie.title" loading="lazy" />
      <button
        class="fav-btn"
        :class="{ active: isFavorite(movie.id) }"
        :title="isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'"
        @click="handleFavoriteClick"
      >
        <svg viewBox="0 0 24 24" :fill="isFavorite(movie.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
      <div class="overlay">
        <div class="overlay-content">
          <span class="rating-badge">★ {{ movie.rating.toFixed(1) }}</span>
          <p class="overlay-plot">{{ movie.plot }}</p>
        </div>
      </div>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <div class="movie-meta">
        <span class="genre-tag">{{ movie.genre }}</span>
        <span class="year">{{ movie.year }}</span>
        <span class="duration">{{ movie.duration }} min</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-surface);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
  animation: card-enter 0.5s ease backwards;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.movie-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.poster-wrapper {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
}

.poster-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .poster-wrapper img {
  transform: scale(1.08);
}

.fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  z-index: 5;
  transition: all 0.25s ease;
  backdrop-filter: blur(4px);
}

.fav-btn svg {
  width: 18px;
  height: 18px;
}

.fav-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.15);
}

.fav-btn.active {
  color: #f5c518;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.movie-card:hover .overlay {
  opacity: 1;
}

.overlay-content {
  width: 100%;
}

.rating-badge {
  display: inline-block;
  background: rgba(245, 197, 24, 0.2);
  color: #f5c518;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.overlay-plot {
  font-size: 0.8rem;
  color: #ccc;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-info {
  padding: 12px 14px 16px;
}

.movie-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.genre-tag {
  background: rgba(79, 172, 254, 0.15);
  color: #4facfe;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 500;
}

.year,
.duration {
  font-size: 0.72rem;
  color: var(--text-muted);
}
</style>
