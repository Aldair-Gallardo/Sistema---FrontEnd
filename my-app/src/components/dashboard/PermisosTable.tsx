"use client";

import { useEffect, useState, useMemo } from "react";
import { App, Button, Table, Modal, Checkbox, Space, Card } from "antd";
import { EditOutlined, SaveOutlined, UndoOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

interface PermissionRow {
  moduleKey: string;
  moduleName: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

type RolePermissionsMatrix = Record<string, PermissionRow[]>;

const DEFAULT_PERMISSIONS: RolePermissionsMatrix = {
  admin: [
    { moduleKey: "catalogo", moduleName: "Catálogo", create: true, read: true, update: true, delete: true },
    { moduleKey: "pedidos", moduleName: "Pedidos", create: true, read: true, update: true, delete: true },
    { moduleKey: "finanzas", moduleName: "Finanzas", create: true, read: true, update: true, delete: true },
    { moduleKey: "usuarios", moduleName: "Usuarios", create: true, read: true, update: true, delete: true },
  ],
  vendedor: [
    { moduleKey: "catalogo", moduleName: "Catálogo", create: false, read: true, update: false, delete: false },
    { moduleKey: "pedidos", moduleName: "Pedidos", create: true, read: true, update: true, delete: true },
    { moduleKey: "finanzas", moduleName: "Finanzas", create: false, read: false, update: false, delete: false },
    { moduleKey: "usuarios", moduleName: "Usuarios", create: false, read: false, update: false, delete: false },
  ],
  encargado: [
    { moduleKey: "catalogo", moduleName: "Catálogo", create: true, read: true, update: true, delete: true },
    { moduleKey: "pedidos", moduleName: "Pedidos", create: true, read: true, update: true, delete: true },
    { moduleKey: "finanzas", moduleName: "Finanzas", create: false, read: false, update: false, delete: false },
    { moduleKey: "usuarios", moduleName: "Usuarios", create: false, read: false, update: false, delete: false },
  ],
  soporte: [
    { moduleKey: "catalogo", moduleName: "Catálogo", create: false, read: false, update: false, delete: false },
    { moduleKey: "pedidos", moduleName: "Pedidos", create: false, read: true, update: false, delete: false },
    { moduleKey: "finanzas", moduleName: "Finanzas", create: false, read: false, update: false, delete: false },
    { moduleKey: "usuarios", moduleName: "Usuarios", create: false, read: false, update: false, delete: false },
  ],
  editor: [
    { moduleKey: "catalogo", moduleName: "Catálogo", create: true, read: true, update: true, delete: true },
    { moduleKey: "pedidos", moduleName: "Pedidos", create: false, read: false, update: false, delete: false },
    { moduleKey: "finanzas", moduleName: "Finanzas", create: false, read: false, update: false, delete: false },
    { moduleKey: "usuarios", moduleName: "Usuarios", create: false, read: false, update: false, delete: false },
  ],
  finanzas: [
    { moduleKey: "catalogo", moduleName: "Catálogo", create: false, read: false, update: false, delete: false },
    { moduleKey: "pedidos", moduleName: "Pedidos", create: false, read: true, update: false, delete: false },
    { moduleKey: "finanzas", moduleName: "Finanzas", create: true, read: true, update: true, delete: true },
    { moduleKey: "usuarios", moduleName: "Usuarios", create: false, read: false, update: false, delete: false },
  ],
};

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "vendedor", label: "Vendedor" },
  { value: "encargado", label: "Encargado" },
  { value: "soporte", label: "Soporte" },
  { value: "editor", label: "Editor" },
  { value: "finanzas", label: "Finanzas" },
];

