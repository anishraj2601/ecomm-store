import { Metadata } from "next";
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
// import sampleData from "@/db/sample-data";

export const metadata: Metadata = {
  title: "Home",
};

//to test loader
// const delay = (ms) => new Promise((resolve)=>setTimeout(resolve, ms));

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const products = latestProducts.map((p) => ({
    ...p,
    price: p.price.toString(), // Decimal -> string
    rating: p.rating?.toString(),
  }));
  //to test loader
  // await delay(2000);

  return (
    <>
      <ProductList data={products} title="Newest Arrivals" limit={4} />
    </>
  );
};

export default Homepage;
