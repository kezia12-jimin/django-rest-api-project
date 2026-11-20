from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from myapp.views import home, task_list, task_detail

urlpatterns = [
    path('admin/', admin.site.urls),

    # Home API
    path('api/', home),

    # Tasks API
    path('api/tasks/', task_list),
    path('api/tasks/<int:pk>/', task_detail),

    # User login and token authentication
    path('api/login/', obtain_auth_token),
]