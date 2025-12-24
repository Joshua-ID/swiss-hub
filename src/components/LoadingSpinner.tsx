import "../LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center flex-col p-6 m-auto w-screen">
      <div className="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="text-3xl font-bold animate-pulse">Swiss Hub</div>
    </div>
  );
}
