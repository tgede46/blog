export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#fbfaf7]" role="status">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        <p className="mt-4 font-semibold text-[#596275]">Chargement…</p>
      </div>
    </div>
  )
}
