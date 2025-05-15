import express from 'express';
import bodyParser from 'body-parser';
import { chromium } from 'playwright';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.send('✅ Codex PDF Generator is running');
});

app.post('/generate', async (req, res) => {
  const { html } = req.body;

  if (!html || typeof html !== 'string') {
    console.warn('⚠️ HTML inválido:', html);
    return res.status(400).json({ error: 'Invalid HTML string' });
  }

  let browser;
  try {
    console.log('🚀 Generando PDF...');

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

    console.log('✅ PDF generado con éxito');

  } catch (err) {
    console.error('❌ Error generando PDF:', err);
    if (browser) await browser.close();
    res.status(500).json({ error: 'Error generando el PDF', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor Codex PDF activo en puerto ${PORT}`);
});
