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
      const parent = placeholderRef.current.parentNode;
      const existingComment = Array.from(parent.childNodes).find(
        (node) => node.nodeType === Node.COMMENT_NODE && node.textContent === ` ${text} `,
      );

      if (!existingComment) {
        // Create a comment node and keep the placeholder div in place.
        const commentNode = document.createComment(` ${text} `);
        parent.insertBefore(commentNode, placeholderRef.current);
      }
    }
  }, [text]);

  // Keep the placeholder div in the DOM so React's reconciliation remains stable.
  return <div ref={placeholderRef} style={{ display: 'none' }} suppressHydrationWarning />;
};
