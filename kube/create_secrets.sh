kubectl create secret generic ril-notify-key --from-literal=ril-notify-key=${NOTIFY_KEY}
kubectl create secret generic redis --from-literal=session_secret=${SESSION_SECRET}
