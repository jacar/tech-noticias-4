"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Ensure we have default values for all required props
  const defaultedProps: ThemeProviderProps = {
    attribute: "class",
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
    ...props
  };
  
  return <NextThemesProvider {...defaultedProps}>{children}</NextThemesProvider>
}
