export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isRetryable: boolean;

  constructor(message: string, statusCode: number, isRetryable = true) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
  }

  static fromResponse(response: Response): ApiError {
    const statusCode = response.status;
    let message = `API Error: ${statusCode}`;
    let isRetryable = true;

    // Customize error messages based on status code
    switch (statusCode) {
      case 400:
        message = 'Solicitud incorrecta';
        isRetryable = false;
        break;
      case 401:
        message = 'No autorizado';
        isRetryable = false;
        break;
      case 403:
        message = 'Acceso prohibido';
        isRetryable = false;
        break;
      case 404:
        message = 'Recurso no encontrado';
        isRetryable = false;
        break;
      case 429:
        message = 'Demasiadas solicitudes';
        isRetryable = true;
        break;
      case 500:
        message = 'Error interno del servidor';
        isRetryable = true;
        break;
      case 502:
        message = 'Error de puerta de enlace';
        isRetryable = true;
        break;
      case 503:
        message = 'Servicio no disponible';
        isRetryable = true;
        break;
      case 504:
        message = 'Tiempo de espera agotado';
        isRetryable = true;
        break;
      default:
        if (statusCode >= 500) {
          message = 'Error del servidor';
          isRetryable = true;
        } else if (statusCode >= 400) {
          message = 'Error en la solicitud';
          isRetryable = false;
        }
    }

    return new ApiError(message, statusCode, isRetryable);
  }
}
