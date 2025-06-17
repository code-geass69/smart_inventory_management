"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Flag, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) {
        alert("Please log in to view your profile");
        router.push("/signin");
        return;
      }

      const res = await fetch(`/api/customers/profile?customerId=${customerId}`);
      const data = await res.json();

      if (data.status === "success") {
        setProfile(data.data);
      } else {
        alert(data.message || "Failed to fetch profile");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = () => {
    router.push("/customer/profile/update");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      const customerId = localStorage.getItem("customerId");
      const res = await fetch(`/api/customers/delete?customerId=${customerId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("Account deleted successfully.");
        localStorage.removeItem("customerId");
        localStorage.removeItem("customerEmail");
        router.push("/");
      } else {
        alert(data.message || "Failed to delete account.");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center space-y-6">
      {loading ? (
        <div className="text-lg">Loading profile...</div>
      ) : profile ? (
        <>
          <Card className="bg-[#1E293B] text-white border border-white shadow-lg w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <User size={24} />
                <span>Customer Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-gray-600 py-2">
                <Label className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Name:</span>
                </Label>
                <span>{profile.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-600 py-2">
                <Label className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Email:</span>
                </Label>
                <span>{profile.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-600 py-2">
                <Label className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>Phone:</span>
                </Label>
                <span>{profile.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-600 py-2">
                <Label className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Address:</span>
                </Label>
                <span>{profile.address || "-"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-600 py-2">
                <Label className="flex items-center space-x-2">
                  <Flag size={16} />
                  <span>State:</span>
                </Label>
                <span>{profile.state}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <Label className="flex items-center space-x-2">
                  <CalendarClock size={16} />
                  <span>Joined On:</span>
                </Label>
                <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button
              onClick={handleUpdate}
              className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              variant="outline"
            >
              Update Profile
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete Account
            </Button>
          </div>
        </>
      ) : (
        <div className="text-lg">Profile not found.</div>
      )}
    </div>
  );
}
