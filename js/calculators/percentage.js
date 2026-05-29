/**
 * Percentage Calculator — CalcHub
 * Three modes: X% of Y, X is ?% of Y, Percentage Change
 */

(function () {
  'use strict';

  // ─── Tab switching ───────────────────────────────────────

  var tabs = document.querySelectorAll('.pct-tab');
  var modes = {
    of:     document.getElementById('pctModeOf'),
    is:     document.getElementById('pctModeIs'),
    change: document.getElementById('pctModeChange')
  };

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var mode = this.getAttribute('data-mode');

      // Update tab styles
      tabs.forEach(function (t) {
        t.classList.remove('active', 'calc-btn-primary');
        t.classList.add('calc-btn-secondary');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active', 'calc-btn-primary');
      this.classList.remove('calc-btn-secondary');
      this.setAttribute('aria-selected', 'true');

      // Show / hide mode panels
      Object.keys(modes).forEach(function (key) {
        modes[key].style.display = key === mode ? 'block' : 'none';
      });
    });
  });

  // ─── Enter key support ──────────────────────────────────

  function onEnter(ids, fn) {
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') fn();
        });
      }
    });
  }
  onEnter(['pctOfPercent', 'pctOfNumber'], function () { calcPercentOf(); });
  onEnter(['pctIsValue', 'pctIsTotal'], function () { calcPercentIs(); });
  onEnter(['pctChangeOld', 'pctChangeNew'], function () { calcPercentChange(); });

  // ─── Mode 1: What is X% of Y? ──────────────────────────

  window.calcPercentOf = function () {
    var pct = parseFloat(document.getElementById('pctOfPercent').value);
    var num = parseFloat(document.getElementById('pctOfNumber').value);

    if (isNaN(pct)) { showInputError('pctOfPercent'); return; }
    if (isNaN(num)) { showInputError('pctOfNumber'); return; }

    var result = (pct / 100) * num;

    document.getElementById('pctOfAnswer').textContent = formatNumber(result, 4);
    document.getElementById('pctOfLabel').textContent =
      formatNumber(pct, 2) + '% of ' + formatNumber(num, 2) + ' = ' + formatNumber(result, 4);

    showResult('pctOfResult');
  };

  // ─── Mode 2: X is what % of Y? ─────────────────────────

  window.calcPercentIs = function () {
    var value = parseFloat(document.getElementById('pctIsValue').value);
    var total = parseFloat(document.getElementById('pctIsTotal').value);

    if (isNaN(value)) { showInputError('pctIsValue'); return; }
    if (isNaN(total)) { showInputError('pctIsTotal'); return; }

    if (total === 0) {
      document.getElementById('pctIsAnswer').textContent = 'Undefined';
      document.getElementById('pctIsLabel').textContent = 'Cannot divide by zero';
      showResult('pctIsResult');
      return;
    }

    var result = (value / total) * 100;

    document.getElementById('pctIsAnswer').textContent = formatNumber(result, 4) + '%';
    document.getElementById('pctIsLabel').textContent =
      formatNumber(value, 2) + ' is ' + formatNumber(result, 4) + '% of ' + formatNumber(total, 2);

    showResult('pctIsResult');
  };

  // ─── Mode 3: Percentage change ──────────────────────────

  window.calcPercentChange = function () {
    var oldVal = parseFloat(document.getElementById('pctChangeOld').value);
    var newVal = parseFloat(document.getElementById('pctChangeNew').value);

    if (isNaN(oldVal)) { showInputError('pctChangeOld'); return; }
    if (isNaN(newVal)) { showInputError('pctChangeNew'); return; }

    if (oldVal === 0) {
      document.getElementById('pctChangeAnswer').textContent = 'Undefined';
      document.getElementById('pctChangeTag').innerHTML =
        '<span class="calc-result-tag info">N/A</span>';
      document.getElementById('pctChangeDiff').textContent = formatNumber(Math.abs(newVal - oldVal), 4);
      showResult('pctChangeResult');
      return;
    }

    var diff = newVal - oldVal;
    var pctChange = (diff / Math.abs(oldVal)) * 100;

    document.getElementById('pctChangeAnswer').textContent = formatNumber(Math.abs(pctChange), 4) + '%';

    var tagEl = document.getElementById('pctChangeTag');
    if (pctChange > 0) {
      tagEl.innerHTML = '<span class="calc-result-tag success">▲ Increase</span>';
    } else if (pctChange < 0) {
      tagEl.innerHTML = '<span class="calc-result-tag error">▼ Decrease</span>';
    } else {
      tagEl.innerHTML = '<span class="calc-result-tag info">No Change</span>';
    }

    document.getElementById('pctChangeDiff').textContent = formatNumber(Math.abs(diff), 4);

    showResult('pctChangeResult');
  };
})();
