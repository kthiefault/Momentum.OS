const GradientMesh = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
  >
    <div className="mesh-blob mesh-blob--ember" />
    <div className="mesh-blob mesh-blob--ice" />
    <div className="mesh-blob mesh-blob--mid" />
  </div>
);

export default GradientMesh;
