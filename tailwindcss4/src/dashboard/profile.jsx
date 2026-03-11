import { CheckCircle } from "lucide-react";

export default function Profile() {
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
              Maria Fernanda
            </h2>
            <span className="text-green-600 text-sm mb-6">
              Premium User
            </span>

            <div className="w-56 h-56 rounded-full border-4 border-gray-200 overflow-hidden">
              <img
                src="https://i.pravatar.cc/300"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

          </div>

          {/* RIGHT CARD */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                Bio & other details
              </h3>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-sm">

              <Detail label="My Role" value="Beatmaker" />
              <Detail label="My Experience Level" value="Intermediate" />
              <Detail label="My 3 Favorite Artists" value="Ninho, Travis Scott, Metro Boomin" />
              <Detail label="My Favorite Music Genre" value="Trap" />
              <Detail label="The Software or Equipment I Use" value="Ableton" />
              <Detail label="My Preferred Music Mood" value="Melancholic" />
              <Detail label="My City or Region" value="California, USA" />

              <div>
                <p className="text-gray-500 mb-1">Availability</p>
                <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Available for Collaboration
                </span>
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
                <p className="text-gray-700">
                  #Drill, #Melancholic, #Rap-US
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}