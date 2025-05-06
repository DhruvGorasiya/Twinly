interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatarUrl: string
  gradient: string
}

export function TestimonialCard({ quote, author, role, avatarUrl, gradient }: TestimonialCardProps) {
  return (
    <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-100 transition-opacity duration-300 group-hover:opacity-80`}
      />

      <div className="relative z-10">
        <div className="mb-6 text-lg italic">"{quote}"</div>

        <div className="flex items-center">
          <img src={avatarUrl || "/placeholder.svg"} alt={author} className="h-12 w-12 rounded-full object-cover" />
          <div className="ml-3">
            <div className="font-semibold">{author}</div>
            <div className="text-sm text-gray-600">{role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
