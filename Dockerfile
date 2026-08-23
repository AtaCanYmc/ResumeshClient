FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir .

EXPOSE 8000

CMD ["uvicorn", "resumesh_client.main:app", "--host", "0.0.0.0", "--port", "8000"]
