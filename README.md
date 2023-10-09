voir l'etiquette
kubectl describe pod gameplay-db-mariadb-7cdd75474-6gfnd -n gameplay-api


install db
helm install gameplay-db ./gameplay-db -n gameplay-api 

namespace gameplay-api
kubectl apply -f ./gameplay-db/namespace.yaml 


install gameplay-api
helm install gameplay-api ./gameplay-api -n gameplay-api 


kubectl port-forward gameplay-api-backend-d9cf7c6bd-lgtx7 3001:3001 -n gameplay-api
