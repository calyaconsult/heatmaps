/**
 * Scales a value to a 0-10 range.
 * @param {number|string} x - The input value, either a number or percentage string.
 * @returns {number} A value between 0 and 10.
 */
function scaleToEleven(x,scale) {
  // Remove any console.log for production use

  // Handle different input types
  let percentage;

  if (typeof x === 'string') {
    // Remove the percentage sign if it exists
    percentage = x.includes('%') ? parseFloat(x) : parseFloat(x);
  } else if (typeof x === 'number') {
    percentage = x;
  } else {
    return 0; // Default value for invalid inputs
  }

  // Scale to 0-10 range and clamp
  if (scale) {
     const scaled = Math.round(percentage / 10);
     return Math.max(0, Math.min(10, scaled));
  } else {
     return percentage
  }
}

/**
 * Returns an RGB color string for a heatmap based on the input value.
 * @param {number|string} battery - The input value.
 * @returns {string} RGB color string.
 */
function getHeatmapColor(battery) {
  let value = scaleToEleven(battery, true);
  const fraction = value / 10;

  // Start color (dark blue): RGB(10, 20, 120)
  // Mid color (purple): RGB(130, 65, 160) at fraction 0.5
  // End color (bright orange): RGB(255, 165, 0)

  let r, g, b;

  if (fraction < 0.5) {
    // From dark blue to purple
    const adjustedFraction = fraction * 2; // Scale to 0-1 range
    r = Math.round(10 + (130 - 10) * adjustedFraction);
    g = Math.round(20 + (65 - 20) * adjustedFraction);
    b = Math.round(120 + (160 - 120) * adjustedFraction);
  } else {
    // From purple to bright orange
    const adjustedFraction = (fraction - 0.5) * 2; // Scale to 0-1 range
    r = Math.round(130 + (255 - 130) * adjustedFraction);
    g = Math.round(65 + (165 - 65) * adjustedFraction);
    b = Math.round(160 - (160) * adjustedFraction);
  }

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Calculates RGB colors for an 11-step heat map.
 * @param {number|string} battery - The input value.
 * @returns {string} RGB color string.
 */
function heatMapColor(battery) {
  let step = scaleToEleven(battery, true);

  // Define color stops for a more complex gradient
  const colorStops = [
    { r: 0, g: 0, b: 100 },     // Dark blue
    { r: 30, g: 60, b: 150 },   // Medium blue
    { r: 70, g: 90, b: 180 },   // Light blue
    { r: 120, g: 120, b: 190 }, // Blue-purple
    { r: 170, g: 110, b: 130 }, // Purple-red
    { r: 215, g: 130, b: 80 },  // Red-orange
    { r: 255, g: 165, b: 0 }    // Bright orange
  ];

  // Calculate which segment of the gradient we're in
  const segmentCount = colorStops.length - 1;
  const position = (step / 10) * segmentCount;
  const segmentIndex = Math.min(Math.floor(position), segmentCount - 1);

  // Calculate position within the current segment (0-1)
  const segmentPosition = position - segmentIndex;

  // Get the colors at the start and end of the current segment
  const startColor = colorStops[segmentIndex];
  const endColor = colorStops[segmentIndex + 1];

  // Interpolate between the two colors
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * segmentPosition);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * segmentPosition);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * segmentPosition);

  return `rgb(${r}, ${g}, ${b})`;
}

