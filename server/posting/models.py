from django.db import models
from django.conf import settings
from django.utils.translation import gettext as _

class Post(models.Model):
    class Category(models.TextChoices):
        RESTAURANT = 'RT', _('Restaurant')  # 식당
        PLACE = 'PL', _('Place')            # 장소
        COMPLEMENT = 'CP', _('Complement')  # 칭찬해요
        QUESTION = 'QT', _('Question')      # 궁금해요
        REQUEST = 'RQ', _('Request')        # 부탁해요
        WORRY = 'WR', _('Worry')            # 고민있어요
        REPORT = 'RP', _('Report')          # 신고해요
        ELSE = 'ES', _('Else')              # 기타

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images', blank=True, null=True)
    content = models.CharField(max_length=1000, blank=True, null=True)
    category = models.CharField(choices=Category.choices, max_length=50)
    date = models.DateField(auto_now_add=True)
    
