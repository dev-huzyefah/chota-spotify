# Django REST Framework: A Comprehensive Guide

> A thorough, in-depth guide to building APIs with Django REST Framework (DRF) — covering serializers, views, authentication, permissions, pagination, filtering, throttling, versioning, testing, and more — with examples and explanations for every concept.

---

## Table of Contents

1. [Introduction to Django REST Framework](#1-introduction-to-django-rest-framework)
   - [What is DRF?](#11-what-is-drf)
   - [Installation and Setup](#12-installation-and-setup)
   - [Project Structure](#13-project-structure)
2. [Serializers](#2-serializers)
   - [What is a Serializer?](#21-what-is-a-serializer)
   - [Serializer Class](#22-serializer-class)
   - [ModelSerializer](#23-modelserializer)
   - [Serializer Fields](#24-serializer-fields)
   - [Field-Level Validation](#25-field-level-validation)
   - [Object-Level Validation](#26-object-level-validation)
   - [Nested Serializers](#27-nested-serializers)
   - [SerializerMethodField](#28-serializermethodfield)
   - [Writable Nested Serializers](#29-writable-nested-serializers)
3. [Views](#3-views)
   - [APIView](#31-apiview)
   - [Generic Views](#32-generic-views)
   - [Mixins](#33-mixins)
   - [ViewSets](#34-viewsets)
   - [Routers](#35-routers)
4. [Requests and Responses](#4-requests-and-responses)
   - [The Request Object](#41-the-request-object)
   - [The Response Object](#42-the-response-object)
   - [Status Codes](#43-status-codes)
5. [Authentication](#5-authentication)
   - [Basic Authentication](#51-basic-authentication)
   - [Session Authentication](#52-session-authentication)
   - [Token Authentication](#53-token-authentication)
   - [JWT Authentication](#54-jwt-authentication)
   - [Custom Authentication](#55-custom-authentication)
6. [Permissions](#6-permissions)
   - [Built-in Permission Classes](#61-built-in-permission-classes)
   - [Object-Level Permissions](#62-object-level-permissions)
   - [Custom Permissions](#63-custom-permissions)
   - [Combining Permissions](#64-combining-permissions)
7. [Throttling](#7-throttling)
   - [Built-in Throttle Classes](#71-built-in-throttle-classes)
   - [Custom Throttling](#72-custom-throttling)
8. [Filtering, Searching, and Ordering](#8-filtering-searching-and-ordering)
   - [Filtering](#81-filtering)
   - [DjangoFilterBackend](#82-djangofilterbackend)
   - [SearchFilter](#83-searchfilter)
   - [OrderingFilter](#84-orderingfilter)
9. [Pagination](#9-pagination)
   - [PageNumberPagination](#91-pagenumberpagination)
   - [LimitOffsetPagination](#92-limitoffsetpagination)
   - [CursorPagination](#93-cursorpagination)
   - [Custom Pagination](#94-custom-pagination)
10. [Routers and URL Configuration](#10-routers-and-url-configuration)
    - [SimpleRouter](#101-simplerouter)
    - [DefaultRouter](#102-defaultrouter)
    - [Custom Routes](#103-custom-routes)
11. [Content Negotiation and Renderers](#11-content-negotiation-and-renderers)
    - [Renderers](#111-renderers)
    - [Parsers](#112-parsers)
12. [Versioning](#12-versioning)
    - [URL Path Versioning](#121-url-path-versioning)
    - [Namespace Versioning](#122-namespace-versioning)
    - [Query Parameter Versioning](#123-query-parameter-versioning)
    - [Header Versioning](#124-header-versioning)
13. [Exception Handling](#13-exception-handling)
    - [Built-in Exceptions](#131-built-in-exceptions)
    - [Custom Exception Handlers](#132-custom-exception-handlers)
14. [Testing](#14-testing)
    - [APIClient](#141-apiclient)
    - [Testing Views](#142-testing-views)
    - [Testing Authentication and Permissions](#143-testing-authentication-and-permissions)
15. [Advanced Topics](#15-advanced-topics)
    - [Signals with DRF](#151-signals-with-drf)
    - [File Uploads](#152-file-uploads)
    - [Caching](#153-caching)
    - [API Documentation with drf-spectacular](#154-api-documentation-with-drf-spectacular)

---

## 1. Introduction to Django REST Framework

### 1.1 What is DRF?

**Django REST Framework (DRF)** is a powerful, flexible toolkit for building Web APIs on top of Django. It provides:

- A **Serializer** system that converts complex Python data types (QuerySets, model instances) to and from JSON, XML, or other content types
- Powerful **generic views** and **ViewSets** that reduce boilerplate
- A complete **authentication** system (Basic, Session, Token, JWT)
- Granular **permission** and **throttling** controls
- Built-in **filtering** , **searching** , **ordering** , and **pagination**
- A browsable **API UI** for easy development and debugging
- Extensive **testing utilities**

DRF follows REST (Representational State Transfer) principles, where each URL represents a **resource** and HTTP verbs define the action:

| HTTP Method | Action                      | Example                               |
| ----------- | --------------------------- | ------------------------------------- |
| `GET`       | Retrieve resource(s)        | `GET /api/posts/`— list all posts     |
| `POST`      | Create a resource           | `POST /api/posts/`— create a post     |
| `PUT`       | Replace a resource          | `PUT /api/posts/1/`— full update      |
| `PATCH`     | Partially update a resource | `PATCH /api/posts/1/`— partial update |
| `DELETE`    | Remove a resource           | `DELETE /api/posts/1/`— delete a post |

---

### 1.2 Installation and Setup

```bash
pip install djangorestframework
pip install django-filter          # For advanced filtering
pip install djangorestframework-simplejwt  # For JWT authentication
```

Add DRF to `INSTALLED_APPS` and configure it in `settings.py`:

```python
# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # DRF
    'rest_framework',
    'rest_framework.authtoken',  # For token authentication
    'django_filters',            # For DjangoFilterBackend

    # Your apps
    'blog',
    'users',
]

# Global DRF configuration
REST_FRAMEWORK = {
    # Authentication
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],

    # Permissions
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],

    # Pagination
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,

    # Filtering
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],

    # Throttling
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day',
    },

    # Renderers
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],

    # Exception handling
    'EXCEPTION_HANDLER': 'myproject.exceptions.custom_exception_handler',

    # Versioning
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1', 'v2'],
}
```

Add DRF's URLs for the browsable API login:

```python
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),  # Browsable API login
    path('api/v1/', include('blog.urls')),
    path('api/v1/', include('users.urls')),
]
```

---

### 1.3 Project Structure

A well-organized DRF project typically looks like this:

```
myproject/
    myproject/
        settings.py
        urls.py
        exceptions.py       # Custom exception handler
    blog/
        models.py
        admin.py
        serializers.py      # Serializers
        views.py            # API views
        urls.py             # API URL routing
        permissions.py      # Custom permissions
        filters.py          # Custom filters
        pagination.py       # Custom pagination
        tests/
            __init__.py
            test_serializers.py
            test_views.py
    users/
        models.py
        serializers.py
        views.py
        urls.py
```

---

## 2. Serializers

### 2.1 What is a Serializer?

A **serializer** does two things:

**Serialization** (Python → JSON): Converts complex Python objects (model instances, QuerySets, Python dicts) into primitive data types that can be rendered into JSON, XML, or other formats.

**Deserialization** (JSON → Python): Converts incoming parsed data back into complex Python types, after validating it.

```
Client  ──POST JSON──►  Deserialize  ──validate──►  Python object  ──save()──►  Database
Client  ◄──JSON──────  Serialize    ◄────────────  Python object  ◄──query──  Database
```

---

### 2.2 Serializer Class

The base `Serializer` class is the most explicit — you define every field manually, just like a Django `Form`.

```python
# blog/serializers.py
from rest_framework import serializers
from .models import Post, Author

class PostSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=300)
    content = serializers.CharField()
    author_id = serializers.IntegerField()
    is_published = serializers.BooleanField(default=False)
    created_at = serializers.DateTimeField(read_only=True)
    view_count = serializers.IntegerField(read_only=True, default=0)

    def create(self, validated_data):
        """Called by serializer.save() when creating a new instance."""
        return Post.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """Called by serializer.save() when updating an existing instance."""
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.is_published = validated_data.get('is_published', instance.is_published)
        instance.save()
        return instance
```

#### Using the Serializer

**Serializing (Python → JSON):**

```python
from blog.models import Post
from blog.serializers import PostSerializer

# Single object
post = Post.objects.get(pk=1)
serializer = PostSerializer(post)
print(serializer.data)
# {'id': 1, 'title': 'Hello DRF', 'content': '...', 'author_id': 1, ...}

# QuerySet (many=True)
posts = Post.objects.all()
serializer = PostSerializer(posts, many=True)
print(serializer.data)
# [{'id': 1, ...}, {'id': 2, ...}, ...]

# Convert to JSON
import json
json_data = json.dumps(serializer.data)
```

**Deserializing (JSON → Python, with validation):**

```python
import json

raw_data = {'title': 'New Post', 'content': 'Hello World', 'author_id': 1}

serializer = PostSerializer(data=raw_data)

if serializer.is_valid():
    # Access the cleaned, validated data
    print(serializer.validated_data)
    # {'title': 'New Post', 'content': 'Hello World', 'author_id': 1, 'is_published': False}

    # Save: calls create() since no instance was passed
    post = serializer.save()
else:
    # Access errors
    print(serializer.errors)
    # {'title': ['This field is required.']}

# Raise exception on invalid data (convenient in views)
serializer.is_valid(raise_exception=True)  # Raises ValidationError automatically
```

**Updating (partial updates supported):**

```python
post = Post.objects.get(pk=1)

# Full update (PUT)
serializer = PostSerializer(post, data=request.data)

# Partial update (PATCH) — only validate fields that are present
serializer = PostSerializer(post, data=request.data, partial=True)

if serializer.is_valid():
    serializer.save()  # Calls update() since an instance was passed
```

---

### 2.3 ModelSerializer

`ModelSerializer` automatically generates fields based on your model — far less boilerplate.

```python
from rest_framework import serializers
from .models import Post, Tag

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'content', 'author', 'tags',
                  'status', 'is_published', 'created_at', 'updated_at']

        # OR use '__all__' to include every field
        # fields = '__all__'

        # OR exclude specific fields
        # exclude = ['internal_notes', 'deleted_at']

        read_only_fields = ['id', 'created_at', 'updated_at', 'slug']

        extra_kwargs = {
            'content': {'write_only': False},
            'author': {'read_only': True},
            'title': {
                'min_length': 5,
                'error_messages': {'min_length': 'Title must be at least 5 characters.'}
            },
        }
```

`ModelSerializer` also auto-generates `create()` and `update()` methods, though you can override them:

```python
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'tags', 'status']

    def create(self, validated_data):
        # Handle M2M separately when present
        tags = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tags)
        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        instance = super().update(instance, validated_data)
        if tags is not None:
            instance.tags.set(tags)
        return instance
```

---

### 2.4 Serializer Fields

DRF provides a rich set of field types that map to Python types and validate incoming data.

#### Core Fields

```python
from rest_framework import serializers

class ExampleSerializer(serializers.Serializer):
    # String fields
    name = serializers.CharField(max_length=100, min_length=2, trim_whitespace=True)
    bio = serializers.CharField(allow_blank=True, default='')
    email = serializers.EmailField()
    url = serializers.URLField()
    slug = serializers.SlugField()
    uuid = serializers.UUIDField()
    ip = serializers.IPAddressField(protocol='IPv4')
    regex = serializers.RegexField(regex=r'^\+?1?\d{9,15}$')

    # Numeric fields
    age = serializers.IntegerField(min_value=0, max_value=150)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    score = serializers.FloatField()

    # Boolean
    is_active = serializers.BooleanField(default=True)
    nullable_flag = serializers.NullBooleanField()

    # Date/time
    birth_date = serializers.DateField()           # YYYY-MM-DD
    event_time = serializers.TimeField()           # HH:MM[:ss]
    created_at = serializers.DateTimeField(read_only=True)
    duration = serializers.DurationField()

    # Collections
    tags = serializers.ListField(child=serializers.CharField())
    scores = serializers.ListField(child=serializers.IntegerField(), min_length=1)
    metadata = serializers.DictField(child=serializers.CharField())
    raw_json = serializers.JSONField()

    # Choice fields
    status = serializers.ChoiceField(choices=['draft', 'published', 'archived'])
    multi_status = serializers.MultipleChoiceField(choices=['a', 'b', 'c'])

    # Relationship fields (more below)
    author_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    author_name = serializers.StringRelatedField(source='author')
```

#### Relationship Fields

```python
from rest_framework import serializers
from .models import Post, Tag, Author

class PostSerializer(serializers.ModelSerializer):
    # Returns the primary key of the related object
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())

    # Returns __str__() of the related object — read-only
    author_name = serializers.StringRelatedField(source='author', read_only=True)

    # Returns a URL to the related object's detail endpoint
    author_url = serializers.HyperlinkedRelatedField(
        source='author',
        view_name='author-detail',
        read_only=True
    )

    # For M2M fields: return list of PKs
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True
    )

    class Meta:
        model = Post
        fields = ['id', 'title', 'author', 'author_name', 'author_url', 'tags']
```

#### Common Field Options

| Option                 | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `read_only=True`       | Field is output-only; ignored on input                  |
| `write_only=True`      | Field is input-only; excluded from output               |
| `required=False`       | Field is optional on input                              |
| `allow_null=True`      | Accepts `null`/`None`values                             |
| `allow_blank=True`     | Accepts empty strings (`""`)                            |
| `default=value`        | Default value if field is not provided                  |
| `source='field_name'`  | Map to a different model field or attribute             |
| `label='Display Name'` | Human-readable label                                    |
| `help_text='...'`      | Descriptive text                                        |
| `validators=[...]`     | List of validator functions                             |
| `error_messages={}`    | Custom error messages                                   |
| `style={}`             | Hints for renderers (e.g.,`{'input_type': 'password'}`) |

---

### 2.5 Field-Level Validation

Add a `validate_<fieldname>` method to validate a single field:

```python
from rest_framework import serializers
from django.contrib.auth.models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate_username(self, value):
        """Field-level: called after type-checking, before object-level."""
        value = value.lower().strip()
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        if not value.isalnum():
            raise serializers.ValidationError("Username may only contain letters and numbers.")
        return value

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_password(self, value):
        if value.isdigit():
            raise serializers.ValidationError("Password cannot be entirely numeric.")
        return value
```

---

### 2.6 Object-Level Validation

The `validate()` method runs after all field-level validation and receives all cleaned fields — useful for cross-field validation:

```python
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, attrs):
        """Object-level: receives all validated field data."""
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': "Passwords do not match."
            })

        # You can also modify attrs here
        attrs.pop('confirm_password')  # Remove the extra field before saving
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'start_date', 'end_date']

    def validate(self, attrs):
        if attrs['end_date'] < attrs['start_date']:
            raise serializers.ValidationError("End date must be after start date.")
        return attrs
```

#### Custom Validators (Reusable)

```python
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator

class ProductSerializer(serializers.ModelSerializer):
    # Field-level unique validator
    sku = serializers.CharField(
        validators=[UniqueValidator(
            queryset=Product.objects.all(),
            message="A product with this SKU already exists."
        )]
    )

    class Meta:
        model = Product
        fields = ['name', 'sku', 'category']

        # Object-level unique-together validator
        validators = [
            UniqueTogetherValidator(
                queryset=Product.objects.all(),
                fields=['name', 'category'],
                message="A product with this name already exists in this category."
            )
        ]
```

---

### 2.7 Nested Serializers

You can embed one serializer inside another for nested representations.

```python
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'email']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    # Nested serializer — embeds the full author object
    author = AuthorSerializer(read_only=True)

    # Nested M2M — embeds a list of tag objects
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'tags', 'created_at']
```

**Response:**

```json
{
  "id": 1,
  "title": "Django REST Framework Guide",
  "content": "...",
  "author": {
    "id": 5,
    "name": "Alice Johnson",
    "email": "alice@example.com"
  },
  "tags": [
    { "id": 1, "name": "Django", "slug": "django" },
    { "id": 2, "name": "API", "slug": "api" }
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 2.8 SerializerMethodField

`SerializerMethodField` calls a method on the serializer and uses its return value as the field's value. It is always read-only.

```python
class PostSerializer(serializers.ModelSerializer):
    # Method name defaults to get_<field_name>
    word_count = serializers.SerializerMethodField()
    reading_time = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    absolute_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'word_count',
                  'reading_time', 'is_owner', 'absolute_url']

    def get_word_count(self, obj):
        """obj is the model instance being serialized."""
        return len(obj.content.split())

    def get_reading_time(self, obj):
        words = len(obj.content.split())
        minutes = round(words / 200)  # ~200 words per minute
        return f"{max(1, minutes)} min read"

    def get_is_owner(self, obj):
        """Access the request via context."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author == request.user
        return False

    def get_absolute_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.get_absolute_url())
        return obj.get_absolute_url()
```

#### Passing Context to Serializers

```python
# In a view
serializer = PostSerializer(
    posts,
    many=True,
    context={'request': request}  # Pass the request into context
)
```

Generic views automatically pass `request`, `format`, and `view` in context.

---

### 2.9 Writable Nested Serializers

By default, nested serializers are read-only. To support writes, override `create()` and `update()`:

```python
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'tags']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)

        for tag_data in tags_data:
            # get_or_create prevents duplicate tags
            tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
            post.tags.add(tag)

        return post

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)

        # Update scalar fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace tags completely
        if tags_data is not None:
            instance.tags.clear()
            for tag_data in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag_data['name'])
                instance.tags.add(tag)

        return instance
```

**Request body example:**

```json
{
  "title": "My New Post",
  "content": "Post content here...",
  "tags": [{ "name": "django" }, { "name": "python" }]
}
```

---

## 3. Views

### 3.1 APIView

`APIView` is the base class for all DRF views. It wraps Django's `View` class and adds DRF features: authentication, permission checking, throttling, content negotiation, and exception handling.

```python
# blog/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Post
from .serializers import PostSerializer

class PostListAPIView(APIView):
    """
    GET  /api/posts/  — List all posts
    POST /api/posts/  — Create a new post
    """

    def get(self, request, format=None):
        posts = Post.objects.filter(is_published=True).order_by('-created_at')
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user)  # Pass extra fields to create()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailAPIView(APIView):
    """
    GET    /api/posts/<pk>/  — Retrieve a post
    PUT    /api/posts/<pk>/  — Full update
    PATCH  /api/posts/<pk>/  — Partial update
    DELETE /api/posts/<pk>/  — Delete
    """

    def get_object(self, pk):
        return get_object_or_404(Post, pk=pk)

    def get(self, request, pk, format=None):
        post = self.get_object(pk)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        post = self.get_object(pk)
        serializer = PostSerializer(post, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        post = self.get_object(pk)
        serializer = PostSerializer(
            post, data=request.data, partial=True, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        post = self.get_object(pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

```python
# blog/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostListAPIView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostDetailAPIView.as_view(), name='post-detail'),
]
```

---

### 3.2 Generic Views

DRF provides generic views that implement common API patterns and eliminate the boilerplate of writing `get()`, `post()`, etc. manually.

```python
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly

class PostListCreateView(generics.ListCreateAPIView):
    """
    GET  — List all posts
    POST — Create a new post
    """
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Override to customize the queryset dynamically."""
        qs = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs

    def perform_create(self, serializer):
        """Hook called by create() before saving. Add extra fields here."""
        serializer.save(author=self.request.user)


class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    — Retrieve a post
    PUT    — Full update
    PATCH  — Partial update
    DELETE — Delete
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_update(self, serializer):
        """Hook called before saving an update."""
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        """Hook called before deletion. Override for soft-delete."""
        instance.is_deleted = True
        instance.save()
        # instance.delete()  # Hard delete
```

#### All Generic View Classes

| Class                          | HTTP Methods            | Use Case                      |
| ------------------------------ | ----------------------- | ----------------------------- |
| `CreateAPIView`                | POST                    | Create only                   |
| `ListAPIView`                  | GET                     | List only                     |
| `RetrieveAPIView`              | GET                     | Retrieve single object        |
| `DestroyAPIView`               | DELETE                  | Delete only                   |
| `UpdateAPIView`                | PUT, PATCH              | Update only                   |
| `ListCreateAPIView`            | GET, POST               | List + create                 |
| `RetrieveUpdateAPIView`        | GET, PUT, PATCH         | Retrieve + update             |
| `RetrieveDestroyAPIView`       | GET, DELETE             | Retrieve + delete             |
| `RetrieveUpdateDestroyAPIView` | GET, PUT, PATCH, DELETE | Full CRUD (minus list/create) |

---

### 3.3 Mixins

Mixins are the building blocks used by generic views. You can mix and match them for precise control:

```python
from rest_framework import generics, mixins

class PostListCreateView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView
):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class PostDetailView(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
```

Available mixins:

| Mixin                | Method                        | Action                        |
| -------------------- | ----------------------------- | ----------------------------- |
| `ListModelMixin`     | `list()`                      | Returns a paginated list      |
| `CreateModelMixin`   | `create()`                    | Creates and returns an object |
| `RetrieveModelMixin` | `retrieve()`                  | Returns a single object       |
| `UpdateModelMixin`   | `update()`,`partial_update()` | Updates an object             |
| `DestroyModelMixin`  | `destroy()`                   | Deletes an object             |

---

### 3.4 ViewSets

A **ViewSet** combines related views (list, create, retrieve, update, delete) into a single class, removing the need to configure URL patterns manually.

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post
from .serializers import PostSerializer, PostListSerializer

class PostViewSet(viewsets.ModelViewSet):
    """
    A ViewSet that provides full CRUD actions:
    list     — GET  /posts/
    create   — POST /posts/
    retrieve — GET  /posts/{pk}/
    update   — PUT  /posts/{pk}/
    partial_update — PATCH /posts/{pk}/
    destroy  — DELETE /posts/{pk}/
    """
    queryset = Post.objects.all().select_related('author').prefetch_related('tags')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        """Return a different serializer per action."""
        if self.action == 'list':
            return PostListSerializer   # Lightweight serializer for list
        return PostSerializer           # Full serializer for detail/create/update

    def get_queryset(self):
        """Customize queryset per action."""
        qs = super().get_queryset()
        if self.action == 'list':
            return qs.filter(is_published=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # Custom action — adds extra endpoint beyond standard CRUD
    @action(detail=True, methods=['post'], url_path='publish')
    def publish(self, request, pk=None):
        """POST /posts/{pk}/publish/"""
        post = self.get_object()
        if post.author != request.user:
            return Response(
                {'detail': 'You cannot publish someone else\'s post.'},
                status=status.HTTP_403_FORBIDDEN
            )
        post.status = 'published'
        post.save()
        return Response({'detail': 'Post published successfully.'})

    @action(detail=True, methods=['get'], url_path='comments')
    def comments(self, request, pk=None):
        """GET /posts/{pk}/comments/"""
        post = self.get_object()
        from .serializers import CommentSerializer
        comments = post.comments.filter(is_approved=True)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-posts')
    def my_posts(self, request):
        """GET /posts/my-posts/ — list the current user's posts."""
        posts = Post.objects.filter(author=request.user)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
```

#### ViewSet Types

| ViewSet                | Provides                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| `ViewSet`              | No actions — you define everything                                 |
| `GenericViewSet`       | No actions — but gives `get_queryset()`,`get_serializer()`, etc.   |
| `ModelViewSet`         | Full CRUD: list, create, retrieve, update, partial_update, destroy |
| `ReadOnlyModelViewSet` | Read-only: list, retrieve                                          |

---

### 3.5 Routers

Routers automatically generate URL patterns for ViewSets:

```python
# blog/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'authors', views.AuthorViewSet, basename='author')
router.register(r'tags', views.TagViewSet, basename='tag')

urlpatterns = [
    path('', include(router.urls)),
]
```

The router generates these URL patterns automatically:

```
GET    /posts/                → PostViewSet.list
POST   /posts/                → PostViewSet.create
GET    /posts/{pk}/           → PostViewSet.retrieve
PUT    /posts/{pk}/           → PostViewSet.update
PATCH  /posts/{pk}/           → PostViewSet.partial_update
DELETE /posts/{pk}/           → PostViewSet.destroy
POST   /posts/{pk}/publish/   → PostViewSet.publish  (custom action)
GET    /posts/{pk}/comments/  → PostViewSet.comments (custom action)
GET    /posts/my-posts/       → PostViewSet.my_posts  (custom action, detail=False)
```

---

## 4. Requests and Responses

### 4.1 The Request Object

DRF wraps Django's `HttpRequest` into its own `Request` object that adds content negotiation and authentication.

```python
from rest_framework.views import APIView
from rest_framework.response import Response

class ExampleView(APIView):
    def post(self, request):
        # Parsed request body (JSON, form data, etc.)
        # Equivalent to request.POST but handles JSON automatically
        data = request.data
        print(request.data)         # {'title': 'Hello', 'content': '...'}

        # Query parameters (?page=2&status=published)
        page = request.query_params.get('page', 1)
        status = request.query_params.get('status')

        # The authenticated user
        user = request.user         # AnonymousUser if not authenticated

        # The auth object returned by the authenticator
        token = request.auth        # e.g., Token object for token auth

        # The successful authenticator class
        print(request.successful_authenticator)

        # HTTP method (always uppercase)
        print(request.method)       # 'POST'

        # The content type of the request
        print(request.content_type) # 'application/json'

        # Files
        file = request.FILES.get('avatar')

        # Headers
        print(request.headers)
        print(request.META.get('HTTP_X_CUSTOM_HEADER'))

        return Response({'received': request.data})
```

---

### 4.2 The Response Object

DRF's `Response` class handles content negotiation — it renders your Python data into the format the client requested (JSON, XML, HTML browsable API, etc.).

```python
from rest_framework.response import Response
from rest_framework import status

# Return data with default 200 OK
return Response({'message': 'Success', 'data': serializer.data})

# Return with explicit status code
return Response(serializer.data, status=status.HTTP_201_CREATED)

# Return errors
return Response(
    {'detail': 'Not found.'},
    status=status.HTTP_404_NOT_FOUND
)

# Return with custom headers
return Response(
    serializer.data,
    status=status.HTTP_200_OK,
    headers={'X-Total-Count': str(total)}
)

# Return empty body
return Response(status=status.HTTP_204_NO_CONTENT)

# Force specific format (bypasses content negotiation)
return Response(data, content_type='application/json')
```

---

### 4.3 Status Codes

DRF provides readable constants for all HTTP status codes in `rest_framework.status`:

```python
from rest_framework import status

# 2xx Success
status.HTTP_200_OK                  # 200 — standard success
status.HTTP_201_CREATED             # 201 — resource created
status.HTTP_204_NO_CONTENT          # 204 — success with no response body (delete)

# 3xx Redirection
status.HTTP_301_MOVED_PERMANENTLY   # 301
status.HTTP_302_FOUND               # 302

# 4xx Client Errors
status.HTTP_400_BAD_REQUEST         # 400 — invalid request / validation error
status.HTTP_401_UNAUTHORIZED        # 401 — not authenticated
status.HTTP_403_FORBIDDEN           # 403 — authenticated but not authorized
status.HTTP_404_NOT_FOUND           # 404 — resource not found
status.HTTP_405_METHOD_NOT_ALLOWED  # 405 — HTTP method not allowed
status.HTTP_409_CONFLICT            # 409 — conflict (e.g. duplicate)
status.HTTP_422_UNPROCESSABLE_ENTITY # 422 — semantic errors in request
status.HTTP_429_TOO_MANY_REQUESTS   # 429 — throttled

# 5xx Server Errors
status.HTTP_500_INTERNAL_SERVER_ERROR  # 500
status.HTTP_503_SERVICE_UNAVAILABLE    # 503
```

---

## 5. Authentication

Authentication identifies **who** is making the request. It runs before permission checking.

DRF supports multiple authentication schemes simultaneously — it tries each in order and uses the first successful one.

### 5.1 Basic Authentication

Sends credentials as a Base64-encoded `Authorization: Basic <credentials>` header. Simple but insecure over plain HTTP — always use HTTPS.

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
    ],
}
```

**Usage:**

```bash
curl -u username:password https://api.example.com/posts/
```

---

### 5.2 Session Authentication

Uses Django's session cookies. Ideal for browser-based clients (same origin). Requires CSRF tokens for write operations.

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```

Used automatically when you access the browsable API in a browser.

---

### 5.3 Token Authentication

Each user has a single token stored in the database. The client sends it in the `Authorization` header.

**Setup:**

```python
# settings.py
INSTALLED_APPS = [
    ...
    'rest_framework.authtoken',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}
```

```bash
python manage.py migrate  # Creates the authtoken_token table
```

**Generate tokens:**

```python
# Via management command — create tokens for all existing users
python manage.py drf_create_token <username>

# Via signal — auto-create token when a user is created
# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
```

**Login endpoint:**

```python
# urls.py
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('api/auth/login/', obtain_auth_token, name='api-login'),
]
```

```bash
# POST to get a token
curl -X POST https://api.example.com/api/auth/login/ \
     -d '{"username": "alice", "password": "secret"}' \
     -H 'Content-Type: application/json'
# Response: {"token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"}

# Use the token in subsequent requests
curl -H 'Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b' \
     https://api.example.com/api/posts/
```

**Custom login/logout view:**

```python
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import authenticate

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Delete the user's token to invalidate it
        request.user.auth_token.delete()
        return Response({'detail': 'Logged out successfully.'})
```

---

### 5.4 JWT Authentication

JSON Web Tokens are stateless — no database lookup needed per request. Use `djangorestframework-simplejwt`.

```bash
pip install djangorestframework-simplejwt
```

```python
# settings.py
from datetime import timedelta

INSTALLED_APPS = [
    ...
    'rest_framework_simplejwt',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,       # Issue a new refresh token on each refresh
    'BLACKLIST_AFTER_ROTATION': True,    # Invalidate old refresh tokens
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),    # Authorization: Bearer <token>
}
```

```python
# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
```

**Usage flow:**

```bash
# 1. Login — get access + refresh tokens
curl -X POST https://api.example.com/api/auth/login/ \
     -d '{"username": "alice", "password": "secret"}' \
     -H 'Content-Type: application/json'
# Response:
# {
#   "access":  "eyJ0eXAi...",   ← short-lived (60 min)
#   "refresh": "eyJ0eXAi..."    ← long-lived (7 days)
# }

# 2. Use the access token
curl -H 'Authorization: Bearer eyJ0eXAi...' \
     https://api.example.com/api/posts/

# 3. When access token expires, use refresh token to get a new one
curl -X POST https://api.example.com/api/auth/refresh/ \
     -d '{"refresh": "eyJ0eXAi..."}' \
     -H 'Content-Type: application/json'
# Response: {"access": "new_access_token..."}
```

**Custom JWT claims:**

```python
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the JWT payload
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        return token

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer
```

---

### 5.5 Custom Authentication

```python
# authentication.py
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User

class ApiKeyAuthentication(BaseAuthentication):
    """Authenticate using a custom X-API-Key header."""

    def authenticate(self, request):
        api_key = request.META.get('HTTP_X_API_KEY')
        if not api_key:
            return None  # No attempt to authenticate — try next authenticator

        try:
            # Look up the key in a model that maps keys to users
            from .models import ApiKey
            key_obj = ApiKey.objects.select_related('user').get(key=api_key, is_active=True)
        except ApiKey.DoesNotExist:
            raise AuthenticationFailed('Invalid API key.')

        return (key_obj.user, key_obj)  # (user, auth) tuple

    def authenticate_header(self, request):
        """Return a string to use in WWW-Authenticate header on 401 responses."""
        return 'X-API-Key'
```

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'myapp.authentication.ApiKeyAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```

---

## 6. Permissions

Permissions determine **what authenticated users are allowed to do** . They run after authentication.

### 6.1 Built-in Permission Classes

```python
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly,
    DjangoModelPermissions,
    DjangoModelPermissionsOrAnonReadOnly,
    DjangoObjectPermissions,
)
```

| Class                       | Behavior                                                     |
| --------------------------- | ------------------------------------------------------------ |
| `AllowAny`                  | Any user, authenticated or not                               |
| `IsAuthenticated`           | Must be authenticated                                        |
| `IsAdminUser`               | Must be `is_staff=True`                                      |
| `IsAuthenticatedOrReadOnly` | Anyone can read (GET/HEAD/OPTIONS); write requires auth      |
| `DjangoModelPermissions`    | Tied to Django's model-level permissions (add/change/delete) |
| `DjangoObjectPermissions`   | Tied to Django's object-level permissions                    |

**Setting permissions globally:**

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

**Setting permissions per-view:**

```python
from rest_framework.permissions import IsAuthenticated, AllowAny

class PostListView(generics.ListAPIView):
    permission_classes = [AllowAny]           # Override global setting

class PostCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]


# Using decorators with function-based views
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([AllowAny])
def public_endpoint(request):
    return Response({'message': 'Public!'})
```

---

### 6.2 Object-Level Permissions

Object-level permissions check access to a **specific object** , not just the view.

```python
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    """Allow object owners full access; others get read-only."""

    def has_permission(self, request, view):
        """View-level check (before fetching the object)."""
        # Allow read access to everyone
        if request.method in SAFE_METHODS:
            return True
        # Require authentication for write actions
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """Object-level check (called when view fetches a specific object)."""
        # Read access is allowed to everyone
        if request.method in SAFE_METHODS:
            return True
        # Write access only allowed to the owner
        return obj.author == request.user
```

> **Important:** Object-level permissions are only checked when `self.get_object()` is called in the view. List views don't trigger `has_object_permission` — filter the queryset instead.

```python
class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        # Filter list to only show published posts to anonymous users
        user = self.request.user
        if user.is_authenticated:
            return Post.objects.filter(author=user) | Post.objects.filter(is_published=True)
        return Post.objects.filter(is_published=True)
```

---

### 6.3 Custom Permissions

```python
# permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsVerifiedUser(BasePermission):
    """Only verified users (email confirmed) can write."""
    message = "Your email address must be verified to perform this action."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and request.user.profile.email_verified
        )


class IsPremiumUser(BasePermission):
    """Only premium subscribers can access this endpoint."""
    message = "This feature requires a premium subscription."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.subscription.plan == 'premium'
        )


class IsStaffOrReadOnly(BasePermission):
    """Staff can do everything; others get read-only."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
```

---

### 6.4 Combining Permissions

```python
# All permissions must pass (AND logic)
permission_classes = [IsAuthenticated, IsVerifiedUser, IsPremiumUser]

# OR logic using bitwise operators (Django 3.0+ / DRF)
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class MyView(APIView):
    # IsAdmin OR (IsAuthenticated AND IsVerifiedUser)
    permission_classes = [IsAdminUser | (IsAuthenticated & IsVerifiedUser)]
```

---

## 7. Throttling

Throttling controls **rate limiting** — how many requests a client can make in a given time period.

### 7.1 Built-in Throttle Classes

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',   # For anonymous users
        'rest_framework.throttling.UserRateThrottle',   # For authenticated users
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',      # 100 requests per day for anonymous users
        'user': '1000/day',     # 1000 requests per day for authenticated users
    },
}
```

Rate format: `number/period` where period is `second`, `minute`, `hour`, or `day`.

**Per-view throttling:**

```python
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

class LoginView(APIView):
    throttle_classes = [AnonRateThrottle]  # Override global setting


class BurstRateThrottle(UserRateThrottle):
    scope = 'burst'

class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'

class MyView(APIView):
    throttle_classes = [BurstRateThrottle, SustainedRateThrottle]

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'burst': '60/min',
        'sustained': '1000/day',
    }
}
```

---

### 7.2 Custom Throttling

```python
from rest_framework.throttling import SimpleRateThrottle

class PostCreationThrottle(SimpleRateThrottle):
    """Limit post creation to 10 per hour per user."""
    scope = 'post_creation'

    def get_cache_key(self, request, view):
        if not request.user.is_authenticated:
            return None  # Don't throttle anonymous users here
        return self.cache_format % {
            'scope': self.scope,
            'ident': request.user.pk
        }

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'post_creation': '10/hour',
    }
}

# views.py
class PostCreateView(generics.CreateAPIView):
    throttle_classes = [PostCreationThrottle]
```

---

## 8. Filtering, Searching, and Ordering

### 8.1 Filtering

The simplest way to filter is overriding `get_queryset()`:

```python
class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        qs = Post.objects.all()

        # ?status=published
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)

        # ?author=5
        author_id = self.request.query_params.get('author')
        if author_id:
            qs = qs.filter(author_id=author_id)

        # ?from=2024-01-01
        date_from = self.request.query_params.get('from')
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)

        return qs
```

---

### 8.2 DjangoFilterBackend

`django-filter` provides a declarative, powerful filtering system.

```bash
pip install django-filter
```

```python
# blog/filters.py
import django_filters
from .models import Post

class PostFilter(django_filters.FilterSet):
    # Exact match
    status = django_filters.ChoiceFilter(choices=Post.STATUS_CHOICES)
    author = django_filters.NumberFilter(field_name='author__id')

    # Range filters
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    min_views = django_filters.NumberFilter(field_name='view_count', lookup_expr='gte')

    # Text contains (case-insensitive)
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')

    # Tags (M2M)
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name='tags__name',
        to_field_name='name',
        queryset=Tag.objects.all(),
        conjoined=False,  # OR logic — post must have ANY of the tags
    )

    class Meta:
        model = Post
        fields = ['status', 'author', 'title', 'created_after', 'created_before']


# views.py
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PostFilter

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter
```

**Usage:**

```
GET /api/posts/?status=published&title=django&created_after=2024-01-01
GET /api/posts/?tags=python&tags=django
GET /api/posts/?min_views=100&created_before=2024-12-31
```

---

### 8.3 SearchFilter

Provides full-text search across multiple fields:

```python
from rest_framework.filters import SearchFilter

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [SearchFilter]
    search_fields = [
        'title',              # Exact starts-with search
        '^title',             # Starts-with search
        '=title',             # Exact match
        '@content',           # Full-text search (PostgreSQL only)
        'author__name',       # Follow FK relationships
        'tags__name',         # Follow M2M relationships
    ]
```

**Usage:**

```
GET /api/posts/?search=django
GET /api/posts/?search=rest+framework
```

---

### 8.4 OrderingFilter

Allows clients to control sorting:

```python
from rest_framework.filters import OrderingFilter

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [OrderingFilter]

    # Fields the client can order by
    ordering_fields = ['title', 'created_at', 'view_count', 'author__name']

    # Default ordering if client doesn't specify
    ordering = ['-created_at']
```

**Usage:**

```
GET /api/posts/?ordering=title          → order by title ascending
GET /api/posts/?ordering=-created_at    → order by date descending
GET /api/posts/?ordering=view_count,-title  → multiple fields
```

---

## 9. Pagination

Pagination splits large result sets into manageable pages.

### 9.1 PageNumberPagination

Standard page-based pagination (`?page=2`):

```python
# pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StandardPagination(PageNumberPagination):
    page_size = 20                      # Default items per page
    page_size_query_param = 'page_size' # Client can override with ?page_size=50
    max_page_size = 100                 # Maximum items per page
    page_query_param = 'page'           # Query param for page number

    def get_paginated_response(self, data):
        """Customize the response format."""
        return Response({
            'pagination': {
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })

    def get_paginated_response_schema(self, schema):
        return {
            'type': 'object',
            'properties': {
                'pagination': {'type': 'object'},
                'results': schema,
            }
        }
```

```python
# Apply globally
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'myapp.pagination.StandardPagination',
    'PAGE_SIZE': 20,
}

# Apply per-view
class PostListView(generics.ListAPIView):
    pagination_class = StandardPagination
```

**Response:**

```json
{
    "pagination": {
        "count": 150,
        "total_pages": 8,
        "current_page": 1,
        "next": "https://api.example.com/posts/?page=2",
        "previous": null
    },
    "results": [...]
}
```

---

### 9.2 LimitOffsetPagination

Client controls exactly how many items and from which offset:

```python
from rest_framework.pagination import LimitOffsetPagination

class FlexiblePagination(LimitOffsetPagination):
    default_limit = 20
    max_limit = 100
```

**Usage:**

```
GET /api/posts/?limit=10&offset=0   → items 1-10
GET /api/posts/?limit=10&offset=10  → items 11-20
GET /api/posts/?limit=10&offset=20  → items 21-30
```

**Response:**

```json
{
    "count": 150,
    "next": "https://api.example.com/posts/?limit=10&offset=10",
    "previous": null,
    "results": [...]
}
```

---

### 9.3 CursorPagination

Cursor-based pagination is the most performant for large, frequently updated datasets. It uses an opaque cursor instead of page numbers, making it impossible to jump to arbitrary pages but much faster.

```python
from rest_framework.pagination import CursorPagination

class PostCursorPagination(CursorPagination):
    page_size = 20
    ordering = '-created_at'    # Must be a stable ordering field
    cursor_query_param = 'cursor'
```

**Response:**

```json
{
    "next": "https://api.example.com/posts/?cursor=cD0yMDIz...",
    "previous": null,
    "results": [...]
}
```

---

### 9.4 Custom Pagination

```python
class NoPagination(PageNumberPagination):
    """Disable pagination for a specific view."""
    page_size = None

class PostViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Post.objects.all()

    def list(self, request, *args, **kwargs):
        # Temporarily disable pagination for exports
        if request.query_params.get('format') == 'csv':
            self.pagination_class = None
        return super().list(request, *args, **kwargs)
```

---

## 10. Routers and URL Configuration

### 10.1 SimpleRouter

Generates standard CRUD routes without an API root view:

```python
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register(r'posts', views.PostViewSet)

# Generated URLs:
# /posts/         — list, create
# /posts/{pk}/    — retrieve, update, partial_update, destroy
```

---

### 10.2 DefaultRouter

Extends `SimpleRouter` by adding an API root view listing all registered endpoints:

```python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'authors', views.AuthorViewSet, basename='author')
router.register(r'tags', views.TagViewSet, basename='tag')

# Visiting /api/ returns:
# {
#     "posts": "http://api.example.com/api/posts/",
#     "authors": "http://api.example.com/api/authors/",
#     "tags": "http://api.example.com/api/tags/"
# }
```

---

### 10.3 Custom Routes

Add extra routes to a ViewSet using the `@action` decorator, or define routes at the router level:

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    # detail=True: operates on a single object — /posts/{pk}/publish/
    @action(
        detail=True,
        methods=['post'],
        permission_classes=[IsAuthenticated],
        url_path='publish',
        url_name='publish'
    )
    def publish(self, request, pk=None):
        post = self.get_object()
        post.status = 'published'
        post.save()
        return Response({'status': 'published'})

    # detail=False: operates on the collection — /posts/trending/
    @action(detail=False, methods=['get'], url_path='trending')
    def trending(self, request):
        posts = Post.objects.filter(
            is_published=True
        ).order_by('-view_count')[:10]
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    # Support multiple HTTP methods on one custom action
    @action(detail=True, methods=['get', 'post'], url_path='comments')
    def comments(self, request, pk=None):
        post = self.get_object()
        if request.method == 'GET':
            comments = post.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(post=post, author=request.user)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
```

---

## 11. Content Negotiation and Renderers

### 11.1 Renderers

Renderers convert your response data into the appropriate format. DRF selects the renderer based on the request's `Accept` header or `?format=` query parameter.

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',  # HTML browser UI
    ],
}

# Per-view
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer

class PostListView(generics.ListAPIView):
    renderer_classes = [JSONRenderer]  # Only JSON, no browsable API
```

**Built-in renderers:**

| Renderer               | Content-Type          | Description               |
| ---------------------- | --------------------- | ------------------------- |
| `JSONRenderer`         | `application/json`    | Default JSON              |
| `BrowsableAPIRenderer` | `text/html`           | Interactive browser UI    |
| `TemplateHTMLRenderer` | `text/html`           | Django template rendering |
| `StaticHTMLRenderer`   | `text/html`           | Plain HTML string         |
| `AdminRenderer`        | `text/html`           | Admin-style table view    |
| `MultiPartRenderer`    | `multipart/form-data` | Form data                 |

**Adding XML support:**

```bash
pip install djangorestframework-xml
```

```python
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework_xml.renderers.XMLRenderer',
    ],
}
```

---

### 11.2 Parsers

Parsers decode incoming request data. DRF selects the parser based on the request's `Content-Type` header.

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',  # For file uploads
    ],
}

# Per-view
from rest_framework.parsers import MultiPartParser, FormParser

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        ...
```

---

## 12. Versioning

API versioning allows you to evolve your API without breaking existing clients.

### 12.1 URL Path Versioning

Version is part of the URL path: `/api/v1/posts/`

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1', 'v2'],
    'VERSION_PARAM': 'version',
}

# urls.py
urlpatterns = [
    path('api/<version>/', include('blog.urls')),
]
```

```python
# views.py
class PostListView(generics.ListAPIView):
    def get_serializer_class(self):
        if self.request.version == 'v2':
            return PostSerializerV2
        return PostSerializer  # v1

    def get_queryset(self):
        qs = Post.objects.all()
        if self.request.version == 'v2':
            qs = qs.select_related('author').prefetch_related('tags')
        return qs
```

---

### 12.2 Namespace Versioning

Version is determined by the URL namespace:

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.NamespaceVersioning',
}

# urls.py
urlpatterns = [
    path('api/v1/', include(('blog.urls_v1', 'v1'), namespace='v1')),
    path('api/v2/', include(('blog.urls_v2', 'v2'), namespace='v2')),
]
```

---

### 12.3 Query Parameter Versioning

Version passed as a query parameter: `/api/posts/?version=v2`

```python
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.QueryParameterVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1', 'v2'],
    'VERSION_PARAM': 'version',
}
```

---

### 12.4 Header Versioning

Version passed in a custom request header: `Accept: application/json; version=v2`

```python
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.AcceptHeaderVersioning',
    'DEFAULT_VERSION': 'v1',
}
```

```bash
curl -H 'Accept: application/json; version=v2' https://api.example.com/posts/
```

---

## 13. Exception Handling

### 13.1 Built-in Exceptions

DRF has several built-in exceptions that return appropriate HTTP responses automatically:

```python
from rest_framework.exceptions import (
    ValidationError,          # 400 — invalid input
    AuthenticationFailed,     # 401 — authentication failure
    NotAuthenticated,         # 401 — not authenticated
    PermissionDenied,         # 403 — permission denied
    NotFound,                 # 404 — resource not found
    MethodNotAllowed,         # 405 — HTTP method not supported
    NotAcceptable,            # 406 — cannot satisfy Accept header
    UnsupportedMediaType,     # 415 — unsupported Content-Type
    Throttled,                # 429 — rate limited
    ParseError,               # 400 — malformed request body
    APIException,             # Generic API exception
)

# Usage in views
def get_object(self):
    try:
        return Post.objects.get(pk=self.kwargs['pk'])
    except Post.DoesNotExist:
        raise NotFound("Post not found.")

# ValidationError can carry field-level detail
raise ValidationError({'title': 'Title must not contain special characters.'})

# Or a global message
raise ValidationError("Invalid request.")

# Throttled can include wait time
raise Throttled(wait=60)  # Tells client to wait 60 seconds
```

---

### 13.2 Custom Exception Handlers

```python
# myproject/exceptions.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom exception handler that formats all errors consistently.
    Returns a Response object, or None to let DRF use the default behavior.
    """
    # Call DRF's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Wrap the response in a consistent format
        original_data = response.data
        response.data = {
            'success': False,
            'status_code': response.status_code,
            'errors': original_data,
        }
    else:
        # Unhandled exception (Python exception, not DRF exception)
        logger.exception(
            "Unhandled exception in view %s",
            context['view'].__class__.__name__
        )
        response = Response(
            {
                'success': False,
                'status_code': 500,
                'errors': {'detail': 'An internal server error occurred.'},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
```

```python
# settings.py
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'myproject.exceptions.custom_exception_handler',
}
```

**Before (default format):**

```json
{
  "title": ["This field is required."],
  "content": ["This field may not be blank."]
}
```

**After (custom format):**

```json
{
  "success": false,
  "status_code": 400,
  "errors": {
    "title": ["This field is required."],
    "content": ["This field may not be blank."]
  }
}
```

---

## 14. Testing

### 14.1 APIClient

DRF provides `APIClient`, which extends Django's test client with API-specific helpers.

```python
# tests/test_views.py
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.urls import reverse
from rest_framework import status

class PostAPITests(APITestCase):
    """Use APITestCase for DRF tests — it sets up APIClient automatically."""

    def setUp(self):
        """Run before each test."""
        self.client = APIClient()

        # Create users
        self.user = User.objects.create_user(
            username='alice',
            password='testpass123',
            email='alice@example.com'
        )
        self.other_user = User.objects.create_user(
            username='bob',
            password='testpass123'
        )

        # Create token for alice
        self.token = Token.objects.create(user=self.user)

        # Create test data
        self.post = Post.objects.create(
            title='Test Post',
            content='Test content',
            author=self.user,
            status='published'
        )

        self.list_url = reverse('post-list')
        self.detail_url = reverse('post-detail', kwargs={'pk': self.post.pk})
```

---

### 14.2 Testing Views

```python
class PostAPITests(APITestCase):

    def test_list_posts_unauthenticated(self):
        """Anonymous users can list published posts."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_post_authenticated(self):
        """Authenticated users can create posts."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        data = {
            'title': 'New Post',
            'content': 'New content',
            'status': 'draft',
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Post')
        self.assertEqual(Post.objects.count(), 2)

    def test_create_post_unauthenticated(self):
        """Anonymous users cannot create posts."""
        data = {'title': 'New Post', 'content': 'Content'}
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_post(self):
        """Anyone can retrieve a published post."""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Post')
        self.assertEqual(response.data['id'], self.post.pk)

    def test_update_post_as_owner(self):
        """Post owner can update their post."""
        self.client.force_authenticate(user=self.user)  # Alternative to credentials()

        data = {'title': 'Updated Title', 'content': 'Updated content', 'status': 'published'}
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')
        self.post.refresh_from_db()
        self.assertEqual(self.post.title, 'Updated Title')

    def test_partial_update_post(self):
        """PATCH only updates specified fields."""
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.detail_url, {'title': 'Patched'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Patched')
        # Content is unchanged
        self.post.refresh_from_db()
        self.assertEqual(self.post.content, 'Test content')

    def test_update_post_as_non_owner(self):
        """Non-owners cannot update someone else's post."""
        self.client.force_authenticate(user=self.other_user)
        data = {'title': 'Stolen Update', 'content': 'x', 'status': 'published'}
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_post_as_owner(self):
        """Owner can delete their post."""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_validation_error_on_create(self):
        """Submitting invalid data returns a 400 with errors."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.list_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)
        self.assertIn('content', response.data)

    def test_filter_by_status(self):
        """Posts can be filtered by status."""
        Post.objects.create(title='Draft Post', content='x', author=self.user, status='draft')
        response = self.client.get(self.list_url, {'status': 'published'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for post in response.data['results']:
            self.assertEqual(post['status'], 'published')
```

---

### 14.3 Testing Authentication and Permissions

```python
class AuthTests(APITestCase):

    def test_login_returns_token(self):
        User.objects.create_user(username='alice', password='secret123')
        response = self.client.post(reverse('api-login'), {
            'username': 'alice',
            'password': 'secret123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_wrong_password(self):
        User.objects.create_user(username='alice', password='secret123')
        response = self.client.post(reverse('api-login'), {
            'username': 'alice',
            'password': 'wrongpassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_requires_auth(self):
        response = self.client.get(reverse('my-profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_with_valid_token(self):
        user = User.objects.create_user(username='alice', password='secret123')
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        response = self.client.get(reverse('my-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_only_endpoint(self):
        regular_user = User.objects.create_user(username='alice', password='secret')
        admin_user = User.objects.create_user(username='admin', password='secret', is_staff=True)

        # Regular user is denied
        self.client.force_authenticate(user=regular_user)
        response = self.client.get(reverse('admin-stats'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Admin is allowed
        self.client.force_authenticate(user=admin_user)
        response = self.client.get(reverse('admin-stats'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

**Testing Serializers Directly:**

```python
class PostSerializerTests(APITestCase):

    def test_valid_serializer(self):
        data = {'title': 'Valid Title', 'content': 'Valid content', 'status': 'draft'}
        serializer = PostSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_title_too_short(self):
        data = {'title': 'Hi', 'content': 'Content here'}  # min_length=5
        serializer = PostSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)

    def test_serializer_output_fields(self):
        post = Post.objects.create(title='Hello', content='World', author=self.user)
        serializer = PostSerializer(post)
        data = serializer.data
        self.assertEqual(set(data.keys()), {'id', 'title', 'content', 'author', 'status', 'created_at'})
```

---

## 15. Advanced Topics

### 15.1 Signals with DRF

Django signals can hook into DRF operations:

```python
# blog/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post

@receiver(post_save, sender=Post)
def on_post_published(sender, instance, created, **kwargs):
    if not created and instance.status == 'published':
        # Notify subscribers, update search index, etc.
        from .tasks import send_notification_to_subscribers
        send_notification_to_subscribers.delay(instance.pk)

# blog/apps.py
class BlogConfig(AppConfig):
    name = 'blog'

    def ready(self):
        import blog.signals  # noqa — register signals
```

You can also use DRF serializer `save()` hooks:

```python
class PostSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        instance = super().create(validated_data)
        # Post-create hook
        send_slack_notification(f"New post: {instance.title}")
        return instance
```

---

### 15.2 File Uploads

```python
# serializers.py
from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'file_size', 'uploaded_at']
        read_only_fields = ['file_size', 'uploaded_at']

    def validate_file(self, value):
        # Validate file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError("File size cannot exceed 10MB.")

        # Validate file type
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                f"Unsupported file type: {value.content_type}. "
                f"Allowed: PDF, JPEG, PNG."
            )
        return value


# views.py
from rest_framework.parsers import MultiPartParser, FormParser

class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            uploaded_by=self.request.user,
            file_size=self.request.FILES['file'].size
        )
```

**Upload via curl:**

```bash
curl -X POST https://api.example.com/documents/ \
     -H 'Authorization: Token mytoken' \
     -F 'title=My Document' \
     -F 'file=@/path/to/document.pdf'
```

---

### 15.3 Caching

```python
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers

class PostListView(generics.ListAPIView):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostSerializer

    # Cache the list view for 15 minutes, vary by Accept and Authorization headers
    @method_decorator(cache_page(60 * 15))
    @method_decorator(vary_on_headers('Accept', 'Authorization'))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
```

For more fine-grained caching:

```python
from django.core.cache import cache

class PopularPostsView(APIView):
    def get(self, request):
        cache_key = 'popular_posts'
        data = cache.get(cache_key)

        if data is None:
            posts = Post.objects.filter(is_published=True).order_by('-view_count')[:10]
            serializer = PostSerializer(posts, many=True, context={'request': request})
            data = serializer.data
            cache.set(cache_key, data, timeout=60 * 30)  # 30 minutes

        return Response(data)
```

---

### 15.4 API Documentation with drf-spectacular

`drf-spectacular` auto-generates OpenAPI 3.0 schemas from your DRF code.

```bash
pip install drf-spectacular
```

```python
# settings.py
INSTALLED_APPS = [
    ...
    'drf_spectacular',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'My Blog API',
    'DESCRIPTION': 'A fully featured blog API built with Django REST Framework.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
}
```

```python
# urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Schema JSON/YAML download
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Swagger UI
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # ReDoc UI
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```

**Annotating views with schema hints:**

```python
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample

@extend_schema_view(
    list=extend_schema(
        summary='List all posts',
        description='Returns a paginated list of published posts.',
        parameters=[
            OpenApiParameter('status', str, description='Filter by status'),
            OpenApiParameter('search', str, description='Search in title and content'),
        ],
        responses={200: PostSerializer(many=True)},
    ),
    create=extend_schema(
        summary='Create a new post',
        request=PostSerializer,
        responses={201: PostSerializer},
        examples=[
            OpenApiExample(
                'Example post',
                value={'title': 'My Post', 'content': 'Content here', 'status': 'draft'}
            )
        ]
    ),
)
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

---

## Summary Reference

### Serializer Cheat Sheet

```python
# Read-only
field = serializers.CharField(read_only=True)

# Write-only
field = serializers.CharField(write_only=True)

# Custom method field
field = serializers.SerializerMethodField()
def get_field(self, obj): return obj.compute()

# Nested (read-only)
nested = OtherSerializer(read_only=True)
nested_many = OtherSerializer(many=True, read_only=True)

# Validate field
def validate_field(self, value): return value

# Validate object
def validate(self, attrs): return attrs

# Custom create/update
def create(self, validated_data): ...
def update(self, instance, validated_data): ...
```

### View Cheat Sheet

```python
# Most common patterns
class ListView(generics.ListAPIView):              # GET /resources/
class CreateView(generics.CreateAPIView):           # POST /resources/
class ListCreateView(generics.ListCreateAPIView):   # GET + POST /resources/
class DetailView(generics.RetrieveAPIView):         # GET /resources/{pk}/
class UpdateView(generics.UpdateAPIView):           # PUT+PATCH /resources/{pk}/
class DeleteView(generics.DestroyAPIView):          # DELETE /resources/{pk}/
class FullView(generics.RetrieveUpdateDestroyAPIView): # GET+PUT+PATCH+DELETE /resources/{pk}/
class ViewSet(viewsets.ModelViewSet):               # All of the above
```

### Settings Quick Reference

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [...],
    'DEFAULT_PERMISSION_CLASSES': [...],
    'DEFAULT_PAGINATION_CLASS': '...',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [...],
    'DEFAULT_THROTTLE_CLASSES': [...],
    'DEFAULT_THROTTLE_RATES': {'anon': '100/day', 'user': '1000/day'},
    'DEFAULT_RENDERER_CLASSES': [...],
    'DEFAULT_PARSER_CLASSES': [...],
    'DEFAULT_VERSIONING_CLASS': '...',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1', 'v2'],
    'EXCEPTION_HANDLER': 'myapp.exceptions.custom_handler',
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}
```

---

_Written for Django REST Framework 3.14+ and Django 4.x / Python 3.11+._
