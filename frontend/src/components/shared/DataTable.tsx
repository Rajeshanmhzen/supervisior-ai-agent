import React from 'react'

type TableColumn<T> = {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

type DataTableProps<T> = {
  columns: TableColumn<T>[]
  data: T[]
  className?: string
}

const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  className = '',
}: DataTableProps<T>) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`text-left px-4 py-3 text-[10px] font-label font-bold uppercase tracking-[0.12em] text-on-surface-variant ${
                  col.className ?? ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-3 text-sm text-on-surface bg-surface-container-lowest ${
                    col.className ?? ''
                  }`}
                >
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
