from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class BaseView(APIView):
    base_res: str = {
        "statusCode": 405,
        "message": "Method is not allowed"
    }

    def get(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def put(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def delete(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)
