from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='testpass123',
            display_name='Test User',
            avatar_url='https://example.com/avatar.jpg',
        )

    def test_login_returns_user_and_tokens(self):
        response = self.client.post(
            '/login',
            {'email': 'test@example.com', 'password': 'testpass123'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertNotIn('password', response.data)

    def test_signup_creates_user(self):
        response = self.client.post(
            '/signup',
            {
                'email': 'signup@example.com',
                'password': 'signuppass1',
                'displayName': 'Signup User',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='signup@example.com').exists())
