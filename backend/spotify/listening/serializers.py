from rest_framework import serializers

from .models import RecentlyPlayed


class RecentlyPlayedSerializer(serializers.ModelSerializer):
    userId = serializers.UUIDField(source='user_id')
    songId = serializers.UUIDField(source='song_id')
    playedAt = serializers.DateTimeField(source='played_at', required=False)

    class Meta:
        model = RecentlyPlayed
        fields = ('id', 'userId', 'songId', 'playedAt')
        read_only_fields = ('id',)

    def validate_userId(self, value):
        request = self.context['request']
        if str(value) != str(request.user.id):
            raise serializers.ValidationError('Cannot record plays for another user.')
        return value

    def create(self, validated_data):
        user_id = validated_data['user_id']
        song_id = validated_data['song_id']
        played_at = validated_data.get('played_at')

        defaults = {}
        if played_at is not None:
            defaults['played_at'] = played_at

        entry, _created = RecentlyPlayed.objects.update_or_create(
            user_id=user_id,
            song_id=song_id,
            defaults=defaults,
        )
        return entry
