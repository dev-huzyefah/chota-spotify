from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """Normalize errors to ``{ "message": "..." }`` for the frontend client."""
    response = exception_handler(exc, context)

    if response is None:
        return response

    if isinstance(exc, APIException):
        detail = exc.detail
        if isinstance(detail, list):
            message = ' '.join(str(item) for item in detail)
        elif isinstance(detail, dict):
            parts = []
            for key, value in detail.items():
                if isinstance(value, list):
                    parts.append(f'{key}: {" ".join(str(v) for v in value)}')
                else:
                    parts.append(f'{key}: {value}')
            message = ' '.join(parts) if parts else 'Request failed'
        else:
            message = str(detail)
    else:
        message = 'An unexpected error occurred'

    response.data = {'message': message}
    return response
