#!/usr/bin/env bash
# exit on error
set -o errexit

# venv
source venv/Scripts/activate

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate