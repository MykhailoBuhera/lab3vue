<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '@/types/user'
import usersData from '@/data/users.json'


const users = ref<User[]>(usersData as User[])

const formatDate = (iso: string): string => new Date(iso).toLocaleDateString('uk-UA')
const genderLabel = (g: User['gender']): string => (g === 'male' ? 'Чоловік' : 'Жінка')

const openedIds = ref(new Set<number>())

const toggleDetails = (id: number): void => {
  if (openedIds.value.has(id)) openedIds.value.delete(id)
  else openedIds.value.add(id)
}

type GenderFilter = 'all' | User['gender']

const genderFilter = ref<GenderFilter>('all')
const adultsOnly = ref(false)

const visibleUsers = computed(() =>
  users.value.filter(
    (u) =>
      (genderFilter.value === 'all' || u.gender === genderFilter.value) &&
      (!adultsOnly.value || u.dob.age >= 18),
  ),
)
</script>

<template>
    <div class="toolbar">
  <div class="toolbar__group">
    <span class="toolbar__label">Стать:</span>
    <button :class="{ active: genderFilter === 'all' }" @click="genderFilter = 'all'">Всі</button>
    <button :class="{ active: genderFilter === 'male' }" @click="genderFilter = 'male'">Чоловіки</button>
    <button :class="{ active: genderFilter === 'female' }" @click="genderFilter = 'female'">Жінки</button>
  </div>
  <div class="toolbar__group">
    <span class="toolbar__label">Вік:</span>
    <button :class="{ active: !adultsOnly }" @click="adultsOnly = false">Всі</button>
    <button :class="{ active: adultsOnly }" @click="adultsOnly = true">18+</button>
  </div>
</div>

<p v-if="!visibleUsers.length" class="users__empty">Список юзерів пустий</p>
<div v-else class="users">
  <article
    v-for="user in visibleUsers"
    :key="user.id"
    class="user-card"
      :class="{
        'user-card--minor': user.dob.age < 18,
        'user-card--young': user.dob.age >= 18 && user.dob.age <= 30,
        'user-card--adult': user.dob.age >= 31 && user.dob.age <= 50,
        'user-card--senior': user.dob.age > 50,
      }"
    >
      <img
        class="user-card__photo"
        :src="user.picture"
        :alt="`${user.name.first} ${user.name.last}`"
      />
      <h2 class="user-card__name">{{ user.name.first }} {{ user.name.last }}</h2>
      <ul class="user-card__info">
        <li><b>Стать:</b> {{ genderLabel(user.gender) }}</li>
        <li><b>Локація:</b> {{ user.location.city }}, {{ user.location.country }}</li>
        <li><b>Email:</b> {{ user.email }}</li>
        <li><b>Телефон:</b> {{ user.phone }}</li>
        <li><b>Дата народження:</b> {{ formatDate(user.dob.date) }}</li>
        <li v-if="user.dob.age > 18"><b>Вік:</b> {{ user.dob.age }}</li>
      </ul>

      <div class="user-card__hobbies">
        <b>Хобі:</b>
        <ul>
          <li v-for="hobby in user.hobbies" :key="hobby">{{ hobby }}</li>
        </ul>
      </div>

      <button class="user-card__toggle" @click="toggleDetails(user.id)">
        {{ openedIds.has(user.id) ? 'Сховати' : 'Детальніше' }}
      </button>
      <p v-show="openedIds.has(user.id)" class="user-card__details">{{ user.details }}</p>
    </article>
  </div>
</template>

<style scoped>
.users {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  padding: 20px;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.user-card:hover {
  transform: translateY(-4px);
}

.user-card--minor {
  background: #e3f2fd;
  border-color: #64b5f6;
}

.user-card--young {
  background: #e8f5e9;
  border-color: #66bb6a;
}

.user-card--adult {
  background: #fff8e1;
  border-color: #ffca28;
}

.user-card--senior {
  background: #fce4ec;
  border-color: #ec407a;
}

.user-card__photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}

.user-card__name {
  margin: 0 0 12px;
  font-size: 1.2rem;
  color: #222;
}

.user-card__info {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  font-size: 0.9rem;
  color: #444;
}

.user-card__info li {
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.user-card__hobbies {
  width: 100%;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #444;
}

.user-card__hobbies ul {
  margin: 4px 0 0;
  padding-left: 20px;
}

.user-card__toggle {
  margin-top: 12px;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  cursor: pointer;
}

.user-card__toggle:hover {
  background: #369870;
}


.users__empty {
  padding: 40px;
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}

.user-card__details {
  margin: 10px 0 0;
  font-size: 0.85rem;
  color: #555;
  text-align: center;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 20px 0;
}

.toolbar__group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar__label {
  font-weight: 600;
  color: #333;
}

.toolbar button {
  padding: 6px 14px;
  border: 1px solid #42b883;
  border-radius: 6px;
  background: #fff;
  color: #42b883;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.toolbar button:hover {
  background: #e8f5e9;
}

.toolbar button.active {
  background: #42b883;
  color: #fff;
}
</style>