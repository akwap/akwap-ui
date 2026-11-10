"""SVG icons for the {% ak_icon %} tag.

The built-in set is the AkwapUI semantic icon set (``delete``, ``add``,
``success``…) plus the Lucide names of those icons (``trash-2``, ``plus``…),
generated from the design system by ``npm run build:django``. Add more by
listing folders of Lucide-style SVG files in ``settings.AKWAPUI["ICON_DIRS"]``
(for example the ``icons/`` folder of the ``lucide-static`` npm package).
"""

from __future__ import annotations

import json
import re
from functools import cache
from pathlib import Path

from django.conf import settings
from django.utils.html import conditional_escape, format_html
from django.utils.safestring import mark_safe

SIZES = {"xs": 12, "sm": 16, "md": 20, "lg": 24, "xl": 32, "2xl": 48}
_INNER = re.compile(r"<svg[^>]*>(.*)</svg>", re.S)


@cache
def builtin_icons() -> dict[str, str]:
    data = json.loads((Path(__file__).parent / "icons.json").read_text())
    return data["icons"]


@cache
def semantic_names() -> dict[str, str]:
    data = json.loads((Path(__file__).parent / "icons.json").read_text())
    return data["semantic"]


@cache
def _from_dirs(name: str) -> str | None:
    if not re.fullmatch(r"[a-z0-9-]+", name):
        return None
    for d in getattr(settings, "AKWAPUI", {}).get("ICON_DIRS", []):
        path = Path(d) / f"{name}.svg"
        if path.is_file():
            m = _INNER.search(path.read_text())
            if m:
                return m.group(1).strip()
    return None


def icon_markup(name: str) -> str:
    inner = builtin_icons().get(name) or _from_dirs(name)
    if inner is None:
        raise ValueError(f"AkwapUI: unknown icon {name!r}. Use a semantic name, or add an SVG folder to AKWAPUI['ICON_DIRS'].")
    return inner


def render_icon(name: str, size: int | str = 20, label: str | None = None, stroke_width: float = 1.75, **extra) -> str:
    px = SIZES.get(str(size), size)
    cls = " ".join(c for c in ("ak-icon", extra.pop("class", "")) if c)
    a11y = format_html(' role="img" aria-label="{}"', label) if label else mark_safe(' aria-hidden="true" focusable="false"')
    rest = mark_safe("".join(f' {conditional_escape(k.replace("_", "-"))}="{conditional_escape(v)}"' for k, v in extra.items()))
    return format_html(
        '<svg xmlns="http://www.w3.org/2000/svg" width="{0}" height="{0}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        'stroke-width="{1}" stroke-linecap="round" stroke-linejoin="round" class="{2}"{3}{4}>{5}</svg>',
        px, stroke_width, cls, a11y, rest, mark_safe(icon_markup(name)),
    )
