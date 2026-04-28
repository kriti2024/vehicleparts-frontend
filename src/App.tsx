import { useEffect, useMemo, useState } from 'react'
import './App.css'

type View = 'parts' | 'vendors' | 'purchases'

type Vendor = {
  vendorId: number
  vendorName: string
  phone?: string | null
  address?: string | null
}

type Part = {
  partId: number
  partName: string
  price: number
  stockQuantity: number
  vendorId: number
  vendorName?: string | null
}

type PurchaseInvoiceItem = {
  purchaseInvoiceItemId: number
  partId: number
  partName?: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
}

type PurchaseInvoice = {
  purchaseInvoiceId: number
  vendorId: number
  vendorName?: string | null
  purchaseDate: string
  totalAmount: number
  items: PurchaseInvoiceItem[]
}

type NotificationItem = {
  notificationId: number
  message: string
  isRead?: boolean
  createdAt?: string
}

type PartFormState = {
  partName: string
  price: string
  stockQuantity: string
  vendorId: string
}

type VendorFormState = {
  vendorName: string
  phone: string
  address: string
}

type PurchaseItemForm = {
  partId: string
  quantity: string
  unitPrice: string
}

type PurchaseFormState = {
  vendorId: string
  purchaseDate: string
  items: PurchaseItemForm[]
}

const API_BASE = 'https://localhost:7117/api'

const createEmptyPartForm = (): PartFormState => ({
  partName: '',
  price: '',
  stockQuantity: '',
  vendorId: '',
})

const createEmptyVendorForm = (): VendorFormState => ({
  vendorName: '',
  phone: '',
  address: '',
})

const createEmptyInvoice = (): PurchaseFormState => ({
  vendorId: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  items: [{ partId: '', quantity: '1', unitPrice: '' }],
})

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const errorBody = await response.json()
      if (typeof errorBody === 'string') {
        message = errorBody
      } else if (errorBody?.title) {
        message = errorBody.title
      }
    } catch {
      const text = await response.text()
      if (text) {
        message = text
      }
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data: unknown) =>
    request<void>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-hint">{hint}</span>
    </div>
  )
}

