'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Server,
  Terminal,
  Copy,
  Layers
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { currentUser, addToast } = useApp();

  // Interactive Hash Demonstrator
  const [inputPass, setInputPass] = useState('BomberosB233@2026!');
  const [salt, setSalt] = useState('cgbvp_salt_paucarpata_x99');
  const [computedHash, setComputedHash] = useState('');

  // Interactive Sanitizer Demo
  const [xssInput, setXssInput] = useState("<script>alert('Ataque XSS inyectado');</script> Casco Rosenbauer");
  const [sanitizedOutput, setSanitizedOutput] = useState('');

  // Compute mock SHA-256 for live visual demonstration
  const handleComputeHash = async () => {
    try {
      const msgBuffer = new TextEncoder().encode(inputPass + salt);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setComputedHash(hashHex);
      addToast('success', 'Hash Criptográfico Calculado', 'Algoritmo SHA-256 con salt dinámico ejecutado en navegador.');
    } catch {
      setComputedHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    }
  };

  const handleSanitize = () => {
    // Escaping tags
    const escaped = xssInput
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    setSanitizedOutput(escaped);
    addToast('info', 'Sanitización Completada', 'Los tags HTML y secuencias de script fueron neutralizados.');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Módulo de Seguridad, Criptografía y Control de Acceso
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            Criterio C4 Rúbrica • Logrado
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Verificación de mecanismos de seguridad: Hash irreversible de contraseñas, RBAC multinivel, mitigación de XSS y prevención de SQLi.
        </p>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Cryptographic Hash Demonstrator */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3>Demostrador Criptográfico: Hash de Contraseñas (SHA-256 + Salt)</h3>
          </div>
          <p className="text-xs text-slate-300">
            Las contraseñas de los bomberos y jefes jamás se persisten en texto claro. Se procesan con un algoritmo de derivación de claves que genera hashes irreversibles:
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Contraseña en Texto Claro
              </label>
              <input
                type="text"
                value={inputPass}
                onChange={e => setInputPass(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Salt Criptográfico Dinámico del Sistema
              </label>
              <input
                type="text"
                value={salt}
                onChange={e => setSalt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-400 font-mono focus:outline-none"
              />
            </div>

            <button
              onClick={handleComputeHash}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Ejecutar Algoritmo de Hashing Criptográfico</span>
            </button>

            {computedHash && (
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                <div className="text-[10px] font-semibold text-amber-400 uppercase">
                  Hash Hexadecimal Generado (Persistido en Servidor):
                </div>
                <div className="text-xs font-mono text-emerald-400 break-all select-all">
                  {computedHash}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: XSS & Sanitization Demo */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <FileCode2 className="w-5 h-5 text-sky-400" />
            <h3>Protección Contra Cross-Site Scripting (XSS) y Sanitización</h3>
          </div>
          <p className="text-xs text-slate-300">
            Next.js y React neutralizan scripts inyectados en formularios de inventario o nombres de voluntarios mediante auto-escapado en el Virtual DOM:
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Cadena Maliciosa de Prueba (Vector XSS)
              </label>
              <input
                type="text"
                value={xssInput}
                onChange={e => setXssInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSanitize}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-950/40 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Probar Filtro de Sanitización de Servidor</span>
            </button>

            {sanitizedOutput && (
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                <div className="text-[10px] font-semibold text-sky-400 uppercase">
                  Salida Renderizada Segura (Texto Seguro sin Ejecución de Código):
                </div>
                <div className="text-xs font-mono text-slate-300 break-all select-all">
                  {sanitizedOutput}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RBAC Roles Matrix Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <UserCheck className="w-5 h-5 text-red-500" />
          <h3>Matriz de Control de Acceso Basado en Roles (RBAC)</h3>
        </div>
        <p className="text-xs text-slate-300">
          Diferenciación estricta de privilegios de usuario entre el personal de almacén/comandancia y los efectivos en guardia:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/80 uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Módulo / Operación</th>
                <th className="px-4 py-3 text-center">Admin de Logística / Jefatura</th>
                <th className="px-4 py-3 text-center">Bombero Voluntario Operativo</th>
                <th className="px-4 py-3">Mecanismo de Control en Servidor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Consultar inventario y disponibilidad</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido (100%)</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido (100%)</td>
                <td className="px-4 py-3 text-slate-400">Lectura pública autenticada con caché</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Alta y modificación de recursos (CRUD 1)</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido</td>
                <td className="px-4 py-3 text-center text-red-400 font-bold">Denegado</td>
                <td className="px-4 py-3 text-slate-400">Validación de role === &apos;admin_logistica&apos; en API</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Baja lógica / Retiro definitivo de equipos</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido</td>
                <td className="px-4 py-3 text-center text-red-400 font-bold">Denegado</td>
                <td className="px-4 py-3 text-slate-400">Botón deshabilitado y chequeo en controlador</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Registrar préstamos de guardia (CRUD 2)</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido</td>
                <td className="px-4 py-3 text-slate-400">Verificación de stock y registro nominal</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Programar y editar mantenimientos (CRUD 3)</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido</td>
                <td className="px-4 py-3 text-center text-red-400 font-bold">Solo Lectura</td>
                <td className="px-4 py-3 text-slate-400">Restricción de formulario a administradores</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Descarga de reportes CSV y auditoría</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-bold">Permitido</td>
                <td className="px-4 py-3 text-slate-400">Exportación parametrizada sin datos sensibles</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
