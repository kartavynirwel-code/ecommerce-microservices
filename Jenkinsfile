pipeline{
    agent any

    stages{
        stage('Checkout Code'){
            steps{
                checkout scm
            }
        }
        stage('Build'){
            steps{
                '''
                Docker compose up -d --build
                docker ps -a
                '''
            }
        }
        stage('Deploy'){
            steps{
                echo 'Deploying...'
            }
        }
    }

    post{
        success{
            echo 'Pipeline completed successfully!'
        }
        failure{
            echo 'Pipeline failed!'
        }
    }
}