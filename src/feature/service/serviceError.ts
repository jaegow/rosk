type ServiceErrorBody = {
  code?: string
  fields?: Record<string, string>
}

type ServiceErrorOutcome = 'offline' | 'denied' | 'notFound' | 'refused' | 'failed'

class ServiceError extends Error {
  readonly status: number
  readonly body: ServiceErrorBody

  constructor(status: number, body: ServiceErrorBody = {}) {
    super(status === 0 ? 'service unreachable' : `service responded ${status}`)
    this.name = 'ServiceError'
    this.status = status
    this.body = body
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

const parseServiceErrorBody = (json: unknown): ServiceErrorBody => {
  if (!isRecord(json)) return {}
  const fields = isRecord(json.fields)
    ? Object.fromEntries(Object.entries(json.fields).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
    : {}
  return {
    ...(typeof json.code === 'string' ? { code: json.code } : {}),
    ...(Object.keys(fields).length > 0 ? { fields } : {}),
  }
}

const serviceErrorOutcome = (error: unknown): ServiceErrorOutcome => {
  if (!(error instanceof ServiceError)) return 'failed'
  if (error.status === 0) return 'offline'
  if (error.status === 401 || error.status === 403) return 'denied'
  if (error.status === 404) return 'notFound'
  if (error.status >= 400 && error.status < 500) return 'refused'
  return 'failed'
}

const serviceErrorFields = (error: unknown): Record<string, string> => (error instanceof ServiceError ? error.body.fields ?? {} : {})

export { parseServiceErrorBody, ServiceError, serviceErrorFields, serviceErrorOutcome }
export type { ServiceErrorBody, ServiceErrorOutcome }
