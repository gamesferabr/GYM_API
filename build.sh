#!/bin/bash

# Para em caso de erro
set -e

# Define variáveis de ambiente (ajuste conforme necessário)
export GOOGLE_APPLICATION_CREDENTIALS="mycredentials.json"
export DB_NAME="postgres_new"
export DB_USER="postgres_new"
export DB_PASSWORD="PKp7nYu#_%~}1K2I"
export DB_CONNECTION_NAME="brave-set-409318:us-central1:myowndb"
export DJANGO_SETTINGS_MODULE= gym_api.settings

# Inicia o Cloud SQL Proxy em background
./gym_api/cloud-sql-proxy -instances=$DB_CONNECTION_NAME=tcp:5432 &

# Ativa o ambiente virtual
source ./venv/Scripts/activate

# Instala dependências
pip install -r requirements.txt

# Aplica as migrações do Django
python manage.py migrate

# Coleta os arquivos estáticos
python manage.py collectstatic --noinput

# Inicia o servidor Django (ajuste conforme necessário, por exemplo, usando gunicorn)
python manage.py runserver

# Para encerrar o Cloud SQL Proxy quando o script terminar
trap "kill $!" EXIT
