"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarDays,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  DollarSign,
  Scale,
  ExternalLink,
} from "lucide-react";
import { Story } from "@/types/stories";
import { data } from "@/stories.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VietnameseCaseInterface() {
  const [selectedData, setSelectedData] = useState<Story>(data[0]);

  const handleStoryChange = (storyId: string) => {
    const story = data.find((s) => s.id === storyId);
    if (story) {
      setSelectedData(story);
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <Select value={selectedData.id} onValueChange={handleStoryChange}>
              <SelectTrigger className="w-full py-7">
                <SelectValue placeholder="Chọn vụ án" />
              </SelectTrigger>
              <SelectContent>
                {data.map((story) => (
                  <SelectItem key={story.id} value={story.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{story.title}</span>
                      <span className="text-xs text-muted-foreground text-left">
                        {story.category}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 mb-2">
                  {selectedData.title}
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  {selectedData.overview}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedData.locations.map((location, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">Timeline sự kiện</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedData.timeline
              .sort((a, b) => {
                const dateA = new Date(a.event_date);
                const dateB = new Date(b.event_date);

                // If dates are different, sort by date (newest first)
                if (dateA.getTime() !== dateB.getTime()) {
                  return dateB.getTime() - dateA.getTime();
                }

                // If dates are the same, sort by time priority: exact_time > estimated_period_time > estimated_period
                const getTimeValue = (event: any) => {
                  if (event.exact_time) return event.exact_time;
                  if (event.estimated_period_time)
                    return event.estimated_period_time;
                  if (event.estimated_period === "chiều") return "22:00";
                  if (event.estimated_period === "sáng") return "01:00";
                  return null;
                };

                const timeA = getTimeValue(a);
                const timeB = getTimeValue(b);

                // Put null times last
                if (!timeA && !timeB) return 0;
                if (!timeA) return 1;
                if (!timeB) return -1;

                // Compare times (newest first)
                return timeB.localeCompare(timeA);
              })
              .map((event, index) => (
                <div
                  key={index}
                  className="flex gap-4"
                  title={JSON.stringify(event)}
                >
                  <div className="flex-shrink-0 relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-2 border-blue-500 relative z-10">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    {index < selectedData.timeline.length - 1 && (
                      <div className="absolute -z-1 -bottom-4 left-1/2 -translate-x-1/2 w-[1px] h-full bg-blue-600"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-blue-600">
                        {formatDate(event.event_date)}
                      </span>
                      {event.exact_time && (
                        <Badge variant="outline" className="text-xs bg-blue-50">
                          {event.exact_time}
                        </Badge>
                      )}
                      {event.estimated_period && (
                        <Badge variant="outline" className="text-xs bg-blue-50">
                          {event.estimated_period}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{event.event}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Key Figures */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">Nhân vật chính</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedData.key_figures.map((figure, index) => (
              <div key={index} className="flex gap-4">
                <Avatar className="w-12 h-12 bg-purple-100">
                  <AvatarFallback className="bg-purple-500 text-white">
                    {figure.name
                      .split(" ")
                      .slice(-2)
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {figure.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {figure.description}
                  </p>
                  {figure.quote && (
                    <div className="border-l-4 border-purple-200 pl-4 bg-purple-50 p-3 rounded-r">
                      <p className="text-sm italic text-gray-700">
                        "{figure.quote}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">Điểm nổi bật</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedData.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-gray-700 flex-1">{highlight}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedData.key_stats.map((stat, index) => (
            <Card key={index} className="border-l-4 border-red-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    {index === 0 && <Scale className="w-4 h-4 text-red-600" />}
                    {index === 1 && (
                      <DollarSign className="w-4 h-4 text-red-600" />
                    )}
                    {index === 2 && <Users className="w-4 h-4 text-red-600" />}
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Articles */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">Bài viết liên quan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedData.articles.map((article, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-3 h-3 text-white" />
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 hover:text-green-600 flex-1"
                >
                  {article.title}
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
