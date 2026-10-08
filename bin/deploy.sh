#! /bin/bash
set -e

export INGRESS_INTERNAL_ANNOTATIONS=$HOF_CONFIG/ingress-internal-annotations.yaml
export INGRESS_EXTERNAL_ANNOTATIONS=$HOF_CONFIG/ingress-external-annotations.yaml
export CONFIGMAP_VALUES=$HOF_CONFIG/configmap-values.yaml
export NGINX_SETTINGS=$HOF_CONFIG/nginx-settings.yaml
export DATA_SERVICE_INTERNAL_ANNOTATIONS=$HOF_CONFIG/data-service-internal-annotations.yaml
export FILEVAULT_NGINX_SETTINGS=$HOF_CONFIG/filevault-nginx-settings.yaml
export FILEVAULT_INGRESS_EXTERNAL_ANNOTATIONS=$HOF_CONFIG/filevault-ingress-external-annotations.yaml

kd='kd --insecure-skip-tls-verify --timeout 10m --check-interval 10s'
redis_storage_files='kube/redis/redis-persistent-volume-claim.yml'
redis_runtime_files='kube/redis/redis-service.yml -f kube/redis/redis-network-policy.yml -f kube/redis/redis-deployment.yml'
export REDIS_PERSISTENCE_ENABLED=${REDIS_PERSISTENCE_ENABLED:-true}
export REDIS_PERSISTENCE_ACCESS_MODES=${REDIS_PERSISTENCE_ACCESS_MODES:-ReadWriteOnce}
export REDIS_PERSISTENCE_STORAGE_CLASS=${REDIS_PERSISTENCE_STORAGE_CLASS:-gp2-encrypted-eu-west-2b}
export REDIS_PERSISTENCE_EXISTING_CLAIM=${REDIS_PERSISTENCE_EXISTING_CLAIM:-}
export REDIS_PERSISTENCE_ANNOTATIONS_FILE=${REDIS_PERSISTENCE_ANNOTATIONS_FILE:-}

if [[ $1 == 'tear_down' ]]; then
  export KUBE_NAMESPACE=$BRANCH_ENV
  export DRONE_SOURCE_BRANCH=$(cat /root/.dockersock/branch_name.txt)

  if [[ -z "${REDIS_PERSISTENCE_SIZE}" ]]; then
    export REDIS_PERSISTENCE_SIZE=1Gi
  fi

  $kd --delete -f kube/configmaps/configmap.yml
  $kd --delete -f kube/redis -f kube/html-pdf -f kube/app
  echo "Torn Down UAT Branch - $APP_NAME-$DRONE_SOURCE_BRANCH.internal.$BRANCH_ENV.homeoffice.gov.uk"
  exit 0
fi

export KUBE_NAMESPACE=$1
export DRONE_SOURCE_BRANCH=$(echo $DRONE_SOURCE_BRANCH | tr '[:upper:]' '[:lower:]' | tr '/' '-')

if [[ ${KUBE_NAMESPACE} == ${PROD_ENV} ]]; then
  export REDIS_PERSISTENCE_SIZE=5Gi
else
  export REDIS_PERSISTENCE_SIZE=1Gi
fi

if [[ ${KUBE_NAMESPACE} == ${BRANCH_ENV} ]]; then
  $kd -f kube/configmaps -f kube/certs
  $kd -f $redis_storage_files
  $kd -f $redis_runtime_files -f kube/html-pdf -f kube/app
elif [[ ${KUBE_NAMESPACE} == ${UAT_ENV} ]]; then
  $kd -f kube/configmaps/configmap.yml
  $kd -f $redis_storage_files
  $kd -f $redis_runtime_files -f kube/html-pdf -f kube/app
elif [[ ${KUBE_NAMESPACE} == ${STG_ENV} ]]; then
  $kd -f kube/configmaps/configmap.yml
  $kd -f $redis_storage_files
  $kd -f $redis_runtime_files -f kube/html-pdf -f kube/app
elif [[ ${KUBE_NAMESPACE} == ${PROD_ENV} ]]; then
  $kd -f kube/configmaps/configmap.yml -f kube/app/service.yml
  $kd -f kube/app/networkpolicy-external.yml -f kube/app/ingress-external.yml
  $kd -f kube/govuk-ingress
  $kd -f $redis_storage_files
  $kd -f $redis_runtime_files -f kube/html-pdf -f kube/app/deployment.yml
fi

sleep $READY_FOR_TEST_DELAY

if [[ ${KUBE_NAMESPACE} == ${BRANCH_ENV} ]]; then
  branch_host="$APP_NAME-$DRONE_SOURCE_BRANCH.internal.$BRANCH_ENV.homeoffice.gov.uk"
  if [[ -d /root/.dockersock ]]; then
    printf '%s' "$branch_host" > /root/.dockersock/branch_url.txt
  fi
  echo "Branch - $branch_host"
fi
