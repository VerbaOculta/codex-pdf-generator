#!/usr/bin/env bash

# Instalar librerías necesarias para ejecutar Chromium en entorno headless
apt-get update && apt-get install -y \
    libgtk-3-0 \
    libxss1 \
    libasound2 \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcups2 \
    libatk1.0-0 \
    libxshmfence1 \
    libglu1-mesa \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    wget \
    ca-certificates
