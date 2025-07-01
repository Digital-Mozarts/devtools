import React, { FC, ReactNode, useEffect, useState } from "react";
import { clsx } from "clsx";
import scalexLogo from "../../scalex_ai_logo.png";

// used to determine x y delta of mouse movement
let originX: number | undefined;
let originY: number | undefined;

const VisualEditorHeader: FC<{
  x: number;
  y: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
  className?: string;
  reverseX?: boolean;
  reverseY?: boolean;
  children?: ReactNode;
  onToggleHighlight: () => void;
}> = ({
  x,
  y,
  setX,
  setY,
  className = "",
  reverseX = false,
  reverseY = false,
  onToggleHighlight,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const onDrag = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const dx = clientX - originX!;
      const dy = clientY - originY!;
      setX(reverseX ? x - dx : x + dx);
      setY(reverseY ? y - dy : y + dy);
    };
    if (isDragging) document.body.addEventListener("mousemove", onDrag);
    return () => document.body.removeEventListener("mousemove", onDrag);
  }, [isDragging]);

  // for when the mouse leaves the page while dragging
  useEffect(() => {
    const mouseLeaveHandler = () => {
      setIsDragging(false);
    };
    document.body.addEventListener("mouseleave", mouseLeaveHandler);
    return () =>
      document.body.removeEventListener("mouseleave", mouseLeaveHandler);
  }, []);

  return (
    <div
      className={clsx("cursor-move", className)}
      onMouseDown={(e) => {
        e.preventDefault();
        originX = e.clientX;
        originY = e.clientY;
        setIsDragging(true);
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        originX = undefined;
        originY = undefined;
        setIsDragging(false);
      }}
    >
      <div style={{background:'#8A2BE2',color:'#fff',padding:'6px 0',textAlign:'center',fontWeight:'bold',fontSize:'1.1rem'}}>ScaleX AI Mode Active</div>
      <header className="visual-editor-header">
        <img src={scalexLogo} alt="ScaleX AI" style={{ height: 32, marginRight: 12 }} />
        <span className="visual-editor-title">ScaleX AI Visual Editor</span>
        <button style={{marginLeft:'auto',background:'#8A2BE2',color:'#fff',border:'none',borderRadius:4,padding:'6px 12px',cursor:'pointer'}} onClick={onToggleHighlight}>
          Toggle Highlight
        </button>
      </header>
    </div>
  );
};

export default VisualEditorHeader;
