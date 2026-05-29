/**
 * Age Calculator — CalcHub
 * Calculates exact age, totals, next birthday countdown, and fun facts.
 */

(function () {
  'use strict';

  // Set default dates on load
  const toDateInput = document.getElementById('ageToDate');
  const dobInput = document.getElementById('ageDob');
  if (toDateInput) {
    toDateInput.value = formatDateForInput(new Date());
  }

  // Allow Enter key to trigger calculation
  [dobInput, toDateInput].forEach(function (input) {
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') calculateAge();
      });
    }
  });

  // ─── Helpers ─────────────────────────────────────────────

  function formatDateForInput(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // ─── Zodiac helpers ──────────────────────────────────────

  function getWesternZodiac(month, day) {
    // month is 0-indexed
    var signs = [
      { name: '♑ Capricorn',   end: [0, 19] },
      { name: '♒ Aquarius',    end: [1, 18] },
      { name: '♓ Pisces',      end: [2, 20] },
      { name: '♈ Aries',       end: [3, 19] },
      { name: '♉ Taurus',      end: [4, 20] },
      { name: '♊ Gemini',      end: [5, 20] },
      { name: '♋ Cancer',      end: [6, 22] },
      { name: '♌ Leo',         end: [7, 22] },
      { name: '♍ Virgo',       end: [8, 22] },
      { name: '♎ Libra',       end: [9, 22] },
      { name: '♏ Scorpio',     end: [10, 21] },
      { name: '♐ Sagittarius', end: [11, 21] },
      { name: '♑ Capricorn',   end: [11, 31] }
    ];
    for (var i = 0; i < signs.length; i++) {
      if (month < signs[i].end[0] || (month === signs[i].end[0] && day <= signs[i].end[1])) {
        return signs[i].name;
      }
    }
    return '♑ Capricorn';
  }

  function getChineseZodiac(year) {
    var animals = [
      '🐀 Rat', '🐂 Ox', '🐅 Tiger', '🐇 Rabbit',
      '🐉 Dragon', '🐍 Snake', '🐎 Horse', '🐐 Goat',
      '🐒 Monkey', '🐓 Rooster', '🐕 Dog', '🐖 Pig'
    ];
    return animals[(year - 4) % 12];
  }

  // ─── Main calculation ────────────────────────────────────

  window.calculateAge = function () {
    var dobVal = dobInput.value;
    var toVal = toDateInput.value;

    if (!dobVal) {
      if (typeof showInputError === 'function') showInputError('ageDob');
      return;
    }

    var dob = new Date(dobVal);
    var toDate = toVal ? new Date(toVal) : new Date();

    // Ensure toDate is not before dob
    if (toDate < dob) {
      if (typeof showInputError === 'function') showInputError('ageToDate');
      return;
    }

    // ── Calculate years, months, days ──
    var years = toDate.getFullYear() - dob.getFullYear();
    var months = toDate.getMonth() - dob.getMonth();
    var days = toDate.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      // days in previous month of toDate
      var prevMonth = toDate.getMonth() - 1;
      var prevYear = toDate.getFullYear();
      if (prevMonth < 0) { prevMonth = 11; prevYear--; }
      days += daysInMonth(prevYear, prevMonth);
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // ── Totals ──
    var msPerDay = 1000 * 60 * 60 * 24;
    var totalDays = Math.floor((toDate - dob) / msPerDay);
    var totalWeeks = Math.floor(totalDays / 7);
    var totalMonths = years * 12 + months;
    var totalHours = totalDays * 24;

    // ── Next birthday ──
    var nextBirthday = new Date(toDate.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday <= toDate) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    // Handle Feb 29 birthdays
    if (dob.getMonth() === 1 && dob.getDate() === 29) {
      while (nextBirthday.getMonth() !== 1) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        nextBirthday = new Date(nextBirthday.getFullYear(), 1, 29);
      }
    }
    var daysUntilBirthday = Math.ceil((nextBirthday - toDate) / msPerDay);

    // ── Fun facts ──
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var bornDay = dayNames[dob.getDay()];
    var zodiac = getWesternZodiac(dob.getMonth(), dob.getDate());
    var chineseZodiac = getChineseZodiac(dob.getFullYear());

    // ── Render results ──
    document.getElementById('ageYears').textContent = formatNumber(years, 0);
    document.getElementById('ageMonths').textContent = formatNumber(months, 0);
    document.getElementById('ageDays').textContent = formatNumber(days, 0);

    document.getElementById('ageTotalMonths').textContent = formatNumber(totalMonths, 0);
    document.getElementById('ageTotalWeeks').textContent = formatNumber(totalWeeks, 0);
    document.getElementById('ageTotalDays').textContent = formatNumber(totalDays, 0);
    document.getElementById('ageTotalHours').textContent = formatNumber(totalHours, 0);

    if (daysUntilBirthday === 0) {
      document.getElementById('ageNextBirthday').textContent = '🎉 Today!';
      document.getElementById('ageNextBirthdayLabel').textContent = 'Happy Birthday!';
    } else {
      document.getElementById('ageNextBirthday').textContent = formatNumber(daysUntilBirthday, 0);
      document.getElementById('ageNextBirthdayLabel').textContent = 'days until your next birthday';
    }

    document.getElementById('ageBornDay').textContent = bornDay;
    document.getElementById('ageZodiac').textContent = zodiac;
    document.getElementById('ageChineseZodiac').textContent = chineseZodiac;

    showResult('ageResultSection');
  };
})();
