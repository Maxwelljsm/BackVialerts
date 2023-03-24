#!/bin/bash
set -x

echo "######################################################"
echo "*** (DEPLOY PROD)Ejecutando  Proyecto en ambiente Prod ***"
echo "######################################################"

ENV_FILE="$JOB_BASE_NAME";
ENV_PATH="/tmp/.auth-$ENV_FILE";

# Generamos
IMAGE=$(sed -n '1p' $ENV_PATH)
TAG=$(sed -n '2p' $ENV_PATH)
REGISTRY_USER=$(sed -n '7p' $ENV_PATH)
REGISTRY_PASS=$(sed -n '8p' $ENV_PATH)
SERVERPROD=$(sed -n '9p' $ENV_PATH)

cd pipeline/deployProd/

sed -e "s;%IMAGE%;${IMAGE};g" -e "s;%TAG%;${TAG};g" -e "s;%REGISTRY_USER%;${REGISTRY_USER};g" -e "s;%REGISTRY_PASS%;${REGISTRY_PASS};g" publish > publish-$ENV_FILE
chmod +x publish-$ENV_FILE

# Transifere el archivo
scp  publish-$ENV_FILE $SERVERPROD:/tmp/publish-$ENV_FILE
ssh  $SERVERPROD /tmp/publish-$ENV_FILE