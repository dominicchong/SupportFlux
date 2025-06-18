import { useState } from "react";
import { Search } from "lucide-react"
import { Input, Card, CardContent, Badge } from "../components/KnowledgeBaseComponent";

const knowledgeData = [
  {
    title: "Chabot Guideline",
    description: "Steps to use the chatbot feature.",
    category: "Communication",
  },
  {
    title: "Using the Chat Feature",
    description: "Learn how to start and manage conversations.",
    category: "Communication",
  },
  {
    title: "Updating Your Profile",
    description: "Guidelines for editing your account information.",
    category: "Account",
  },
  {
    title: "Understanding User Roles",
    description: "Explanation of student, faculty staff, and admin roles.",
    category: "Permissions",
  },
  {
    title: "Joining a Meeting Room",
    description: "Instructions to join a video or audio room.",
    category: "Communication",
  },
];

const categories = ["All", ...new Set(knowledgeData.map((item) => item.category))];

const KnowledgeBasePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredData = knowledgeData.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 pt-20 space-y-6">
      {/* Search Bar on top of the whole layout */}
      <div className="max-w-xl mx-auto relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="size-5 text-base-content/40" />
        </div>
        <Input
          placeholder="Search information..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10"
        />
      </div>

      {/* Filter + Content in two columns below */}
      <div className="flex gap-6">
        {/* Filter Panel on the left */}
        <div className="w-1/4 space-y-2">
          <h2 className="text-lg font-semibold">Filter by Category</h2>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="w-fit cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Cards on the right */}
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredData.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold truncate">{item.title}</h2>
                <p className="text-sm text-gray-600 truncate">{item.description}</p>
                <Badge variant="secondary">{item.category}</Badge>
              </CardContent>
            </Card>
          ))}

          {filteredData.length === 0 && (
            <div className="text-gray-500 col-span-full text-center">
              No matching articles found.
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default KnowledgeBasePage;
