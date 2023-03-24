#!/bin/bash
set -x

echo "######################################################"
echo "*** (DEPLOY QA)Ejecutando  Proyecto en ambiente QA ***"
echo "######################################################"

ENV_FILE="$JOB_BASE_NAME";
ENV_PATH="/tmp/.auth-$ENV_FILE";

# Generamos
IMAGE=$(sed -n '1p' $ENV_PATH)
TAG=$(sed -n '2p' $ENV_PATH)
REGISTRY_USER=$(sed -n '3p' $ENV_PATH)
REGISTRY_PASS=$(sed -n '4p' $ENV_PATH)
REGISTRY=$(sed -n '5p' $ENV_PATH)

SERVERQA=$(sed -n '6p' $ENV_PATH)

cd pipeline/deployQA/

sed -e "s;%IMAGE%;${IMAGE};g" -e "s;%TAG%;${TAG};g" -e "s;%REGISTRY_USER%;${REGISTRY_USER};g" -e "s;%REGISTRY_PASS%;${REGISTRY_PASS};g" -e "s;%REGISTRY%;${REGISTRY};g" publish > publish-$ENV_FILE
chmod +x publish-$ENV_FILE

# Transifere el archivo
scp  publish-$ENV_FILE $SERVERQA:/tmp/publish-$ENV_FILE
ssh  $SERVERQA /tmp/publish-$ENV_FILE