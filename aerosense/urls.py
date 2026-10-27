from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    re_path(
        r"^(?!api(?:/|$)|admin(?:/|$)|static(?:/|$)|media(?:/|$)).*$",
        TemplateView.as_view(template_name="spa.html"),
        name="spa",
    ),
]
