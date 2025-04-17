    "use client"

    import { useState } from "react"
    import { useRouter } from "next/navigation"
    import { Input } from "@/components/ui/input"
    import { Button } from "@/components/ui/button"
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
    import { Label } from "@/components/ui/label"

    export default function CustomerRegisterPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    })

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch("/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        })

        const data = await res.json()
        setLoading(false)

        if (data.status === "success") {
        router.push("/login")
        } else {
        alert("Registration failed")
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center">
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-2xl">Customer Registration</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={form.address} onChange={handleChange} />
                </div>
                <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </Button>

            <p className="text-sm text-muted-foreground">
                Already registered?{" "}
                <a href="/login" className="text-primary hover:underline font-medium">
                Login
                </a>
            </p>
            <p className="text-sm text-muted-foreground">
                Go Back: {" "}
                <a href="/login" className="text-primary hover:underline font-medium">
                Home
                </a>
            </p>
            </CardFooter>
            </form>
        </Card>
        </div>
    )
    }
