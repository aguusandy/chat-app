
FROM python:3.11-slim


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y build-essential libpq-dev


WORKDIR /app


COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/


# RUN pip install gunicorn
# EXPOSE 8000
# CMD ["gunicorn", "chat_app.wsgi:application", "--bind", "0.0.0.0:8000"]

# PORT of Django
EXPOSE 8000

CMD ["python", "chat_app/manage.py", "runserver", "0.0.0.0:8000"]