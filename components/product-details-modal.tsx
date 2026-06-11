import { BatchStamp } from "./batch-stamp";
import { X, ShieldCheck, Check } from "lucide-react";
import type { ProductCardData } from "./product-card";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductCardData | null;
}

export function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
  if (!isOpen || !product) return null;

  const whatsappText = `Hi, I'm interested in ordering: *${product.name}* (${product.variant}) from Coconet.
Batch: ${product.batch}
Pressed: ${product.pressed}
Starting Price: ₹${product.startingFrom}`;
  const whatsappUrl = `https://wa.me/918124165047?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-kernel border hairline overflow-hidden shadow-2xl z-10 animate-fade-in animate-duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-kernel/90 border hairline rounded-full hover:bg-kernel-deeper transition-colors duration-200 z-20 text-shell hover:text-ink focus:outline-none focus:ring-2 focus:ring-leaf"
          aria-label="Close details"
        >
          <X size={16} />
        </button>

        {/* Product Color Gradient Block */}
        <div
          className="aspect-[16/7] w-full relative"
          style={{
            background: `linear-gradient(160deg, ${product.hueA} 0%, ${product.hueB} 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="eyebrow text-kernel/90">{product.variant}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <h3 
              className="font-display text-3xl text-leaf-deep"
              style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 32" }}
            >
              {product.name}
            </h3>
            
            <div className="pt-1">
              <BatchStamp batch={product.batch} pressed={product.pressed} className="!px-0 !py-0 !border-0 !bg-transparent" />
            </div>
          </div>

          <div className="h-px bg-shell/15" />

          {/* Description */}
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">Description</span>
            <p className="font-body text-sm text-shell leading-relaxed">
              {product.description || product.tagline}
            </p>
          </div>

          {/* Key Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">Key Benefits</span>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-shell font-body">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-4 h-4 bg-leaf/10 text-leaf rounded-full flex items-center justify-center">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="h-px bg-shell/15 pt-2" />

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block">Starting From</span>
              <span className="font-mono text-xl font-bold text-ink">₹{product.startingFrom}</span>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="btn-secondary !px-4 !py-2.5 rounded-sm"
              >
                Close
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !px-5 !py-2.5 rounded-sm flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
