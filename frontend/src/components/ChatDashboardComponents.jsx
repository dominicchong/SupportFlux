export const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
    <Icon className="size-8 text-blue-600" />
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

export const ChatsByCategory = ({ categories }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">Resolution Priority</h3>
        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold uppercase">
          Live Updates
        </span>
      </div>
      
      <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {categories.map((cat, index) => (
          <div key={cat.id || cat.name} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
            {/* Priority Indicator */}
            <div className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center font-bold ${
              index === 0 ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 
              index === 1 ? 'bg-orange-400 text-white' :
              index === 2 ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-400'

            }`}>
              {index + 1}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-bold text-gray-700 truncate">{cat.name}</p>
                <span className="text-sm font-mono font-bold text-gray-900">{cat.count}</span>
              </div>
              
              {/* Subtle Progress Bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-400' : index === 2 ? 'bg-green-400' : 'bg-blue-400'
                  }`}
                  style={{ width: `${(cat.count / (categories[0]?.count || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-sm">
                No chats found for this period.
            </div>
        )}
      </div>
    </div>
  );
};

export const CommonWordsPanel = ({ words = [] }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="font-medium mb-4">Common Words (Live Chat)</h3>

    {words.length === 0 ? (
      <p className="text-sm text-gray-400">No data available</p>
    ) : (
      <ul className="space-y-2 text-sm">
        {words.map((w, i) => (
          <li key={w.word} className="flex justify-between">
            <span>{i + 1}. {w.word}</span>
            <span className="text-gray-500">{w.count}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
