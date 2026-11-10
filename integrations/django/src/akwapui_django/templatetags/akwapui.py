"""AkwapUI template tags.

    {% load akwapui %}

Every component tag renders a template from ``akwapui/components/``. Override
any of them by putting a template with the same path in your own templates
directory. Keyword arguments the tag does not know about become HTML
attributes on the component's root element (``aria_label`` becomes
``aria-label``), so you can always add an id, a ``name``, ``data-*`` hooks or
htmx attributes.
"""

from __future__ import annotations

import json
from collections.abc import Callable
from typing import Any

from django import template
from django.contrib.messages import constants as message_constants
from django.forms import BoundField
from django.templatetags.static import static
from django.utils.html import conditional_escape, format_html
from django.utils.safestring import SafeString, mark_safe

from ..icons import render_icon

register = template.Library()

BUTTON_VARIANTS = ("primary", "secondary", "outline", "subtle", "transparent", "danger", "link")
SIZES = ("sm", "md", "lg")
INTENTS = ("info", "success", "warning", "danger")
ACCENTS = ("red", "orange", "amber", "lime", "green", "teal", "cyan", "blue", "indigo", "purple", "magenta", "pink")
BADGE_COLORS = ("brand", "neutral", "success", "warning", "danger", "info", *ACCENTS)
INTENT_ICON = {"info": "info", "success": "success", "warning": "warning", "danger": "error"}
INTENT_LABEL = {"info": "Information", "success": "Success", "warning": "Warning", "danger": "Error"}
MESSAGE_INTENT = {
    message_constants.DEBUG: "info",
    message_constants.INFO: "info",
    message_constants.SUCCESS: "success",
    message_constants.WARNING: "warning",
    message_constants.ERROR: "danger",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _choice(name: str, value: Any, allowed: tuple[str, ...]) -> str:
    if value not in allowed:
        raise template.TemplateSyntaxError(f"AkwapUI: {name}={value!r} is not one of {', '.join(allowed)}")
    return value


def _classes(*parts: Any) -> str:
    return " ".join(str(p) for p in parts if p)


def attrs(extra: dict[str, Any]) -> SafeString:
    """Turn leftover tag kwargs into escaped HTML attributes.

    ``aria_label="Close"`` -> ``aria-label="Close"``; ``True`` renders a bare
    attribute and ``False``/``None`` drop it.
    """
    out = []
    for key, value in extra.items():
        if value is None or value is False:
            continue
        name = conditional_escape(str(key).replace("_", "-"))
        out.append(f" {name}" if value is True else f' {name}="{conditional_escape(value)}"')
    return mark_safe("".join(out))


def initials(name: str) -> str:
    parts = [p for p in str(name).replace("-", " ").split() if p]
    if not parts:
        return "?"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()


def accent_for(key: str) -> str:
    """Same stable hash as accentFor() in the Vue library."""
    h = 0
    for ch in str(key):
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return ACCENTS[h % len(ACCENTS)]


class ComponentNode(template.Node):
    def __init__(self, template_name, prepare, args, kwargs, nodelist=None, takes_context=False):
        self.template_name = template_name
        self.prepare = prepare
        self.args = args
        self.kwargs = kwargs
        self.nodelist = nodelist
        self.takes_context = takes_context

    def render(self, context):
        args = [a.resolve(context) for a in self.args]
        kwargs = {k: v.resolve(context) for k, v in self.kwargs.items()}
        if self.nodelist is not None:
            kwargs["content"] = mark_safe(self.nodelist.render(context).strip())
        if self.takes_context:
            kwargs["context"] = context
        data = self.prepare(*args, **kwargs)
        if isinstance(data, str):
            return data
        tpl = context.template.engine.get_template(self.template_name)
        with context.push(**data):
            return tpl.render(context)


def _parse_bits(parser, bits):
    args, kwargs = [], {}
    for bit in bits:
        if "=" in bit and not bit.startswith(("'", '"')):
            key, value = bit.split("=", 1)
            kwargs[key] = parser.compile_filter(value)
        else:
            if kwargs:
                raise template.TemplateSyntaxError(f"AkwapUI: positional argument {bit!r} after keyword arguments")
            args.append(parser.compile_filter(bit))
    return args, kwargs


def component(name: str, template_name: str | None = None, block: bool = False, takes_context: bool = False):
    """Register ``prepare`` as tag ``name`` (and ``end<name>`` if block)."""

    def decorator(prepare: Callable[..., dict[str, Any] | str]):
        def compile_tag(parser, token):
            bits = token.split_contents()[1:]
            args, kwargs = _parse_bits(parser, bits)
            nodelist = None
            if block:
                nodelist = parser.parse((f"end{name}",))
                parser.delete_first_token()
            return ComponentNode(template_name, prepare, args, kwargs, nodelist, takes_context)

        register.tag(name, compile_tag)
        return prepare

    return decorator


# ---------------------------------------------------------------------------
# Page setup
# ---------------------------------------------------------------------------
THEME_SCRIPT = """(function(){var d=document.documentElement;try{var p=localStorage.getItem('akwapui:theme')||'system';var t=p;if(p==='system'){t=matchMedia('(forced-colors: active)').matches?'high-contrast':matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t);var b=JSON.parse(localStorage.getItem('akwapui:brand')||'null');if(b&&typeof b.hue==='number'){d.style.setProperty('--ak-brand-hue',String(b.hue));d.style.setProperty('--ak-brand-chroma',String(b.chroma))}}catch(e){d.setAttribute('data-theme','light')}})();"""


@register.simple_tag
def ak_head(nonce: str | None = None, css: str | None = None):
    """Put in <head>: applies the saved theme before first paint (no flash).

    ``css="prebuilt"`` also links the prebuilt stylesheet for apps that do not
    run Tailwind. Pass ``nonce=request.csp_nonce`` under a strict CSP.
    """
    parts = [mark_safe('<meta name="color-scheme" content="light dark">')]
    parts.append(format_html("<script{}>{}</script>", attrs({"nonce": nonce}), mark_safe(THEME_SCRIPT)))
    if css == "prebuilt":
        parts.append(format_html('<link rel="stylesheet" href="{}">', static("akwapui/akwapui.css")))
    return mark_safe("\n".join(parts))


@register.simple_tag
def ak_scripts(nonce: str | None = None):
    """Theme switcher, dismissible alerts, dialogs and toasts. Put before </body>."""
    return format_html('<script src="{}" defer{}></script>', static("akwapui/akwapui.js"), attrs({"nonce": nonce}))


@register.simple_tag
def ak_icon(name: str, size: int | str = 20, label: str | None = None, stroke_width: float = 1.75, **extra):
    """``{% ak_icon "delete" %}`` — a semantic AkwapUI icon or a Lucide name."""
    return render_icon(name, size=size, label=label, stroke_width=stroke_width, **extra)


# ---------------------------------------------------------------------------
# Buttons and badges
# ---------------------------------------------------------------------------
@component("ak_button", "akwapui/components/button.html")
def _button(label="", variant="secondary", size="md", type="button", href=None, icon=None, icon_end=None,
            icon_only=False, disabled=False, loading=False, loading_text=None, block=False, pressed=None, **extra):
    _choice("variant", variant, BUTTON_VARIANTS)
    _choice("size", size, SIZES)
    if icon_only and not (extra.get("aria_label") or label):
        raise template.TemplateSyntaxError("AkwapUI: ak_button icon_only needs a label or aria_label")
    tag = "a" if href else "button"
    a = dict(extra)
    if tag == "a":
        if not disabled:
            a["href"] = href
        else:
            a.update({"aria_disabled": "true", "role": "link", "tabindex": "-1"})
    else:
        a["type"] = type
        a["disabled"] = bool(disabled)
    if loading:
        a["aria_busy"] = "true"
        a["aria_disabled"] = "true"
    if pressed is not None:
        a["aria_pressed"] = "true" if pressed else "false"
    return {
        "tag": tag,
        "label": label,
        "loading": loading,
        "loading_text": loading_text,
        "icon": icon,
        "icon_end": icon_end,
        "icon_only": icon_only,
        "spinner_size": "sm" if size == "lg" else "xs",
        "classes": _classes(
            "ak-btn",
            f"ak-btn-{variant}" if variant != "secondary" else "",
            f"ak-btn-{size}" if size != "md" else "",
            icon_only and "ak-btn-icon",
            block and "ak-btn-block",
            extra.pop("class", None),
        ),
        "attrs": attrs({k: v for k, v in a.items() if k != "class"}),
    }


@component("ak_badge", "akwapui/components/badge.html")
def _badge(label="", color="neutral", appearance="tint", size="md", icon=None, dot=False, shape="circular", **extra):
    _choice("color", color, BADGE_COLORS)
    _choice("appearance", appearance, ("tint", "filled", "outline"))
    _choice("size", size, SIZES)
    return {
        "label": label,
        "icon": icon,
        "dot": dot,
        "classes": _classes(
            "ak-badge",
            f"ak-badge-{color}",
            appearance != "tint" and f"ak-badge-{appearance}",
            size != "md" and f"ak-badge-{size}",
            shape == "rounded" and "ak-badge-rounded",
            extra.pop("class", None),
        ),
        "attrs": attrs(extra),
    }


# ---------------------------------------------------------------------------
# Containers and feedback
# ---------------------------------------------------------------------------
@component("ak_card", "akwapui/components/card.html", block=True)
def _card(content="", title=None, subtitle=None, appearance="outline", padding="md", href=None, heading_level=3, **extra):
    _choice("appearance", appearance, ("outline", "filled", "subtle", "elevated"))
    _choice("padding", padding, ("none", "sm", "md", "lg"))
    return {
        "content": content,
        "title": title,
        "subtitle": subtitle,
        "tag": "a" if href else "section",
        "heading_tag": f"h{int(heading_level)}",
        "classes": _classes(
            "ak-card",
            appearance != "outline" and f"ak-card-{appearance}",
            padding != "md" and f"ak-card-pad-{padding}",
            extra.pop("class", None),
        ),
        "attrs": attrs({"href": href, **extra}),
    }


@component("ak_alert", "akwapui/components/alert.html", block=True)
def _alert(content="", intent="info", title=None, dismissible=False, role=None, icon=None, **extra):
    _choice("intent", intent, INTENTS)
    if role is None:
        role = "alert" if intent in ("danger", "warning") else "status"
    return {
        "content": content,
        "title": title,
        "dismissible": dismissible,
        "icon": icon or INTENT_ICON[intent],
        "intent_label": INTENT_LABEL[intent],
        "classes": _classes("ak-alert", intent != "info" and f"ak-alert-{intent}", extra.pop("class", None)),
        "attrs": attrs({"role": None if role == "none" else role, **extra}),
    }


@component("ak_messages", "akwapui/components/messages.html", takes_context=True)
def _messages(context=None, toast=False, dismissible=True, timeout=6000):
    """Django's messages framework as alerts, or as toasts with toast=True."""
    items = []
    for m in context.get("messages") or []:
        intent = MESSAGE_INTENT.get(m.level, "info")
        items.append({"message": m, "intent": intent, "icon": INTENT_ICON[intent], "intent_label": INTENT_LABEL[intent],
                      "role": "alert" if intent in ("danger", "warning") else "status"})
    return {"items": items, "toast": toast, "dismissible": dismissible, "timeout": timeout}


@component("ak_empty", "akwapui/components/empty.html", block=True)
def _empty(content="", title="", description=None, icon="inbox", heading_level=3, **extra):
    return {"content": content, "title": title, "description": description, "icon": icon,
            "heading_tag": f"h{int(heading_level)}", "attrs": attrs(extra)}


@component("ak_dialog", "akwapui/components/dialog.html", block=True)
def _dialog(content="", id="", title="", close_label="Close", **extra):
    """Native <dialog>. Open it with any element carrying data-ak-dialog-open="<id>"."""
    if not id:
        raise template.TemplateSyntaxError("AkwapUI: ak_dialog needs an id")
    return {"content": content, "id": id, "title": title, "close_label": close_label,
            "classes": _classes("ak-dialog", extra.pop("class", None)), "attrs": attrs(extra)}


@component("ak_spinner", "akwapui/components/spinner.html")
def _spinner(size="md", label=None, **extra):
    _choice("size", size, ("xs", "sm", "md", "lg"))
    return {"label": label, "classes": _classes("ak-spinner", size != "md" and f"ak-spinner-{size}"), "attrs": attrs(extra)}


@component("ak_progress", "akwapui/components/progress.html")
def _progress(value=0, max=100, label=None, intent=None, show_value=True, value_text=None, **extra):
    value, max_ = float(value or 0), float(max or 100)
    pct = round(sorted((0.0, value / max_ * 100, 100.0))[1]) if max_ else 0
    if intent:
        _choice("intent", intent, ("success", "warning", "danger"))
    return {"value": value, "max": max_, "pct": pct, "label": label, "show_value": show_value,
            "value_text": value_text or f"{pct}%",
            "classes": _classes("ak-progress", intent and f"ak-progress-{intent}"), "attrs": attrs(extra)}


@component("ak_stat", "akwapui/components/stat.html")
def _stat(label="", value="", icon=None, delta=None, direction=None, good=None, delta_label=None, **extra):
    _choice("direction", direction, (None, "up", "down", "flat"))
    return {
        "label": label, "value": value, "icon": icon, "delta": delta, "direction": direction or "flat",
        "delta_label": delta_label,
        "delta_icon": {"up": "trending-up", "down": "trending-down"}.get(direction or "flat", "remove"),
        "direction_text": {"up": "Increased", "down": "Decreased"}.get(direction or "flat", "No change"),
        "tone": "" if good is None else ("ak-stat-good" if good else "ak-stat-bad"),
        "attrs": attrs(extra),
    }


@component("ak_avatar", "akwapui/components/avatar.html")
def _avatar(name="", src=None, size="md", color=None, shape="circular", decorative=False, **extra):
    _choice("size", size, ("sm", "md", "lg", "xl"))
    color = color or accent_for(name)
    _choice("color", color, ACCENTS)
    return {
        "name": name, "src": src, "initials": initials(name), "decorative": decorative,
        "classes": _classes("ak-avatar", f"ak-avatar-{color}", size != "md" and f"ak-avatar-{size}",
                            shape == "square" and "ak-avatar-square", extra.pop("class", None)),
        "attrs": attrs(extra),
    }


# ---------------------------------------------------------------------------
# Navigation
# ---------------------------------------------------------------------------
def _items(items):
    """Accept [("Label", "/url"), …] or [{"label":…, "url":…, "active":…, "icon":…}, …]."""
    out = []
    for item in items or []:
        if isinstance(item, dict):
            out.append({"label": item.get("label", ""), "url": item.get("url"), "active": item.get("active", False),
                        "icon": item.get("icon"), "badge": item.get("badge")})
        else:
            label, url, *rest = list(item) + [None]
            out.append({"label": label, "url": url, "active": bool(rest and rest[0]), "icon": None, "badge": None})
    return out


@component("ak_breadcrumb", "akwapui/components/breadcrumb.html")
def _breadcrumb(items=None, label="Breadcrumb"):
    return {"items": _items(items), "label": label}


@component("ak_tabs", "akwapui/components/tabs.html", takes_context=True)
def _tabs(items=None, label="Sections", context=None):
    items = _items(items)
    request = context.get("request")
    if request is not None and not any(i["active"] for i in items):
        for i in items:
            i["active"] = i["url"] == request.path
    return {"items": items, "label": label}


@component("ak_nav", "akwapui/components/nav.html", takes_context=True)
def _nav(sections=None, label="Main", context=None):
    """sections: [{"title": "Workspace", "items": [{"label", "url", "icon"}, …]}, …] or a flat item list."""
    request = context.get("request")
    if sections and isinstance(sections[0], dict) and "items" in sections[0]:
        secs = [{"title": s.get("title"), "items": _items(s["items"])} for s in sections]
    else:
        secs = [{"title": None, "items": _items(sections)}]
    for s in secs:
        for i in s["items"]:
            if not i["active"] and request is not None and i["url"]:
                i["active"] = request.path == i["url"] or (i["url"] != "/" and request.path.startswith(i["url"]))
    return {"sections": secs, "label": label}


@component("ak_pagination", "akwapui/components/pagination.html", takes_context=True)
def _pagination(page_obj=None, param="page", label="Pagination", summary=True, context=None):
    """Pagination for a Django ``Page`` (page_obj in ListView). Keeps other query parameters."""
    if page_obj is None or page_obj.paginator.num_pages <= 1 and not summary:
        return ""
    request = context.get("request")
    query = request.GET.copy() if request is not None else None

    def url(n):
        if query is None:
            return f"?{param}={n}"
        q = query.copy()
        q[param] = n
        return "?" + q.urlencode()

    current, total = page_obj.number, page_obj.paginator.num_pages
    pages = []
    for n in _page_window(current, total):
        pages.append(None if n is None else {"number": n, "url": url(n), "current": n == current})
    return {
        "page": page_obj, "pages": pages, "label": label, "summary": summary,
        "first_url": url(1), "prev_url": url(current - 1) if page_obj.has_previous() else None,
        "next_url": url(current + 1) if page_obj.has_next() else None, "last_url": url(total),
        "is_first": current == 1, "is_last": current == total, "show_nav": total > 1,
    }


def _page_window(current: int, total: int, siblings: int = 1) -> list[int | None]:
    """1 … 4 5 6 … 20 — same shape as AkPagination."""
    if total <= 5 + siblings * 2:
        return list(range(1, total + 1))
    left, right = max(2, current - siblings), min(total - 1, current + siblings)
    if left <= 3:
        left, right = 2, 3 + siblings * 2
    if right >= total - 2:
        left, right = total - 2 - siblings * 2, total - 1
    out: list[int | None] = [1]
    if left > 2:
        out.append(None)
    out.extend(range(left, right + 1))
    if right < total - 1:
        out.append(None)
    out.append(total)
    return out


@component("ak_theme_switcher", "akwapui/components/theme_switcher.html")
def _theme_switcher(labels=True, label="Theme"):
    return {
        "labels": labels, "label": label,
        "options": [("light", "Light", "light"), ("dark", "Dark", "dark"),
                    ("high-contrast", "High contrast", "high-contrast"), ("system", "System", "system")],
    }


# ---------------------------------------------------------------------------
# Forms
# ---------------------------------------------------------------------------
CONTROL_WIDGETS = {"text", "email", "password", "number", "url", "tel", "search", "date", "datetime", "time", "color",
                   "file", "dateinput", "datetimeinput", "timeinput"}


def field_kind(bf: BoundField) -> str:
    w = bf.widget_type
    if bf.is_hidden:
        return "hidden"
    if w == "checkbox":
        return "switch" if bf.field.widget.attrs.get("role") == "switch" else "checkbox"
    if w in ("radioselect", "checkboxselectmultiple"):
        return "choices"
    if w in ("select", "nullbooleanselect"):
        return "select"
    if w == "selectmultiple":
        return "multiple"
    if w == "textarea":
        return "textarea"
    if w == "clearablefile":
        return "file"
    if w in ("splitdatetime", "selectdate", "multi"):
        return "multi"
    return "control"


@register.filter
def ak_widget(bf: BoundField, size: str = "") -> SafeString:
    """Render a bound field's widget with AkwapUI classes and ARIA wiring."""
    kind = field_kind(bf)
    existing = bf.field.widget.attrs.get("class", "")
    cls = {"checkbox": "ak-check", "switch": "ak-switch",
           "choices": "ak-radio" if bf.widget_type == "radioselect" else "ak-check"}.get(kind, "")
    extra: dict[str, Any] = {}
    if cls or existing:
        extra["class"] = _classes(existing, cls)
    describedby = []
    if bf.auto_id and kind not in ("hidden", "choices"):
        if bf.help_text:
            describedby.append(f"{bf.auto_id}_helptext")
        if bf.errors:
            describedby.append(f"{bf.auto_id}_error")
    if describedby and not bf.field.widget.attrs.get("aria-describedby"):
        extra["aria-describedby"] = " ".join(describedby)
    if bf.errors and kind != "hidden":
        extra["aria-invalid"] = "true"
    return bf.as_widget(attrs=extra)


@register.filter
def ak_field_kind(bf: BoundField) -> str:
    return field_kind(bf)


@register.simple_tag(takes_context=True)
def ak_field(context, bf: BoundField, size: str = "md", horizontal: bool = False, hide_label: bool = False):
    """Render one form field as an AkwapUI field: label, control, help and errors."""
    tpl = context.template.engine.get_template("akwapui/forms/field.html")
    with context.push(field=bf, size=size, horizontal=horizontal, hide_label=hide_label):
        return tpl.render(context)


@register.simple_tag(takes_context=True)
def ak_form(context, form, size: str = "md", horizontal: bool = False):
    """Render a whole form (errors, fields, hidden fields) — no <form> or buttons."""
    tpl = context.template.engine.get_template("akwapui/forms/form.html")
    fields = [bf for bf in form.visible_fields()]
    with context.push(form=form, ak_fields=fields, size=size, horizontal=horizontal):
        return tpl.render(context)


# ---------------------------------------------------------------------------
# Vue islands
# ---------------------------------------------------------------------------
@register.simple_tag
def ak_island(component: str, props: Any = None, name: str | None = None, **extra):
    """Mount point for a Vue component (see docs/DJANGO.md, “Vue islands”).

    ``name="start_date"`` asks the islands script to keep a hidden input of that
    name in sync with the component's v-model, so it posts with the form.
    Anything inside the element (for example a server-rendered fallback) is
    replaced when the island mounts.
    """
    return format_html(
        '<div data-ak-island="{}" data-ak-props="{}"{}{}></div>',
        component,
        json.dumps(props or {}, default=str),
        format_html(' data-ak-name="{}"', name) if name else "",
        attrs(extra),
    )


@register.filter
def ak_initials(name: str) -> str:
    return initials(name)
