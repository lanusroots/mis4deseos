import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ItemList } from "../ItemList/ItemList"
import { getProducts, getCategories } from "../../services/products"
import "./ItemListContainer.css"

const SIZE_OPTIONS = ["Chica", "Grande", "Docena", "Individual"]

const SORT_OPTIONS = [
  { value: "featured",      label: "Destacados" },
  { value: "price-asc",    label: "Menor precio" },
  { value: "price-desc",   label: "Mayor precio" },
  { value: "best-selling", label: "Más vendidos" },
  { value: "name-asc",     label: "A → Z" },
  { value: "name-desc",    label: "Z → A" },
]

export const ItemListContainer = () => {
  const [products, setProducts]       = useState([])
  const [categories, setCategories]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState("")

  // Modales mobile
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [sortModalOpen, setSortModalOpen]     = useState(false)

  // Acordeón dentro del modal de filtros
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [sizeOpen, setSizeOpen]         = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const searchQuery      = searchParams.get("search")   || ""
  const selectedCategory = searchParams.get("category") || "Todos"
  const selectedSort     = searchParams.get("sort")     || "featured"
  const selectedSizes    = searchParams.get("sizes")?.split(",").filter(Boolean) || []

  const setParam = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (!value || value === "Todos" || value === "featured" || value === "") {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      return next
    })
  }

  const toggleSize = (size) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size]
    setParam("sizes", next.join(","))
  }

  const clearFilters = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete("sort")
      next.delete("sizes")
      next.delete("category")
      return next
    })
  }

  // Cuenta filtros activos para el badge (categoría + tamaños, sort no cuenta como "filtro")
  const activeFilterCount =
    (selectedCategory !== "Todos" ? 1 : 0) + selectedSizes.length

  const hasActiveFilters =
    selectedSort !== "featured" ||
    selectedSizes.length > 0 ||
    selectedCategory !== "Todos"

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === selectedSort)?.label

  // Bloquear scroll del body cuando hay un modal abierto
  useEffect(() => {
    document.body.style.overflow = (filterModalOpen || sortModalOpen) ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [filterModalOpen, sortModalOpen])

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError("")
    getProducts(
      selectedCategory,
      searchQuery,
      { sort: selectedSort, sizes: selectedSizes }
    )
      .then(res => setProducts(res.data))
      .catch(() => setError("No se pudieron cargar los productos"))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, selectedSort, searchParams.get("sizes")])

  return (
    <section className="products-section">
      <h1 className="products-title">
        {searchQuery ? `Resultados para "${searchQuery}"` : "Nuestros Productos"}
      </h1>

      {/* Categorías — solo visible en desktop */}
      {!searchQuery && (
        <nav className="category-filter">
          {["Todos", ...categories].map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setParam("category", cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      )}

      {/* Barra de acciones mobile — Filtrar + Ordenar por */}
      <div className="mobile-actions-bar">
        <button
          className="mobile-action-btn"
          onClick={() => setFilterModalOpen(true)}
        >
          <i className="fa-solid fa-sliders" aria-hidden="true" />
          Filtrar
          {activeFilterCount > 0 && (
            <span className="mobile-action-badge">{activeFilterCount}</span>
          )}
        </button>

        <button
          className="mobile-action-btn mobile-action-btn--sort"
          onClick={() => setSortModalOpen(true)}
        >
          <i className="fa-solid fa-arrow-up-wide-short" aria-hidden="true" />
          <span className="mobile-action-sort-text">
            <span className="mobile-action-sort-label">Ordenar por</span>
            <span className="mobile-action-sort-value">{currentSortLabel}</span>
          </span>
        </button>
      </div>

      <div className="products-layout">

        {/* ── Sidebar desktop ── */}
        <aside className="filters-sidebar">
          <p className="filters-title">Filtros</p>

          <div className="filter-group">
            <p className="filter-label">
              <i className="fa-solid fa-arrow-up-wide-short" aria-hidden="true" />
              Ordenar por
            </p>
            <select
              className="filter-select"
              value={selectedSort}
              onChange={e => setParam("sort", e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <hr className="filter-divider" />

          <div className="filter-group">
            <p className="filter-label">
              <i className="fa-solid fa-ruler" aria-hidden="true" />
              Tamaño
            </p>
            <div className="size-options">
              {SIZE_OPTIONS.map(size => (
                <label key={size} className="size-option">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                  />
                  <span className="size-chip">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <>
              <hr className="filter-divider" />
              <button className="clear-filters-btn" onClick={clearFilters}>
                <i className="fa-solid fa-xmark" aria-hidden="true" />
                Limpiar filtros
              </button>
            </>
          )}
        </aside>

        {/* ── Grilla ── */}
        <div className="products-content">
          {loading && <p className="loading-text">Cargando productos...</p>}
          {error   && <p className="loading-text">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="loading-text">No se encontraron productos</p>
          )}
          {!loading && !error && products.length > 0 && (
            <>
              <p className="products-count">{products.length} producto{products.length !== 1 ? "s" : ""}</p>
              <ItemList list={products} />
            </>
          )}
        </div>

      </div>

      {/* ── Modal: Filtrar (mobile) ── */}
      {filterModalOpen && (
        <>
          <div className="modal-overlay" onClick={() => setFilterModalOpen(false)} />
          <div className="modal-sheet modal-sheet--drawer">
            <div className="modal-header">
              <h2>Filtrar por</h2>
              <button className="modal-close" onClick={() => setFilterModalOpen(false)} aria-label="Cerrar">
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">
              {/* Acordeón Categoría */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => setCategoryOpen(o => !o)}
                  aria-expanded={categoryOpen}
                >
                  Categoría
                  <i className={`fa-solid fa-chevron-down accordion-chevron ${categoryOpen ? "open" : ""}`} aria-hidden="true" />
                </button>
                {categoryOpen && (
                  <div className="accordion-content">
                    {["Todos", ...categories].map(cat => (
                      <label key={cat} className="modal-checkbox-row">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setParam("category", cat)}
                        />
                        <span className="modal-checkbox-fake" />
                        {cat}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Acordeón Tamaño */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => setSizeOpen(o => !o)}
                  aria-expanded={sizeOpen}
                >
                  Tamaño
                  <i className={`fa-solid fa-chevron-down accordion-chevron ${sizeOpen ? "open" : ""}`} aria-hidden="true" />
                </button>
                {sizeOpen && (
                  <div className="accordion-content">
                    {SIZE_OPTIONS.map(size => (
                      <label key={size} className="modal-checkbox-row">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => toggleSize(size)}
                        />
                        <span className="modal-checkbox-fake modal-checkbox-fake--square" />
                        {size}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn-secondary" onClick={clearFilters}>
                Limpiar
              </button>
              <button className="modal-btn-primary" onClick={() => setFilterModalOpen(false)}>
                Aplicar{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Modal: Ordenar por (mobile) ── */}
      {sortModalOpen && (
        <>
          <div className="modal-overlay" onClick={() => setSortModalOpen(false)} />
          <div className="modal-sheet">
            <div className="modal-header">
              <h2>Ordenar por</h2>
              <button className="modal-close" onClick={() => setSortModalOpen(false)} aria-label="Cerrar">
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">
              {SORT_OPTIONS.map(o => (
                <label key={o.value} className="modal-checkbox-row">
                  <input
                    type="radio"
                    name="sort"
                    checked={selectedSort === o.value}
                    onChange={() => {
                      setParam("sort", o.value)
                      setSortModalOpen(false)
                    }}
                  />
                  <span className="modal-checkbox-fake" />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

    </section>
  )
}