pipeline {
    agent any

    environment {
        REMOTE_SERVER = 'ubuntu@139.185.53.18'
        REPO_URL = 'https://github.com/IE-Network-Solutions/organizational-structure-and-employee-information.git'
        BRANCH_NAME = 'develop'
        REPO_DIR = 'osei-backend'
        SSH_CREDENTIALS_ID = 'peptest'
    }
 
    stages {
        stage('Prepare Repository') {
            steps {
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $REMOTE_SERVER '
                        if [ -d "$REPO_DIR" ]; then
                            sudo chown -R \$USER:\$USER $REPO_DIR
                            sudo chmod -R 755 $REPO_DIR
                        fi'
                    """
                }
            }
        }
stage('Pull Latest Changes') {
    steps {
        sshagent (credentials: [SSH_CREDENTIALS_ID]) {
            sh """
                ssh -o StrictHostKeyChecking=no $REMOTE_SERVER '
                if [ ! -d "$REPO_DIR/.git" ]; then
                    git clone $REPO_URL -b $BRANCH_NAME $REPO_DIR
                else
                    cd $REPO_DIR
                    git config user.email "jenkins-ci@example.com"
                    git config user.name "Jenkins CI"
                    git reset --hard HEAD
                    git pull origin $BRANCH_NAME
                fi'
            """
        }
    }
}

        stage('Install Dependencies') {
            steps {
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    sh """
                 
                        ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cp ~/backend-env/.osei-env ~/$REPO_DIR/.env'
                        ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cd ~/$REPO_DIR && npm install'
                    """
                }
            }
        }
        stage('Run Migrations') {
            steps {
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    script {
                        def output = sh(
                            script: "ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cd ~/$REPO_DIR && npm run migration:force || true'",
                            returnStdout: true
                        ).trim()
                        echo output
                        if (output.contains('No changes in database schema were found')) {
                            echo 'No database schema changes found, skipping migration.'
                        } else {
                            sh "ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cd ~/$REPO_DIR && npm run migration:run'"
                        }
                    }
                }
            }
        }
        stage('Run Nest js App') {
            steps {
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $REMOTE_SERVER 'cd ~/$REPO_DIR && npm run build && sudo npm run start:prod'
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
            emailext(
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """
                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    color: #333333;
                                    line-height: 1.6;
                                }
                                h2 {
                                    color: #e74c3c;
                                }
                                .details {
                                    margin-top: 20px;
                                }
                                .label {
                                    font-weight: bold;
                                }
                                .link {
                                    color: #3498db;
                                    text-decoration: none;
                                }
                                .footer {
                                    margin-top: 30px;
                                    font-size: 0.9em;
                                    color: #7f8c8d;
                                }
                            </style>
                        </head>
                        <body>
                            <h2>Build Failed</h2>
                            <p>The Jenkins job has failed. Please review the details below:</p>
                            <div class="details">
                                <p><span class="label">Job:</span> ${env.JOB_NAME}</p>
                                <p><span class="label">Build Number:</span> ${env.BUILD_NUMBER}</p>
                                <p><span class="label">Console Output:</span> <a href="${env.BUILD_URL}console" class="link">View the console output</a></p>
                            </div>
                        </body>
                    </html>
                """,
                from: 'selamnew@ienetworksolutions.com',
                recipientProviders: [[$class: 'DevelopersRecipientProvider']],
                to: 'yonas.t@ienetworksolutions.com, surafel@ienetworks.co, abeselom.g@ienetworksolutions.com'
            )
        }
    }
}
