import express from 'express';
import { chromium } from 'playwright';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para recibir JSON
app.use(bodyParser.json({ limit: '2mb' }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🧪 Codex PDF Generator is running');
});

// Ruta principal para generar PDF
app.post('/generate', async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'HTML is required' });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('❌ Error al generar PDF:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