function getColor(battery) {
  /**
   * Generator: dragontail
   * Maps a percentage (0-100) to an RGB color string.
   * 0%   -> Red   (255, 0, 0)
   * 59%  -> Yellow (255, 255, 0)
   * 100% -> Green (0, 255, 0)
   *
   * @param {number} percentage - The input percentage (0 to 100).
   * @returns {string} - The calculated RGB color string "rgb(r, g, b)".
   */
   // Clamp percentage to the valid range 0-100
    let percentage = scaleToEleven(battery);
    //console.log('Percentage',percentage);
    percentage = Math.max(0, Math.min(100, percentage));

    let r, g, b;

    if (percentage < 59) {
      // Interpolate between Red (0%) and Yellow (59%)
      //  Red:   (255, 0, 0)
      //  Yellow:(255, 255, 0)

      // Calculate how far we are in this segment (0 to 1)
      const segmentPercent = percentage / 59;

      r = 255; // Red component stays 255 in this segment
      g = Math.round(segmentPercent * 255); // Green component goes from 0 to 255
      b = 0; // Blue component stays 0

    } else {
      // Interpolate between Yellow (59%) and Green (100%)
      //  Yellow: (255, 255, 0)
      //  Green:  (0, 255, 0)

      // Calculate how far we are in this segment (0 to 1)
      // (percentage - 59) gives a value from 0 to 41
      // (100 - 59) = 41 is the length of this segment
      const segmentPercent = (percentage - 59) / (100 - 59);

      r = Math.round(255 - (segmentPercent * 255)); // Red component goes from 255 to 0
      g = 255; // Green component stays 255 in this segment
      b = 0; // Blue component stays 0
    }

    return `rgb(${r}, ${g}, ${b})`;
  };

  function percentageToRGBa(battery) {
    /**
     * Modified version: Sunset gradient
     * Maps a percentage (0-100) to an RGB color string.
     * 0%   -> Dark Purple (75, 0, 130)
     * 33%  -> Deep Pink (255, 20, 147)
     * 66%  -> Orange (255, 165, 0)
     * 100% -> Bright Yellow (255, 255, 0)
     */
    let pct = scaleToEleven(battery);
    pct = Math.max(0, Math.min(100, pct));
    let r, g, b;

    if (pct <= 33) {
      // Dark Purple to Deep Pink
      const ratio = pct / 33;
      r = Math.round(75 + ratio * (255 - 75));     // 75 → 255
      g = Math.round(0 + ratio * (20 - 0));        // 0 → 20
      b = Math.round(130 + ratio * (147 - 130));   // 130 → 147
    } else if (pct <= 66) {
      // Deep Pink to Orange
      const ratio = (pct - 33) / 33;
      r = 255;                                     // Stays at 255
      g = Math.round(20 + ratio * (165 - 20));     // 20 → 165
      b = Math.round(147 - ratio * 147);           // 147 → 0
    } else {
      // Orange to Bright Yellow
      const ratio = (pct - 66) / 34;
      r = 255;                                     // Stays at 255
      g = Math.round(165 + ratio * (255 - 165));   // 165 → 255
      b = 0;                                       // Stays at 0
    }

    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Given a percentage [0–100], returns an interpolated RGB string
   * between peacock blue (0%) and bright mint (100%).
   *
   * @param {number} pct  Percentage (0–100)
   * @returns {string}    CSS “rgb(r,g,b)” color
   */
  function getPercentageColor(battery) {
    // Clamp input to [0,100]
    let pct = scaleToEleven(battery);
    pct = Math.max(0, Math.min(100, pct));
    const clamped = Math.max(0, Math.min(100, pct)) / 100;

    // Define end‑point colors
    const start = { r: 0,  g: 95,  b: 105 };  // peacock blue
    const end   = { r: 79, g: 255, b: 176 };  // bright mint

    // Linear interpolation helper
    const lerp = (startVal, endVal, t) =>
      Math.round(startVal + (endVal - startVal) * t);

    // Interpolate each channel
    const r = lerp(start.r, end.r, clamped);
    const g = lerp(start.g, end.g, clamped);
    const b = lerp(start.b, end.b, clamped);

    return `rgb(${r}, ${g}, ${b})`;
  }
 // Helper interpolation function
 // Generator: dragontail
 function interpolateColor(color1, color2, factor) {
             const result = color1.map((c, i) =>
             Math.round(c + factor * (color2[i] - c))
          );
          return result;
  }

  function percentageToRGBb(battery) {
      let percent = scaleToEleven(battery);
      const colorStart = [48, 89, 138];     // 0%
      const colorMid = [0, 102, 255];       // 50%
      const colorEnd = [227, 247, 250];     // 100%

      let rgb;

      if (percent <= 50) {
          // interpolate from start (0%) to mid (50%)
          const factor = percent / 50;
          rgb = interpolateColor(colorStart, colorMid, factor);
      } else {
          // interpolate from mid (50%) to end (100%)
          const factor = (percent - 50) / 50;
          rgb = interpolateColor(colorMid, colorEnd, factor);
      }

      return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  }

  function percentageToRGBc(battery) {
    // Modified to create a blue-focused gradient with subtle variations
    let percent = scaleToEleven(battery);
    // New anchor colors in blue range
    const colorStart = [7, 71, 133];        // 0% - deep blue
    const colorMid = [32, 135, 185];        // 50% - medium blue-teal
    const colorEnd = [116, 197, 209];       // 100% - light blue-teal

    let rgb;

    // Using a non-linear interpolation for a more dynamic gradient
    if (percent <= 50) {
      // Apply a slight curve to the interpolation
      const factor = Math.pow(percent / 50, 1.2);
      rgb = interpolateColor(colorStart, colorMid, factor);
    } else {
      // Apply a different curve to the second half
      const factor = Math.pow((percent - 50) / 50, 0.8);
      rgb = interpolateColor(colorMid, colorEnd, factor);
    }

    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  }
  // Specify names and values for 'low', 'middle', and 'high' colors.
  const colorScale = {
     getHeatmapColor: [{name: 'dark blue', rgb:'rgb(3, 5, 91)', color:'white'},{name: 'dark orange', rgb:'rgb(130, 65, 160)', color:'white'},{name: 'bright orange', rgb:'rgb(255, 165, 0)', color:'black'}],
     heatMapColor: [{name: 'dark blue', rgb:'rgb(0, 0, 139)', color:'white'},{name: 'light mauve', rgb:'rgb(120, 120, 190)', color:'white'},{name: 'bright orange', rgb:'rgb(255, 165, 0)', color:'black'}],
     getColor: [{name: 'red', rgb:'rgb(255,0,0)', color:'white'},{name: 'yellow', rgb:'rgb(255,216,0)', color:'black'},{name: 'green', rgb:'rgb(0,255,0)', color:'black'}],
     percentageToRGBa: [{name: 'violet', rgb:'rgb(75, 0, 130)', color:'white'},{name: 'pink orange', rgb:'rgb(255, 95, 71)'},{name: 'yellow', rgb:'rgb(255,255,0)'}],
     percentageToRGBb: [{name: 'chambray', rgb:'rgb(48, 89, 138)', color:'white'},{name: 'sky blue', rgb:'rgb(0,102,255)', color:'white'},{name: 'white ice', rgb:'rgb(227,247,250)', color:'black'}],
     percentageToRGBc: [{name: 'dark blue', rgb:'rgb(7, 71, 133)', color:'white'},{name: 'sea blue', rgb:'rgb(116, 197, 209)', color:'white'},{name: 'clear sky', rgb:'rgb(116, 197, 209)', color:'black'}],
     getPercentageColor: [{name: 'peacock blue', rgb:'rgb(0, 95, 105)', color:'white'},{name: 'turquoise', rgb:'rgb(40, 175, 141)', color:'white'},{name: 'bright mint', rgb:'rgb(79, 255, 176)', color:'black'}]
     // getPercentageColor generates an identical heatmap to percentageToRGBb
  }
  // Adapr description on page to current description
  function colorDescription(obj, objID) {
     const colorMapName = document.getElementById('color-map-name');
     colorMapName.textContent = objID;
     const colorZero = document.getElementById('c1');
     const colorMiddle = document.getElementById('c2');
     const color100 = document.getElementById('c3');
     colorZero.textContent = obj[0].name;
     colorZero.style["background-color"] = obj[0].rgb;
     colorZero.style["color"] = obj[0].color;
     colorMiddle.textContent = obj[1].name;
     colorMiddle.style["background-color"] = obj[1].rgb;
     colorMiddle.style["color"] = obj[1].color;
     color100.textContent = obj[2].name;
     color100.style["background-color"] = obj[2].rgb;
     color100.style["color"] = obj[2].color;
  };
