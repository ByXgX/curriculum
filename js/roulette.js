// Orden oficial de casillas de la Ruleta Europea
    const numbers = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
      5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const center = canvas.width / 2;
    const numSlices = numbers.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    let currentAngle = 0;
    let balance = 100;
    let isSpinning = false;

    // Dibujar la ruleta en el Canvas
    function drawWheel() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      numbers.forEach((num, i) => {
        const angle = currentAngle + i * sliceAngle;

        // Definir color del sector
        if (num === 0) ctx.fillStyle = "#16a34a"; // Verde
        else if (redNumbers.includes(num)) ctx.fillStyle = "#dc2626"; // Rojo
        else ctx.fillStyle = "#1e293b"; // Negro/Oscuro

        // Dibujar quesito/sector
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, center - 5, angle, angle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#475569";
        ctx.stroke();

        // Dibujar el número
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(num, center - 15, 4);
        ctx.restore();
      });

      // Círculo central decorativo
      ctx.beginPath();
      ctx.arc(center, center, 35, 0, 2 * Math.PI);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function spinWheel() {
      const betAmount = parseInt(document.getElementById("betAmount").value);
      if (betAmount > balance || isSpinning) return;

      balance -= betAmount;
      updateUI();

      isSpinning = true;
      document.getElementById("spinBtn").disabled = true;
      document.getElementById("info").innerText = "La rueda está girando...";

      // Seleccionar un índice ganador al azar
      const winningIndex = Math.floor(Math.random() * numSlices);
      
      // Calcular el ángulo objetivo para que la flecha superior apunte al sector
      const extraRounds = 5 * 2 * Math.PI; // 5 vueltas completas
      const targetSliceAngle = -(winningIndex * sliceAngle) - (sliceAngle / 2) - (Math.PI / 2);
      
      // Normalizar rotación actual y calcular la rotación final
      const startAngle = currentAngle % (2 * Math.PI);
      const totalRotation = extraRounds + targetSliceAngle - startAngle;

      let startTime = null;
      const duration = 4000; // 4 segundos de giro

      function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Función de frenado suave (Ease Out Cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentAngle = startAngle + totalRotation * easeOut;

        drawWheel();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isSpinning = false;
          document.getElementById("spinBtn").disabled = false;
          checkWin(numbers[winningIndex], betAmount);
        }
      }

      requestAnimationFrame(animate);
    }

    function checkWin(winningNumber, bet) {
      const betType = document.getElementById("betType").value;
      const info = document.getElementById("info");
      let won = false;
      let payout = 0;

      const isRed = redNumbers.includes(winningNumber);
      const isEven = winningNumber !== 0 && winningNumber % 2 === 0;

      if (betType === "red" && isRed) { won = true; payout = bet * 2; }
      else if (betType === "black" && !isRed && winningNumber !== 0) { won = true; payout = bet * 2; }
      else if (betType === "even" && isEven) { won = true; payout = bet * 2; }
      else if (betType === "odd" && !isEven && winningNumber !== 0) { won = true; payout = bet * 2; }
      else if (betType === "0" && winningNumber === 0) { won = true; payout = bet * 36; }

      const colorName = winningNumber === 0 ? "Verde" : (isRed ? "Rojo" : "Negro");

      if (won) {
        balance += payout;
        info.innerHTML = `<span class="win">🎉 ¡Salió el ${winningNumber} (${colorName})! Ganaste ${payout}€</span>`;
      } else {
        info.innerHTML = `<span class="lose">😢 Salió el ${winningNumber} (${colorName}). ¡Inténtalo de nuevo!</span>`;
      }

      updateUI();
    }

    function updateUI() {
      document.getElementById("balance").innerText = `Saldo: ${balance} €`;
    }

    // Dibujo inicial
    drawWheel();