/**
 * Evocaa - Booking Form Handler
 *
 * Validates the booking form, posts the data to the Google Apps Script
 * Web App URL (read from window.CONFIG.GOOGLE_SCRIPT_URL), and shows the
 * success / error state to the user.
 *
 * Expected flow (see PROJECT_STRUCTURE.md "How It Works"):
 *   1. User submits form
 *   2. Data is sent to the Google Apps Script URL (from env)
 *   3. Apps Script saves to the Google Sheet + sends confirmation email
 *   4. User is redirected to the thank-you page (thankyou.html)
 */
(function () {
  'use strict';

  function init() {
    var form = document.getElementById('bookingForm');
    if (!form) return;

    var successMsg = document.getElementById('successMsg');
    var errorMsg = document.getElementById('errorMsg');
    var errorText = document.getElementById('errorText');

    // Clear validation state as the user types / selects
    form.addEventListener('input', clearInvalid);
    form.addEventListener('change', clearInvalid);

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!validate(form)) {
        focusFirstInvalid(form);
        return;
      }

      var scriptUrl = getScriptUrl();

      if (!scriptUrl) {
        showMessage(errorMsg, successMsg);
        errorText.textContent =
          'This booking form is not configured yet. Please contact Evocaa directly to book your diagnosis.';
        return;
      }

      submit(form, scriptUrl, function (ok, message) {
        if (ok) {
          // Success - send the visitor to the dedicated thank-you page.
          window.location.href = 'thankyou.html';
          return;
        } else {
          showMessage(errorMsg, successMsg);
          errorText.textContent = message;
        }
      });
    });

    // Expose retry for the inline error button
    window.retryForm = function () {
      form.requestSubmit();
    };
  }

  function getScriptUrl() {
    if (window.CONFIG && window.CONFIG.GOOGLE_SCRIPT_URL) {
      return window.CONFIG.GOOGLE_SCRIPT_URL;
    }
    // Fallback: allow an explicit URL to be passed without the env pipeline
    return (typeof window.__EVOCAA_SCRIPT_URL__ === 'string' && window.__EVOCAA_SCRIPT_URL__) || '';
  }

  function validate(form) {
    var valid = true;

    // Required free-text fields
    ['name', 'business', 'goal_90_days'].forEach(function (name) {
      var field = form.elements[name];
      var ok = !!field.value.trim();
      if (!ok) valid = false;
      toggleInvalid(field, !ok);
    });

    // WhatsApp number (required + basic phone format)
    var whatsapp = form.elements.whatsapp;
    var wOk = !!whatsapp.value.trim() && /^[+]?[0-9\s\-()]{7,20}$/.test(whatsapp.value.trim());
    if (!wOk) valid = false;
    toggleInvalid(whatsapp, !wOk);

    // Required radio groups
    [
      'business_age',
      'monthly_revenue',
      'marketing_spend',
      'biggest_challenge',
      'invest_499'
    ].forEach(function (name) {
      var node = form.elements[name];
      var ok = !!node.value;
      var first = node[0];
      if (!ok) valid = false;
      if (first) toggleInvalid(first, !ok);
    });

    return valid;
  }
  function toggleInvalid(field, invalid) {
    var wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('invalid', invalid);
  }

  function clearInvalid(event) {
    var field = event.target;
    if (!field || !field.closest) return;
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.remove('invalid');
  }

  function focusFirstInvalid(form) {
    var first = form.querySelector('.field.invalid input, .field.invalid select');
    if (first) first.focus();
  }

  function submit(form, url, done) {
    var btn = document.getElementById('submitBtn');
    var originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    var payload = new URLSearchParams();
    payload.append('name', form.elements.name.value.trim());
    payload.append('business', form.elements.business.value.trim());
    payload.append('whatsapp', form.elements.whatsapp.value.trim());
    payload.append('business_age', form.elements.business_age.value);
    payload.append('monthly_revenue', form.elements.monthly_revenue.value);
    payload.append('marketing_spend', form.elements.marketing_spend.value);
    payload.append('biggest_challenge', form.elements.biggest_challenge.value);
    payload.append('goal_90_days', form.elements.goal_90_days.value.trim());
    payload.append('invest_499', form.elements.invest_499.value);

    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload.toString()
    })
      .then(function (response) {
        // mode:'no-cors' returns an opaque response, so treat a successful
        // round-trip as success unless the request itself failed.
        done(true, '');
      })
      .catch(function () {
        done(false, 'We couldn\'t submit your booking just now. Please try again in a moment.');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = originalLabel;
      });
  }

  function showMessage(show, hide) {
    show.classList.add('show');
    if (hide) hide.classList.remove('show');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
