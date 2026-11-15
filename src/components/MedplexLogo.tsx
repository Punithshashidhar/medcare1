import React from 'react';

interface MedplexLogoProps {
  variant?: 'horizontal' | 'stacked';
  tone?: 'light' | 'dark';
  className?: string;
}

export const MedplexLogo: React.FC<MedplexLogoProps> = ({
  variant = 'horizontal',
  tone = 'light',
  className = '',
}) => {
  const houseColor = tone === 'dark' ? '#E2E8F0' : '#2D2D2D';
  const crossFill = tone === 'dark' ? '#E2E8F0' : '#2D2D2D';
  const wordColor = '#E14B6E';

  if (variant === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-center gap-1.5 select-none ${className}`}>
        <svg
          width="48"
          height="42"
          viewBox="0 0 120 104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M60 4L6 52H18V98H102V52H114L60 4ZM60 32C44.536 32 32 44.536 32 60C32 75.464 44.536 88 60 88C75.464 88 88 75.464 88 60C88 44.536 75.464 32 60 32Z"
            fill={houseColor}
          />
          <path
            d="M54 44H66V54H76V66H66V76H54V66H44V54H54V44Z"
            fill={crossFill}
          />
        </svg>
        <svg
          width="112"
          height="16"
          viewBox="0 0 280 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* M */}
          <path d="M4 36L20 4H29L13 36H4Z" fill={wordColor} />
          <path d="M18 36L31 10V36H18Z" fill={wordColor} />
          <path d="M35 4H43V36H35V4Z" fill={wordColor} />
          {/* E */}
          <path d="M53 4H79V11H53V4ZM53 16.5H76V23.5H53V16.5ZM53 29H79V36H53V29Z" fill={wordColor} />
          {/* D */}
          <path d="M89 4H106C116 4 122 10.5 122 20C122 29.5 116 36 106 36H89V4ZM97 11V29H105.5C111 29 114 25.5 114 20C114 14.5 111 11 105.5 11H97Z" fill={wordColor} />
          {/* P */}
          <path d="M132 4H151C159.5 4 164 8.5 164 15.5C164 22.5 159.5 27 151 27H140V36H132V4ZM140 11V20H150C154 20 156 18.2 156 15.5C156 12.8 154 11 150 11H140Z" fill={wordColor} />
          {/* L */}
          <path d="M172 4H180V29H198V36H172V4Z" fill={wordColor} />
          {/* E */}
          <path d="M206 4H232V11H206V4ZM206 16.5H229V23.5H206V16.5ZM206 29H232V36H206V29Z" fill={wordColor} />
          {/* X */}
          <path d="M240 4H250L259 16L268 4H277L264 20L277 36H268L259 24L250 36H240L254 20L240 4Z" fill={wordColor} />
        </svg>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="32"
        height="28"
        viewBox="0 0 120 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M60 4L6 52H18V98H102V52H114L60 4ZM60 32C44.536 32 32 44.536 32 60C32 75.464 44.536 88 60 88C75.464 88 88 75.464 88 60C88 44.536 75.464 32 60 32Z"
          fill={houseColor}
        />
        <path
          d="M54 44H66V54H76V66H66V76H54V66H44V54H54V44Z"
          fill={crossFill}
        />
      </svg>
      <svg
        width="106"
        height="15"
        viewBox="0 0 280 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* M */}
        <path d="M4 36L20 4H29L13 36H4Z" fill={wordColor} />
        <path d="M18 36L31 10V36H18Z" fill={wordColor} />
        <path d="M35 4H43V36H35V4Z" fill={wordColor} />
        {/* E */}
        <path d="M53 4H79V11H53V4ZM53 16.5H76V23.5H53V16.5ZM53 29H79V36H53V29Z" fill={wordColor} />
        {/* D */}
        <path d="M89 4H106C116 4 122 10.5 122 20C122 29.5 116 36 106 36H89V4ZM97 11V29H105.5C111 29 114 25.5 114 20C114 14.5 111 11 105.5 11H97Z" fill={wordColor} />
        {/* P */}
        <path d="M132 4H151C159.5 4 164 8.5 164 15.5C164 22.5 159.5 27 151 27H140V36H132V4ZM140 11V20H150C154 20 156 18.2 156 15.5C156 12.8 154 11 150 11H140Z" fill={wordColor} />
        {/* L */}
        <path d="M172 4H180V29H198V36H172V4Z" fill={wordColor} />
        {/* E */}
        <path d="M206 4H232V11H206V4ZM206 16.5H229V23.5H206V16.5ZM206 29H232V36H206V29Z" fill={wordColor} />
        {/* X */}
        <path d="M240 4H250L259 16L268 4H277L264 20L277 36H268L259 24L250 36H240L254 20L240 4Z" fill={wordColor} />
      </svg>
    </span>
  );
};
