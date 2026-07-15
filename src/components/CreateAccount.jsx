import { useState } from "react";

export default function CreateAccount({ onAccountCreated }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    role: "User",
    email: "",
    password: "", // Added password to state
    gender: "",   
    image: "",
    bio: ""
  });

  // State to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: localImageUrl
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAccountCreated({
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      gender: formData.gender,
      image: formData.image || "https://via.placeholder.com/150", 
      bio: formData.bio || "No bio provided yet.",
      level: 1, 
      points: 0 
    });
  };

  const getBioContent = () => {
    switch (formData.role) {
      case "User":
        return {
          label: "Interests & Favorite Sports:",
          placeholder: "What are your favorite sports? Tell us what you want to see most on the app (e.g., Football, Basketball, specific teams)..."
        };
      case "Author":
        return {
          label: "Writing Experience & Focus Area:",
          placeholder: "What is your favorite sports niche to write about? Tell us briefly about your writing background or experience..."
        };
      case "Admin":
        return {
          label: "Professional Bio:",
          placeholder: "Enter professional background or administrative notes"
        };
      default:
        return {
          label: "Brief Bio:",
          placeholder: "Tell us a bit about yourself..."
        };
    }
  };

  const bioContent = getBioContent();

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-[#2a1d16]/30 border border-stone-800 p-6 rounded-2xl max-w-xl mx-auto space-y-4 shadow-xl"
    >
      <h2 className="text-xl font-bold text-[#f7f4f0] border-b border-stone-800 pb-2">
        Create New <span className="text-amber-500">Account</span>
      </h2>

      {/* Account Type/Role Selector */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="role" className="text-amber-400 font-medium text-sm tracking-wide">
          Account Type:
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full bg-[#2a1d16] text-[#f7f4f0] border border-stone-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
        >
          <option value="User">Regular User</option>
          <option value="Author">Author / Sports Writer</option>
          <option value="Admin">Administrator</option>
        </select>
      </div>

      {/* First Name */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="firstName" className="text-amber-400 font-medium text-sm tracking-wide">
          First Name:
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="Enter first name"
          className="w-full bg-[#2a1d16] text-[#f7f4f0] placeholder-stone-500 border border-stone-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="lastName" className="text-amber-400 font-medium text-sm tracking-wide">
          Last Name:
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Enter last name"
          className="w-full bg-[#2a1d16] text-[#f7f4f0] placeholder-stone-500 border border-stone-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      {/* Username */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="username" className="text-amber-400 font-medium text-sm tracking-wide">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter username"
          className="w-full bg-[#2a1d16] text-[#f7f4f0] placeholder-stone-500 border border-stone-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
          required
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-amber-400 font-medium text-sm tracking-wide">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email"
          className="w-full bg-[#2a1d16] text-[#f7f4f0] placeholder-stone-500 border border-stone-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* Password Field with Show/Hide Toggle */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="text-amber-400 font-medium text-sm tracking-wide">
          Password:
        </label>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter password"
            className="w-full bg-[#2a1d16] text-[#f7f4f0] placeholder-stone-500 border border-stone-700 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-500 focus:outline-none transition duration-150"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye-Slash Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              // Eye Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Gender Field Dropdown */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="gender" className="text-amber-400 font-medium text-sm tracking-wide">
          Gender:
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full bg-[#2a1d16] text-[#f7f4f0] border border-stone-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
        >
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Profile Image Dual Upload System */}
      <div className="flex flex-col space-y-2">
        <label className="text-amber-400 font-medium text-sm tracking-wide">
          Profile Picture:
        </label>
        <input
          type="text"
          name="image"
          placeholder="Paste image URL here"
          className="w-full bg-[#2a1d16] text-[#f7f4f0] placeholder-stone-500 border border-stone-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200"
          value={formData.image.startsWith('blob:') ? "" : formData.image}
          onChange={handleChange}
        />
        <div className="text-center text-[10px] text-stone-500 font-bold uppercase tracking-widest my-1">— OR —</div>
        <label className="flex items-center justify-center border border-dashed border-stone-700 bg-[#2a1d16]/50 rounded-lg p-4 cursor-pointer ">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">
            {formData.image.startsWith('blob:') ? "✓ Image Loaded from Device" : "Upload from Device"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Dynamic Biography Textarea */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="bio" className="text-amber-400 font-medium text-sm tracking-wide">
          {bioContent.label}
        </label>
        <textarea
          id="bio"
          name="bio"
          rows="4"
          placeholder={bioContent.placeholder}
          className="w-full bg-[#2a1d16] text-[#f7f4f0] placeholder-stone-500 border border-stone-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200 resize-none"
          value={formData.bio}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 mt-2"
      >
        Create Account
      </button>
    </form>
  );
}