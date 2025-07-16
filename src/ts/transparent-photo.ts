const img = new Image();
img.src = "assets/images/me.webp";
img.onload = () => {
  const canvas = document.getElementById("hero__canvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = img.width;
  canvas.height = img.height;

    ctx.save()
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(img, 0, 0)
    ctx.restore()

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4
        const alpha = 0.1 * Math.pow(x / canvas.width , 2)
        data[index + 3] = data[index + 3] * alpha 
      }
    }

  ctx.putImageData(imageData, 0, 0);
};
