import { Metadata } from "next";
import ProductList from "@/components/shared/product/product-list";
import { getFeaturedProducts, getLatestProducts } from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
// import sampleData from "@/db/sample-data";

export const metadata: Metadata = {
  title: "Home",
};

//to test loader
// const delay = (ms) => new Promise((resolve)=>setTimeout(resolve, ms));

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  const products = latestProducts.map((p) => ({
    ...p,
    price: p.price.toString(), // Decimal -> string
    rating: p.rating?.toString(),
  }));
  //to test loader
  // await delay(2000);

  return (
    <>
    {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={products} title="Newest Arrivals" limit={4} />
      <ViewAllProductsButton />
    </>
  );
};

export default Homepage;
