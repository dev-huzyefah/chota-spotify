from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from songs.models import Song

User = get_user_model()


class RecentlyPlayedTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='testpass123',
            display_name='Test User',
        )
        cls.song = Song.objects.create(
            title='Test Song',
            artist='Artist',
            album='Album',
            duration=180,
            cover_url='https://example.com/cover.jpg',
            audio_url='https://example.com/audio.mp3',
            genre='Pop',
        )

    def authenticate(self):
        response = self.client.post(
            '/login',
            {'email': 'test@example.com', 'password': 'testpass123'},
            format='json',
        )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
        return response.data

    def test_recently_played_flow(self):
        user = self.authenticate()
        create = self.client.post(
            '/recentlyPlayed',
            {
                'userId': user['id'],
                'songId': str(self.song.id),
                'playedAt': '2026-05-18T12:00:00Z',
            },
            format='json',
        )
        self.assertEqual(create.status_code, status.HTTP_201_CREATED)

        listing = self.client.get(
            f'/recentlyPlayed?userId={user["id"]}&_sort=playedAt&_order=desc'
        )
        self.assertEqual(listing.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(listing.data), 1)
