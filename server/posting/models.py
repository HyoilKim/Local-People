from django.db import models
from django.conf import settings
from django.db.models.deletion import SET_NULL
from django.utils.translation import gettext as _

class Posting(models.Model):
    class Category(models.TextChoices):
        RESTAURANT = 'RT', _('Restaurant')  # 식당
        PLACE = 'PL', _('Place')            # 장소
        COMPLEMENT = 'CP', _('Complement')  # 칭찬해요
        QUESTION = 'QT', _('Question')      # 궁금해요
        REQUEST = 'RQ', _('Request')        # 부탁해요
        WORRY = 'WR', _('Worry')            # 고민있어요
        REPORT = 'RP', _('Report')          # 신고해요
        ELSE = 'ES', _('Else')              # 기타

    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    image = models.ImageField(upload_to='images', blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    category = models.CharField(choices=Category.choices, max_length=50)
    created_at = models.DateField(auto_now_add=True)
    latitude = models.DecimalField()        # 위도
    longitude = models.DecimalField()       # 경도

    def __str__(self):
        return self.content

class Comment(models.Model):
    posting = models.ForeignKey(Posting, null=False, blank=False, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=False, on_delete=models.SET_NULL)
    comment = models.TextField()
    created_at = models.DateField(auto_now_add=True, null=False, blank=False)
    
    def __str__(self):
        return self.comment