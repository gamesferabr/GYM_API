"""
WSGI config for gym_api project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application

# Adiciona o diretório do projeto ao sys.path
proj_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if proj_path not in sys.path:
    sys.path.append(proj_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_api.settings')

application = get_wsgi_application()

