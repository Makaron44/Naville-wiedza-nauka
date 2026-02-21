
import React from 'react';
import { Concept, Quote, Practice } from './types';

export const NEVILLE_BOOKS = [
  "Na Twoje Rozkazanie",
  "Twoja Wiara to Twoje Przeznaczenie",
  "Wolność dla Wszystkich",
  "Uczucie jest Sekretem",
  "Modlitwa: Sztuka Wierzenia",
  "Nie z tego świata",
  "Potęga Świadomości",
  "Przebudzona Wyobraźnia",
  "Czas siewu i zbioru",
  "Prawo i Obietnica"
];

export const CONCEPTS: Concept[] = [
  {
    id: 'law-of-assumption',
    title: 'Prawo Założenia',
    description: 'Świat jest Twoim lustrem. Jeśli założysz, że Twoje życzenie jest już spełnione, rzeczywistość musi się do tego dostosować.',
    icon: '✨'
  },
  {
    id: 'sats',
    title: 'Stan Podobny do Snu (SATS)',
    description: 'Kluczowa technika Neville\'a. Polega na wejściu w stan głębokiego relaksu przed snem i zapętleniu krótkiej sceny sugerującej spełnienie marzenia.',
    icon: '🌙'
  },
  {
    id: 'mental-diet',
    title: 'Dieta Mentalna',
    description: 'Uważność na wewnętrzne rozmowy. Musisz pilnować swoich myśli tak, jak pilnujesz jedzenia, wybierając tylko te, które wspierają Twoją nową tożsamość.',
    icon: '🧠'
  },
  {
    id: 'revision',
    title: 'Technika Rewizji',
    description: 'Narzędzie do zmiany przeszłości w Twoim umyśle. Jeśli coś poszło nie po Twojej myśli, przeżyj to w wyobraźni tak, jakbyś tego chciał.',
    icon: '⏳'
  },
  {
    id: 'eiypo',
    title: 'Wszyscy to Ty (EIYPO)',
    description: 'Koncepcja "Everyone Is You Pushed Out". Inni ludzie reagują na Twoje założenia o nich. Zmień swoje myślenie o kimś, a on zmieni swoje zachowanie.',
    icon: '👥'
  },
  {
    id: 'bridge-of-incidence',
    title: 'Most Zdarzeń',
    description: 'Seria naturalnych wydarzeń, które prowadzą do spełnienia Twojego celu. Nie musisz ich planować – one wydarzą się same jako wynik Twojego założenia.',
    icon: '🌉'
  },
  {
    id: 'persistence',
    title: 'Wytrwałość',
    description: 'Nawet jeśli zmysły zaprzeczają Twojemu założeniu, trwaj w nim. Wytrwałość w uczuciu spełnienia jest tym, co ostatecznie krystalizuje rzeczywistość.',
    icon: '⚓'
  }
];

export const QUOTES: Quote[] = [
  { text: "Wyobraźnia tworzy rzeczywistość.", source: "Neville Goddard" },
  { text: "Uczucie jest sekretem.", source: "Feeling is the Secret" },
  { text: "Zmień swoje wyobrażenie o sobie, a zmienisz swój świat.", source: "Neville Goddard" },
  { text: "Nie ma nikogo do zmiany poza samym sobą.", source: "Neville Goddard" },
  { text: "To, co czujesz jako prawdziwe, stanie się Twoją rzeczywistością.", source: "Neville Goddard" }
];

export const PRACTICES: Practice[] = [
  {
    id: 'sats-guide',
    name: 'Praktyka SATS',
    description: 'Przewodnik krok po kroku do Twojej wieczornej sesji.',
    steps: [
      'Połóż się wygodnie i zamknij oczy.',
      'Rozluźnij każdą część ciała, aż poczujesz się "bezwładny".',
      'Wybierz jedną, krótką scenę, która wydarzyłaby się PO spełnieniu marzenia (np. uścisk dłoni gratulacyjny).',
      'Poczuj tekstury, zapachy i dźwięki in tej scenie.',
      'Zapętlaj tę scenę, aż poczujesz, że jest całkowicie REALNA.',
      'Zasypiaj w tym uczuciu.'
    ]
  },
  {
    id: 'mental-diet-exercise',
    name: 'Zarządzanie Dietą Mentalną',
    description: 'Monitorowanie wewnętrznego monologu w ciągu dnia.',
    steps: [
      'Przez najbliższą godzinę obserwuj swoje myśli.',
      'Zauważ każdą negatywną myśl o sobie lub sytuacji.',
      'Natychmiast "przetłumacz" ją na pozytywne stwierdzenie zgodne z Twoim celem.',
      'Powtarzaj nową myśl z poczuciem ulgi.'
    ]
  }
];
