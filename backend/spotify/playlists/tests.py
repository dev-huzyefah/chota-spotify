from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from songs.models import Song

from .models import Playlist

User = get_user_model()


class PlaylistTests(APITestCase):
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

    def test_playlist_crud(self):
        user = self.authenticate()
        create = self.client.post(
            '/playlists',
            {
                'userId': user['id'],
                'name': 'Favorites',
                'description': 'My list',
                'coverUrl': 'https://example.com/pl.jpg',
                'songIds': [str(self.song.id)],
            },
            format='json',
        )
        self.assertEqual(create.status_code, status.HTTP_201_CREATED)
        playlist_id = create.data['id']

        listing = self.client.get(f'/playlists?userId={user["id"]}')
        self.assertEqual(listing.status_code, status.HTTP_200_OK)
        self.assertEqual(len(listing.data), 1)

        patch = self.client.patch(
            f'/playlists/{playlist_id}',
            {'songIds': []},
            format='json',
        )
        self.assertEqual(patch.status_code, status.HTTP_200_OK)
        self.assertEqual(patch.data['songIds'], [])

        delete = self.client.delete(f'/playlists/{playlist_id}')
        self.assertEqual(delete.status_code, status.HTTP_204_NO_CONTENT)


class FeaturedPlaylistTests(APITestCase):
    def test_featured_playlists_are_public(self):
        Playlist.objects.create(
            name='Featured',
            description='Curated',
            cover_url='https://example.com/f.jpg',
            is_featured=True,
        )
        response = self.client.get('/featuredPlaylists')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(p['name'] == 'Featured' for p in response.data))
