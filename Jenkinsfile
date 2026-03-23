pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: "node:22-alpine"
    command: ['sleep']
    args: ['99d']
  - name: kaniko
    image: "gcr.io/kaniko-project/executor:debug"
    command: ['sleep']
    args: ['99d']
    volumeMounts:
      - name: registry-creds
        mountPath: /kaniko/.docker
  - name: kustomizer
    image: "line/kubectl-kustomize:latest"
    command: ['sleep']
    args: ['99d']
  volumes:
    - name: registry-creds
      secret:
        secretName: registry-pull-secret
        items:
          - key: .dockerconfigjson
            path: config.json
"""
        }
    }

    environment {
        HTTP_PROXY  = "http://192.168.1.204:44681"
        HTTPS_PROXY = "http://192.168.1.204:44681"
        NO_PROXY    = "localhost,127.0.0.1,.svc.cluster.local,.goodwin.website"
        // Название образа для фронта
        IMAGE_FULL_NAME = "registry.goodwin.website/cloud1c-front"
    }
    
    stages {
        stage('Install & Lint') {
            steps {
                container('node') {
                    sh """
                        npm install
                        # Можно добавить npm run lint или build для проверки
                    """
                }
            }
        }

        stage('Build and Push (Kaniko)') {
            steps {
                container('kaniko') {
                    sh """
                    /kaniko/executor \
                      --context ${WORKSPACE} \
                      --dockerfile Dockerfile \
                      --destination ${IMAGE_FULL_NAME}:${BUILD_NUMBER} \
                      --destination ${IMAGE_FULL_NAME}:latest \
                      --build-arg HTTP_PROXY=${HTTP_PROXY} \
                      --build-arg HTTPS_PROXY=${HTTPS_PROXY} \
                      --build-arg VITE_API_URL=https://cloud1c-server.dev-projects.goodwin.website \
                      --build-arg VITE_CLUSTER_ADDRESS=192.168.1.202 \
                      --build-arg VITE_IB_USER_PASS_REQUIRED=false \
                      --build-arg VITE_CLUSTER_WEB_URL=https://cloud1c.dev-projects.goodwin.website
                    """
                }
            }
        }

        stage('Deploy (GitOps)') {
            steps {
                container('kustomizer') {
                    withCredentials([string(credentialsId: 'github-token-gitops', variable: 'G_TOKEN')]) {
                        sh """
                            apk add --no-cache git
                            git config --global user.email "jenkins@goodwin.website"
                            git config --global user.name "Jenkins CI"

                            # Замени ссылку на репо твоего фронта или его инфраструктуры
                            git clone https://x-access-token:${G_TOKEN}@github.com:AlexGalitsky/cloud1c-gitops.git infra-repo
                            
                            cd infra-repo/k8s
                            
                            # Обновляем тег именно для фронта
                            kustomize edit set image ${IMAGE_FULL_NAME}=${IMAGE_FULL_NAME}:${BUILD_NUMBER}
                            
                            git add kustomization.yaml
                            if git diff --staged --quiet; then
                                echo "No changes"
                            else
                                git commit -m "Bump front image to ${BUILD_NUMBER}"
                                git push origin main
                            fi
                        """
                    }
                }
            }
        }
    }
}
