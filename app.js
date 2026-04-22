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
