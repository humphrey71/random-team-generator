/**
 * Creates an ultra-visible, high-contrast theme-colored drag ghost image.
 * Solves the native browser semi-transparent ghost image invisibility issue.
 */
export function setCustomDragGhost(
  e: React.DragEvent,
  name: string,
  badgeText = 'Moving'
) {
  // Create an offscreen DOM container
  const ghost = document.createElement('div');
  ghost.style.position = 'fixed';
  ghost.style.top = '-1000px';
  ghost.style.left = '-1000px';
  ghost.style.zIndex = '99999';
  ghost.style.pointerEvents = 'none';

  // Apply high-contrast brand styling: Solid Brand Indigo with drop shadow & border
  ghost.style.display = 'inline-flex';
  ghost.style.alignItems = 'center';
  ghost.style.gap = '8px';
  ghost.style.backgroundColor = '#4338CA'; // Indigo 700 - high contrast
  ghost.style.color = '#FFFFFF';
  ghost.style.padding = '8px 14px';
  ghost.style.borderRadius = '10px';
  ghost.style.border = '2px solid #818CF8'; // Indigo 400 highlight
  ghost.style.boxShadow = '0 12px 24px -4px rgba(67, 56, 202, 0.6)';
  ghost.style.fontSize = '13px';
  ghost.style.fontWeight = '700';
  ghost.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  ghost.style.whiteSpace = 'nowrap';

  // Grip icon + Name + Badge
  ghost.innerHTML = `
    <span style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.2);padding:2px 6px;border-radius:6px;font-size:11px;font-weight:800;color:#FDE047;">
      ✊ ${badgeText}
    </span>
    <span style="font-size:14px;letter-spacing:-0.2px;">${name}</span>
  `;

  document.body.appendChild(ghost);

  try {
    e.dataTransfer.setDragImage(ghost, 20, 20);
  } catch {
    // fallback if not supported
  }

  // Remove the temporary node after drag start completes
  setTimeout(() => {
    if (document.body.contains(ghost)) {
      document.body.removeChild(ghost);
    }
  }, 0);
}
