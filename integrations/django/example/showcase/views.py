import random

from django.contrib import messages
from django.core.paginator import Paginator
from django.shortcuts import redirect, render

from .forms import AccountForm

STATUSES = [("Paid", "success"), ("Pending", "warning"), ("Refunded", "neutral"), ("Failed", "danger")]
CUSTOMERS = ["Ada Mensah", "Kofi Boateng", "Lina Haddad", "Sam Okafor", "Mei Tan", "Noah Weber", "Ines Duarte", "Tomas Novak"]


def _orders():
    rng = random.Random(7)
    return [
        {
            "id": f"#{1040 + i}",
            "customer": rng.choice(CUSTOMERS),
            "amount": f"{rng.randint(20, 900)}.{rng.randint(0, 99):02d}",
            "status": STATUSES[rng.randint(0, 3)],
        }
        for i in range(57)
    ]


def dashboard(request):
    page = Paginator(_orders(), 8).get_page(request.GET.get("page"))
    return render(request, "showcase/dashboard.html", {"page_obj": page, "breadcrumb": [("Home", "/"), ("Dashboard", None)]})


def components(request):
    return render(request, "showcase/components.html", {"tabs": [("Overview", "/components/"), ("Dashboard", "/"), ("Form", "/form/")], "accents": ["red", "orange", "amber", "lime", "green", "teal", "cyan", "blue", "indigo", "purple", "magenta", "pink"]})


def account(request):
    form = AccountForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            messages.success(request, f"Account created for {form.cleaned_data['full_name']}.")
            return redirect("account")
        messages.error(request, "Please fix the highlighted fields.")
    return render(request, "showcase/account.html", {"form": form})


def islands(request):
    from django.conf import settings

    built = (settings.BASE_DIR / "static" / "islands" / "islands.js").exists()
    revenue = [12.4, 14.1, 13.2, 16.8, 18.3, 21.0, 19.6, 23.4]
    return render(request, "showcase/islands.html", {
        "islands_built": built,
        "chart": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            "series": [{"name": "Revenue ($k)", "values": revenue}],
            "summary": "Revenue grew from $12.4k in January to $23.4k in August.",
            "area": True,
        },
        "table": {
            "caption": "Customers",
            "columns": [{"key": "name", "label": "Name", "sortable": True}, {"key": "plan", "label": "Plan", "sortable": True},
                        {"key": "seats", "label": "Seats", "align": "end", "sortable": True}],
            "rows": [{"id": i, "name": n, "plan": p, "seats": s} for i, (n, p, s) in enumerate(
                [("Ada Mensah", "Team", 12), ("Kofi Boateng", "Starter", 3), ("Lina Haddad", "Enterprise", 140), ("Sam Okafor", "Team", 25)])],
            "selectable": True,
            "minWidth": "0px",
            "hideCaption": True,
        },
        "topics": {"options": [{"label": "Product", "value": "product"}, {"label": "Billing", "value": "billing"},
                               {"label": "Security", "value": "security"}], "modelValue": ["security"]},
        "picked": [v for v in request.GET.getlist("topics") + [request.GET.get("start", "")] if v],
    })
