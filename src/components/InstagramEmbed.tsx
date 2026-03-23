'use client';

import { useEffect } from 'react';

export default function InstagramEmbed() {
  useEffect(() => {
    // Load Instagram script
    const script = document.createElement('script');
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <blockquote 
            class="instagram-media" 
            data-instgrm-permalink="https://www.instagram.com/reel/DHy0nOXMpMf/" 
            data-instgrm-version="14"
            style="max-width:540px; width:100%;">
          </blockquote>
        `,
      }}
    />
  );
}