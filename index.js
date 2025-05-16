const express = require('express');
const { chromium } = require('playwright');
const app = express();

app.use(express.json());

app.post('/generar', async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(html || '<h1>Sin contenido</h1>', {
      waitUntil: 'domcontentloaded',
    });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando PDF', details: error.message });
  }
});

app.listen(3000, () => console.log('Servidor PDF activo en puerto 3000'));
