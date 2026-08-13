// src/components/producto/ResenaModal.tsx
'use client';

import { useState } from 'react';
import { App, Button, Input, Modal, Rate } from 'antd';
import { crearResena } from '@/lib/api/resenas';
import type { Resena } from '@/types/resena';

const MAX_COMENTARIO = 500;

interface ResenaModalProps {
  productoId: string;
  productoNombre: string;
  open: boolean;
  onClose: () => void;
  onPublicada: (resena: Resena) => void;
}

export function ResenaModal({ productoId, productoNombre, open, onClose, onPublicada }: ResenaModalProps) {
  const { message } = App.useApp();
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  function handleCerrar() {
    if (enviando) return;
    setCalificacion(0);
    setComentario('');
    onClose();
  }

  async function handlePublicar() {
    if (calificacion === 0) {
      message.error('Selecciona una calificación');
      return;
    }
    setEnviando(true);
    try {
      const resena = await crearResena(productoId, { calificacion, comentario });
      message.success('Reseña publicada');
      onPublicada(resena);
      setCalificacion(0);
      setComentario('');
      onClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'No se pudo publicar la reseña');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal open={open} onCancel={handleCerrar} footer={null} title="Escribir mi reseña" destroyOnHidden>
      <p style={{ color: '#756b63', marginTop: -4, marginBottom: 20 }}>{productoNombre}</p>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Tu calificación</p>
        <Rate value={calificacion} onChange={setCalificacion} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Tu comentario</p>
        <Input.TextArea
          rows={4}
          maxLength={MAX_COMENTARIO}
          showCount
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe cómo te fue con este producto y qué te pareció la calidad"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button
          type="primary"
          block
          loading={enviando}
          onClick={handlePublicar}
          style={{ background: '#6F4E37', borderColor: '#6F4E37' }}
        >
          Publicar reseña
        </Button>
        <Button block onClick={handleCerrar} disabled={enviando}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
