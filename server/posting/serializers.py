from .models import Posting
from rest_framework import serializers

class PostingSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    user_id = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = Posting
        fields = ('pk', 'user_id', 'image', 'content', 'category', 'created_at')
