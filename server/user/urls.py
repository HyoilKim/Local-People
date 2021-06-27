from django.urls import path
from .views import UserView, sign_up

urlpatterns = [
    path('', UserView.as_view()),
    path('sign-up', sign_up)
]
