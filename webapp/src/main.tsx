import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById("root")!).render(<App />);
