app.post('/generar', async (req, res) => {
  const { html, authKey } = req.body;
  const trustedKey = process.env.API_SECRET_KEY;

  // Verificación clave secreta
  if (authKey !== trustedKey) {
    return res.status(403).json({ error: 'Acceso no autorizado (clave)' });
  }

  // Verificación opcional por IP o encabezado
  const userAgent = req.get('User-Agent') || '';
  const customOrigin = req.get('x-vercel-backend') || '';
  const allowedHeader = 'vercel-internal';

  if (customOrigin !== allowedHeader) {
    return res.status(403).json({ error: 'Acceso no autorizado (fuente)' });
  }

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(html || '<h1>Sin contenido</h1>', {
      waitUntil: 'networkidle',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando PDF', details: error.message });
  }
});
