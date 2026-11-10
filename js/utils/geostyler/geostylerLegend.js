import { readSldWithPointStacker } from "./geostylerPointStacker.js";

/**
 * Draws graphic rule symbols and class names; excludes text-only rules.
 * @param {string} sldString SLD XML content.
 * @returns {Promise<HTMLCanvasElement>} Legend with one labeled 24 px row per graphic rule.
 */
export const sld2Legend = async function (sldString) {
  const { output: style, errors } = await readSldWithPointStacker(sldString);
  if (errors?.length) {
    throw errors[0];
  }

  const rules = style.rules.filter((rule) =>
    rule.symbolizers.some((symbolizer) =>
      ["Line", "Fill", "Mark"].includes(symbolizer.kind)
    )
  );
  const rowHeight = 24;
  const symbolWidth = 32;
  const textX = symbolWidth + 8;
  const font = "12px Arial, sans-serif";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const textWidth = Math.max(
    0,
    ...rules.map((rule) => context.measureText(rule.name || "").width)
  );
  canvas.width = Math.ceil(textX + textWidth + 8);
  canvas.height = Math.max(rowHeight, rules.length * rowHeight);
  context.font = font;
  context.textBaseline = "middle";
  // Use a shared scale to fit symbols within rows while preserving relative circle sizes.
  const maxRadius = Math.max(
    1,
    ...rules.flatMap((rule) =>
      rule.symbolizers.map((symbolizer) =>
        Number.isFinite(symbolizer.radius) ? symbolizer.radius : 5
      )
    )
  );
  const radiusScale = Math.min(1, (rowHeight / 2 - 3) / maxRadius);

  rules.forEach((rule, index) => {
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
        context.lineTo(symbolWidth - 2, y);
        context.stroke();
      } else if (symbolizer.kind === "Fill") {
        context.globalAlpha *= symbolizer.fillOpacity ?? 1;
        context.fillStyle = symbolizer.color ?? "transparent";
        context.fillRect(4, y - 8, symbolWidth - 8, 16);
        if (symbolizer.outlineColor) {
          // Use independent outline opacity.
          context.globalAlpha = symbolizer.outlineOpacity ?? 1;
          context.strokeStyle = symbolizer.outlineColor;
          context.lineWidth = symbolizer.outlineWidth ?? 1;
          context.setLineDash(symbolizer.outlineDasharray ?? []);
          context.strokeRect(4, y - 8, symbolWidth - 8, 16);
        }
      } else if (symbolizer.kind === "Mark") {
        const radius =
          (Number.isFinite(symbolizer.radius) ? symbolizer.radius : 5) * radiusScale;
        context.translate(symbolWidth / 2, y);
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
    context.fillStyle = "#333333";
    context.fillText(rule.name || "", textX, y);
  });

  return canvas;
};
