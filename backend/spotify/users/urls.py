from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, SignupView

urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('signup', SignupView.as_view(), name='signup'),
    path('auth/refresh', TokenRefreshView.as_view(), name='token-refresh'),
]
