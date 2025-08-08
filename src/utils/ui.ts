export const cls = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(' ')
export const fmtDate = (ms: number) => new Date(ms).toLocaleString()