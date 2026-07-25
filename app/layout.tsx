import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { PwaRegister } from "@/components/PwaRegister";
export const metadata: Metadata = { title:"Moist Entropy Weather", description:"Погода через термодинамику влажного воздуха", manifest:"/manifest.webmanifest", icons:{ icon:"/icon.svg" } };
export const viewport: Viewport = { themeColor:"#07110f", width:"device-width", initialScale:1 };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ru"><body><PwaRegister/>{children}</body></html>; }
