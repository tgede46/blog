import React from "react"

export default function AdminMediaPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">Media Library</h1>
                    <p className="text-gray-600 font-medium text-lg">Manage all your uploaded images and assets.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 border-2 border-[#121212] bg-[#a5f3fc] font-bold uppercase text-sm shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all">
                        Upload Asset
                    </button>
                </div>
            </div>

            <div className="bg-white border-2 border-[#121212] shadow-[6px_6px_0px_0px_#121212] p-16 flex items-center justify-center text-center">
                <div className="max-w-md">
                    <h2 className="text-2xl font-black uppercase mb-4">No Media Yet</h2>
                    <p className="text-gray-600 font-medium mb-6">Upload some images to start filling out your library.</p>
                    <button className="px-8 py-4 border-2 border-[#121212] bg-[#fce96a] font-black uppercase shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all">
                        Browse Files
                    </button>
                </div>
            </div>
        </div>
    )
}
