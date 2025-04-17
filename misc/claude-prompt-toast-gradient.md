Hier ist ein Generator, der die verschiedenen Schwärzungsgrade eines Toasts als Farbgradient darstellt - von komplett verbrannt (Schwarz) bis hin zu perfekt getoastet (helles Goldbraun #F5D7A0):

```javascript
/**
 * Toast-Schwärzungsgrad Generator
 * Liefert Farbcodes vom perfekt getoasteten Toast (#F5D7A0) bis hin zum verbrannten Toast (Schwarz #000000)
 * 
 * @returns {Function} Eine Funktion, die für einen Wert zwischen 0 und 1 die entsprechende Toastfarbe zurückgibt
 */
function createToastGradientFunction() {
  // Definiere die Farben für verschiedene Schwärzungsgrade
  const toastColors = [
    { position: 0, color: "#F5D7A0" },  // Perfekt getoastet (hell)
    { position: 0.2, color: "#E6B980" }, // Leicht gebräunt
    { position: 0.4, color: "#C89B58" }, // Mittlere Bräunung
    { position: 0.6, color: "#8B5E34" }, // Stark gebräunt
    { position: 0.8, color: "#553118" }, // Fast verbrannt
    { position: 1, color: "#000000" }    // Komplett verbrannt (schwarz)
  ];
  
  /**
   * Die Gradientenfunktion für Toast-Schwärzungsgrade
   * @param {number} toastLevel - Wert zwischen 0 (perfekt) und 1 (verbrannt)
   * @returns {string} Die Farbe des Toasts an der angegebenen Position als Hex-String
   */
  return function(toastLevel) {
    // Position auf den Bereich [0,1] beschränken
    toastLevel = Math.max(0, Math.min(1, toastLevel));
    
    // Finde die beiden Farbpunkte, zwischen denen der toastLevel liegt
    let startPoint = toastColors[0];
    let endPoint = toastColors[toastColors.length - 1];
    
    for (let i = 0; i < toastColors.length - 1; i++) {
      if (toastLevel >= toastColors[i].position && toastLevel <= toastColors[i + 1].position) {
        startPoint = toastColors[i];
        endPoint = toastColors[i + 1];
        break;
      }
    }
    
    // Berechne die relative Position zwischen den beiden Farbpunkten
    const segmentSize = endPoint.position - startPoint.position;
    const relativePosition = segmentSize === 0 ? 0 : (toastLevel - startPoint.position) / segmentSize;
    
    // Interpoliere zwischen den Farben
    const startRGB = hexToRgb(startPoint.color);
    const endRGB = hexToRgb(endPoint.color);
    
    const r = Math.round(startRGB[0] + relativePosition * (endRGB[0] - startRGB[0]));
    const g = Math.round(startRGB[1] + relativePosition * (endRGB[1] - startRGB[1]));
    const b = Math.round(startRGB[2] + relativePosition * (endRGB[2] - startRGB[2]));
    
    return rgbToHex(r, g, b);
  };
}

/**
 * Konvertiert einen Hex-Farbwert in ein RGB-Array
 * @param {string} hex - Hex-Farbwert (z.B. "#F5D7A0")
 * @returns {Array} RGB-Array [r, g, b]
 */
function hexToRgb(hex) {
  // Entferne das #-Zeichen, falls vorhanden
  hex = hex.replace(/^#/, '');
  
  // Parse als RGB-Komponenten
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return [r, g, b];
}

/**
 * Konvertiert RGB-Werte in einen Hex-Farbwert
 * @param {number} r - Rotwert (0-255)
 * @param {number} g - Grünwert (0-255)
 * @param {number} b - Blauwert (0-255)
 * @returns {string} Hex-Farbwert (z.B. "#F5D7A0")
 */
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// Toast-Gradient-Funktion erstellen
const toastGradient = createToastGradientFunction();

// Demo: Ausgabe von verschiedenen Toast-Zuständen
console.log("Toast-Schwärzungsgrade:");
console.log("0.0 - Perfekt getoastet:", toastGradient(0));
console.log("0.2 - Leicht gebräunt:", toastGradient(0.2));
console.log("0.4 - Mittlere Bräunung:", toastGradient(0.4));
console.log("0.6 - Stark gebräunt:", toastGradient(0.6));
console.log("0.8 - Fast verbrannt:", toastGradient(0.8));
console.log("1.0 - Komplett verbrannt:", toastGradient(1));

// Beispiel: Zwischenwerte
console.log("\nZwischenwerte:");
console.log("0.1 - Fast perfekt:", toastGradient(0.1));
console.log("0.3 - Leicht-mittlere Bräunung:", toastGradient(0.3));
console.log("0.5 - Mittlere-starke Bräunung:", toastGradient(0.5));
console.log("0.7 - Stark-fast verbrannt:", toastGradient(0.7));
console.log("0.9 - Kurz vor komplett verbrannt:", toastGradient(0.9));

```

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f9f9f9;
    }
    
    h2 {
      color: #5a3921;
    }
    
    .toast-container {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .gradient-bar {
      height: 60px;
      width: 100%;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
      background: linear-gradient(to right, #F5D7A0, #E6B980, #C89B58, #8B5E34, #553118, #000000);
    }
    
    .toast-levels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    
    .toast-sample {
      text-align: center;
      width: 16%;
    }
    
    .toast-color {
      height: 50px;
      border-radius: 6px;
      margin-bottom: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .toast-label {
      font-size: 12px;
      color: #5a3921;
    }
    
    .toast-hex {
      font-size: 10px;
      color: #888;
      font-family: monospace;
    }
    
    .toast-slider-container {
      margin: 30px 0;
    }
    
    .toast-slider {
      width: 100%;
      margin-bottom: 10px;
    }
    
    .slider-output {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .color-preview {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      margin-right: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .color-info {
      font-family: monospace;
    }
    
    .toast-icon {
      text-align: center;
      font-size: 24px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="toast-container">
    <h2>Toast-Schwärzungsgrad Gradient</h2>
    
    <div class="toast-icon">🍞 → 🔥</div>
    
    <div class="gradient-bar"></div>
    
    <div class="toast-levels">
      <div class="toast-sample">
        <div class="toast-color" style="background-color: #F5D7A0;"></div>
        <div class="toast-label">Perfekt</div>
        <div class="toast-hex">#F5D7A0</div>
      </div>
      <div class="toast-sample">
        <div class="toast-color" style="background-color: #E6B980;"></div>
        <div class="toast-label">Leicht</div>
        <div class="toast-hex">#E6B980</div>
      </div>
      <div class="toast-sample">
        <div class="toast-color" style="background-color: #C89B58;"></div>
        <div class="toast-label">Mittel</div>
        <div class="toast-hex">#C89B58</div>
      </div>
      <div class="toast-sample">
        <div class="toast-color" style="background-color: #8B5E34;"></div>
        <div class="toast-label">Stark</div>
        <div class="toast-hex">#8B5E34</div>
      </div>
      <div class="toast-sample">
        <div class="toast-color" style="background-color: #553118;"></div>
        <div class="toast-label">Fast verbrannt</div>
        <div class="toast-hex">#553118</div>
      </div>
      <div class="toast-sample">
        <div class="toast-color" style="background-color: #000000;"></div>
        <div class="toast-label">Verbrannt</div>
        <div class="toast-hex">#000000</div>
      </div>
    </div>
    
    <div class="toast-slider-container">
      <h3>Teste den Toast-Gradienten</h3>
      <input type="range" min="0" max="100" value="0" class="toast-slider" id="toastSlider">
      
      <div class="slider-output">
        <div class="color-preview" id="colorPreview" style="background-color: #F5D7A0;"></div>
        <div class="color-info">
          <div>Schwärzungsgrad: <span id="toastLevel">0.00</span></div>
          <div>Farbe: <span id="colorHex">#F5D7A0</span></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Funktion zum Konvertieren von Hex zu RGB
    function hexToRgb(hex) {
      hex = hex.replace(/^#/, '');
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    }

    // Funktion zum Konvertieren von RGB zu Hex
    function rgbToHex(r, g, b) {
      return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
    }

    // Toast-Gradient-Funktion
    function toastGradient(toastLevel) {
      // Toast-Farben
      const toastColors = [
        { position: 0, color: "#F5D7A0" },  // Perfekt getoastet
        { position: 0.2, color: "#E6B980" }, // Leicht gebräunt
        { position: 0.4, color: "#C89B58" }, // Mittlere Bräunung
        { position: 0.6, color: "#8B5E34" }, // Stark gebräunt
        { position: 0.8, color: "#553118" }, // Fast verbrannt
        { position: 1, color: "#000000" }    // Komplett verbrannt
      ];
      
      // Beschränke den Wert auf [0,1]
      toastLevel = Math.max(0, Math.min(1, toastLevel));
      
      // Finde die Farbpunkte
      let startPoint = toastColors[0];
      let endPoint = toastColors[toastColors.length - 1];
      
      for (let i = 0; i < toastColors.length - 1; i++) {
        if (toastLevel >= toastColors[i].position && toastLevel <= toastColors[i + 1].position) {
          startPoint = toastColors[i];
          endPoint = toastColors[i + 1];
          break;
        }
      }
      
      // Berechne die relative Position
      const segmentSize = endPoint.position - startPoint.position;
      const relativePosition = segmentSize === 0 ? 0 : (toastLevel - startPoint.position) / segmentSize;
      
      // Interpoliere zwischen den Farben
      const startRGB = hexToRgb(startPoint.color);
      const endRGB = hexToRgb(endPoint.color);
      
      const r = Math.round(startRGB[0] + relativePosition * (endRGB[0] - startRGB[0]));
      const g = Math.round(startRGB[1] + relativePosition * (endRGB[1] - startRGB[1]));
      const b = Math.round(startRGB[2] + relativePosition * (endRGB[2] - startRGB[2]));
      
      return rgbToHex(r, g, b);
    }

    // Interaktiver Slider
    const slider = document.getElementById('toastSlider');
    const levelDisplay = document.getElementById('toastLevel');
    const colorPreview = document.getElementById('colorPreview');
    const colorHex = document.getElementById('colorHex');
    
    slider.addEventListener('input', function() {
      const value = this.value / 100;
      const color = toastGradient(value);
      
      levelDisplay.textContent = value.toFixed(2);
      colorPreview.style.backgroundColor = color;
      colorHex.textContent = color;
    });
  </script>
</body>
</html>

```

Dieser Generator erstellt einen realistischen Farbverlauf, der die verschiedenen Schwärzungsgrade eines Toasts darstellt - von perfekt getoastet (#F5D7A0, goldbraun) bis hin zu komplett verbrannt (schwarz).

Der Generator nutzt sechs unterschiedliche Toastfarben als Referenzpunkte:
1. 0.0: #F5D7A0 - Perfekt getoastet, helles Goldbraun
2. 0.2: #E6B980 - Leicht gebräunt
3. 0.4: #C89B58 - Mittlere Bräunung
4. 0.6: #8B5E34 - Stark gebräunt
5. 0.8: #553118 - Fast verbrannt
6. 1.0: #000000 - Komplett verbrannt (schwarz)

Du kannst die Funktion `toastGradient()` mit einem Wert zwischen 0 und 1 aufrufen, um die entsprechende Farbe zu erhalten. In der HTML-Visualisierung kannst du außerdem mit dem Schieberegler interaktiv durch die verschiedenen Schwärzungsgrade navigieren.

Diese Art von Funktionsschar ist besonders nützlich für:
- Visualisierungen zum Toastgrad in einer Smart-Kitchen-App
- Anzeige des Bräunungsgrades in Toaster-Simulationen
- Infografiken zum Thema Kochen und Backen
