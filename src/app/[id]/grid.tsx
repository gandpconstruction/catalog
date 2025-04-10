'use client';

import { useEffect, useRef, useState } from 'react';
import { VariableSizeGrid } from 'react-window';

interface RowData {
  catalogId: string;
  id: string;
  data: Record<string, any>;
}

interface GridData {
  id: string;
  name: string;
  rows: RowData[];
}

export default function Grid({ id, data }: { id: string; data: GridData }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Extract columns
  const columns = data.rows.length > 0 ? Object.keys(data.rows[0].data) : [];
  const columnCount = columns.length;
  const rowCount = data.rows.length;

  // Estimate column widths based on content
  const calculateColumnWidth = (column: string): number => {
    const maxLength = Math.max(
      ...data.rows.map((row) => String(row.data[column]).length),
      column.length
    );
    return Math.min(Math.max(maxLength * 10, 100), 300); // Min 100px, max 300px
  };

  const columnWidths = columns.map(calculateColumnWidth);
  const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0) || 0;

  // Update dimensions based on container size and content width
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Account for scrollbar width (approx 16px, adjust as needed)
        const scrollbarWidth = 16;
        const availableWidth = width - 2 - scrollbarWidth; // Subtract border and scrollbar
        // Grid width is totalWidth, capped by available container width
        const effectiveWidth = Math.min(availableWidth, totalWidth);
        setDimensions({ width: effectiveWidth, height: height - 40 }); // Subtract header height
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [totalWidth]);

  type TCellRendererProps = { columnIndex: number; rowIndex: number; style: React.CSSProperties };
  const cellRenderer: React.FC<TCellRendererProps> = ({ columnIndex, rowIndex, style }) => {
    const row = data.rows[rowIndex];
    const column = columns[columnIndex];
    const value = row.data[column];
    return (
      <div
        style={{
          ...style,
          border: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </div>
    );
  };

  const scrollbarWidth = 16;

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        width: 'fit-content',
        maxWidth: '100%',
        border: '1px solid #ccc',
        backgroundColor: 'white',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', width: `${totalWidth}px` }}>
        {columns.map((column, index) => (
          <div
            key={index}
            style={{
              width: columnWidths[index],
              minWidth: columnWidths[index],
              textAlign: 'center',
              border: '1px solid #ddd',
              padding: '8px',
              backgroundColor: '#f5f5f5',
              whiteSpace: 'nowrap',
            }}
          >
            {column}
          </div>
        ))}
      </div>

      {/* Grid */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <VariableSizeGrid
          columnCount={columnCount}
          columnWidth={(index: number) => columnWidths[index]}
          height={dimensions.height}
          rowCount={rowCount}
          rowHeight={() => 35}
          width={totalWidth + scrollbarWidth}
          style={{ overflowX: 'auto' }}
        >
          {cellRenderer}
        </VariableSizeGrid>
      )}
    </div>
  );
}