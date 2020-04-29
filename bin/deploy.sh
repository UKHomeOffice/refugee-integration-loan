#!/usr/bin/env bash

set -o errexit
set -o nounset

# default values
export DRONE_DEPLOY_TO=${DRONE_DEPLOY_TO:?'[error] Please specify which cluster to deploy to.'}
export KUBE_NAMESPACE=${KUBE_NAMESPACE=cto-dev}
export KUBE_ENVIRONMENT=${KUBE_ENVIRONMENT:-${DRONE_DEPLOY_TO}}

export KUBE_CERTIFICATE_AUTHORITY=https://raw.githubusercontent.com/UKHomeOffice/acp-ca/master/${DRONE_DEPLOY_TO}.crt

export NAME="hof-form-example"
export REDIS_NAME="redis"
export REPO="ssh://git@gitlab.digital.homeoffice.gov.uk:2222/cto/defra-form-example.git"

case ${DRONE_DEPLOY_TO} in
  'acp-notprod')
    export KUBE_SERVER="https://kube-api-notprod.notprod.acp.homeoffice.gov.uk"
    export KUBE_TOKEN=${KUBE_TOKEN_ACP_NOTPROD}
    ;;
esac

echo "--- kube api url: ${KUBE_SERVER}"
echo "--- namespace: ${KUBE_NAMESPACE}"
echo "--- environment: ${KUBE_ENVIRONMENT}"

echo "--- deploying redis"
kd --timeout=5m \
   --check-interval=5s \
  -f kube/redis-service.yml \
  -f kube/redis-network-policy.yml \
  -f kube/redis-deployment.yml \

echo "--- deploying ${NAME}"
if ! kd --timeout=5m \
  -f kube/networkpolicy-internal.yaml \
  -f kube/networkpolicy-external.yaml \
  -f kube/service.yaml \
  -f kube/ingress-internal.yaml \
  -f kube/ingress-external.yaml \
  -f kube/deployment.yaml ; then
  echo "[error] failed to deploy ${NAME}"
  exit 1
fi

echo "--- deploying file vault"
kd --timeout=5m \
   --check-interval=5s \
   -f kube/file-vault-ingress.yml \
   -f kube/file-vault-service.yml \
   -f kube/file-vault-network-policy.yml \
  #  -f kube/file-vault-deployment.yml \