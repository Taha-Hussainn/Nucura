const MobileTabs = ({ items, active, onChange }) => (
  <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 mb-4 overflow-x-auto no-scrollbar">
    <div className="flex gap-2 w-max">
      {items.map(({ key, label, icon: Icon, count }) => (
        <button key={key} onClick={() => onChange(key)}
          className={`flex items-center whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium border transition-all active:scale-95 ${
            active === key
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : 'bg-white text-slate-600 border-slate-200'
          }`}>
          <Icon className="h-4 w-4 mr-2" />{label}
          {count > 0 && (
            <span className={`ml-2 text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center ${
              active === key ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
            }`}>{count}</span>
          )}
        </button>
      ))}
    </div>
  </div>
)

export default MobileTabs