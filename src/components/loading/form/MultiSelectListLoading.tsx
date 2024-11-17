function MultiSelectListLoading() {
  return (
    <div className="px-1 py-1.5 space-y-1 text-sm m-0 transition ease-in-out border border-gray-300 border-solid rounded-md focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none min-h-[10rem]">
      {[1, 2, 3, 4, 5].map((item) => (
        <div className="w-full loading h-[26px]" key={item} />
      ))}
    </div>
  )
}
export default MultiSelectListLoading
