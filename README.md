# CISTEC - Sistema de Tótem Digital y Panel de Atención TV

Sistema integral de gestión de turnos para asistencia técnica especializada multimarcas (Apple, Samsung, DJI, Xiaomi, JOOG, General), diseñado para **CISTEC • Grupo Cell Motion S.A.**.

## 📱 Componentes del Sistema

1. **Tótem de Autoservicio (Pantalla Vertical 27"):**
   - URL: `http://localhost:5173/` (o ruta raíz)
   - Flujo de autoatención: Selección de idioma, captura de datos del cliente (Nombre y Cédula/CPF) con teclado táctil virtual integrado, selección directa de categoría/marca y emisión instantánea de turno digital.

2. **Pantalla TV de Recepción (16:9 Panorámica):**
   - URL: `http://localhost:5173/?view=tv`
   - Vista pública en vivo con 3 columnas en estética Ultra-Dark OLED & Glassmorphism:
     - **Próximos en Fila** (clientes en espera).
     - **Actualmente en Mostrador** (3 puestos simultáneos con código masivo, datos centrados y borde perimetral de luz animada).
     - **Recepcionados** (historial de clientes ingresados al laboratorio).
     - Reloj digital de gran tamaño y fecha en tiempo real.

3. **Terminales de Mostrador para Recepcionistas (MacBooks):**
   - **Puesto 1:** `http://localhost:5173/?view=operator&puesto=1`
   - **Puesto 2:** `http://localhost:5173/?view=operator&puesto=2`
   - **Puesto 3:** `http://localhost:5173/?view=operator&puesto=3`
   - Botón *"Llamar Siguiente"*, *"Re-llamar con aviso acústico a la TV"* y *"Finalizar y Recepcionar"*, con panel lateral de fila en vivo.

---

## ⚡ Tecnologías

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Audio:** Web Audio API nativo (Chimes armónicos y feedback acústico táctil sintético sin dependencias pesadas).
- **Nube:** Google Firebase SDK (Cloud Firestore en tiempo real + Firebase Hosting `cistec-totem.web.app`).
- **Respaldo Offline:** BroadcastChannel API + LocalStorage + SSE stream en red local Wi-Fi.

---

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

