// --- Constants ---
const PLANK_LENGTH = 400;
const MAX_ANGLE = 30;
const OBJECT_SIZE = 32;
const TORQUE_DIVISOR = 10;
const LS_KEY = 'seesawState';

// --- State ---
let state = {
  objects: [],
  currentAngle: 0,
  targetAngle: 0
};

// --- Physics ---
function calculateTorques() {
  let left = 0, right = 0;
  state.objects.forEach(function (obj) {
    const torque = obj.weight * Math.abs(obj.offset);
    if (obj.side === 'left') left += torque;
    else right += torque;
  });
  return { left, right };
}

function getTargetAngle() {
  const { left, right } = calculateTorques();
  const raw = (right - left) / TORQUE_DIVISOR;
  return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, raw));
}

function getSideTotals() {
  let left = 0, right = 0;
  state.objects.forEach(function (obj) {
    if (obj.side === 'left') left += obj.weight;
    else right += obj.weight;
  });
  return { left, right };
}

// --- Animation ---
let rafId = null;

function animatePlank(target) {
  if (rafId) cancelAnimationFrame(rafId);
  const start = state.currentAngle;
  if (Math.abs(target - start) < 0.01) return;
  let startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / 600, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    state.currentAngle = start + (target - start) * eased;
    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      state.currentAngle = target;
      rafId = null;
    }
  }
  rafId = requestAnimationFrame(step);
}

// --- Render ---
function renderPlankAngle(angle) {
  document.getElementById('plank').style.transform = 'rotate(' + angle + 'deg)';
}

function updateHUD() {
  const totals = getSideTotals();
  document.getElementById('hud-left').textContent = totals.left + ' kg';
  document.getElementById('hud-right').textContent = totals.right + ' kg';
}

function renderObjects() {
  const plank = document.getElementById('plank');
  plank.querySelectorAll('.object').forEach(function (el) { el.remove(); });
  state.objects.forEach(function (obj) {
    const el = document.createElement('div');
    el.className = 'object';
    el.style.left = (PLANK_LENGTH / 2 + obj.offset) + 'px';
    el.textContent = obj.weight + 'kg';
    plank.appendChild(el);
  });
}

function renderScene() {
  animatePlank(state.targetAngle);
  renderPlankAngle(state.targetAngle);
  renderObjects();
  updateHUD();
}

// --- Events ---
function bindEvents() {
  document.getElementById('plank').addEventListener('click', handlePlankClick);
  document.getElementById('reset-btn').addEventListener('click', handleReset);
}

function getPlankLocalOffset(event) {
  const plank = document.getElementById('plank');
  const rect = plank.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = event.clientX - cx;
  const dy = event.clientY - cy;
  const rad = state.currentAngle * (Math.PI / 180);
  const localX = dx * Math.cos(-rad) - dy * Math.sin(-rad);
  const maxOffset = PLANK_LENGTH / 2 - OBJECT_SIZE / 2;
  return Math.max(-maxOffset, Math.min(maxOffset, localX));
}

function generateWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

function addObject(weight, offset) {
  state.objects.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    weight: weight,
    offset: offset,
    side: offset >= 0 ? 'right' : 'left'
  });
}

function handlePlankClick(event) {
  const offset = getPlankLocalOffset(event);
  const weight = generateWeight();
  addObject(weight, offset);
  state.targetAngle = getTargetAngle();
  renderScene();
}

function handleReset() {
  console.log('reset clicked');
}

// --- Init ---
function init() {
  state.targetAngle = getTargetAngle();
  state.currentAngle = state.targetAngle;
  renderScene();
  bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
