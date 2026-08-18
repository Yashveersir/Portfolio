'use client';

import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function ThemeProvider() {
  const { data } = usePortfolioData();

  const primaryColor = data?.theme?.primaryColor || '#22d3ee'; // default cyan
  const secondaryColor = data?.theme?.secondaryColor || '#a855f7'; // default purple

  // Convert hex to comma-separated RGB for Tailwind's rgba support
  const hexToRgbStr = (hex: string) => {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        const hexStr = c.join('');
        const num = parseInt(hexStr, 16);
        return [(num>>16)&255, (num>>8)&255, num&255].join(',');
    }
    return '';
  }

  const primaryRgb = hexToRgbStr(primaryColor);
  const secondaryRgb = hexToRgbStr(secondaryColor);

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        :root {
          --cyan: ${primaryRgb || '34,211,238'};
          --purple-500: ${secondaryRgb || '168,85,247'};
          --theme: rgb(var(--cyan));
        }
      `
    }} />
  );
}
