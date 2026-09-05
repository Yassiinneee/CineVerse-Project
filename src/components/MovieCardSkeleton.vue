<script setup lang="ts">
defineProps<{ count?: number }>()
</script>

<template>
  <div class="skeleton-grid">
    <div v-for="i in (count ?? 12)" :key="i" class="skeleton-card">
      <div class="skeleton-poster shimmer"></div>
      <div class="skeleton-info">
        <div class="skeleton-title shimmer"></div>
        <div class="skeleton-meta shimmer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.skeleton-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
}

.skeleton-poster {
  aspect-ratio: 2 / 3;
  width: 100%;
}

.skeleton-info {
  padding: 12px 14px 16px;
}

.skeleton-title {
  height: 16px;
  width: 70%;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-meta {
  height: 12px;
  width: 50%;
  border-radius: 4px;
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-shine) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 600px) {
  .skeleton-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 14px;
  }
}
</style>
