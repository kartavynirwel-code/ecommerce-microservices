pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Verify Docker Compose') {
            steps {
                sh '''
                    docker --version
                    docker-compose version
                '''
            }
        }

        stage('Prepare Environment File') {
            steps {
                // The ENTIRE .env file is stored as a single "Secret file"
                // credential in Jenkins (uploaded once via the UI). This
                // avoids managing dozens of individual string credentials -
                // one credential ID to rotate/update instead of many.
                withCredentials([
                    file(credentialsId: 'ecommerce-env-file', variable: 'ENV_FILE')
                ]) {
                    sh 'cp "$ENV_FILE" .env'
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                sh '''
                    docker-compose down --remove-orphans || true
                    docker-compose up -d --build
                    docker ps -a
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 15
                    docker-compose ps
                '''
            }
        }
    }

    post {
        cleanup {
            // "cleanup" is guaranteed by Jenkins to run LAST, after
            // success/failure blocks - so failure{} can still read .env
            // (e.g. for docker-compose logs) before it gets deleted here.
            sh 'rm -f .env'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            sh 'docker-compose logs --tail=100 || true'
        }
    }
}