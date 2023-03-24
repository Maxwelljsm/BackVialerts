#!/bin/bash

echo "######################################################################################"
echo "*** (TEST-SECURITY SCANER) Iniciando Analisis de vulnerabilidad de imagenes docker ***"
echo "######################################################################################"

ENV_FILE="$JOB_BASE_NAME";
ENV_PATH="/tmp/.auth-$ENV_FILE";

IMAGE=$(sed -n '1p' $ENV_PATH)
BUILD_TAG=$(sed -n '2p' $ENV_PATH)
REGISTRY=$(sed -n '5p' $ENV_PATH)

echo "$REGISTRY/$IMAGE:$BUILD_TAG ${WORKSPACE}/Dockerfile " > anchore_images