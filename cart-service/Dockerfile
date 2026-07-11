FROM python:3.11-slim-bookworm as build

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM gcr.io/distroless/python3-debian12:nonroot

WORKDIR /app
COPY --from=build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=build /app /app

ENV PYTHONPATH=/usr/local/lib/python3.11/site-packages

EXPOSE 8000
USER nonroot:nonroot
ENTRYPOINT ["python3"]
CMD ["-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]