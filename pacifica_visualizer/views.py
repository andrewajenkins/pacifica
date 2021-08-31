from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view

from pacifica_visualizer.reports import get_abcs, get_daily


@api_view(['GET'])
def report_list(request):
    if request.query_params.get('type') == 'abc':
        return JsonResponse(get_abcs(), status=status.HTTP_200_OK, safe=False)
    elif request.query_params.get('type') == 'daily':
        return JsonResponse(get_daily(), status=status.HTTP_200_OK, safe=False)
    else:
        raise LookupError("Failed to find query type")
