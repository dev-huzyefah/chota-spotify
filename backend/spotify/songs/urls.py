from rest_framework.routers import SimpleRouter

from .views import SongViewSet

router = SimpleRouter(trailing_slash=False)
router.register('songs', SongViewSet, basename='song')

urlpatterns = router.urls
