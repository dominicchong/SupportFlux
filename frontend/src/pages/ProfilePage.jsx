import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, LogOut } from "lucide-react";
import { DateTimeFormatter } from "../components/BasicUIComponents";
import ConfirmationModal from "../components/ConfirmationModal";
import toast from "react-hot-toast";
import { getAvatarBg, getInitials } from "../components/Avatar";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isModalLogoutOpen, setIsModalLogoutOpen] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      const originalImage = authUser?.profilePic;

      setSelectedImg(base64Image);

      try {
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile picture updated!");
      } catch (error) {
        toast.error("Failed to update profile picture");
        setSelectedImg(originalImage); // Revert on failure
      }
    };
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalLogoutOpen(false);
    }
  }


  return (
    <div className="h-screen pt-15">
      <div className="max-w-4xl mx-auto p-4 px-8 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:items-start ">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className={`size-32 rounded-full flex items-center justify-center font-bold border-3 border-base-content/10 overflow-hidden
                  ${!(selectedImg || authUser?.profilePic) ? getAvatarBg() + " text-4xl" : ""}`}>

                  {selectedImg || authUser?.profilePic ? (
                    <img
                      src={selectedImg || authUser?.profilePic}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(authUser?.fullName)}</span>
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                  title="Update photo"
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="flex flex-col flex-1 w-full max-w-md">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Role
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border capitalize">{authUser?.role}</p>
                </div>
              </div>

              <div className="mt-6 bg-base-300 rounded-xl p-3">
                <h2 className="text-md font-medium border-b border-zinc-700 pb-2 md:text-lg">Account Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 mt-2">
                    <span>Member Since</span>
                    <span>
                      <DateTimeFormatter value={authUser?.createdAt} format="simple" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={isUpdatingProfile}
                  className="flex gap-2 items-center bg-red-500 hover:bg-red-600 text-white 
              px-4 py-2 rounded cursor-pointer transition-colors"
                  onClick={() => { setIsModalLogoutOpen(true) }}
                >
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalLogoutOpen}
        onClose={() => setIsModalLogoutOpen(false)}
        title="Confirmation"
        children="Do you want to logout?"
        primaryButton={{ label: "Logout", onClick: handleLogout }}
        primaryButtonStyle={"bg-red-500 border-red-500 hover:bg-red-600 text-white"}
        secondaryButton={{ label: "Cancel", onClick: () => setIsModalLogoutOpen(false) }}
      ></ConfirmationModal>
    </div>
  );
};
export default ProfilePage;