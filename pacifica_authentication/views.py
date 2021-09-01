import logging
from datetime import datetime, timedelta

import arrow
from django.contrib.auth import get_user_model
from django.core.cache import cache

from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers, status
from django.utils.translation import gettext_lazy as _
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username')


class UserAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]
    serializer_class = UserSerializer

    def get_object(self):
        print("get_object")
        from pprint import pprint
        pprint(vars(self.request))
        pprint(vars(self.request.user))

        return None


class MyTokenObtainPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        email = request.data['username']
        cache_results = InvalidLoginAttemptsCache.get(email)
        if cache_results and cache_results.get('lockout_start'):
            lockout_start = arrow.get(cache_results.get('lockout_start'))
            locked_out = lockout_start >= arrow.utcnow().shift(minutes=-10)
            if not locked_out:
                InvalidLoginAttemptsCache.delete(email)
            else:
                raise AuthenticationFailed(
                    _('Too many login attempts, user locked out for 15 minutes'),
                    code='too_many_login_attempts',
                )

        cache_results = InvalidLoginAttemptsCache.get(email)
        lockout_timestamp = None
        invalid_attempt_timestamps = cache_results['invalid_attempt_timestamps'] if cache_results else []

        for timestamp in invalid_attempt_timestamps:
            print(str(timestamp))

        invalid_attempt_timestamps =\
            [timestamp for timestamp in invalid_attempt_timestamps if datetime.now() > (datetime.now() - timedelta(minutes=15))]

        invalid_attempt_timestamps.append(datetime.now())
        if len(invalid_attempt_timestamps) >= 10:
            lockout_timestamp = datetime.now()

        print(f"setting: {email}, {invalid_attempt_timestamps}, {lockout_timestamp}")
        InvalidLoginAttemptsCache.set(email, invalid_attempt_timestamps, lockout_timestamp)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class InvalidLoginAttemptsCache(object):
    @staticmethod
    def _key(email):
        return 'invalid_login_attempt_{}'.format(email)

    @staticmethod
    def _value(lockout_timestamp, timebucket):
        return {
            'lockout_start': lockout_timestamp,
            'invalid_attempt_timestamps': timebucket
        }

    @staticmethod
    def delete(email):
        try:
            cache.delete(InvalidLoginAttemptsCache._key(email))
        except Exception as e:
            logger.exception(e.message)

    @staticmethod
    def set(email, timebucket, lockout_timestamp=None):
        try:
            key = InvalidLoginAttemptsCache._key(email)
            value = InvalidLoginAttemptsCache._value(lockout_timestamp, timebucket)
            cache.set(key, value)
        except Exception as e:
            logger.exception(e.message)

    @staticmethod
    def get(email):
        try:
            key = InvalidLoginAttemptsCache._key(email)
            return cache.get(key)
        except Exception as e:
            logger.exception(e.message)
