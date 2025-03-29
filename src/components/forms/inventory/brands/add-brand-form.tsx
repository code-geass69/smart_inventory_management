"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addBrand } from "@/actions/inventory/brands"
import { brandSchema } from "@/validations/inventory"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AddBrandFormInputs = z.infer<typeof brandSchema>

export function AddBrandForm(): JSX.Element {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [categories, setCategories] = useState<string[]>([])

  const form = useForm<AddBrandFormInputs>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      category: "",
    },
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data.map((c: any) => c.name))
      } catch (err) {
        console.error("Failed to load categories", err)
      }
    }

    fetchCategories()
  }, [])

  function onSubmit(formData: AddBrandFormInputs) {
    startTransition(async () => {
      try {
        const response = await addBrand(formData)

        if (response === "success") {
          toast({ title: "Success!", description: "New brand added" })
        }

        router.push("/app/inventory/brands")
      } catch (error) {
        toast({
          title: "Something went wrong",
          description: "Please try again",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Brand name" {...field} />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2 pt-2">
          <Button disabled={isPending} aria-label="Add Brand" className="w-fit">
            {isPending ? (
              <>
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add Brand</span>
            )}
            <span className="sr-only">Add Brand</span>
          </Button>

          <Link
            href="/app/inventory/brands"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
          >
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  )
}
