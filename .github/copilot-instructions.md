---
applyTo: '**'
---

# Instrukcje dla GitHub Copilot - GymApp

## Technologie i narzędzia

Ten projekt używa następujących technologii:
- **Nuxt 3.17.6** z Vue 3.5.17 i TypeScript
- **Vuetify 3.9.0** jako główny UI framework
- **Nuxt UI 3.2.0** jako dodatkowy komponent library
- **Pinia 3.0.3** do zarządzania stanem aplikacji
- **UnoCSS 66.4.2** do stylowania
- **Better SQLite3 12.2.0** jako lokalna baza danych
- **Firebase 11.10.0** do uwierzytelniania i backendu
- **@nuxtjs/i18n 9.5.6** do internacjonalizacji
- **Material Design Icons (@mdi)** do ikon
- **@nuxt/image 1.10.0** do optymalizacji obrazów

## Standardy kodowania

### TypeScript/JavaScript
- Używamy TypeScript we wszystkich nowych plikach
- Preferujemy Vue 3 Composition API z `<script setup>`
- Używamy podwójnych cudzysłowów dla stringów
- Używamy 2 spacje do wcięć
- Nazwy plików używają kebab-case (np. `my-component.vue`)
- Zmienne i funkcje: camelCase
- Komponenty i typy: PascalCase

### Vue komponenty
- Komponenty Vue używają Single File Component (SFC) format
- Obowiązkowe użycie `<script setup lang="ts">`
- Struktura komponentu: `<template>`, `<script setup>`, `<style scoped>`
- Używamy Vuetify komponentów z prefiksem `v-`
- Implementujemy responsive design (mobile-first)
- Dodajemy właściwości accessibility (aria-labels, roles)

### Zarządzanie stanem
- Używamy Pinia do zarządzania stanem
- Store'y tworzymy w katalogu `stores/`
- Preferujemy composition API style stores
- Używamy `usePinia()` do dostępu do store'ów

### Baza danych i backend
- Better SQLite3 jako główna lokalna baza danych
- Firebase Auth do uwierzytelniania użytkowników
- Firebase Firestore do synchronizacji danych w chmurze
- Implementujemy proper error handling

### Stylowanie
- Używamy UnoCSS jako głównego frameworka CSS
- Vuetify do komponentów UI z systemem motywów
- Style scoped w komponentach Vue
- Responsive design z breakpoints Vuetify

## Struktura projektu

- `pages/` - strony aplikacji (Nuxt routing)
- `components/` - komponenty Vue wielokrotnego użytku
- `layouts/` - layouty Nuxt
- `stores/` - Pinia stores
- `types/` - definicje typów TypeScript
- `utils/` - funkcje pomocnicze
- `assets/` - zasoby statyczne
- `locales/` - pliki tłumaczeń (i18n)

## Konwencje kontekstu fitness/siłowni

### Funkcjonalności aplikacji
- Zarządzanie planami treningowymi i ćwiczeniami
- Śledzenie serii, powtórzeń i obciążeń
- Monitorowanie postępów użytkownika
- Profile użytkowników z celami fitness
- Zarządzanie sprzętem siłowni
- Harmonogramy treningów
- Analityka wydajności i statystyki

### Nazewnictwa specyficzne dla domeny
- `workout` - trening
- `exercise` - ćwiczenie
- `set` - seria
- `rep` - powtórzenie
- `weight` - ciężar/obciążenie
- `routine` - plan treningowy
- `progress` - postęp
- `equipment` - sprzęt

## Budowanie i development

- `npm run dev` - uruchomienie serwera deweloperskiego
- `npm run build` - budowanie produkcyjne
- `npm run generate` - generowanie statyczne
- `npm run lint` - uruchomienie ESLint
- `npm run lint:fix` - automatyczne naprawianie błędów
- `npm run typecheck` - sprawdzanie typów TypeScript

## Internacjonalizacja

- Używamy @nuxtjs/i18n do tłumaczeń
- Pliki tłumaczeń w odpowiednich katalogach
- Zawsze używaj `useI18n()` zamiast hardcoded tekstu
- Implementuj tłumaczenia dla polski i angielski

## Wymagania jakości

- Wszystkie nowe komponenty muszą mieć właściwe typy TypeScript
- Używaj ESLint i Prettier z konfiguracji projektu
- Komponenty muszą być responsywne
- Implementuj proper error handling
- Używaj semantic HTML i accessibility best practices
- Testuj kompatybilność z urządzeniami mobilnymi

## Wzorce kodowania

- Używaj `definePageMeta()` do konfiguracji stron
- Używaj `useNuxtImage()` do optymalizacji obrazów
- Używaj composables do logiki wielokrotnego użytku
- Implementuj lazy loading dla komponentów
- Używaj Vuetify's design system konsekwentnie
