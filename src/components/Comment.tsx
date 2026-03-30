import React, { useEffect, useRef } from 'react';

/**
 * Component that renders actual HTML comments visible in DevTools Inspector
 * JSX comments (written as {...}) are stripped during compilation and never reach the DOM.
 * This component uses a placeholder div and useEffect to inject real comment nodes into the DOM.
 */
export const Comment: React.FC<{ text: string }> = ({ text }) => {
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (placeholderRef.current && placeholderRef.current.parentNode) {
      // Create a comment node
      const commentNode = document.createComment(` ${text} `);
      // Insert the comment right before the placeholder div
      placeholderRef.current.parentNode.insertBefore(commentNode, placeholderRef.current);
      // Remove the placeholder div
      placeholderRef.current.remove();
    }
  }, [text]);

  // Return an empty div as a placeholder that gets replaced with the comment node
  return <div ref={placeholderRef} style={{ display: 'none' }} suppressHydrationWarning />;
};
