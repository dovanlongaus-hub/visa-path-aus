import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Star, Users } from 'lucide-react';

export default function Testimonials() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const data = await base44.entities.TestimonialStory.filter(
        { is_featured: true },
        '-created_date',
        100
      ).catch(() => []);
      setStories(data);
      setLoading(false);
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#0a1628] mb-2 flex items-center justify-center gap-2">
            <Users className="w-8 h-8" /> Câu chuyện thành công
          </h1>
          <p className="text-gray-600">Những người đã đạt được visa Úc và bắt đầu cuộc sống mới</p>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Chưa có câu chuyện nào</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stories.map(story => (
              <div
                key={story.id}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Header with photo */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-start gap-4">
                  {story.photo_url && (
                    <img
                      src={story.photo_url}
                      alt={story.user_name}
                      className="w-12 h-12 rounded-full border-2 border-white"
                    />
                  )}
                  <div className="text-white flex-1">
                    <div className="font-bold text-lg">{story.user_name}</div>
                    <div className="text-sm opacity-90">{story.occupation}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Visa Badge */}
                  <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold text-sm">
                    ✓ {story.visa_obtained} Visa
                  </div>

                  {/* Story */}
                  <p className="text-gray-700 leading-relaxed line-clamp-4">{story.story}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      ⏱️ {story.timeline_months} tháng
                    </span>
                    {story.rating && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: story.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Bạn cũng có thể thành công!</h2>
          <p className="text-gray-600 mb-6">Hãy bắt đầu hành trình di trú của bạn ngay hôm nay cùng Úc Di Trú AI</p>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
            Bắt đầu ngay
          </button>
        </div>
      </div>
    </div>
  );
}