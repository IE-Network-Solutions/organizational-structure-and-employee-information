pipeline {
    agent any

    environment {
        REMOTE_SERVER = 'ubuntu@139.185.51.164'
        REPO_URL = 'https://github.com/IE-Network-Solutions/organizational-structure-and-employee-information.git'
        BRANCH_NAME = 'staging'
        REPO_DIR = '/home/ubuntu/staging/osei-backend'
        SSH_CREDENTIALS_ID = 'pepproduction'
    }

    stages {
        stage('Pull Latest Changes') {
            steps {
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $REMOTE_SERVER '
                        sudo mkdir -p "$REPO_DIR" || true
                        sudo chown -R ubuntu:ubuntu "$REPO_DIR"
                        if [ ! -d "$REPO_DIR/.git" ]; then
                            git clone $REPO_URL -b $BRANCH_NAME "$REPO_DIR"
                        else
                            cd "$REPO_DIR" && git reset --hard HEAD && git pull origin $BRANCH_NAME
                        fi'
                    """
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cp ~/backend-env/staging-env/.osei-env "$REPO_DIR/.env"'
                        ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cd "$REPO_DIR" && npm install'
                    """
                }
            }
        }
        stage('Run Migrations') {
            steps {
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    script {
                        def output = sh(
                            script: "ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cd \"$REPO_DIR\" && npm run migration:generate-run || true'",
                            returnStdout: true
                        ).trim()
                        echo output
                        if (output.contains('No changes in database schema were found')) {
                            echo 'No database schema changes found, skipping migration.'
                        } else {
                            sh "ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cd \"$REPO_DIR\" && npm run migration:run'"
                        }
                    }
                }
            }
        }
        stage('Run Nest js App') {
            steps {
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cd "$REPO_DIR" && npm run build && sudo npm run start:prod'
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Nest js application deployed successfully!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
