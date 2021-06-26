from .models import Post
from .serializers import PostSerializer
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly

# main screen 
class PostViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    filter_backends = [SearchFilter]
    search_fields = ('category', 'content') # only tuple

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
