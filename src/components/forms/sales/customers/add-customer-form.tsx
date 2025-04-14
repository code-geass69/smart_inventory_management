"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { customerSchema, type AddCustomerFormInput } from "@/validations/customers"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { useTransition } from "react"
import Link from "next/link"
import { addCustomer } from "@/actions/sales/customers"

export function AddCustomerForm(): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<AddCustomerFormInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      address: "",
    },
  })

  function onSubmit(data: AddCustomerFormInput) {
    startTransition(async () => {
      try {
        const result = await addCustomer(data)

        if (result === "success") {
          toast({ title: "Customer added successfully!" })
          form.reset()
        } else if (result === "exists") {
          toast({ title: "Customer already exists", variant: "destructive" })
        } else {
          throw new Error("Add customer failed")
        }
      } catch (error) {
        toast({
          title: "Error adding customer",
          description: "Something went wrong",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-10"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+91 9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Full address..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button disabled={isPending} aria-label="Add Customer">
            {isPending ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add Customer</span>
            )}
            <span className="sr-only">Add Customer</span>
          </Button>

          <Link
            href="/app/sales/customers"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
          >
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  )
}
