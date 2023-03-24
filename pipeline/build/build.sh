#!/bin/bash

echo "###############################################"
echo "*** (BUILD)Construyendo imagen del proyecto ***"
echo "###############################################"

ENV_FILE="$JOB_BASE_NAME";
ENV_PATH="/tmp/.auth-$ENV_FILE";

export IMAGE=$(sed -n '1p' $ENV_PATH)
cd pipeline/build/ && docker-compose -f docker-compose-build.yml build --no-cache