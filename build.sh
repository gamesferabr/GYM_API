#!/bin/bash

# Para em caso de erro
set -e

# Define variáveis de ambiente (ajuste conforme necessário)
export GOOGLE_APPLICATION_CREDENTIALS="mycredentials.json"
export DB_NAME="postgres_new"
export DB_USER="postgres_new"
export DB_PASSWORD="PKp7nYu#_%~}1K2I"
export DB_CONNECTION_NAME="brave-set-409318:us-central1:myowndb"
export DJANGO_SETTINGS_MODULE="gym_api.gym_api.settings"


# Inicia o Cloud SQL Proxy em background
# Torna o Cloud SQL Proxy executável
chmod +x ./gym_api/cloud_sql_proxy.linux.amd64


# Inicia o Cloud SQL Proxy em background
./gym_api/cloud_sql_proxy.linux.amd64 -instances=${DB_CONNECTION_NAME}=tcp:5432 &

# Ativa o ambiente virtual
source ./venv/Scripts/activate

# Instala dependências
pip install -r requirements.txt