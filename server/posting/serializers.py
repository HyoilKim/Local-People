from .models import Post
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    user_id = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = Post
        fields = ('pk', 'user_id', 'image', 'content', 'category', 'date')