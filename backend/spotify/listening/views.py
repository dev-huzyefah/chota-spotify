from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import RecentlyPlayed
from .permissions import IsListeningEntryOwner
from .serializers import RecentlyPlayedSerializer


@extend_schema_view(
    list=extend_schema(
        summary='List recently played tracks',
        parameters=[
            OpenApiParameter('userId', str, OpenApiParameter.QUERY, description='User UUID'),
            OpenApiParameter('_sort', str, OpenApiParameter.QUERY, description='Sort field (e.g. playedAt)'),
            OpenApiParameter('_order', str, OpenApiParameter.QUERY, description='asc or desc'),
        ],
        tags=['Listening'],
    ),
    create=extend_schema(summary='Record a play', tags=['Listening']),
    destroy=extend_schema(summary='Remove a recently played entry', tags=['Listening']),
)
class RecentlyPlayedViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    POST /recentlyPlayed, GET /recentlyPlayed?userId=&_sort=playedAt&_order=desc
    """

    serializer_class = RecentlyPlayedSerializer
    permission_classes = [IsAuthenticated, IsListeningEntryOwner]
    lookup_field = 'pk'

    SORT_FIELDS = {
        'playedAt': 'played_at',
        'played_at': 'played_at',
    }

    def get_queryset(self):
        queryset = RecentlyPlayed.objects.select_related('song', 'user')
        user_id = self.request.query_params.get('userId')

        if user_id:
            if str(user_id) != str(self.request.user.id):
                return RecentlyPlayed.objects.none()
            queryset = queryset.filter(user_id=user_id)
        else:
            queryset = queryset.filter(user=self.request.user)

        sort_key = self.request.query_params.get('_sort', 'playedAt')
        order = self.request.query_params.get('_order', 'desc')
        sort_field = self.SORT_FIELDS.get(sort_key, 'played_at')
        if order == 'desc':
            sort_field = f'-{sort_field}'
        return queryset.order_by(sort_field)
