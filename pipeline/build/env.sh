#!/bin/bash
set -x

echo "###################################"
echo "*** (BUILD) Cargando variables  ***"
echo "###################################"

#Recibir y realizar split JOB_BASE_NAME
IN=$JOB_BASE_NAME;
arrIN=(${IN//+/ })

#Recibir variables pipeline 
PROJECT=${arrIN[1]};
NAME=${arrIN[2]};
REGISTRY=$1;
SERVERQA=$2;
REGISTRY_USER=$3;
REGISTRY_PASS=$4;

# Recibir parametros Produccion
DOCKER_HUB_ACCESS_USR=$5;
DOCKER_HUB_ACCESS_PSW=$6;
SERVERPROD=$7;

#Definir nombre archiov .auth
ENV_FILE="$JOB_BASE_NAME";
IMAGE="$PROJECT-qa-$NAME";

#Contruir variables
#if [ ${arrIN[3]} == "prod" ]; then

#    REPOSITORY_NAME="$PROJECT-$NAME"
#    AWS_ECS_CLUSTER="cluster-$PROJECT";
#    AWS_ECS_TASKDEFINITION="task-$PROJECT-$NAME";
#    AWS_ECS_SERVICES="services-$PROJECT-$NAME";
#    AWS_CONTAINER_SERVICES="container-$PROJECT-$NAME"

    #URL repositorio ECR proyecto indicado
#    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
#    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
#    export AWS_DEFAULT_REGION=$AWS_REGION
#    AWS_ECR=`aws ecr describe-repositories --repository-names ${REPOSITORY_NAME} --region ${AWS_REGION} | jq .repositories[].repositoryUri | tr -d '"'`

#fi


# Enviamos variables archivo .auth
echo $IMAGE > /tmp/.auth-$ENV_FILE
echo $BUILD_NUMBER >> /tmp/.auth-$ENV_FILE
echo $REGISTRY_USER >> /tmp/.auth-$ENV_FILE
echo $REGISTRY_PASS >> /tmp/.auth-$ENV_FILE
echo $REGISTRY >> /tmp/.auth-$ENV_FILE
echo $SERVERQA >> /tmp/.auth-$ENV_FILE
echo $DOCKER_HUB_ACCESS_USR >> /tmp/.auth-$ENV_FILE
echo $DOCKER_HUB_ACCESS_PSW >> /tmp/.auth-$ENV_FILE
echo $SERVERPROD >> /tmp/.auth-$ENV_FILE