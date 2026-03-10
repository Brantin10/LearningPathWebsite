'use client';

import React from 'react';
import Image from 'next/image';
import { AvatarImages } from '../config/theme';

interface Props {
  index: number;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export default function Avatar({ index, size = 80, className = '', onClick }: Props) {
  const src = AvatarImages[index] || AvatarImages[0];

  return (
    <Image
      src={src}
      alt={`Avatar ${index}`}
      width={size}
      height={size}
      onClick={onClick}
      className={`
        rounded-full border border-border-light object-cover
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
    />
  );
}
