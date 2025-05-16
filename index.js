import express from 'express';
import { chromium } from 'playwright';

const app = express();
app.use(express.json({ limit: '10mb' })); // por si el HTML es muy largo

app.post('/generar', async (req, res) => {
  try {
    const { html, authKey, id_sesion, tipo_entregable } = req.body;
    const trustedKey = process.env.API_SECRET_KEY;

    // ✅ Verificación por API key
    if (authKey !== trustedKey) {
      return res.status(403).json({ error: 'Acceso no autorizado (clave)' });
    }

    // ✅ Verificación opcional por header
    const vercelHeader = req.get('x-vercel-backend');
    if (vercelHeader !== 'vercel-internal') {
      return res.status(403).json({ error: 'Acceso no autorizado (fuente)' });
    }

    // ✅ Log de sesión y tipo de entrega
    console.log(`📦 PDF solicitado | Sesión: ${id_sesion || 'sin_id'} | Tipo: ${tipo_entregable || 'desconocido'}`);

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

const PORT = process.env.PORT || 3000;
console.log("🚀 Variable de entorno PORT:", process.env.PORT);

app.listen(PORT, () => {
  console.log(`Servidor PDF activo en puerto ${PORT}`);
});
