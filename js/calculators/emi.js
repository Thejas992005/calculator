/* ===== EMI Calculator — Logic ===== */

(function () {
  'use strict';

  // Sync range sliders with number inputs
  const loanAmountInput = document.getElementById('emiLoanAmount');
  const loanAmountRange = document.getElementById('emiLoanAmountRange');
  const interestRateInput = document.getElementById('emiInterestRate');
  const interestRateRange = document.getElementById('emiInterestRateRange');

  if (loanAmountInput && loanAmountRange) {
    loanAmountInput.addEventListener('input', () => {
      loanAmountRange.value = loanAmountInput.value;
    });
    loanAmountRange.addEventListener('input', () => {
      loanAmountInput.value = loanAmountRange.value;
    });
  }

  if (interestRateInput && interestRateRange) {
    interestRateInput.addEventListener('input', () => {
      interestRateRange.value = interestRateInput.value;
    });
    interestRateRange.addEventListener('input', () => {
      interestRateInput.value = interestRateRange.value;
    });
  }
})();

// Track state for amortization table
let emiAmortizationData = [];
let emiShowAll = false;

/**
 * Main EMI calculation
 */
function calculateEMI() {
  const principal = parseFloat(document.getElementById('emiLoanAmount').value);
  const annualRate = parseFloat(document.getElementById('emiInterestRate').value);
  const tenureValue = parseFloat(document.getElementById('emiLoanTenure').value);
  const tenureUnit = document.getElementById('emiTenureUnit').value;

  // Validate inputs
  if (!isValidNumber(principal)) {
    showInputError('emiLoanAmount');
    return;
  }
  if (!isValidNumber(annualRate)) {
    showInputError('emiInterestRate');
    return;
  }
  if (!isValidNumber(tenureValue)) {
    showInputError('emiLoanTenure');
    return;
  }

  // Convert tenure to months
  const totalMonths = tenureUnit === 'years'
    ? Math.round(tenureValue * 12)
    : Math.round(tenureValue);

  if (totalMonths < 1) {
    showInputError('emiLoanTenure');
    return;
  }

  // Monthly interest rate
  const monthlyRate = annualRate / 12 / 100;

  let emi, totalPayment, totalInterest;

  if (monthlyRate === 0) {
    // Zero interest edge case
    emi = principal / totalMonths;
    totalPayment = principal;
    totalInterest = 0;
  } else {
    // EMI = P × r × (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    emi = principal * monthlyRate * factor / (factor - 1);
    totalPayment = emi * totalMonths;
    totalInterest = totalPayment - principal;
  }

  // Update result values
  document.getElementById('emiMonthlyEMI').textContent = formatCurrency(emi);
  document.getElementById('emiTotalInterest').textContent = formatCurrency(totalInterest);
  document.getElementById('emiTotalPayment').textContent = formatCurrency(totalPayment);

  // Update pie chart
  updatePieChart(principal, totalInterest);

  // Generate amortization schedule
  generateAmortizationSchedule(principal, monthlyRate, emi, totalMonths);

  // Show results
  showResult('emiResultSection');
}

/**
 * Update the CSS pie chart
 */
function updatePieChart(principal, totalInterest) {
  const total = principal + totalInterest;
  const principalPct = (principal / total) * 100;
  const interestPct = (totalInterest / total) * 100;

  const pie = document.getElementById('emiPieChart');
  if (pie) {
    // Use conic-gradient for the pie chart
    pie.style.background = `conic-gradient(
      var(--accent-purple) 0deg ${principalPct * 3.6}deg,
      var(--accent-cyan) ${principalPct * 3.6}deg 360deg
    )`;
  }

  document.getElementById('emiPrincipalPct').textContent = principalPct.toFixed(1) + '%';
  document.getElementById('emiPrincipalLabel').textContent = formatCurrency(principal);
  document.getElementById('emiInterestLabel').textContent = formatCurrency(totalInterest);
}

/**
 * Generate the amortization schedule data and render table
 */
function generateAmortizationSchedule(principal, monthlyRate, emi, totalMonths) {
  emiAmortizationData = [];
  let balance = principal;

  for (let month = 1; month <= totalMonths; month++) {
    const interestPart = balance * monthlyRate;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);

    emiAmortizationData.push({
      month,
      emi,
      principal: principalPart,
      interest: interestPart,
      balance
    });
  }

  emiShowAll = false;
  renderAmortizationTable();
}

/**
 * Render the amortization table (first 12 or all)
 */
function renderAmortizationTable() {
  const tbody = document.getElementById('emiAmortizationBody');
  const showAllBtn = document.getElementById('emiShowAllBtn');
  if (!tbody) return;

  const dataToShow = emiShowAll
    ? emiAmortizationData
    : emiAmortizationData.slice(0, 12);

  let html = '';
  dataToShow.forEach(row => {
    html += `<tr>
      <td>${row.month}</td>
      <td>${formatCurrency(row.emi)}</td>
      <td>${formatCurrency(row.principal)}</td>
      <td>${formatCurrency(row.interest)}</td>
      <td>${formatCurrency(row.balance)}</td>
    </tr>`;
  });

  tbody.innerHTML = html;

  // Show/hide the "Show All" button
  if (showAllBtn) {
    if (emiAmortizationData.length > 12) {
      showAllBtn.style.display = 'inline-flex';
      showAllBtn.textContent = emiShowAll
        ? 'Show First 12 Months'
        : `Show All ${emiAmortizationData.length} Months`;
    } else {
      showAllBtn.style.display = 'none';
    }
  }
}

/**
 * Toggle between showing 12 months and all months
 */
function toggleAmortizationTable() {
  emiShowAll = !emiShowAll;
  renderAmortizationTable();
}

/**
 * Reset the calculator to defaults
 */
function resetEMI() {
  document.getElementById('emiLoanAmount').value = 1000000;
  document.getElementById('emiLoanAmountRange').value = 1000000;
  document.getElementById('emiInterestRate').value = 8.5;
  document.getElementById('emiInterestRateRange').value = 8.5;
  document.getElementById('emiLoanTenure').value = 20;
  document.getElementById('emiTenureUnit').value = 'years';

  const resultSection = document.getElementById('emiResultSection');
  if (resultSection) {
    resultSection.style.display = 'none';
  }

  emiAmortizationData = [];
  emiShowAll = false;
}
