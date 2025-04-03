import React from 'react';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      content: "TaskSmasher turned my overwhelming project into a clear plan in seconds. I use it every morning now!",
      author: "Alex K.",
      role: "Freelance Designer",
      avatar: "😎"
    },
    {
      content: "RecipeSmasher is like having a chef in my phone. I had random ingredients and it gave me a gourmet meal idea!",
      author: "Jamie T.",
      role: "Food Blogger",
      avatar: "👩‍🍳"
    },
    {
      content: "These tools are game-changers for small business owners like me. Simple, fast, and actually useful.",
      author: "Sam P.",
      role: "Startup Founder",
      avatar: "🚀"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What People Are <span className="text-secondary">Saying</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy users who are smashing through their tasks with our tools.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card card-hover">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-secondary" fill="#FFD60A" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-xl">
                  {testimonial.avatar}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;