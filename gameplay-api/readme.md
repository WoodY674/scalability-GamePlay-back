step 1 :
minikube delete
step 2 :
minikube start
step 3 :
kubectl apply -f ./gameplay-api/namespace.yaml 
step 2 :
helm install gameplay-api ./gameplay-api -n gameplay-api 





get pods
kubectl get pods -n gameplay-api

get services
kubectl get services -n gameplay-api

get ingress
kubectl get ingress -n gameplay-api

get deployments
kubectl get deployments -n gameplay-api

get secrets
kubectl get secrets -n gameplay-api

get configmaps
kubectl get configmaps -n gameplay-api

logs
kubectl logs -n gameplay-api -f <pod-name>
