
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Video, FileText, Lightbulb, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  const categories = [
    {
      title: "Crop Management",
      articles: [
        { title: "Best Practices for Soil Preparation", type: "Article", duration: "5 min read" },
        { title: "Organic Pest Control Methods", type: "Video", duration: "12 min" },
        { title: "Irrigation Scheduling Guide", type: "PDF", duration: "Download" }
      ]
    },
    {
      title: "Financial Planning",
      articles: [
        { title: "Farm Budget Planning Template", type: "PDF", duration: "Download" },
        { title: "Understanding Agricultural Loans", type: "Article", duration: "8 min read" },
        { title: "Insurance Options for Farmers", type: "Video", duration: "15 min" }
      ]
    },
    {
      title: "Technology & Innovation",
      articles: [
        { title: "IoT in Modern Agriculture", type: "Article", duration: "10 min read" },
        { title: "Drone Applications in Farming", type: "Video", duration: "18 min" },
        { title: "Smart Farming Techniques", type: "Article", duration: "7 min read" }
      ]
    }
  ];

  const tips = [
    "Test soil pH before planting new crops",
    "Rotate crops to maintain soil health",
    "Use companion planting to reduce pests",
    "Monitor weather patterns for irrigation timing"
  ];

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'article': return FileText;
      case 'video': return Video;
      case 'pdf': return Download;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'article': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'pdf': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">Agricultural Resources</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Quick Tips */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Categories */}
        {categories.map((category, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.articles.map((article, articleIndex) => {
                const IconComponent = getTypeIcon(article.type);
                return (
                  <div key={articleIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="h-5 w-5 text-purple-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{article.title}</div>
                        <div className="text-xs text-gray-500">{article.duration}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(article.type)}`}>
                      {article.type}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        {/* Action Button */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
            <p className="text-purple-100 text-sm mb-4">
              Connect with agricultural experts and get personalized advice
            </p>
            <Button variant="secondary" className="w-full">
              Contact Expert
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
