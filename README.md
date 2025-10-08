# Next.js + Docker + GHCR + Minikube

A minimal Next.js app containerized with Docker, built and pushed to GitHub Container Registry (GHCR) via GitHub Actions, and deployed to Kubernetes (Minikube) using manifests.

## Prerequisites
- Node.js 18+ and npm
- Docker Desktop
- GitHub account and repository for this project
- kubectl
- Minikube

Optional (if using private GHCR images):
- A GitHub Personal Access Token with `read:packages` (for pulling) and `write:packages` (for pushing)

## Project structure
```
nextjs-k8s-ghcr/
  app/
    layout.js
    page.js
  k8s/
    deployment.yaml
    service.yaml
  .github/workflows/docker-publish.yml
  .dockerignore
  .gitignore
  Dockerfile
  next.config.mjs
  package.json
  README.md
```

## Local development
1) Install dependencies
```
npm install
```

2) Run the dev server
```
npm run dev
```
Visit http://localhost:3000

## Build and run with Docker locally
1) Build the image
```
docker build -t nextjs-k8s-ghcr:dev .
```

2) Run the container
```
docker run --rm -p 3000:3000 nextjs-k8s-ghcr:dev
```
Visit http://localhost:3000

## GitHub Actions (build and push to GHCR)
- Make sure this project is pushed to a GitHub repository.
- The provided workflow builds on every push to `main` and pushes to GHCR with tags:
  - `latest`
  - a commit SHA tag

Image path format: `ghcr.io/<OWNER>/<REPO>:<tag>`

> If your repo is public, the image can be public too (no registry secret needed for pull). If private, see the Minikube section for imagePullSecrets.

## Kubernetes deployment (Minikube)
1) Start Minikube
```
minikube start
```

2) Update the image in `k8s/deployment.yaml`
Edit the `image:` field to match your repo. Example:
```
image: ghcr.io/<YOUR_GH_USERNAME>/<YOUR_REPO>:latest
```

3) If your GHCR package is private, create a registry secret and reference it
```
kubectl create secret docker-registry ghcr-creds \
  --docker-server=ghcr.io \
  --docker-username=<YOUR_GH_USERNAME> \
  --docker-password=<A_PAT_WITH_read:packages> \
  --docker-email=<YOUR_EMAIL>
```
Then, uncomment `imagePullSecrets` in `k8s/deployment.yaml`.

4) Apply manifests
```
kubectl apply -f k8s/
```

5) Access the app via Minikube service helper
```
minikube service nextjs-service --url
```
Open the printed URL (it will point to NodePort 30080 by default).

## Useful commands
- Update the running Deployment to a new tag without editing files:
```
kubectl set image deployment/nextjs-deployment nextjs=ghcr.io/<OWNER>/<REPO>:<tag>
```

- Watch rollout status:
```
kubectl rollout status deployment/nextjs-deployment
```

- Get service URL again:
```
minikube service nextjs-service --url
```

## Notes
- The Dockerfile uses Next.js `output: 'standalone'` for a small runtime image.
- The workflow uses metadata-action for deterministic tags (`latest` and commit SHA).
- For simplicity, NodePort is used. You could also use the Minikube Ingress addon for a friendlier URL.
