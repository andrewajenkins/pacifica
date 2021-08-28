from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view

from pacifica_visualizer.models import Sheet

...


@api_view(['GET', 'POST', 'DELETE'])
def sheet_list(request):
    print("returning sheet list")

# GET list of tutorials, POST a new tutorial, DELETE all tutorials


@api_view(['GET', 'PUT', 'DELETE'])
def sheet_detail(request, pk):
    # find tutorial by pk (id)
    try:
        tutorial = Sheet.objects.get(pk=pk)
    except Sheet.DoesNotExist:
        return JsonResponse({'message': 'The tutorial does not exist'}, status=status.HTTP_404_NOT_FOUND)

        # GET / PUT / DELETE tutorial


@api_view(['GET'])
def sheet_list_active(request):
# GET all published tutorials
    print("returning sheet list active")