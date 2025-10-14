import React, { useState, useEffect } from 'react';
import { AlertCircle, Upload, LogOut, User, Mail, Phone, BookOpen, Hash, MapPin, Droplet, Calendar, Settings } from 'lucide-react';
import ConfirmModal from '../src/components/ConfirmModal/ConfirmModal';

const API_URL = 'https://idbackend-production.up.railway.app';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [students, setStudents] = useState([]);
  const [collegeInfo, setCollegeInfo] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchStudents();
      fetchCollegeInfo();
    }
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    fetchCollegeInfo();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCollegeInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/college-info`);
      if (response.ok) {
        const data = await response.json();
        setCollegeInfo(data);
      }
    } catch (error) {
      console.error('Error fetching college info:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAdmin(false);
    setStudents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isAdmin ? (
        <HomePage 
          setToken={setToken} 
          setIsAdmin={setIsAdmin} 
          collegeInfo={collegeInfo}
        />
      ) : (
        <AdminDashboard 
          students={students} 
          fetchStudents={fetchStudents} 
          handleLogout={handleLogout}
          token={token}
          collegeInfo={collegeInfo}
          fetchCollegeInfo={fetchCollegeInfo}
        />
      )}
    </div>
  );
}

function HomePage({ setToken, setIsAdmin, collegeInfo }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            {collegeInfo?.name || 'ID Card System'}
          </h1>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Admin Logins
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <StudentForm collegeInfo={collegeInfo} />
      </main>

      {showLogin && (
        <LoginModal 
          setShowLogin={setShowLogin} 
          setToken={setToken} 
          setIsAdmin={setIsAdmin} 
        />
      )}
    </div>
  );
}

function StudentForm({ collegeInfo }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    department: '',
    address: '',
    bloodGroup: '',
    validity: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const confirmSubmission = async () => {
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('image', image);

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Registration successful!');
        setFormData({ name: '', email: '', phone: '', rollNumber: '', department: '', address: '', bloodGroup: '', validity: '' });
        setImage(null);
        setPreview(null);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setShowConfirm(true);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h2>
        <p className="text-gray-600 mb-8">Fill in your details to register for your ID card</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* === Name === */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline mr-2" size={16} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* === Email & Phone === */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline mr-2" size={16} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline mr-2" size={16} />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* === Roll Number & Department === */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline mr-2" size={16} />
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline mr-2" size={16} />
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* === Address === */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline mr-2" size={16} />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* === Blood & Validity === */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Droplet className="inline mr-2" size={16} />
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Validity (e.g., 2022-2025)
              </label>
              <input
                type="text"
                name="validity"
                value={formData.validity}
                onChange={handleChange}
                required
                placeholder="2022-2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* === Image Upload === */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline mr-2" size={16} />
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold text-lg"
          >
            Submit Registration
          </button>
        </form>
      </div>

      {(formData.name || preview) && (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Live ID Card Preview
          </h3>
          <IDCardPreview
            student={{
              ...formData,
              image: preview
            }}
            collegeInfo={collegeInfo}
          />
        </div>
      )}

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmSubmission}
        formData={formData}
      />
    </div>
  );
}

// ===== Keep your IDCardPreview, LoginModal, AdminDashboard, CollegeSettingsModal unchanged =====

function IDCardPreview({ student, idCardUrl, collegeInfo }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden" style={{ width: '400px' }}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          {collegeInfo?.logo && (
            <img 
              src={`${API_URL.replace('/api', '')}/uploads/logos/${collegeInfo.logo}`}
              alt="College Logo" 
              className="w-12 h-12 object-contain bg-white rounded-full p-1"
            />
          )}
          <div className="flex-1 text-center">
            <h3 className="text-sm font-bold uppercase">
              {collegeInfo?.name || 'INSTITUTE OF TECHNOLOGY'}
            </h3>
            <p className="text-xs">Student ID Card</p>
          </div>
          {collegeInfo?.logo && <div className="w-12"></div>}
        </div>
        {collegeInfo?.address && (
          <p className="text-xs text-center">{collegeInfo.address}</p>
        )}
      </div>

      <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {idCardUrl ? (
              <img
                src={idCardUrl}
                alt="Student"
                className="w-32 h-40 object-cover rounded-lg border-4 border-blue-600"
              />
            ) : student.image ? (
              <img
                src={student.image}
                alt="Student"
                className="w-32 h-40 object-cover rounded-lg border-4 border-blue-600"
              />
            ) : (
              <div className="w-32 h-40 bg-gray-200 rounded-lg border-4 border-blue-600 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <p className="text-xs text-gray-500 font-medium">Name</p>
              <p className="font-bold text-blue-900 uppercase">{student.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Branch</p>
              <p className="font-semibold text-gray-800">{student.department || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Validity</p>
              <p className="font-semibold text-gray-800">{student.validity || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">USN No</p>
              <p className="font-semibold text-gray-800">{student.rollNumber || '-'}</p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="bg-red-100 border-2 border-red-500 rounded-lg p-2 text-center">
              <Droplet className="text-red-600 mx-auto mb-1" size={20} />
              <p className="text-red-600 font-bold text-lg">{student.bloodGroup || '-'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
          <p className="text-sm"><strong>Contact:</strong> {student.phone || '-'}</p>
          <p className="text-sm"><strong>Address:</strong> {student.address || '-'}</p>
        </div>
      </div>

      <div className="bg-blue-800 text-white text-center py-2">
        <p className="text-xs">Authorized Signature</p>
      </div>
    </div>
  );
}

function LoginModal({ setShowLogin, setToken, setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setIsAdmin(true);
        setShowLogin(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Login</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ students, fetchStudents, handleLogout, token, collegeInfo, fetchCollegeInfo }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [idCardFile, setIdCardFile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleIdCardUpload = async (studentId) => {
    if (!idCardFile) return;

    const formData = new FormData();
    formData.append('idcard', idCardFile);

    try {
      const response = await fetch(`${API_URL}/students/${studentId}/idcard`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('ID Card uploaded successfully');
        setIdCardFile(null);
        setSelectedStudent(null);
        fetchStudents();
      }
    } catch (error) {
      alert('Error uploading ID card');
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`${API_URL}/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Student deleted successfully');
        fetchStudents();
      }
    } catch (error) {
      alert('Error deleting student');
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Settings size={20} />
              College Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Registered Students ({students.length})
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {students.map((student) => (
            <div key={student._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{student.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Phone:</strong> {student.phone}</p>
                    <p><strong>Roll No:</strong> {student.rollNumber}</p>
                    <p><strong>Department:</strong> {student.department}</p>
                    <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
                    <p><strong>Validity:</strong> {student.validity}</p>
                    <p><strong>Address:</strong> {student.address}</p>
                  </div>

                  {student.idCardImage ? (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-green-600 mb-2">✓ ID Card Uploaded</p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      {selectedStudent === student._id ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setIdCardFile(e.target.files[0])}
                            className="w-full text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleIdCardUpload(student._id)}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
                            >
                              Upload
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudent(null);
                                setIdCardFile(null);
                              }}
                              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedStudent(student._id)}
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                        >
                          <Upload size={18} />
                          Upload ID Card Image
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(student._id)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete Student
                  </button>
                </div>

                <div className="flex-shrink-0">
                  <IDCardPreview
                    student={student}
                    idCardUrl={student.idCardImage ? `${API_URL.replace('/api', '')}/uploads/idcards/${student.idCardImage}` : `${API_URL.replace('/api', '')}/uploads/students/${student.image}`}
                    collegeInfo={collegeInfo}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No students registered yet.
          </div>
        )}
      </main>

      {showSettings && (
        <CollegeSettingsModal
          setShowSettings={setShowSettings}
          token={token}
          collegeInfo={collegeInfo}
          fetchCollegeInfo={fetchCollegeInfo}
        />
      )}
    </div>
  );
}

function CollegeSettingsModal({ setShowSettings, token, collegeInfo, fetchCollegeInfo }) {
  const [formData, setFormData] = useState({
    name: collegeInfo?.name || '',
    address: collegeInfo?.address || ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('address', formData.address);
    if (logoFile) {
      data.append('logo', logoFile);
    }

    try {
      const response = await fetch(`${API_URL}/college-info`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('College information updated successfully!');
        fetchCollegeInfo();
        setTimeout(() => setShowSettings(false), 2000);
      } else {
        setError(result.message || 'Update failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">College Settings</h2>
        
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {collegeInfo?.logo && !logoFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Current Logo:</p>
                <img 
                  src={`${API_URL.replace('/api', '')}/uploads/logos/${collegeInfo.logo}`}
                  alt="Current Logo"
                  className="w-20 h-20 object-contain border rounded"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default App;
