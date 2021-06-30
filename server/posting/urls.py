from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet, PostingViewSet, MyPostingViewSet

router = DefaultRouter()
router.register(r'^postings', PostingViewSet)
router.register(r'^my-postings', MyPostingViewSet)
router.register(r'^comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
