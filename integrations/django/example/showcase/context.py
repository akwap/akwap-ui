from django.urls import reverse


def navigation(request):
    """Sidebar items for {% ak_nav %}. The active item is picked from request.path."""
    return {
        "nav_sections": [
            {
                "title": "Example",
                "items": [
                    {"label": "Dashboard", "url": reverse("dashboard"), "icon": "dashboard"},
                    {"label": "Components", "url": reverse("components"), "icon": "adjust"},
                    {"label": "Form", "url": reverse("account"), "icon": "document", "badge": "new"},
                    {"label": "Vue islands", "url": reverse("islands"), "icon": "barChart"},
                ],
            }
        ]
    }
