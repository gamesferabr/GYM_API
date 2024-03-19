#!/usr/bin/env bash
# exit on error
set -o errexit

# venv
source venv/Scripts/activate

pip install -r requirements.txt

python gym_api/manage.py collectstatic --no-input
python gym_api/manage.py migrate