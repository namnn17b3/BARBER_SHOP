from django.urls import path
from . import views

app_name = 'hair_fast_gan'

urlpatterns = [
  path('api/hair-fast-gan', view=views.HairFastGanView.as_view(), name='hair-fast-gan-view'),
]
