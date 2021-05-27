#! /bin/bash
set -e

export STATUS=$(drone build info $GIT_REPO $DRONE_BUILD_PARENT --format {{.Status}})
export BRANCH=$(drone build info $GIT_REPO $DRONE_BUILD_PARENT --format {{.Target}})

if [ "$STATUS" != "success" || "$BRANCH" != "master" ]; then
  return 1
fi
