import * as XLSX from 'xlsx'

export function exportVisitsXLSX(rows: any[], filename = 'visitas.xlsx') {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Visitas')
  XLSX.writeFile(wb, filename)
}