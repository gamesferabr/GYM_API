# Usa a imagem oficial do Python como imagem de base
FROM python:3.11-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de requisitos primeiro, para aproveitar o cache do Docker
COPY requirements.txt .

# Instala as dependências do projeto
RUN pip install --no-cache-dir -r requirements.txt

# Copia os arquivos restantes do projeto para o contêiner
COPY . .

# Coleta os arquivos estáticos
RUN python manage.py collectstatic --noinput

# Expõe a porta 8000 para o contêiner
EXPOSE 8000

# Define as variáveis de ambiente (ajuste conforme necessário)
ENV DJANGO_SECRET_KEY="django-insecure-cypkvo++so(u@x09w$&b*6f81+9-z6a&2)$7v5#v_gnzt%ey7)"
ENV DB_NAME="postgres_new"
ENV DB_USER="postgres_new"
ENV DB_PASSWORD="PKp7nYu#_%~}1K2I"
ENV DB_HOST="brave-set-409318:us-central1:myowndb"
ENV PYTHONUNBUFFERED=1

# Comando para rodar a aplicação
CMD ["gunicorn", "-b", "0.0.0.0:8000", "gym_api.wsgi:application"]
