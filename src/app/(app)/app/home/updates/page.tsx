import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { recentUpdates } from "@/data/constants/recent-updates"
import dayjs from "dayjs"

export default async function AppdHomeUpdatesPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  // Filter only the updates from the past 5 days
  const updatesToShow = recentUpdates.filter((update) =>
    dayjs(update.date).isAfter(dayjs().subtract(5, "day"))
  )

  return (
    <div className="p-5">
      <h1 className="mb-6 text-xl font-semibold tracking-tight">Recent Updates</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {updatesToShow.map((update, idx) => (
          <div
            key={idx}
            className="rounded-lg border bg-secondary p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm text-muted-foreground">
              {dayjs(update.date).format("MMMM D, YYYY")}
            </p>
            <h2 className="mt-2 text-base font-semibold">{update.title}</h2>
            <p className="mt-1 text-sm">{update.description}</p>
            {update.link && (
              <a
                href={update.link}
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Learn more →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
