import React, { useRef } from 'react';
import { Reorder, useDragControls } from 'motion/react';
import { ArrowUp, ArrowDown, GripVertical, X, Plus } from 'lucide-react';

export interface RankingItemProps {
  value: string | number;
  text: string;
  index?: number;
  total?: number;
  onClick?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isRanked?: boolean;
  longTap?: boolean;
}

export const RankingItem: React.FC<RankingItemProps> = ({ 
  value, 
  text, 
  index,
  total,
  onClick, 
  onMoveUp,
  onMoveDown,
  isRanked, 
  longTap 
}) => {
  const controls = useDragControls();
  const timeoutRef = useRef<any>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (longTap && !onClick) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // For long press, we need to persist the event or clone it if needed,
      // but controls.start(e) needs the original event.
      // React 17+ doesn't pool events, so 'e' is safe to use in timeout.
      
      timeoutRef.current = setTimeout(() => {
        controls.start(e);
        if (navigator.vibrate) navigator.vibrate(50);
      }, 500);
    } else if (!onClick) {
      // Immediate drag for non-longTap
      controls.start(e);
    }
  };

  const cancelLongPress = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  // If onClick is present (Select to Rank mode), we don't drag.
  // If longTap is true, we drag via custom controls on long press.
  // If longTap is false, we drag via custom controls on immediate press (on the grip icon).
  
  return (
    <Reorder.Item
      value={value}
      className="msj__rankingItem"
      dragListener={false} // We always use dragControls for better control
      dragControls={controls}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `${isRanked ? 'Remove' : 'Add'} ${text}` : undefined}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        touchAction: 'none' // Important for drag to work reliably on mobile
      }}
    >
      <span className="msj__rankingLabel" style={{ flex: 1 }}>{text}</span>
      
      <span className="msj__rankingControls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Select to Rank Mode: Add/Remove buttons */}
        {onClick && (
           isRanked ? <X size={16} /> : <Plus size={16} />
        )}

        {/* Standard Ranking Mode: Arrows + Drag Handle */}
        {!onClick && (
          <>
            {onMoveUp && index !== undefined && index > 0 && (
              <button 
                type="button" 
                className="msj__miniButton" 
                onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                aria-label="Move up"
              >
                <ArrowUp size={16} />
              </button>
            )}
            
            {onMoveDown && index !== undefined && total !== undefined && index < total - 1 && (
              <button 
                type="button" 
                className="msj__miniButton" 
                onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                aria-label="Move down"
              >
                <ArrowDown size={16} />
              </button>
            )}

            <div 
              className="msj__dragHandle"
              onPointerDown={onPointerDown}
              onPointerUp={cancelLongPress}
              onPointerLeave={cancelLongPress}
              style={{ 
                cursor: longTap ? 'context-menu' : 'grab', 
                display: 'flex', 
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <GripVertical size={16} className="msj__muted" />
            </div>
          </>
        )}
      </span>
    </Reorder.Item>
  );
};
