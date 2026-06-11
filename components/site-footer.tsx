export function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container py-12">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <div className="h-8 w-8 rounded-full bg-leaf/20 flex items-center justify-center text-leaf border border-leaf/20">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 2.76 1.12 5.26 2.93 7.07L12 12l7.07 7.07C20.88 17.26 22 14.76 22 12c0-5.52-4.48-10-10-10zm-1 4.05c-.47.1-1.39.46-2.03.96L10 8.01c.42-.31 1-.54 1-.54v-1.37c-.01-.01-.01-.01 0 0zm2 0v1.37s.58.23 1 .54l1.09-1c-.64-.5-1.56-.86-2.03-.96c-.02-.01-.04-.01-.06 0zm-5.4 3.7c-.55.43-1.07 1.05-1.4 1.76l1.37.49c.21-.5.56-.94.56-.94l-.53-1.31zm8.8 0l-.53 1.31s.35.44.56.94l1.37-.49c-.33-.71-.85-1.33-1.4-1.76z" />
                </svg>
              </div>
              <span>COCO Paradise</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Tropical Flavors. Modern Dining.
              <br />
              Serving fresh brownies, artisan birthday cakes, and refreshing cold beverages.
            </p>
          </div>

          {/* Contact Column */}
          <div>
            <div className="text-xs font-semibold text-leaf uppercase tracking-wider mb-4">Contact</div>
            <p className="text-sm leading-relaxed">
              No. 45, Coconut Grove Street,
              <br />
              Madurai, Tamil Nadu – 625001
              <br />
              <span className="block mt-2 font-semibold text-white">Phone: +91 81241 65047</span>
              <span className="block text-xs">Email: support@cocoparadise.in</span>
            </p>
          </div>

          {/* Menu Column */}
          <div>
            <div className="text-xs font-semibold text-leaf uppercase tracking-wider mb-4">Menu</div>
            <ul className="space-y-2 text-sm">
              {["Brownies", "Birthday Cakes", "Cold Beverages", "Special Desserts"].map((item) => (
                <li key={item}>
                  <a href="#products" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-gray-900 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2026 COCO PARADISE · ALL RIGHTS RESERVED</p>
          <p>Built with care by PixlNova</p>
        </div>
      </div>
    </footer>
  );
}
