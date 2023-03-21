import React from 'react';
import { createRoot } from 'react-dom/client';

function Content(): JSX.Element {
  return (
    <div className="bg-blue-500 w-full">
      <p>Test Twitter New Thing!</p>
    </div>
  );
}

function init() {
  const rootContainer = document.body;
  setTimeout(() => {
    const twitterDiv = document.body.querySelector('div.css-1dbjc4n') as HTMLDivElement;
    if (!rootContainer) throw new Error("Can't find Content root element");
    if (!twitterDiv) throw new Error("Can't find Twiiter DIV element");
    const root = createRoot(twitterDiv);
    root.render(<Content />);
  }, 10000);
}

document.addEventListener('DOMContentLoaded', init);
