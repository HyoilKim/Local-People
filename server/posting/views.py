from .models import Posting
from .serializers import PostingSerializer
from rest_framework import viewsets, mixins
from rest_framework.filters import SearchFilter
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly

class PostingViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    queryset = Posting.objects.all()
    serializer_class = PostingSerializer

    filter_backends = [SearchFilter]
    search_fields = ('content', 'category') # only tuple

class MyPostingViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    queryset = Posting.objects.all()
    serializer_class = PostingSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        qs = Posting.objects.all()
        qs = qs.filter(author=self.request.user)           
        return qs