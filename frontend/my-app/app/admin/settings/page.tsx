"use client"

import React from "react"

export default function AdminSettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">Settings</h1>
                    <p className="text-gray-600 font-medium text-lg">Configure your admin panel preferences.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 border-2 border-[#121212] bg-[#fbcfe8] font-bold uppercase text-sm shadow-[4px_4px_0px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#121212] transition-all">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-white border-2 border-[#121212] shadow-[6px_6px_0px_0px_#121212] p-8 max-w-3xl">
                <h2 className="text-2xl font-black uppercase border-b-2 border-[#121212] pb-4 mb-6">General Settings</h2>

                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    <label className="flex flex-col gap-2 font-bold text-sm uppercase">
                        Site Name
                        <input
                            type="text"
                            defaultValue="DEVBLOG ADMIN"
                            className="border-2 border-[#121212] bg-[#f4f4f4] p-3 outline-none font-bold focus:bg-white"
                        />
                    </label>
                    <label className="flex flex-col gap-2 font-bold text-sm uppercase">
                        Site Description
                        <textarea
                            defaultValue="The neo-brutalist tech blog."
                            className="border-2 border-[#121212] bg-[#f4f4f4] p-3 outline-none font-bold focus:bg-white resize-none h-24"
                        ></textarea>
                    </label>
                </form>
            </div>
        </div>
    )
}
