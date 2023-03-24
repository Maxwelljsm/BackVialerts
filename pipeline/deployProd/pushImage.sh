#!/bin/bash

echo "#####################################################################"
echo "*** (PUSH PROD) Enviando imagen docker repositorio de artefactos ***"
echo "#####################################################################"

ENV_FILE="$JOB_BASE_NAME";
ENV_PATH="/tmp/.auth-$ENV_FILE";

IMAGE=$(sed -n '1p' $ENV_PATH)
BUILD_TAG=$(sed -n '2p' $ENV_PATH)
REGISTRY_USER=$(sed -n '7p' $ENV_PATH)
REGISTRY_PASS=$(sed -n '8p' $ENV_PATH)
#REGISTRY=$(sed -n '9p' $ENV_PATH)

docker login -u $REGISTRY_USER -p $REGISTRY_PASS
docker tag $IMAGE:$BUILD_TAG $REGISTRY_USER/$IMAGE:$BUILD_TAG
docker push $REGISTRY_USER/$IMAGE:$BUILD_TAG

echo "###################################################"
echo "**** (PUSH PROD) eliminando datos temoprales *****"
echo "###################################################"

docker rmi -f $IMAGE:$BUILD_TAG