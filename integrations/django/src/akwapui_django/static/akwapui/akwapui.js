/*! AkwapUI for Django — small progressive enhancements, no dependencies.
 *
 *  - Theme: buttons with [data-ak-theme="light|dark|high-contrast|system"]
 *    (the {% ak_theme_switcher %} tag), or call AkwapUI.setTheme('dark').
 *    Shares the 'akwapui:theme' key with the Vue library, so Vue islands and
 *    Django pages stay in step.
 *  - Brand: AkwapUI.setBrand(hue, chroma) / AkwapUI.resetBrand().
 *  - Alerts: [data-ak-dismiss] removes the closest .ak-alert.
 *  - Toasts: [data-ak-toaster] alerts dismiss themselves after data-ak-timeout ms.
 *  - Dialogs: [data-ak-dialog-open="id"] opens <dialog id="id">;
 *    [data-ak-dialog-close] or a backdrop click closes it.
 *  - htmx: everything is delegated, so swapped-in content works too.
 */
(function () {
  'use strict'
  var THEME_KEY = 'akwapui:theme'
  var BRAND_KEY = 'akwapui:brand'
  var THEMES = ['light', 'dark', 'high-contrast', 'system']
  var root = document.documentElement
  var dark = window.matchMedia('(prefers-color-scheme: dark)')
  var forced = window.matchMedia('(forced-colors: active)')

  function read(key) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return null
    }
  }
  function write(key, value) {
    try {
      if (value === null) localStorage.removeItem(key)
      else localStorage.setItem(key, value)
    } catch (e) {
      /* private mode: the choice still applies for this page */
    }
  }

  var preference = THEMES.indexOf(read(THEME_KEY)) >= 0 ? read(THEME_KEY) : 'system'

  function resolve(pref) {
    if (pref !== 'system') return pref
    if (forced.matches) return 'high-contrast'
    return dark.matches ? 'dark' : 'light'
  }

  function apply() {
    var theme = resolve(preference)
    root.setAttribute('data-theme', theme)
    var buttons = document.querySelectorAll('[data-ak-theme]')
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-ak-theme') === preference))
    }
    document.dispatchEvent(new CustomEvent('akwapui:theme', { detail: { preference: preference, theme: theme } }))
  }

  function setTheme(pref) {
    if (THEMES.indexOf(pref) < 0) throw new Error('AkwapUI: unknown theme ' + pref)
    preference = pref
    write(THEME_KEY, pref)
    apply()
  }

  function setBrand(hue, chroma) {
    root.style.setProperty('--ak-brand-hue', String(hue))
    root.style.setProperty('--ak-brand-chroma', String(chroma))
    write(BRAND_KEY, JSON.stringify({ hue: Number(hue), chroma: Number(chroma), hex: '' }))
  }
  function resetBrand() {
    root.style.removeProperty('--ak-brand-hue')
    root.style.removeProperty('--ak-brand-chroma')
    write(BRAND_KEY, null)
  }

  function dismiss(alert) {
    if (!alert) return
    var parent = alert.parentElement
    alert.remove()
    if (parent && parent.hasAttribute('data-ak-toaster') && !parent.children.length) parent.remove()
  }

  function armToasts(scope) {
    var stacks = (scope || document).querySelectorAll('[data-ak-toaster]:not([data-ak-armed])')
    for (var i = 0; i < stacks.length; i++) {
      var stack = stacks[i]
      stack.setAttribute('data-ak-armed', '')
      var timeout = Number(stack.getAttribute('data-ak-timeout') || 6000)
      if (!timeout) continue
      Array.prototype.forEach.call(stack.children, function (toast) {
        // Errors stay until dismissed, so they cannot vanish before being read.
        if (toast.classList.contains('ak-alert-danger')) return
        var timer = setTimeout(function () { dismiss(toast) }, timeout)
        toast.addEventListener('mouseenter', function () { clearTimeout(timer) })
        toast.addEventListener('focusin', function () { clearTimeout(timer) })
      })
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target instanceof Element ? e.target : null
    if (!t) return
    var themeBtn = t.closest('[data-ak-theme]')
    if (themeBtn) return setTheme(themeBtn.getAttribute('data-ak-theme'))
    var dismissBtn = t.closest('[data-ak-dismiss]')
    if (dismissBtn) return dismiss(dismissBtn.closest('.ak-alert'))
    var opener = t.closest('[data-ak-dialog-open]')
    if (opener) {
      var dialog = document.getElementById(opener.getAttribute('data-ak-dialog-open'))
      if (dialog && typeof dialog.showModal === 'function') {
        e.preventDefault()
        dialog.showModal()
      }
      return
    }
    var closer = t.closest('[data-ak-dialog-close]')
    if (closer) {
      var d = closer.closest('dialog')
      if (d) d.close(closer.getAttribute('value') || '')
      return
    }
    // Click on the backdrop (the dialog element itself, outside its box).
    if (t.tagName === 'DIALOG' && t.classList.contains('ak-dialog')) {
      var r = t.getBoundingClientRect()
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) t.close('')
    }
  })

  function onSystemChange() {
    if (preference === 'system') apply()
  }
  if (dark.addEventListener) {
    dark.addEventListener('change', onSystemChange)
    forced.addEventListener('change', onSystemChange)
  }
  // Another tab (or a Vue island using useTheme) changed the theme.
  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY) {
      preference = THEMES.indexOf(e.newValue) >= 0 ? e.newValue : 'system'
      apply()
    }
  })

  function ready() {
    apply()
    armToasts()
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready)
  else ready()
  // htmx: arm toasts and sync theme buttons in swapped-in content.
  document.addEventListener('htmx:afterSettle', function (e) {
    apply()
    armToasts(e.target)
  })

  window.AkwapUI = {
    setTheme: setTheme,
    getTheme: function () { return { preference: preference, theme: resolve(preference) } },
    setBrand: setBrand,
    resetBrand: resetBrand,
  }
})()
