import React from 'react'

export default function Logo({ size = 22, inline = false }: { size?: number; inline?: boolean }) {
  const style: React.CSSProperties = {
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    fontWeight: 500,
    fontSize: size,
    lineHeight: 1,
    display: inline ? 'inline-flex' : 'inline-flex',
    alignItems: 'center',
    gap: 6,
  };

  return (
    <span style={style} aria-label="GramScaling logo">
      <span style={{ color: '#ffffff', fontWeight: 500 }}>Gram</span>
      <span style={{ color: '#FFD700', fontWeight: 500 }}>Scaling</span>
    </span>
  );
}
