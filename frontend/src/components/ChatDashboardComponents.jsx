export const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
    <Icon className="size-8 text-blue-600" />
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);


export const ChatsByCategory = ({ categories, tickets }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-medium mb-4">Chats by Category</h3>

      {categories.map((category) => {
        const count = tickets.filter(t => t.category === category).length;

        return (
          <div key={category} className="mb-3">
            <div className="flex justify-between text-sm">
              <span>{category}</span>
              <span>{count}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${(count / tickets.length) * 100 || 0}%` }}
              />
            </div>
          </div>
        );
      })}
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
