from rest_framework import serializers

from songs.models import Song

from .models import Playlist


class PlaylistSerializer(serializers.ModelSerializer):
    userId = serializers.UUIDField(source='user_id', required=False, allow_null=True)
    coverUrl = serializers.URLField(source='cover_url', required=False, allow_blank=True)
    songIds = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True,
    )
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    isFeatured = serializers.BooleanField(source='is_featured', required=False)

    class Meta:
        model = Playlist
        fields = (
            'id',
            'userId',
            'name',
            'description',
            'coverUrl',
            'songIds',
            'createdAt',
            'isFeatured',
        )
        read_only_fields = ('id', 'createdAt')

    def _get_song_ids(self, instance):
        return [str(song_id) for song_id in instance.songs.values_list('id', flat=True)]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['songIds'] = self._get_song_ids(instance)
        if data.get('userId') is None and instance.user_id:
            data['userId'] = str(instance.user_id)
        return data

    def _set_songs(self, playlist, song_ids):
        if song_ids is None:
            return
        songs = Song.objects.filter(id__in=song_ids)
        playlist.songs.set(songs)

    def create(self, validated_data):
        song_ids = validated_data.pop('songIds', [])
        user_id = validated_data.pop('user_id', None)
        request = self.context['request']

        if user_id is None:
            user_id = request.user.id
        elif str(user_id) != str(request.user.id):
            raise serializers.ValidationError({'userId': 'Cannot create playlists for another user.'})

        playlist = Playlist.objects.create(user_id=user_id, **validated_data)
        self._set_songs(playlist, song_ids)
        return playlist

    def update(self, instance, validated_data):
        song_ids = validated_data.pop('songIds', None)
        validated_data.pop('user_id', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self._set_songs(instance, song_ids)
        return instance
