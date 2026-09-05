<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Movie } from '../types/movie'
import { useFavorites } from '../composables/useFavorites'
import { useRatings } from '../composables/useRatings'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{ movie: Movie | null }>()
const emit = defineEmits<{ close: []; requireAuth: [] }>()

const { isFavorite, toggleFavorite } = useFavorites()
const { getUserRating, rateMovie, getAggregateRating } = useRatings()
const { user } = useAuth()

const aggregate = ref<{ average: number; count: number } | null>(null)
const hoverRating = ref(0)
const submittingRating = ref(false)

watch(() => props.movie, async (movie) => {
  if (!movie) return
  hoverRating.value = 0
  aggregate.value = await getAggregateRating(movie.id)
}, { immediate: true })

async function handleFavoriteClick() {
  if (!user.value) {
    emit('requireAuth')
    return
  }
  try {
    await toggleFavorite(props.movie!.id)
  } catch {
    emit('requireAuth')
  }
}

async function handleRate(rating: number) {
  if (!user.value) {
    emit('requireAuth')
    return
  }
  submittingRating.value = true
  try {
    await rateMovie(props.movie!.id, rating)
    aggregate.value = await getAggregateRating(props.movie!.id)
  } catch {
    emit('requireAuth')
  } finally {
    submittingRating.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="movie" class="modal-backdrop" @click="$emit('close')">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="$emit('close')">&#10005;</button>
          <div class="backdrop-section" :style="{ backgroundImage: `url(${movie.backdrop_url || movie.poster_url})` }">
            <div class="backdrop-overlay">
              <img :src="movie.poster_url" :alt="movie.title" class="modal-poster" />
              <div class="modal-header-info">
                <h2>{{ movie.title }}</h2>
                <div class="meta-row">
                  <span class="rating-badge">★ {{ movie.rating.toFixed(1) }}</span>
                  <span class="meta-pill">{{ movie.year }}</span>
                  <span class="meta-pill">{{ movie.duration }} min</span>
                  <span class="genre-tag">{{ movie.genre }}</span>
                </div>
                <button
                  class="fav-toggle-btn"
                  :class="{ active: isFavorite(movie.id) }"
                  @click="handleFavoriteClick"
                >
                  <svg viewBox="0 0 24 24" :fill="isFavorite(movie.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {{ isFavorite(movie.id) ? 'In Favorites' : 'Add to Favorites' }}
                </button>
              </div>
            </div>
          </div>
          <div class="modal-body">
            <div class="info-section">
              <h3>Overview</h3>
              <p class="plot-text">{{ movie.plot }}</p>
            </div>

            <div class="info-section">
              <h3>Rate This Movie</h3>
              <div class="rating-stars" @mouseleave="hoverRating = 0">
                <button
                  v-for="star in 10"
                  :key="star"
                  class="star-btn"
                  :class="{
                    filled: star <= (hoverRating || getUserRating(movie.id) || 0),
                    dim: star > (hoverRating || getUserRating(movie.id) || 0)
                  }"
                  @mouseenter="hoverRating = star"
                  @click="handleRate(star)"
                  :disabled="submittingRating"
                >
                  <svg viewBox="0 0 24 24" :fill="star <= (hoverRating || getUserRating(movie.id) || 0) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              </div>
              <p class="rating-hint">
                <template v-if="getUserRating(movie.id)">
                  Your rating: {{ getUserRating(movie.id) }}/10
                </template>
                <template v-else-if="!user">
                  Sign in to rate this movie
                </template>
                <template v-else>
                  Click a star to rate
                </template>
                <template v-if="aggregate && aggregate.count > 0">
                  &middot; Community: {{ aggregate.average.toFixed(1) }} ({{ aggregate.count }} {{ aggregate.count === 1 ? 'vote' : 'votes' }})
                </template>
              </p>
            </div>

            <div class="info-section">
              <h3>Director</h3>
              <p>{{ movie.director }}</p>
            </div>
            <div class="info-section">
              <h3>Cast</h3>
              <p>{{ movie.cast }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--bg-surface);
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid var(--border-color);
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 0, 0, 0.5);
}

.backdrop-section {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  border-radius: 16px 16px 0 0;
}

.backdrop-overlay {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, var(--modal-overlay) 30%, rgba(26, 26, 46, 0.3) 100%);
  display: flex;
  align-items: flex-end;
  padding: 24px;
  gap: 20px;
  border-radius: 16px 16px 0 0;
}

.modal-poster {
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

.modal-header-info {
  padding-bottom: 8px;
}

.modal-header-info h2 {
  font-size: 1.6rem;
  color: #fff;
  margin: 0 0 10px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.rating-badge {
  background: rgba(245, 197, 24, 0.2);
  color: #f5c518;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.meta-pill {
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.genre-tag {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.fav-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ccc;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.fav-toggle-btn svg {
  width: 18px;
  height: 18px;
}

.fav-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.fav-toggle-btn.active {
  background: rgba(245, 197, 24, 0.2);
  border-color: rgba(245, 197, 24, 0.4);
  color: #f5c518;
}

.modal-body {
  padding: 24px;
}

.info-section {
  margin-bottom: 20px;
}

.info-section h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4facfe;
  margin: 0 0 6px;
}

.info-section p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.plot-text {
  font-size: 1rem !important;
  line-height: 1.7 !important;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: #444;
  transition: color 0.15s ease, transform 0.1s ease;
}

.star-btn svg {
  width: 22px;
  height: 22px;
}

.star-btn.filled {
  color: #f5c518;
}

.star-btn.dim {
  color: var(--star-dim);
}

.star-btn:hover {
  transform: scale(1.2);
}

.star-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.rating-hint {
  font-size: 0.82rem !important;
  color: var(--text-muted) !important;
  margin-top: 8px !important;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(30px);
}

@media (max-width: 600px) {
  .backdrop-overlay {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .modal-header-info h2 {
    font-size: 1.3rem;
  }
  .meta-row {
    justify-content: center;
  }
}
</style>
