import BestSellingProducts from "@/src/components/Islamic-shop/BestSellingProducts";
import CategorySection from "@/src/components/Islamic-shop/CategorySection";
import ProductSearchBar from "@/src/components/Islamic-shop/ShopSearch";
import ShopHeroSlider from "@/src/components/Islamic-shop/Slider";
import TrustBadges from "@/src/components/Islamic-shop/TrustBadges";

const page = () => {
  return (
    <div className="bg-white">
      <ShopHeroSlider />
      <ProductSearchBar />
      <section id="all-products">
        <CategorySection />
      </section>
      <BestSellingProducts />
      <TrustBadges />
    </div>
  );
};

export default page;
