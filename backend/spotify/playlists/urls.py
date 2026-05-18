from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import FeaturedPlaylistView, PlaylistViewSet

router = SimpleRouter(trailing_slash=False)
router.register('playlists', PlaylistViewSet, basename='playlist')

urlpatterns = [
    path('featuredPlaylists', FeaturedPlaylistView.as_view(), name='featured-playlists'),
    *router.urls,
]
