#!/bin/bash

# Create public directory if it doesn't exist
mkdir -p public

# Download Leaflet marker images
wget https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png -O public/marker-icon-2x.png
wget https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png -O public/marker-icon.png
wget https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png -O public/marker-shadow.png
