import React, { useEffect, useState } from 'react'
import './ChangePasswordModal.css'

export default function ChangePasswordModal({ visible, onClose, onSubmit, loading, serverError }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})


  
  useEffect(() => {
    if (!visible) return
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setFieldErrors({})
  }, [visible])

  useEffect(() => {
    if (!visible) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [visible, onClose])

  const validateFields = () => {
    const errors = {}

    if (!currentPassword.trim()) {
      errors.currentPassword = 'Current password is required.'
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required.'
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters.'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required.'
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match.'
    }

    setFieldErrors(errors)
    return errors
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    const errors = validateFields()
    if (Object.keys(errors).length) return

    try {
      await onSubmit({ currentPassword, newPassword })
    } catch (error) {
      // error handled by parent through serverError prop
    }
  }

  if (!visible) {
    return null
  }

  return (
    <div className="change-password-modal-backdrop" onClick={onClose}>
      <div className="change-password-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Change Password</h2>
            <p className="modal-copy">Update your password securely in a single step.</p>
          </div>
          <button
            className="modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close change password modal"
          >
            ×
          </button>
        </div>

        <form className="change-password-form" onSubmit={handleFormSubmit} noValidate>
          <div className="form-field">
            <label className="form-label" htmlFor="currentPassword">Current Password</label>
            <div className="password-field">
              <input
                id="currentPassword"
                className="form-input"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword((state) => !state)}
              >
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldErrors.currentPassword && <p className="field-error">{fieldErrors.currentPassword}</p>}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="newPassword">New Password</label>
            <div className="password-field">
              <input
                id="newPassword"
                className="form-input"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword((state) => !state)}
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldErrors.newPassword && <p className="field-error">{fieldErrors.newPassword}</p>}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-field">
              <input
                id="confirmPassword"
                className="form-input"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((state) => !state)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword}</p>}
          </div>

          {serverError && <p className="server-error">{serverError}</p>}

          <div className="modal-actions">
            <button className="modal-button modal-button--secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-button modal-button--primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
