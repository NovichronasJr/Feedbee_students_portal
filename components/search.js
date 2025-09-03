export default function SearchBar(){
    return(
        <div class="flex justify-start mx-32">
  <div class="relative w-full max-w-md">
    <input 
      type="text" 
      placeholder="Search..."
      class="w-full py-2 pl-10 pr-4 border border-zinc-50 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
    />
    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10 16a6 6 0 100-12 6 6 0 000 12z" />
      </svg>
    </div>
  </div>
</div>

    )
}