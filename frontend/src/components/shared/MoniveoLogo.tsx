import React from "react";

const MoniveoLogo = ({
  size = 24,
  stroke = "#191c1e",
  fill = "#191c1e",
}: {
  size?: number;
  stroke?: string;
  fill?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="22" height="22" rx="5" stroke={stroke} strokeWidth="2" fill="none" />
    <rect x="5" y="5" width="14" height="14" rx="3" fill={fill} />
  </svg>
);

export default MoniveoLogo;
