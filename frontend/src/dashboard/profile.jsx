import { Camera, CheckCircle, User2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api, storeUser } from "../lib/api";

export default function Profile() {
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const dateLimits = useMemo(() => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() - 18);

    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - 100);

    return {
      min: minDate.toISOString().slice(0, 10),
      max: maxDate.toISOString().slice(0, 10),
    };
  }, []);

  useEffect(() => {
    api.getMe().then(({ user }) => {
      setUser(user);
      setProfile(user.profile || {});
    }).catch((err) => setError(err.message));
  }, []);

  const handleChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = async () => {
    setError("");
    try {
      if (profile.dob && !isAgeBetween18And100(profile.dob)) {
        setError("Age must be between 18 and 100 years");
        return;
      }

      const { user: updatedUser } = await api.updateProfile(profile);
      setUser(updatedUser);
      setProfile(updatedUser.profile || {});
      storeUser(updatedUser);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadAvatar = async (file) => {
    if (!file) return;

    setError("");
    setUploadingAvatar(true);
    try {
      const { user: updatedUser } = await api.uploadAvatar(file);
      setUser(updatedUser);
      setProfile(updatedUser.profile || {});
      storeUser(updatedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8ee] px-8 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Page Title
       <div className="mb-8">
  <h1 className="text-3xl font-bold">Profile</h1>
  <p className="text-gray-600 text-sm">
    View all your profile details here.
  </p>
</div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">

            <h2 className="text-xl font-semibold mb-1">
              {user?.username || "User"}
            </h2>
            <span className="text-green-600 text-sm mb-6">
              {user?.email || ""}
            </span>

            <div className="w-56 h-56 rounded-full border-4 border-gray-200 overflow-hidden bg-[#f3f1ea] flex items-center justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <User2 size={72} />
                  <span className="mt-2 text-sm">No profile image</span>
                </div>
              )}
            </div>

            {editing && (
              <div className="mt-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => uploadAvatar(e.target.files?.[0])}
                />
                <button
                  type="button"
                  disabled={uploadingAvatar}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  <Camera size={16} />
                  {uploadingAvatar ? "Uploading..." : "Upload Image"}
                </button>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG or WebP. 2MB max.
                </p>
              </div>
            )}

          </div>

          {/* RIGHT CARD */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                Bio & other details
              </h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => (editing ? saveProfile() : setEditing(true))}
                  className="px-4 py-2 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800 transition"
                >
                  {editing ? "Save" : "Edit"}
                </button>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-sm">

              <LockedDetail label="Username" value={user?.username || ""} />
              <LockedDetail label="Email" value={user?.email || ""} />
              <Detail editing={editing} label="Full Name" value={profile.fullName || ""} onChange={(value) => handleChange("fullName", value)} />
              <Detail editing={editing} label="Phone" value={profile.phone || ""} onChange={(value) => handleChange("phone", value)} />
              <DobDetail
                editing={editing}
                value={profile.dob || ""}
                min={dateLimits.min}
                max={dateLimits.max}
                onChange={(value) => handleChange("dob", value)}
              />
              <Detail editing={editing} label="Country" value={profile.country || ""} onChange={(value) => handleChange("country", value)} />
              <Detail editing={editing} label="My Role" value={profile.role || ""} onChange={(value) => handleChange("role", value)} />
              <Detail editing={editing} label="My Experience Level" value={profile.experienceLevel || ""} onChange={(value) => handleChange("experienceLevel", value)} />
              <Detail editing={editing} label="Favorite Breeds" value={profile.favoriteBreeds || ""} onChange={(value) => handleChange("favoriteBreeds", value)} />
              <Detail editing={editing} label="Farm Type" value={profile.farmType || ""} onChange={(value) => handleChange("farmType", value)} />
              <Detail editing={editing} label="Equipment I Use" value={profile.equipment || ""} onChange={(value) => handleChange("equipment", value)} />
              <Detail editing={editing} label="Preferred Language" value={profile.preferredLanguage || ""} onChange={(value) => handleChange("preferredLanguage", value)} />
              <Detail editing={editing} label="My City or Region" value={profile.cityOrRegion || ""} onChange={(value) => handleChange("cityOrRegion", value)} />

              <div>
                <p className="text-gray-500 mb-1">Availability</p>
                {editing ? (
                  <input
                    value={profile.availability || ""}
                    onChange={(e) => handleChange("availability", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    {profile.availability || "Empty"}
                  </span>
                )}
              </div>

              <div>
                <p className="text-gray-500 mb-1">Badges</p>
                <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full w-fit">
                  <CheckCircle size={12} />
                  Top Collaborator
                </span>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500 mb-1">Tags</p>
                {editing ? (
                  <input
                    value={profile.tags || ""}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-700">{profile.tags || "Empty"}</p>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Detail({ editing, label, value, onChange }) {
  return (
    <div>
      <p className="text-gray-500 mb-1">{label}</p>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      ) : (
        <p className="text-gray-800">{value || "Empty"}</p>
      )}
    </div>
  );
}

function DobDetail({ editing, value, min, max, onChange }) {
  return (
    <div>
      <p className="text-gray-500 mb-1">Date of Birth</p>
      {editing ? (
        <input
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      ) : (
        <p className="text-gray-800">{value || "Empty"}</p>
      )}
    </div>
  );
}

function LockedDetail({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800">{value || "Empty"}</p>
    </div>
  );
}

function isAgeBetween18And100(dob) {
  const date = new Date(`${dob}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  let age = today.getUTCFullYear() - date.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - date.getUTCMonth();
  const dayDiff = today.getUTCDate() - date.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 18 && age <= 100;
}
