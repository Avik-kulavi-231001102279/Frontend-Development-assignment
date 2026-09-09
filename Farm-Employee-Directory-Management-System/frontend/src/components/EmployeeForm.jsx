import React, { useState, useEffect } from 'react';
import { addEmployee, editEmployee } from '../services/api';

const initialFormData = {
  name: '',
  department: '',
  gender: 'Male',
  phoneNumber: '',
  localAddress: '',
  permanentAddress: '',
};

const DEPARTMENTS = ['Agriculture', 'Livestock', 'Administration', 'Maintenance'];

const EmployeeForm = ({ employeeToEdit, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [sameAsLocal, setSameAsLocal] = useState(false);

  const isEditMode = Boolean(employeeToEdit);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        department: employeeToEdit.department || '',
        gender: employeeToEdit.gender || 'Male',
        phoneNumber: employeeToEdit.phoneNumber || '',
        localAddress: employeeToEdit.localAddress || '',
        permanentAddress: employeeToEdit.permanentAddress || '',
      });
      if (employeeToEdit.localAddress && employeeToEdit.localAddress === employeeToEdit.permanentAddress) {
        setSameAsLocal(true);
      } else {
        setSameAsLocal(false);
      }
    } else {
      setFormData(initialFormData);
      setSameAsLocal(false);
    }
    setErrors({});
  }, [employeeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If localAddress changes and checkbox is checked, sync permanentAddress
      if (name === 'localAddress' && sameAsLocal) {
        updated.permanentAddress = value;
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAsLocal(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, permanentAddress: prev.localAddress }));
      if (errors.permanentAddress) {
        setErrors((prev) => ({ ...prev, permanentAddress: '' }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.department) newErrors.department = 'Department is required.';
    if (!formData.gender) newErrors.gender = 'Gender is required.';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 numeric digits.';
    }
    if (!formData.localAddress.trim()) newErrors.localAddress = 'Local address is required.';
    if (!formData.permanentAddress.trim()) newErrors.permanentAddress = 'Permanent address is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEditMode) {
        await editEmployee(employeeToEdit._id, formData);
        onSuccess('Employee updated successfully.');
      } else {
        await addEmployee(formData);
        onSuccess('Employee added successfully.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Server error. Please try again.';
      onSuccess(serverMsg, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="employee-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Department */}
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select id="department" name="department" value={formData.department} onChange={handleChange}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <span className="field-error">{errors.department}</span>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="field-error">{errors.gender}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input id="phoneNumber" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" />
            {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
          </div>

          {/* Local Address */}
          <div className="form-group">
            <label htmlFor="localAddress">Local Address *</label>
            <textarea id="localAddress" name="localAddress" value={formData.localAddress} onChange={handleChange} placeholder="Enter local address" rows="2" />
            {errors.localAddress && <span className="field-error">{errors.localAddress}</span>}
          </div>

          {/* Same Address Checkbox */}
          <label className="checkbox-label">
            <input type="checkbox" checked={sameAsLocal} onChange={handleSameAddressChange} />
            Permanent Address is same as Local Address
          </label>

          {/* Permanent Address */}
          <div className="form-group">
            <label htmlFor="permanentAddress">Permanent Address *</label>
            <textarea id="permanentAddress" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Enter permanent address" rows="2" disabled={sameAsLocal} />
            {errors.permanentAddress && <span className="field-error">{errors.permanentAddress}</span>}
          </div>

          {/* Employee ID Display (Edit Mode Only) */}
          {isEditMode && (
            <div className="form-group">
              <label>Employee ID</label>
              <input type="text" value={employeeToEdit.employeeId} disabled />
              <span className="field-hint">Employee ID is automatically managed.</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
