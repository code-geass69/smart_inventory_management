import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProfilePage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  const user = session.user

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Your Profile</h1>

      <form className="grid gap-4">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            defaultValue={user?.name?.split(" ")[0] || ""}
            name="firstName"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            defaultValue={user?.name?.split(" ")[1] || ""}
            name="lastName"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select name="gender" className="w-full p-2 border rounded-md">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Birthday</label>
          <input
            type="date"
            name="birthday"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">About</label>
          <textarea
            name="about"
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder="Tell us something about yourself..."
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-black px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
