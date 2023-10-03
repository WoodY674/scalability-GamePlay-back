import { Request } from 'express'
import {RequestValidation} from "../enum/enum";
export class Utils {
  static validBodyRequest (
    request: Request,
    interfaceModel: any
  ): number {
    // Vérifie si request.body existe
    if (!request.body) {
      return RequestValidation.NO_BODY
    }
    const requiredProperties = Object.keys(interfaceModel)
    const providedProperties = Object.keys(request.body)
    for (const prop of requiredProperties) {
      if (!providedProperties.includes(prop)) {
        return RequestValidation.MISSING_PROPERTIES
      }
    }
    // Vérifie s'il y a des propriétés en trop dans request.body
    for (const prop of providedProperties) {
      if (!requiredProperties.includes(prop)) {
        return RequestValidation.TOO_MUCH_PROPERTIES
      }
    }
    // Vérifie le type de chaque propriété
    for (const prop of requiredProperties) {
      if (typeof request.body[prop] !== typeof interfaceModel[prop]) {
        return RequestValidation.WRONG_TYPE
      }
    }
    return RequestValidation.VALID
  }
}
