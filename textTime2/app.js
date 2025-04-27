// Word Clock Watch Face for Bangle.js 2 (Brighter Green, Blacker Background, Bold Hour)

function draw() {
  // Set colors
  g.setBgColor(0,0,0);   // pure black background
  g.setColor(1,1,1);     // maximum vibrant green

  g.clear();

  var w = g.getWidth();
  var h = g.getHeight();

  // Get current time
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var battery = E.getBattery(); // Battery percentage

  // Wordify the time and make it UPPERCASE
  var words = timeInWords(hours, minutes).toUpperCase().split(" ");

  // Draw battery at top right
  g.setFont("12x20", 1);
  g.setFontAlign(1, -1); // right, top
  g.drawString(battery + "%", w-2, 2); // minimal padding

  // Draw date at bottom right
  var dateStr = formatDate(now);
  g.setFont("12x20", 1);
  g.setFontAlign(1, 1); // right, bottom
  g.drawString(dateStr, w-2, h-2);

  // Draw time words on the left, stacked
  g.setFontAlign(-1, 0); // left align, vertically center

  let lineHeight = 34; // slightly more space for bigger font
  let startY = (h/2) - ((words.length-1)*lineHeight/2);

  words.forEach((word, i) => {
    if (i == 0) {
      g.setFont("Vector", 36); // BOLDER, BIGGER hour
    } else {
      g.setFont("Vector", 26); // Brighter normal minutes
    }
    g.drawString(word, 2, startY + i*lineHeight);
  });
}

// Converts time to words (direct, like "FIVE O' SEVEN")
function timeInWords(h, m) {
  const numbers = ["twelve", "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

  h = h % 12 || 12; // 0 -> 12

  let hourWord = numbers[h];
  let minuteWord = "";

  if (m == 0) {
    minuteWord = "o'clock";
  } else if (m < 10) {
    minuteWord = "o' " + numbers[m];
  } else {
    minuteWord = numberToWords(m);
  }

  return hourWord + " " + minuteWord;
}

// Helper to turn numbers into words
function numberToWords(n) {
  const ones = ["zero","one","two","three","four","five","six","seven","eight","nine"];
  const teens = ["ten","eleven","twelve","thirteen","fourteen","fifteen",
                 "sixteen","seventeen","eighteen","nineteen"];
  const tens = ["", "", "twenty","thirty","forty","fifty"];

  if (n < 10) return ones[n];
  if (n < 20) return teens[n-10];
  let ten = Math.floor(n/10);
  let one = n%10;
  return tens[ten] + (one ? " " + ones[one] : "");
}

// Formats date like "Sat, Apr 26"
function formatDate(now) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let dayName = days[now.getDay()];
  let monthName = months[now.getMonth()];
  let dayNumber = now.getDate();
  return dayName + ", " + monthName + " " + dayNumber;
}

// Refresh every minute
Bangle.on('lcdPower', function(on) {
  if (on) {
    draw();
    if (!drawInterval) drawInterval = setInterval(draw, 60000);
  } else {
    if (drawInterval) clearInterval(drawInterval);
    drawInterval = undefined;
  }
});

// Start glow animation
function startGlow() {
  if (glowInterval) clearInterval(glowInterval);
  glowBrightness = 0;
  glowInterval = setInterval(() => {
    glowBrightness += 0.1;
    if (glowBrightness >= 1) {
      glowBrightness = 1;
      clearInterval(glowInterval);
      glowInterval = undefined;
    }
    draw();
  }, 50);
}

// Shake-to-Wake
Bangle.on('accel', function(accel) {
  if (!Bangle.isLCDOn() && accel.mag > 1.5) { // adjust threshold if needed
    Bangle.setLCDPower(true);
  }
});

// Start
var drawInterval = setInterval(draw, 60000);
draw();

// Set up basic swipe or button controls if needed
Bangle.setUI("clock");
