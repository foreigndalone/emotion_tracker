import { renderReflection } from '../modules/scripts/reflectionUtils.js';

document.addEventListener("DOMContentLoaded", () => {

  // === NAVBAR ===
  const button_home = document.querySelector('#js-home');
  const button_profile = document.querySelector('#js-profile');
  const button_history = document.querySelector('#js-history');
  const button_insights = document.querySelector('#js-insights');
  const reflectionsList = document.querySelector('#reflections__list');

  button_home.addEventListener('click', () => window.location.href = '../main/main.html');
  button_profile.addEventListener('click', () => window.location.href = '../profile/profile_personal_info.html');
  button_history.addEventListener('click', () => window.location.href = 'history.html');
  button_insights.addEventListener('click', () => window.location.href = '../insights/insights.html');

  // === ПОДГРУЖАЕМ ВСЕ REFLECTIONS ===
  const savedReflections = JSON.parse(localStorage.getItem('reflections')) || [];

  reflectionsList.innerHTML = '';
  savedReflections.forEach(ref => renderReflection(ref, reflectionsList));


    });