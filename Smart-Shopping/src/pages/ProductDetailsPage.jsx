import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProducts } from '../features/products/productThunks';
import {
  selectSelectedProduct,
  selectProductDetailsStatus,
  selectProductDetailsError,
  selectRelatedProducts,
  selectAllProducts,
} from '../features/products/productSelectors';
import { addToCart } from '../features/cart/cartSlice';
import { addToast, selectCurrency } from '../features/preferences/preferenceSlice';
import { formatPrice } from '../utils/currency';
import QuantitySelector from '../components/cart/QuantitySelector';
import RatingStars from '../components/common/RatingStars';
import ProductCard from '../components/products/ProductCard';
import { ProductDetailsSkeleton } from '../components/common/SkeletonLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  ShoppingCart,
  Zap,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Share2,
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector(selectSelectedProduct);
  const status = useSelector(selectProductDetailsStatus);
  const error = useSelector(selectProductDetailsError);
  const allProducts = useSelector(selectAllProducts);
  const currency = useSelector(selectCurrency);

  const relatedProducts = useSelector((state) =>
    selectRelatedProducts(state, product)
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, id, allProducts.length]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    dispatch(addToCart({ product, quantity }));
    dispatch(
      addToast({
        message: `Added ${quantity} × "${product.title.slice(0, 28)}..." to cart!`,
        type: 'success',
      })
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 700);
  };

  const handleBuyNow = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      dispatch(addToast({ message: 'Product link copied to clipboard!', type: 'info' }));
    }
  };

  if (status === 'loading' || !product || String(product.id) !== String(id)) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load product details"
        message={error}
        onRetry={() => dispatch(fetchProductById(id))}
      />
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Back button */}
      <div className="pt-2">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Products</span>
        </Link>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Product Image Stage */}
        <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white p-8 sm:p-12 shadow-sm flex items-center justify-center overflow-hidden min-h-[420px] max-h-[550px]">
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            {product.category}
          </span>

          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <img
            src={
              imgError
                ? `https://placehold.co/500x500?text=${encodeURIComponent(product.title.slice(0, 16))}`
                : product.image
            }
            alt={product.title}
            onError={() => setImgError(true)}
            className="max-h-[380px] max-w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info & Purchase Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <RatingStars
                rating={product.rating?.rate}
                count={product.rating?.count}
                size="md"
              />
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Verified Customer Reviews
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {formatPrice(product.price, currency)}
            </span>
            <span className="text-xs text-slate-500">
              Tax included • Free Shipping available
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Quantity:
              </span>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onChange={(q) => setQuantity(q)}
                size="md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 active:scale-95 text-white dark:text-slate-900 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <Truck className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Express Delivery</p>
              <p className="text-[10px] text-slate-400">Ships in 24 hours</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <RotateCcw className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">30-Day Return</p>
              <p className="text-[10px] text-slate-400">Easy refunds</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
              <ShieldCheck className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">2 Year Warranty</p>
              <p className="text-[10px] text-slate-400">100% Genuine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section aria-label="Related Products" className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              More from this category
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Related Products You Might Like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
