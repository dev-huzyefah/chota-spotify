from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Song

User = get_user_model()


class SongTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.song = Song.objects.create(
            title='Test Song',
            artist='Artist',
            album='Album',
            duration=180,
            cover_url='https://example.com/cover.jpg',
            audio_url='https://example.com/audio.mp3',
            genre='Pop',
        )

    def test_list_songs_without_auth(self):
        response = self.client.get('/songs')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
