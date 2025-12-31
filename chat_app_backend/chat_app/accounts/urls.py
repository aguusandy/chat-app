from django.urls import path
from .views import register_user, user_login, user_logout, user_search, user_profile

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('user_search/', user_search, name='user_search'),
    path('profile/', user_profile, name='user_profile'),
]