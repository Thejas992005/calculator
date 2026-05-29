/* ===== BMI Calculator — Logic ===== */

(function () {
  'use strict';

  const weightUnitSelect = document.getElementById('bmiWeightUnit');
  const weightUnitLabel = document.getElementById('bmiWeightUnitLabel');
  const heightUnitSelect = document.getElementById('bmiHeightUnit');
  const heightCmGroup = document.getElementById('bmiHeightCmGroup');
  const heightFtInGroup = document.getElementById('bmiHeightFtInGroup');

  // Toggle weight unit label
  if (weightUnitSelect && weightUnitLabel) {
    weightUnitSelect.addEventListener('change', () => {
      weightUnitLabel.textContent = weightUnitSelect.value === 'kg' ? 'kg' : 'lbs';
    });
  }

  // Toggle height input fields
  if (heightUnitSelect && heightCmGroup && heightFtInGroup) {
    heightUnitSelect.addEventListener('change', () => {
      if (heightUnitSelect.value === 'cm') {
        heightCmGroup.style.display = 'block';
        heightFtInGroup.style.display = 'none';
      } else {
        heightCmGroup.style.display = 'none';
        heightFtInGroup.style.display = 'block';
      }
    });
  }
})();

/**
 * Main BMI calculation
 */
function calculateBMI() {
  const weightUnit = document.getElementById('bmiWeightUnit').value;
  const heightUnit = document.getElementById('bmiHeightUnit').value;

  // Get weight in kg
  let weightKg;
  const weightInput = parseFloat(document.getElementById('bmiWeight').value);

  if (!isValidNumber(weightInput)) {
    showInputError('bmiWeight');
    return;
  }

  weightKg = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

  // Get height in meters
  let heightM;

  if (heightUnit === 'cm') {
    const heightCm = parseFloat(document.getElementById('bmiHeightCm').value);
    if (!isValidNumber(heightCm)) {
      showInputError('bmiHeightCm');
      return;
    }
    heightM = heightCm / 100;
  } else {
    const feet = parseFloat(document.getElementById('bmiHeightFt').value);
    const inches = parseFloat(document.getElementById('bmiHeightIn').value) || 0;

    if (isNaN(feet) || feet < 0) {
      showInputError('bmiHeightFt');
      return;
    }
    if (feet === 0 && inches === 0) {
      showInputError('bmiHeightFt');
      return;
    }

    const totalInches = (feet * 12) + inches;
    heightM = totalInches * 0.0254;
  }

  if (heightM <= 0) {
    return;
  }

  // Calculate BMI
  const bmi = weightKg / (heightM * heightM);

  // Determine category
  const { category, tagClass, tagText } = getBMICategory(bmi);

  // Update result values
  document.getElementById('bmiValue').textContent = bmi.toFixed(1);

  // Update category tag
  const tagContainer = document.getElementById('bmiCategoryTag');
  tagContainer.innerHTML = `<span class="calc-result-tag ${tagClass}">${tagText}</span>`;

  // Update gauge pointer
  updateBMIGauge(bmi);

  // Show results
  showResult('bmiResultSection');
}

/**
 * Get BMI category info
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      category: 'underweight',
      tagClass: 'info',
      tagText: '⚠️ Underweight'
    };
  } else if (bmi < 25) {
    return {
      category: 'normal',
      tagClass: 'success',
      tagText: '✅ Normal Weight'
    };
  } else if (bmi < 30) {
    return {
      category: 'overweight',
      tagClass: 'warning',
      tagText: '⚠️ Overweight'
    };
  } else {
    return {
      category: 'obese',
      tagClass: 'error',
      tagText: '🔴 Obese'
    };
  }
}

/**
 * Update the visual BMI gauge pointer position
 * Scale: 0 to 40 mapped across the gauge width
 */
function updateBMIGauge(bmi) {
  const pointer = document.getElementById('bmiPointer');
  const pointerLabel = document.getElementById('bmiPointerLabel');
  if (!pointer) return;

  // Clamp BMI between 0 and 40 for the gauge
  const clampedBmi = Math.min(Math.max(bmi, 0), 40);

  // Calculate percentage position (0 = 0%, 40 = 100%)
  const pct = (clampedBmi / 40) * 100;

  pointer.style.left = pct + '%';

  if (pointerLabel) {
    pointerLabel.textContent = bmi.toFixed(1);
  }
}

/**
 * Reset the calculator to defaults
 */
function resetBMI() {
  document.getElementById('bmiWeight').value = '';
  document.getElementById('bmiHeightCm').value = '';
  document.getElementById('bmiHeightFt').value = '';
  document.getElementById('bmiHeightIn').value = '';

  document.getElementById('bmiWeightUnit').value = 'kg';
  document.getElementById('bmiWeightUnitLabel').textContent = 'kg';
  document.getElementById('bmiHeightUnit').value = 'cm';

  // Reset height toggle visibility
  document.getElementById('bmiHeightCmGroup').style.display = 'block';
  document.getElementById('bmiHeightFtInGroup').style.display = 'none';

  const resultSection = document.getElementById('bmiResultSection');
  if (resultSection) {
    resultSection.style.display = 'none';
  }
}
