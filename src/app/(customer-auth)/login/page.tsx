"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function CustomerLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/customers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok && data.status === "success") {
      localStorage.setItem("customerId", data.customerId)
      router.push("/customer/place-order")
    } else {
      alert(data.message || "Login failed")
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Customer Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm text-muted-foreground">
                Not registered yet?{" "}
                <a href="/register" className="text-primary hover:underline font-medium">
                Register
                </a>
            </p>
            <p className="text-sm text-muted-foreground">
                Go back: {" "}
                <a href="/" className="text-primary hover:underline font-medium">
                Home
                </a>
            </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  )
}
