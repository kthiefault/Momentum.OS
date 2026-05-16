import { type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NoiseOverlay from "./effects/NoiseOverlay";
import CustomCursor from "./effects/CustomCursor";
import GradientMesh from "./effects/GradientMesh";

const PageLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen bg-background text-foreground antialiased">
    <CustomCursor />
    <GradientMesh />
    <NoiseOverlay />
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
