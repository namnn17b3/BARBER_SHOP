from django.shortcuts import render
from ai_service.base_view import BaseView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
import magic
from rest_framework import serializers

# Create your views here.

# Validator kiểm tra loại file dựa trên byte của file
def validate_image_file(value):
    """
    Validator để kiểm tra file upload có phải là ảnh dựa trên byte.
    """
    # Đọc một phần nội dung file để kiểm tra MIME type
    mime = magic.Magic(mime=True)
    
    # Kiểm tra MIME type của file dựa trên nội dung byte
    mime_type = mime.from_buffer(value.read(2048))  # Đọc 2048 byte đầu tiên để kiểm tra
    
    # Đặt con trỏ đọc về vị trí ban đầu để tránh ảnh hưởng đến các quá trình khác
    value.seek(0)
    
    # Kiểm tra nếu MIME type không bắt đầu bằng 'image/'
    if not mime_type.startswith('image/'):
      raise serializers.ValidationError("Is not image file")


class DataUploadSerializer(serializers.Serializer):
  image = serializers.ImageField(validators=[validate_image_file])
  hairStyleUrl = serializers.CharField(min_length=1, max_length=255)
  hairColorUrl = serializers.CharField(min_length=1, max_length=255)

  def validate(self, data):
    # Thêm các logic validate khác nếu cần thiết
    return data


class HairFastGanView(BaseView):
  def post(self, request: Request, *args, **kwargs):
    serializer = DataUploadSerializer(data=request.data)
    if serializer.is_valid():
      print(type(serializer.validated_data.get('image')))
    else:
      print(serializer.errors)
    
    return Response(data={}, content_type='application/json', status=status.HTTP_200_OK)