export function PermisosTable() {
  const { message, modal } = App.useApp();
  const [selectedRole, setSelectedRole] = useState("vendedor");
  const [matrix, setMatrix] = useState<RolePermissionsMatrix | null>(null);
  const [tempMatrix, setTempMatrix] = useState<RolePermissionsMatrix | null>(null);
  
  // Modal de edición
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState<PermissionRow | null>(null);
  const [modalCheckboxes, setModalCheckboxes] = useState({
    create: false,
    read: false,
    update: false,
    delete: false,
  });

  // Cargar matriz inicial
  useEffect(() => {
    const saved = localStorage.getItem("teca_roles_crud_permissions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMatrix(parsed);
        setTempMatrix(JSON.parse(JSON.stringify(parsed))); // copia profunda
      } catch (e) {
        setMatrix(DEFAULT_PERMISSIONS);
        setTempMatrix(JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)));
      }
    } else {
      setMatrix(DEFAULT_PERMISSIONS);
      setTempMatrix(JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)));
    }
  }, []);

  // Comparar matriz temporal con la oficial para habilitar botón de guardar
  const hasChanges = useMemo(() => {
    if (!matrix || !tempMatrix) return false;
    return JSON.stringify(matrix) !== JSON.stringify(tempMatrix);
  }, [matrix, tempMatrix]);

  if (!matrix || !tempMatrix) {
    return <div className="text-center py-12">Cargando matriz de permisos...</div>;
  }

  // Filas para la tabla del rol actualmente seleccionado
  const tableData = tempMatrix[selectedRole] || [];

  const handleEditClick = (row: PermissionRow) => {
    setEditingRow(row);
    setModalCheckboxes({
      create: row.create,
      read: row.read,
      update: row.update,
      delete: row.delete,
    });
    setEditModalVisible(true);
  };

  const handleModalConfirm = () => {
    if (!editingRow) return;

    const updatedRows = tempMatrix[selectedRole].map((r) => {
      if (r.moduleKey === editingRow.moduleKey) {
        return {
          ...r,
          create: modalCheckboxes.create,
          read: modalCheckboxes.read,
          update: modalCheckboxes.update,
          delete: modalCheckboxes.delete,
        };
      }
      return r;
    });

    setTempMatrix({
      ...tempMatrix,
      [selectedRole]: updatedRows,
    });
    setEditModalVisible(false);
    setEditingRow(null);
  };

  const handleRevertChanges = () => {
    setTempMatrix(JSON.parse(JSON.stringify(matrix)));
    message.info("Cambios temporales revertidos");
  };

  const handleSaveChanges = () => {
    modal.confirm({
      title: "¿Guardar cambios de permisos?",
      content: "Esta acción guardará los cambios actuales en la base de datos local y afectará los privilegios del rol en tiempo real.",
      okText: "Guardar",
      cancelText: "Cancelar",
      onOk: () => {
        localStorage.setItem("teca_roles_crud_permissions", JSON.stringify(tempMatrix));
        setMatrix(JSON.parse(JSON.stringify(tempMatrix)));
        message.success("Matriz de permisos actualizada exitosamente");
      },
    });
  };

  const columns = [
    {
      title: "Módulo del Sistema",
      dataIndex: "moduleName",
      key: "moduleName",
      width: "25%",
      render: (text: string) => <strong className="text-gray-800 text-sm">{text}</strong>,
    },
    {
      title: "Permisos CRUD Granulares",
      key: "permissions",
      render: (_: any, record: PermissionRow) => (
        <div className="flex flex-wrap gap-2.5">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 border ${
              record.create
                ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
                : "bg-gray-50 text-gray-450 border-gray-150 opacity-40"
            }`}
          >
            Crear
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 border ${
              record.read
                ? "bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]"
                : "bg-gray-50 text-gray-450 border-gray-150 opacity-40"
            }`}
          >
            Leer
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 border ${
              record.update
                ? "bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]"
                : "bg-gray-50 text-gray-450 border-gray-150 opacity-40"
            }`}
          >
            Editar
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 border ${
              record.delete
                ? "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]"
                : "bg-gray-50 text-gray-450 border-gray-150 opacity-40"
            }`}
          >
            Eliminar
          </span>
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      width: "15%",
      align: "center" as const,
      render: (_: any, record: PermissionRow) => (
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined className="text-[#6F4E37] text-base hover:scale-110 transition-transform" />}
          onClick={() => handleEditClick(record)}
          disabled={selectedRole === "admin"}
          title={selectedRole === "admin" ? "Los permisos del Administrador no son modificables" : "Editar permisos"}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#3E2723] flex items-center gap-2">
            <SafetyCertificateOutlined className="text-[#6F4E37]" /> Gestión de Roles y Permisos
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Controla granularmente los privilegios de Crear, Leer, Editar y Eliminar por módulo del sistema.
          </p>
        </div>
      </div>

      {/* Pill buttons para selección de rol */}
      <div className="bg-white border border-[#E6DFDB] rounded-xl p-5 shadow-sm">
        <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wider">
          Selecciona un rol para ver y configurar:
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
                selectedRole === role.value
                  ? "bg-[#6F4E37] text-white border-[#6F4E37] shadow-md scale-105"
                  : "bg-white text-gray-700 border-gray-250 hover:border-[#6F4E37] hover:text-[#6F4E37]"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de módulos */}
      <Card className="shadow-sm border border-[#E6DFDB] rounded-xl overflow-hidden bg-white">
        <Table
          dataSource={tableData}
          columns={columns}
          rowKey="moduleKey"
          pagination={false}
          className="[&_.ant-table-thead_th]:!bg-[#FAF8F5] [&_.ant-table-thead_th]:!text-[#3E2723] [&_.ant-table-thead_th]:!font-bold"
        />

        {selectedRole === "admin" && (
          <div className="p-4 bg-amber-50 text-amber-800 border-t border-amber-200 text-xs">
            💡 El rol **Administrador** posee acceso total a todos los recursos del sistema de forma obligatoria y sus permisos no son editables.
          </div>
        )}
      </Card>

      {/* Botones de acción general (Guardado Explícito) */}
      {hasChanges && (
        <div className="flex justify-end gap-3 bg-[#FFF8F2] border border-[#FFE0B2] rounded-xl p-4 animate-fade-in shadow-sm">
          <Button
            icon={<UndoOutlined />}
            size="large"
            onClick={handleRevertChanges}
            className="rounded-md border-gray-300 text-gray-600 hover:!text-gray-800 hover:!border-gray-400"
          >
            Revertir cambios
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            size="large"
            onClick={handleSaveChanges}
            className="rounded-md !bg-[#6F4E37] !border-[#6F4E37] hover:!bg-[#5A3E2B] hover:!border-[#5A3E2B] font-semibold"
          >
            Guardar cambios
          </Button>
        </div>
      )}

      {/* Modal para la edición de permisos de un módulo */}
      <Modal
        title={`Editar Permisos: ${editingRow?.moduleName || ""}`}
        open={editModalVisible}
        onOk={handleModalConfirm}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingRow(null);
        }}
        okText="Confirmar"
        cancelText="Cancelar"
        okButtonProps={{ className: "!bg-[#6F4E37] !border-[#6F4E37] hover:!bg-[#5A3E2B] hover:!border-[#5A3E2B]" }}
        className="[&_.ant-modal-header]:!mb-6"
      >
        <div className="flex flex-col gap-4 py-2">
          <p className="text-gray-500 text-xs mb-2">
            Edita los accesos de Crear, Leer, Editar y Eliminar del módulo <strong>{editingRow?.moduleName}</strong> para el rol <strong>{ROLES.find(r => r.value === selectedRole)?.label}</strong>:
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-lg p-4 flex items-center justify-between">
              <span className="text-[#2E7D32] font-bold text-xs uppercase">Crear</span>
              <Checkbox
                checked={modalCheckboxes.create}
                onChange={(e) => setModalCheckboxes({ ...modalCheckboxes, create: e.target.checked })}
                className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-[#2E7D32] [&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-[#2E7D32]"
              />
            </div>

            <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-lg p-4 flex items-center justify-between">
              <span className="text-[#1565C0] font-bold text-xs uppercase">Leer</span>
              <Checkbox
                checked={modalCheckboxes.read}
                onChange={(e) => setModalCheckboxes({ ...modalCheckboxes, read: e.target.checked })}
                className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-[#1565C0] [&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-[#1565C0]"
              />
            </div>

            <div className="bg-[#FFF3E0] border border-[#FFE0B2] rounded-lg p-4 flex items-center justify-between">
              <span className="text-[#E65100] font-bold text-xs uppercase">Editar</span>
              <Checkbox
                checked={modalCheckboxes.update}
                onChange={(e) => setModalCheckboxes({ ...modalCheckboxes, update: e.target.checked })}
                className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-[#E65100] [&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-[#E65100]"
              />
            </div>

            <div className="bg-[#FFEBEE] border border-[#FFCDD2] rounded-lg p-4 flex items-center justify-between">
              <span className="text-[#C62828] font-bold text-xs uppercase">Eliminar</span>
              <Checkbox
                checked={modalCheckboxes.delete}
                onChange={(e) => setModalCheckboxes({ ...modalCheckboxes, delete: e.target.checked })}
                className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-[#C62828] [&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-[#C62828]"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
