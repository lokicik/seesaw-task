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
