from rest_framework.routers import SimpleRouter

from .views import RecentlyPlayedViewSet

router = SimpleRouter(trailing_slash=False)
router.register('recentlyPlayed', RecentlyPlayedViewSet, basename='recently-played')

urlpatterns = router.urls
