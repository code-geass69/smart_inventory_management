import * as React from "react"

import { Header } from "@/components/nav/app/header"
import { Sidebar } from "@/components/nav/app/sidebar"
import styles from "@/styles/helperScroll.module.css"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <div className="flex">
      <Sidebar />
      <div className={`h-screen w-full overflow-y-auto ${styles.scrollArea}`}>
        <Header />
        <main>{children}</main>
      </div>
    </div>
  )
}
