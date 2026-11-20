from rest_framework import serializers
from .models import Task

class HomeSerializer(serializers.Serializer):
    message = serializers.CharField()
    status = serializers.CharField()
    

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'