function PartsManager({
  parts,
  vendors,
  loading,
  onRefresh,
  onShowMessage,
}: {
  parts: Part[]
  vendors: Vendor[]
  loading: boolean
  onRefresh: () => Promise<void>
  onShowMessage: (message: string, type?: 'success' | 'error') => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [editingPart, setEditingPart] = useState<Part | null>(null)
  const [form, setForm] = useState<PartFormState>(createEmptyPartForm())
  const [submitting, setSubmitting] = useState(false)

  const lowStockCount = useMemo(
    () => parts.filter((part) => part.stockQuantity < 10).length,
    [parts],
  )

  const resetForm = () => {
    setForm(createEmptyPartForm())
    setEditingPart(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (part: Part) => {
    setEditingPart(part)
    setForm({
      partName: part.partName,
      price: String(part.price),
      stockQuantity: String(part.stockQuantity),
      vendorId: String(part.vendorId),
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const validateForm = () => {
    if (!form.partName.trim()) return 'Part name is required.'
    if (!form.vendorId) return 'Please select a vendor.'
    if (Number(form.price) <= 0) return 'Price must be greater than 0.'
    if (Number(form.stockQuantity) < 0) return 'Stock cannot be negative.'
    return null
  }

  const handleSubmit = async () => {
    const validationMessage = validateForm()
    if (validationMessage) {
      onShowMessage(validationMessage, 'error')
      return
    }

    const payload = {
      partName: form.partName.trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      vendorId: Number(form.vendorId),
    }

    try {
      setSubmitting(true)

      if (editingPart) {
        await api.put(`/Part/${editingPart.partId}`, {
          partId: editingPart.partId,
          ...payload,
        })
        onShowMessage('Part updated successfully.')
      } else {
        await api.post<Part>('/Part', payload)
        onShowMessage('Part created successfully.')
      }

      closeModal()
      await onRefresh()
    } catch (error) {
      onShowMessage(
        error instanceof Error ? error.message : 'Unable to save part.',
        'error',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (part: Part) => {
    if (!window.confirm(`Delete "${part.partName}"?`)) return

    try {
      await api.delete(`/Part/${part.partId}`)
      onShowMessage('Part deleted successfully.')
      await onRefresh()
    } catch (error) {
      onShowMessage(
        error instanceof Error ? error.message : 'Unable to delete part.',
        'error',
      )
    }
  }

  return (
    <section className="feature-section">
      <div className="section-header">
        <div>
          <h2>Parts Management</h2>
          <p className="section-subtitle">
            Deliverable Feature 3: create, edit, delete and monitor stock levels.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          Add Part
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Parts" value={String(parts.length)} hint="Current catalog items" />
        <StatCard label="Low Stock" value={String(lowStockCount)} hint="Items below 10 units" />
        <StatCard label="Suppliers Used" value={String(vendors.length)} hint="Linked vendors" />
      </div>

      <div className="card">
        {loading ? (
          <p className="empty-state">Loading parts...</p>
        ) : parts.length === 0 ? (
          <p className="empty-state">No parts found. Add your first inventory item.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part) => (
                  <tr key={part.partId}>
                    <td>{part.partName}</td>
                    <td>{part.vendorName || 'N/A'}</td>
                    <td>${part.price.toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          part.stockQuantity < 10 ? 'badge-warning' : 'badge-success'
                        }`}
                      >
                        {part.stockQuantity}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="btn btn-secondary" onClick={() => openEditModal(part)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(part)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingPart ? 'Edit Part' : 'Add New Part'}</h3>
              <button className="icon-btn" onClick={closeModal}>
                x
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="partName">Part Name</label>
              <input
                id="partName"
                type="text"
                value={form.partName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, partName: event.target.value }))
                }
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="partPrice">Price</label>
                <input
                  id="partPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="partStock">Stock Quantity</label>
                <input
                  id="partStock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stockQuantity: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="partVendor">Vendor</label>
              <select
                id="partVendor"
                value={form.vendorId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, vendorId: event.target.value }))
                }
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.vendorId} value={vendor.vendorId}>
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : editingPart ? 'Update Part' : 'Create Part'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function VendorManager({
  vendors,
  loading,
  onRefresh,
  onShowMessage,
}: {
  vendors: Vendor[]
  loading: boolean
  onRefresh: () => Promise<void>
  onShowMessage: (message: string, type?: 'success' | 'error') => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [form, setForm] = useState<VendorFormState>(createEmptyVendorForm())
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setForm(createEmptyVendorForm())
    setEditingVendor(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setForm({
      vendorName: vendor.vendorName,
      phone: vendor.phone ?? '',
      address: vendor.address ?? '',
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleSubmit = async () => {
    if (!form.vendorName.trim()) {
      onShowMessage('Vendor name is required.', 'error')
      return
    }

    const payload = {
      vendorName: form.vendorName.trim(),
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
    }

    try {
      setSubmitting(true)

      if (editingVendor) {
        await api.put(`/Vendor/${editingVendor.vendorId}`, {
          vendorId: editingVendor.vendorId,
          ...payload,
        })
        onShowMessage('Vendor updated successfully.')
      } else {
        await api.post<Vendor>('/Vendor', payload)
        onShowMessage('Vendor created successfully.')
      }

      closeModal()
      await onRefresh()
    } catch (error) {
      onShowMessage(
        error instanceof Error ? error.message : 'Unable to save vendor.',
        'error',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (vendor: Vendor) => {
    if (!window.confirm(`Delete vendor "${vendor.vendorName}"?`)) return

    try {
      await api.delete(`/Vendor/${vendor.vendorId}`)
      onShowMessage('Vendor deleted successfully.')
      await onRefresh()
    } catch (error) {
      onShowMessage(
        error instanceof Error ? error.message : 'Unable to delete vendor.',
        'error',
      )
    }
  }

  return (
    <section className="feature-section">
      <div className="section-header">
        <div>
          <h2>Vendor Management</h2>
          <p className="section-subtitle">
            Deliverable Feature 5: manage supplier records with full CRUD support.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          Add Vendor
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p className="empty-state">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <p className="empty-state">No vendors found. Add supplier details to continue.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.vendorId}>
                    <td>{vendor.vendorName}</td>
                    <td>{vendor.phone || '-'}</td>
                    <td>{vendor.address || '-'}</td>
                    <td className="actions-cell">
                      <button className="btn btn-secondary" onClick={() => openEditModal(vendor)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(vendor)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingVendor ? 'Edit Vendor' : 'Add Vendor'}</h3>
              <button className="icon-btn" onClick={closeModal}>
                x
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="vendorName">Vendor Name</label>
              <input
                id="vendorName"
                type="text"
                value={form.vendorName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, vendorName: event.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="vendorPhone">Phone</label>
              <input
                id="vendorPhone"
                type="text"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="vendorAddress">Address</label>
              <textarea
                id="vendorAddress"
                rows={3}
                value={form.address}
                onChange={(event) =>
                  setForm((current) => ({ ...current, address: event.target.value }))
                }
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : editingVendor ? 'Update Vendor' : 'Create Vendor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function PurchaseInvoiceManager({
  invoices,
  vendors,
  parts,
  loading,
  onRefresh,
  onShowMessage,
}: {
  invoices: PurchaseInvoice[]
  vendors: Vendor[]
  parts: Part[]
  loading: boolean
  onRefresh: () => Promise<void>
  onShowMessage: (message: string, type?: 'success' | 'error') => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<PurchaseFormState>(createEmptyInvoice())
  const [submitting, setSubmitting] = useState(false)

  const totalValue = useMemo(
    () =>
      form.items.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 0
        const unitPrice = Number(item.unitPrice) || 0
        return sum + quantity * unitPrice
      }, 0),
    [form.items],
  )

  const closeModal = () => {
    setShowModal(false)
    setForm(createEmptyInvoice())
  }

  const updateItem = (index: number, field: keyof PurchaseItemForm, value: string) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItemRow = () => {
    setForm((current) => ({
      ...current,
      items: [...current.items, { partId: '', quantity: '1', unitPrice: '' }],
    }))
  }

  const removeItemRow = (index: number) => {
    setForm((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleCreate = async () => {
    if (!form.vendorId) {
      onShowMessage('Please select a vendor.', 'error')
      return
    }

    if (form.items.length === 0) {
      onShowMessage('At least one invoice item is required.', 'error')
      return
    }

    const invalidItem = form.items.some(
      (item) =>
        !item.partId || Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0,
    )

    if (invalidItem) {
      onShowMessage('Each invoice item must have a part, quantity and unit price.', 'error')
      return
    }

    try {
      setSubmitting(true)
      await api.post<PurchaseInvoice>('/Purchase', {
        vendorId: Number(form.vendorId),
        purchaseDate: form.purchaseDate,
        items: form.items.map((item) => ({
          partId: Number(item.partId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      })
      onShowMessage('Purchase invoice created successfully. Stock should now be updated.')
      closeModal()
      await onRefresh()
    } catch (error) {
      onShowMessage(
        error instanceof Error ? error.message : 'Unable to create purchase invoice.',
        'error',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="feature-section">
      <div className="section-header">
        <div>
          <h2>Purchase Invoices</h2>
          <p className="section-subtitle">
            Deliverable Feature 4: create purchase invoices that increase inventory stock.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Create Invoice
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Invoices"
          value={String(invoices.length)}
          hint="Recorded stock purchases"
        />
        <StatCard
          label="Available Parts"
          value={String(parts.length)}
          hint="Usable in invoice items"
        />
        <StatCard
          label="Invoice Total"
          value={`$${totalValue.toFixed(2)}`}
          hint="Current draft total"
        />
      </div>

      <div className="card">
        {loading ? (
          <p className="empty-state">Loading purchase invoices...</p>
        ) : invoices.length === 0 ? (
          <p className="empty-state">No purchase invoices yet. Create one to update stock.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Vendor</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.purchaseInvoiceId}>
                    <td>#{invoice.purchaseInvoiceId}</td>
                    <td>{invoice.vendorName || 'N/A'}</td>
                    <td>{new Date(invoice.purchaseDate).toLocaleDateString()}</td>
                    <td>{invoice.items.length}</td>
                    <td>${invoice.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3>Create Purchase Invoice</h3>
              <button className="icon-btn" onClick={closeModal}>
                x
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="invoiceVendor">Vendor</label>
                <select
                  id="invoiceVendor"
                  value={form.vendorId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, vendorId: event.target.value }))
                  }
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.vendorId} value={vendor.vendorId}>
                      {vendor.vendorName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                  id="purchaseDate"
                  type="date"
                  value={form.purchaseDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, purchaseDate: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="items-header">
              <h4>Invoice Items</h4>
              <button className="btn btn-secondary" onClick={addItemRow}>
                Add Item Row
              </button>
            </div>

            <div className="invoice-items">
              {form.items.map((item, index) => (
                <div key={`${index}-${item.partId}`} className="invoice-item-row">
                  <select
                    value={item.partId}
                    onChange={(event) => updateItem(index, 'partId', event.target.value)}
                  >
                    <option value="">Select Part</option>
                    {parts.map((part) => (
                      <option key={part.partId} value={part.partId}>
                        {part.partName}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(event) => updateItem(index, 'unitPrice', event.target.value)}
                  />

                  <div className="line-total">
                    ${(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)}
                  </div>

                  <button
                    className="btn btn-danger"
                    onClick={() => removeItemRow(index)}
                    disabled={form.items.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="invoice-summary">
              <span>Calculated Invoice Total</span>
              <strong>${totalValue.toFixed(2)}</strong>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function App() {
  const [view, setView] = useState<View>('parts')
  const [parts, setParts] = useState<Part[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [flashMessage, setFlashMessage] = useState('')
  const [flashType, setFlashType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setFlashType(type)
    setFlashMessage(message)
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setPageError('')

      const [partData, vendorData, invoiceData, notificationData] = await Promise.all([
        api.get<Part[]>('/Part'),
        api.get<Vendor[]>('/Vendor'),
        api.get<PurchaseInvoice[]>('/Purchase'),
        api.get<NotificationItem[]>('/Notification/unread'),
      ])

      setParts(partData)
      setVendors(vendorData)
      setInvoices(invoiceData)
      setNotifications(notificationData)
    } catch (error) {
      setPageError(
        error instanceof Error
          ? `${error.message}. Start the backend API on https://localhost:7117 and try again.`
          : 'Unable to connect to the backend API.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboardData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!flashMessage) return undefined

    const timer = window.setTimeout(() => setFlashMessage(''), 3500)
    return () => window.clearTimeout(timer)
  }, [flashMessage])

  const totalStock = parts.reduce((sum, part) => sum + part.stockQuantity, 0)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">VehicleParts Admin</div>
        <p className="sidebar-note">Coursework scope: Features 3, 4 and 5 only.</p>

        <ul className="nav-links">
          <li
            className={`nav-item ${view === 'parts' ? 'active' : ''}`}
            onClick={() => setView('parts')}
          >
            Parts Management
          </li>
          <li
            className={`nav-item ${view === 'vendors' ? 'active' : ''}`}
            onClick={() => setView('vendors')}
          >
            Vendor Management
          </li>
          <li
            className={`nav-item ${view === 'purchases' ? 'active' : ''}`}
            onClick={() => setView('purchases')}
          >
            Purchase Invoices
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="title">Vehicle Parts Coursework Dashboard</h1>
            <p className="section-subtitle">
              Demonstrates admin-side inventory, vendor and stock-purchase workflows.
            </p>
          </div>

          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => void loadDashboardData()}>
              Refresh Data
            </button>

            <div className="notification-wrapper">
              <button
                className="btn btn-secondary notification-btn"
                onClick={() => setShowNotifications((current) => !current)}
              >
                Notifications
                {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
              </button>

              {showNotifications && (
                <div className="notification-panel card">
                  <h4>Low Stock Alerts</h4>
                  {notifications.length === 0 ? (
                    <p className="empty-state">No unread notifications.</p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.notificationId} className="notification-item">
                        {notification.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <StatCard label="Parts in Stock" value={String(totalStock)} hint="Total units available" />
          <StatCard label="Registered Vendors" value={String(vendors.length)} hint="Active suppliers" />
          <StatCard label="Purchase Invoices" value={String(invoices.length)} hint="Stock update records" />
        </div>

        {pageError && (
          <div className="banner banner-error">
            <strong>Connection Problem:</strong> {pageError}
          </div>
        )}

        {flashMessage && (
          <div className={`banner ${flashType === 'error' ? 'banner-error' : 'banner-success'}`}>
            {flashMessage}
          </div>
        )}

        {view === 'parts' && (
          <PartsManager
            parts={parts}
            vendors={vendors}
            loading={loading}
            onRefresh={loadDashboardData}
            onShowMessage={showMessage}
          />
        )}

        {view === 'vendors' && (
          <VendorManager
            vendors={vendors}
            loading={loading}
            onRefresh={loadDashboardData}
            onShowMessage={showMessage}
          />
        )}

        {view === 'purchases' && (
          <PurchaseInvoiceManager
            invoices={invoices}
            vendors={vendors}
            parts={parts}
            loading={loading}
            onRefresh={loadDashboardData}
            onShowMessage={showMessage}
          />
        )}
      </main>
    </div>
  )
}

export default App
