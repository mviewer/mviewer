/**
 * Draws Line, Fill and Mark symbols; skips labels, filters and scale limits.
 * @param {string} sldString SLD XML content.
 * @returns {Promise<HTMLCanvasElement>} Legend with one 24 px row per rule.
 */
export const sld2Legend = async function (sldString) {
  const { output: style, errors } = await new SldStyleParser().readStyle(sldString);
  if (errors) {
    throw errors[0];
  }

  const rowHeight = 24;
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = Math.max(rowHeight, style.rules.length * rowHeight);
  const context = canvas.getContext("2d");

  style.rules.forEach((rule, index) => {
    const y = index * rowHeight + rowHeight / 2;

    rule.symbolizers.forEach((symbolizer) => {
      // Isolate each symbolizer's canvas state.
      context.save();
      context.globalAlpha = symbolizer.opacity ?? 1;

      if (symbolizer.kind === "Line") {
        context.strokeStyle = symbolizer.color ?? "#000000";
        context.lineWidth = symbolizer.width ?? 1;
        context.setLineDash(symbolizer.dasharray ?? []);
        context.beginPath();
        context.moveTo(2, y);
        context.lineTo(canvas.width - 2, y);
        context.stroke();
      } else if (symbolizer.kind === "Fill") {
        context.globalAlpha *= symbolizer.fillOpacity ?? 1;
        context.fillStyle = symbolizer.color ?? "transparent";
        context.fillRect(4, y - 8, canvas.width - 8, 16);
        if (symbolizer.outlineColor) {
          // Use independent outline opacity.
          context.globalAlpha = symbolizer.outlineOpacity ?? 1;
          context.strokeStyle = symbolizer.outlineColor;
          context.lineWidth = symbolizer.outlineWidth ?? 1;
          context.setLineDash(symbolizer.outlineDasharray ?? []);
          context.strokeRect(4, y - 8, canvas.width - 8, 16);
        }
      } else if (symbolizer.kind === "Mark") {
        const radius = symbolizer.radius ?? 5;
        context.translate(canvas.width / 2, y);
        context.rotate(((symbolizer.rotate ?? 0) * Math.PI) / 180);
        context.fillStyle = symbolizer.color ?? "transparent";
        context.globalAlpha *= symbolizer.fillOpacity ?? 1;
        context.beginPath();
        if (symbolizer.wellKnownName === "square") {
          context.rect(-radius, -radius, radius * 2, radius * 2);
        } else {
          context.arc(0, 0, radius, 0, Math.PI * 2);
        }
        context.fill();
        if (symbolizer.strokeColor) {
          context.globalAlpha = symbolizer.strokeOpacity ?? 1;
          context.strokeStyle = symbolizer.strokeColor;
          context.lineWidth = symbolizer.strokeWidth ?? 1;
          context.stroke();
        }
      }

      context.restore();
    });
  });

  return canvas;
};
