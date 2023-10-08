step 1 :
minikube delete
step 2 :
minikube start

step 3 :
kubectl apply -f ./gameplay-api/namespace.yaml 
step 4 :
helm install gameplay-api ./gameplay-api -n gameplay-api 

kubectl port-forward pods/gameplay-api-58df85469b-m6d46 31000:3001 -n gameplay-api


//command all in one
minikube delete && minikube start && kubectl apply -f ./gameplay-api/namespace.yaml && helm install gameplay-api ./gameplay-api -n gameplay-api



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
