const host = import.meta.env.VITE_SERVER_API_HOST
const port = import.meta.env.VITE_SERVER_API_PORT

export const BASE_URL = `http://${host}:${port}/api/v1`

export const ROLE_URL = `${BASE_URL}/roles`
export const BRANCHES_URL = `${BASE_URL}/branches`
export const SERVICES_URL = `${BASE_URL}/services`
export const ROLE_SERVICES_URL = `${BASE_URL}/role-services`
export const WINDOW_SERVICES_URL = `${BASE_URL}/window-services`
export const OPERATORS_URL = `${BASE_URL}/operators`
export const WINDOWS_URL = `${BASE_URL}/windows`
export const SESSION_URL = `${BASE_URL}/sessions`
export const TICKETS_URL = `${BASE_URL}/tickets`
