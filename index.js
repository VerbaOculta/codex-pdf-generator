import express from 'express';
import { chromium } from 'playwright';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(bodyParser.json({ limit: '2mb' }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🧪 Codex PDF Generator is running');
});

// Ruta para generar el PDF
app.post('/generate', async (req, res) => {
  const inicio = Date.now();
  console.log('📥 Solicitud recibida para /generate');

  const { html } = req.body;

  if (!html || typeof html !== 'string') {
    console.warn('⚠️ HTML no proporcionado o inválido');
    return res.status(400).json({ error: 'HTML field is required and must be a string.' });
  }

  try {
    console.log('🧱 Lanzando navegador Playwright...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🖋 Estableciendo contenido HTML...');
    await page.setContent(html, { waitUntil: 'networkidle' });

    console.log('🖨 Generando PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();
    console.log('✅ PDF generado y navegador cerrado');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="codex.pdf"');
    res.send(pdfBuffer);

    console.log(`⏱ Tiempo total: ${Date.now() - inicio} ms`);

  } catch (err) {
    console.error('❌ Error crítico durante la generación del PDF:', err);
    res.status(500).json({ error: 'Failed to generate PDF', details: err.message });
  }
});

// Manejo de errores globales
process.on('unhandledRejection', err => {
  console.error('💥 Rechazo no manejado:', err);
});
process.on('uncaughtException', err => {
  console.error('💥 Excepción no capturada:', err);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Codex PDF Generator corriendo en puerto ${PORT}`);
});
