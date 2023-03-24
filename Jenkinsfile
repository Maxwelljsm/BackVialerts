def (JOB, PROJECT, NAME, BRANCH_NAME) = "${JOB_BASE_NAME}".tokenize( '+' )
def SONAR_PROJECT_NAME = "${PROJECT}-${NAME}.${BRANCH_NAME}"

pipeline {

agent any
     options {
        buildDiscarder logRotator(
                    daysToKeepStr: '16',
                    numToKeepStr: '10'
            )
    }

    environment {
        BRANCH = "${BRANCH_NAME}"
        SONAR_PROJECT_NAME = "${PROJECT}-${NAME}.${BRANCH_NAME}"
        DOCKER_REGISTRY_ACCESS     = credentials('Docker-registry')
        REGISTRY = '192.168.100.122:5000'
        SERVERQA = 'imasd@192.168.100.123'

        //Parametros de Acceso docker Hub y server  Prod
        DOCKER_HUB_ACCESS     = credentials('Dockerhub-Qvision')
        SERVERPROD = 'ubuntu@3.231.9.74'
        WEBHOOK = 'https://qvisionsas.webhook.office.com/webhookb2/cb70aecc-db7a-4597-93b9-8d7cde9197f0@d6921bbf-5e55-4660-9f9a-5edb0c619766/JenkinsCI/4da31ffc7680489b9ea070f477914ba6/251249ef-b3e6-4997-8691-76dc82193122'
   
    }

    stages {

          // Carga archivos con variables 
          stage('Config'){
            when {
                    anyOf {
                        environment name: 'BRANCH', value: 'qa'
                        environment name: 'BRANCH', value: 'prod'
                    }
                 }
            
            steps{
                script{            
                        sh './pipeline/build/env.sh ${REGISTRY} ${SERVERQA} ${DOCKER_REGISTRY_ACCESS_USR} ${DOCKER_REGISTRY_ACCESS_PSW} ${DOCKER_HUB_ACCESS_USR} ${DOCKER_HUB_ACCESS_PSW} ${SERVERPROD}'
                  }
            }
       }

            // Compilar y contruir artefacto
            stage('Build') {
               when {
                    anyOf {
                        environment name: 'BRANCH', value: 'qa'
                        environment name: 'BRANCH', value: 'prod'
                    }
                 }
                steps {
                      
                    script {
                            last_stage = env.STAGE_NAME
                            sh './pipeline/build/build.sh '
                    }                                     
                }
            }

            // Analisis estatico de codigo sonarqube
            stage('SonarQube analysis') {
                  when {
                    not {
                        environment name: 'BRANCH', value: 'prod'
                    }
                 }
                  agent { label 'master' }
                  steps {
                        nodejs(nodeJSInstallationName: 'NodeJSAuto', configId: '') {
                            sh '''npm install -g typescript
                            ./pipeline/test/sonar.sh'''
                                  script {
                                          last_stage = env.STAGE_NAME
                                          def SCANNERHOME  = tool 'sonarScanner'
                                          withSonarQubeEnv('SonarServer-Qv'){
                                                sh "${SCANNERHOME}/bin/sonar-scanner -Dproject.settings=sonar-project.properties -Dsonar.projectKey=${SONAR_PROJECT_NAME} -Dsonar.projectName=${SONAR_PROJECT_NAME} -Dsonar.projectVersion=0.${BUILD_NUMBER}"
                                          }
                                  }
                        }
                  }
            }

            // Resultado politica de calidad sonarqube
            stage("Quality gate") {
                     when {
                    anyOf {
                        environment name: 'BRANCH', value: 'qa'
                    }
                 }
                  steps {
                        script {
                               last_stage = env.STAGE_NAME
                        }
                        waitForQualityGate abortPipeline: true
                  }
            }

            // Enviar artefacto  repositorio de  artefacto
            stage('Push Image') {
                     when {
                    anyOf {
                        environment name: 'BRANCH', value: 'qa'
                    }
                 }
                 steps {
                          
                      script {
                              last_stage = env.STAGE_NAME
                              sh './pipeline/push/pushImage.sh'
                      }
                 }
            }

            // Despliegue en ambiente de QA
            stage('Deploy QA') {
                  when {
                    anyOf {
                        environment name: 'BRANCH', value: 'qa'
                    }
                 }         
                  steps {
                       
                        script {
                               last_stage = env.STAGE_NAME
                               sh './pipeline/deployQA/deploy.sh'
                        }
                  }
            }

          

             // Despliegue en ambiente de produccion AWS
            stage('Deploy PROD') {
                  when {
                    anyOf {
                        environment name: 'BRANCH', value: 'prod'
                    }
                 }
                    steps {
                          script {
                              last_stage = env.STAGE_NAME
                              sh './pipeline/deployProd/pushImage.sh'
                               sh './pipeline/deployProd/deploy.sh'
                        }
                 }   
            }
    }

    post {

        failure {
            office365ConnectorSend message: "La ejecucion del jobs ${currentBuild.fullDisplayName} a fallado en la fase $last_stage", status:"Fallo", webhookUrl:"${WEBHOOK}",color:"d00000"
        } 
        success {
            office365ConnectorSend message: "La ejecucion del jobs ${currentBuild.fullDisplayName} a sido ejecutada con exito", status:"Exitoso", webhookUrl:"${WEBHOOK}",color:"05b222"
        }
    }
}