from django import http

def home(request):
    return http.HttpResponse('<html><head><meta http-equiv="refresh" content="0; url=/www/index.html" /></head></html>')
