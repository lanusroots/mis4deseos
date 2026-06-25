import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext/useAuthContext";
import { updateProfile } from "../../services/auth";
import { getAllOrders, updateOrderStatus } from "../../services/orders";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/products";
import "./admin.css";

const CATEGORIES = [
  "Especiales",
  "Tartas y Tortas",
  "Pastelería Clásica",
  "Muffins y Cupcakes",
];

const SIZE_OPTIONS = ["Chica", "Grande", "Docena", "Individual"];

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "Especiales",
  imageUrl: "",
};

// Objeto base de tamaños: { Chica: { checked: false, price: "" }, ... }
const EMPTY_SIZES = SIZE_OPTIONS.reduce((acc, size) => {
  acc[size] = { checked: false, price: "" };
  return acc;
}, {});

export const Admin = () => {
  const { user, login, logout } = useAuthContext();
  const navigate = useNavigate();

  // ── Tabs ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("productos");

  // ── Productos ─────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [sizesData, setSizesData] = useState(EMPTY_SIZES);

  // ── Perfil ────────────────────────────────────────────────
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);

  // ── Pedidos ───────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // ── Feedback global ───────────────────────────────────────
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ── Efectos ───────────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []);

  // ── Handlers Productos ────────────────────────────────────
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSizeChecked = (size) => {
    setSizesData((prev) => ({
      ...prev,
      [size]: { ...prev[size], checked: !prev[size].checked },
    }));
  };

  const handleSizePriceChange = (size, value) => {
    setSizesData((prev) => ({
      ...prev,
      [size]: { ...prev[size], price: value },
    }));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl || "",
    });

    // Reconstruir sizesData a partir del array sizes del producto
    const nextSizes = { ...EMPTY_SIZES };
    product.sizes.forEach((s) => {
      nextSizes[s.size] = { checked: true, price: String(s.price) };
    });
    setSizesData(nextSizes);

    clearMessages();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setSizesData(EMPTY_SIZES);
    clearMessages();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: fd },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error?.message || "Error al subir imagen");

      setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Armar el array sizes a partir de los checkboxes tildados
    const sizes = SIZE_OPTIONS
      .filter((size) => sizesData[size].checked)
      .map((size) => ({
        size,
        price: Number(sizesData[size].price),
      }));

    if (sizes.length === 0) {
      setError("Seleccioná al menos un tamaño con su precio");
      return;
    }

    if (sizes.some((s) => !s.price || s.price <= 0)) {
      setError("Todos los tamaños seleccionados necesitan un precio válido");
      return;
    }

    setSaving(true);
    const data = { ...formData, sizes };

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, data);
        setProducts(
          products.map((p) => (p._id === editingProduct._id ? res.data : p)),
        );
        showSuccess("Producto actualizado correctamente");
      } else {
        const res = await createProduct(data);
        setProducts([res.data, ...products]);
        showSuccess("Producto creado correctamente");
      }
      setEditingProduct(null);
      setFormData(EMPTY_FORM);
      setSizesData(EMPTY_SIZES);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    try {
      await deleteProduct(product._id);
      setProducts(products.filter((p) => p._id !== product._id));
      showSuccess("Producto eliminado correctamente");
      if (editingProduct?._id === product._id) handleCancel();
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Handlers Perfil ───────────────────────────────────────
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingProfile(true);
    try {
      const res = await updateProfile({
        name: profileData.name,
        email: profileData.email,
      });
      login(res.data);
      showSuccess("Perfil actualizado correctamente");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoadingProfile(true);
    try {
      const res = await updateProfile({ password: passwordData.newPassword });
      login(res.data);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      showSuccess("Contraseña cambiada correctamente");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta?",
    );
    if (confirmed) {
      logout();
      navigate("/");
    }
  };

  // ── Handlers Pedidos ──────────────────────────────────────
  const fetchOrders = async () => {
    if (orders.length > 0) return;
    setLoadingOrders(true);
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch {
      setError("No se pudieron cargar los pedidos");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o._id === orderId ? res.data : o)));
      showSuccess("Estado actualizado correctamente");
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="admin-container">
      {/* Header con info del admin */}
      <div className="admin-profile-header">
        <div className="admin-profile-avatar">
          <i className="fa-solid fa-user-shield"></i>
        </div>
        <div>
          <h1 className="admin-title">{user?.name}</h1>
          <p className="admin-subtitle">{user?.email}</p>
          <span className="nav__admin-badge">Administrador</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === "productos" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("productos");
            clearMessages();
          }}
        >
          <i className="fa-solid fa-box-open"></i> Productos
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "pedidos" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("pedidos");
            clearMessages();
            fetchOrders();
          }}
        >
          <i className="fa-solid fa-receipt"></i> Pedidos
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "datos" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("datos");
            clearMessages();
          }}
        >
          <i className="fa-solid fa-user-pen"></i> Mis Datos
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("password");
            clearMessages();
          }}
        >
          <i className="fa-solid fa-lock"></i> Contraseña
        </button>
      </div>

      {/* Feedback */}
      <div className="admin-feedback">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>

      {/* ── Tab Productos ── */}
      {activeTab === "productos" && (
        <div className="admin-layout">
          <div className="admin-table-wrapper">
            <h3>Productos ({products.length})</h3>
            {loading ? (
              <p style={{ padding: "1rem" }}>Cargando...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Tamaños / Precios</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="admin-table__img"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>
                        {product.sizes.map((s) => (
                          <p key={s.size} style={{ fontSize: "0.85rem", margin: "2px 0" }}>
                            <strong>{s.size}:</strong> ${s.price.toLocaleString()}
                          </p>
                        ))}
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(product)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="admin-form-wrapper">
            <h3>
              {editingProduct
                ? `Editando: ${editingProduct.name}`
                : "Nuevo Producto"}
            </h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div>
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  required
                  disabled={saving}
                />
              </div>
              <div>
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                  required
                  disabled={saving}
                />
              </div>

              {/* ── Tamaños y precios ── */}
              <div>
                <label>Tamaños y precios</label>
                <div className="admin-sizes-list">
                  {SIZE_OPTIONS.map((size) => (
                    <div key={size} className="admin-size-row">
                      <label className="admin-size-checkbox">
                        <input
                          type="checkbox"
                          checked={sizesData[size].checked}
                          onChange={() => toggleSizeChecked(size)}
                          disabled={saving}
                        />
                        {size}
                      </label>
                      {sizesData[size].checked && (
                        <input
                          type="number"
                          placeholder="Precio"
                          min="0"
                          value={sizesData[size].price}
                          onChange={(e) => handleSizePriceChange(size, e.target.value)}
                          disabled={saving}
                          className="admin-size-price-input"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label>Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={saving}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Imagen</label>
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "8px",
                    }}
                  />
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleImageChange}
                  disabled={saving || uploading}
                  style={{ fontSize: "0.85rem" }}
                />
                {uploading && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#7cc3b8",
                      margin: "6px 0 0",
                    }}
                  >
                    Subiendo imagen...
                  </p>
                )}
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="O pegá una URL externa (https://...)"
                  disabled={saving || uploading}
                  style={{ marginTop: "8px" }}
                />
              </div>
              <div className="admin-form__actions">
                <button
                  type="submit"
                  className="btn-submit-admin"
                  disabled={saving || uploading}
                >
                  {saving
                    ? "Guardando..."
                    : uploading
                      ? "Subiendo imagen..."
                      : editingProduct
                        ? "Guardar cambios"
                        : "Crear producto"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Tab Pedidos ── */}
      {activeTab === "pedidos" && (
        <div className="admin-orders">
          <h3>Todos los Pedidos</h3>
          {loadingOrders ? (
            <p>Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <p className="admin-empty">No hay pedidos aún</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <p style={{ fontWeight: 600 }}>{order.name}</p>
                      <p style={{ fontSize: "0.8rem", color: "#888" }}>
                        {order.phone}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#888" }}>
                        {order.address}
                      </p>
                    </td>
                    <td>
                      {order.items.map((item, i) => (
                        <p key={i} style={{ fontSize: "0.85rem" }}>
                          {item.name} x{item.quantity}
                        </p>
                      ))}
                    </td>
                    <td>${order.total.toLocaleString()}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`order-status-select status-${order.status}`}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="preparing">En preparación</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {new Date(order.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Tab Mis Datos ── */}
      {activeTab === "datos" && (
        <div className="admin-profile-form">
          <form onSubmit={handleUpdateProfile} className="admin-form">
            <h3>Información Personal</h3>
            <div>
              <label>Nombre Completo</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled={loadingProfile}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                disabled={loadingProfile}
              />
            </div>
            <div>
              <label>Miembro desde</label>
              <input
                type="text"
                value={new Date(
                  user?.createdAt || Date.now(),
                ).toLocaleDateString()}
                disabled
                className="disabled-input"
              />
            </div>
            <button
              type="submit"
              className="btn-submit-admin"
              disabled={loadingProfile}
            >
              {loadingProfile ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>

          <div className="danger-zone" style={{ marginTop: "2rem" }}>
            <h4>Zona de Peligro</h4>
            <p>Una vez que elimines tu cuenta, no hay vuelta atrás.</p>
            <button className="btn-danger" onClick={handleDeleteAccount}>
              Eliminar Cuenta
            </button>
          </div>
        </div>
      )}

      {/* ── Tab Contraseña ── */}
      {activeTab === "password" && (
        <div className="admin-profile-form">
          <form onSubmit={handleChangePassword} className="admin-form">
            <h3>Cambiar Contraseña</h3>
            <div>
              <label>Nueva Contraseña</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Mínimo 6 caracteres"
                disabled={loadingProfile}
              />
            </div>
            <div>
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repite la nueva contraseña"
                disabled={loadingProfile}
              />
            </div>
            <button
              type="submit"
              className="btn-submit-admin"
              disabled={loadingProfile}
            >
              {loadingProfile ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};