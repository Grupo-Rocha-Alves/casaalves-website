import { ReactNode, useState, useRef, useEffect } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Tooltip({
  content,
  children,
  maxWidth = "500px",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showBelow, setShowBelow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setShowBelow(rect.top < 600);
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal break-words"
          style={{
            maxWidth,
            ...(showBelow
              ? {
                  top: "100%",
                  marginTop: "8px",
                }
              : {
                  bottom: "100%",
                  marginBottom: "8px",
                }),
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {content}
          <div
            className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
            style={{
              ...(showBelow
                ? {
                    top: "-4px",
                  }
                : {
                    bottom: "-4px",
                  }),
              left: "50%",
              marginLeft: "-4px",
            }}
          />
        </div>
      )}
    </div>
  );
}
