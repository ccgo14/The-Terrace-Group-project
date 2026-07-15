import { useState } from "react";

export default function UserProfile({ userData }) {
  
  const [user, setUser] = useState(userData);

  // Settings states 
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: false
  });

  // Toggle handlers for switches
  const handleToggle = (settingKey) => {
    setSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey]
    }));
  };

  // Profile Picture Update handler (Inline replacement)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setUser((prev) => ({
        ...prev,
        image: localImageUrl
      }));
    }
  };

 return (
    <div className="max-w-xl mx-auto space-y-6 px-4">
      <div className="bg-[#2a1d16]/40 border border-stone-800 p-6 rounded-2xl relative shadow-xl">
        <div className="flex items-start space-x-4">
          
          {/* Avatar Component */}
          <div className="relative group w-16 h-16 flex-shrink-0">
            <img 
              src={user.image} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover border-2 border-stone-700"
            />
            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-[10px] text-stone-200 opacity-0 group-hover:opacity-100 cursor-pointer transition duration-200 text-center p-1">
              Change Picture
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          {/* Dynamic Details Rendered Here */}
          <div className="space-y-1 flex-1">
            <h1 className="text-xl font-bold text-[#f7f4f0]">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xs font-semibold text-stone-400">
              Lvl {user.level} <span className="text-amber-500 mx-1">•</span> {user.role}
            </p>
            <p className="text-sm text-stone-300 pt-2 leading-relaxed">
              {user.bio}
            </p>
            <div className="pt-3 text-xs font-bold uppercase tracking-wider text-amber-400">
              Points Available: <span className="text-[#f7f4f0] font-mono text-sm">{user.points}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-[#2a1d16]/40 border border-stone-800 rounded-2xl divide-y divide-stone-800/60 overflow-hidden shadow-xl">
        
        {/* Toggle Option: Dark Mode */}
        <div className="flex items-center justify-between p-4 bg-[#2a1d16]/10 hover:bg-[#2a1d16]/30 transition duration-150">
          <span className="text-[#f7f4f0] font-medium text-base tracking-wide">Dark Mode</span>
          <button 
            type="button"
            onClick={() => handleToggle("darkMode")}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${settings.darkMode ? 'bg-amber-500' : 'bg-stone-700'}`}
          >
            <div className={`bg-stone-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${settings.darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Toggle Option: Notification */}
        <div className="flex items-center justify-between p-4 bg-[#2a1d16]/10 hover:bg-[#2a1d16]/30 transition duration-150">
          <span className="text-[#f7f4f0] font-medium text-base tracking-wide">Notification</span>
          <button 
            type="button"
            onClick={() => handleToggle("notifications")}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${settings.notifications ? 'bg-amber-500' : 'bg-stone-700'}`}
          >
            <div className={`bg-stone-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${settings.notifications ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Action Link: Edit Account */}
        <button className="w-full flex items-center justify-between p-4 text-left bg-[#2a1d16]/10 hover:bg-[#2a1d16]/30 transition duration-150 group">
          <span className="text-[#f7f4f0] font-medium text-base tracking-wide">Edit Account</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-stone-500 group-hover:text-amber-500 transition duration-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Action Link: Change Password */}
        <button className="w-full flex items-center justify-between p-4 text-left bg-[#2a1d16]/10 hover:bg-[#2a1d16]/30 transition duration-150 group">
          <span className="text-[#f7f4f0] font-medium text-base tracking-wide">Change Password</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-stone-500 group-hover:text-amber-500 transition duration-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Action Link: Sign Out (Note: the original image duplicates Change Password at the bottom, so this serves as a practical exit link slot) */}
        <button className="w-full flex items-center justify-between p-4 text-left bg-[#2a1d16]/10 hover:bg-[#2a1d16]/30 transition duration-150 group">
          <span className="text-[#f7f4f0] font-medium text-base tracking-wide">Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-stone-500 group-hover:text-amber-500 transition duration-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      </div>
    </div>
  );
}