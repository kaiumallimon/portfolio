export default function HomeBackground() {
  return (<>
    <div className="fixed inset-0 z-0 pointer-events-none mesh-gradient"></div>
    <div className="fixed top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-indigo-500/20 to-transparent z-50"></div>
  </>);

}