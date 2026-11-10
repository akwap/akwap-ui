from django.urls import path

from showcase import views

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("components/", views.components, name="components"),
    path("form/", views.account, name="account"),
    path("islands/", views.islands, name="islands"),
]
