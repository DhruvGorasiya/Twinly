import Spline from '@splinetool/react-spline';

interface SplineModelProps {
  url: string;
}
import React from 'react';

export function SplineModel({ url }: SplineModelProps) {
  return <Spline scene={url} />;
}