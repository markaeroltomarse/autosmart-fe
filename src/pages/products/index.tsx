import { useLazyGetProductsQuery } from '@/store/api/productsApi';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
export default function Products() {
  const router = useRouter();
  const [getProducts, productsState] = useLazyGetProductsQuery();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts(undefined).then(({ data }: any) => {
      console.log(data);
      setProducts(data.data);
    });
  }, []);
  return (
    <>
      <main className="p-5 md:px-[10%] md:py-5">
        <h1 className="text-2xl">
          Products {productsState.isSuccess && productsState?.data.data.length}
        </h1>
        <div className="flex gap-2 flex-row flex-wrap border">
          {productsState.isSuccess &&
            productsState?.data.data.map((product: any) => (
              <div
                className="border p-5 rounded bg-white flex-wrap w-[24.2%]"
                key={product.id}
                onClick={(e) =>
                  router.replace({
                    pathname: `/products/${product.id}`,
                  })
                }
              >
                <Image
                  src={
                    'https://cdn.shopify.com/s/files/1/0580/3245/5858/products/10-pc-chickenjoy-bucket.jpg?v=1635459211&width=1080'
                  }
                  alt="product"
                  width={150}
                  height={150}
                />
                <div className="flex justify-between">
                  <div>{product.name}</div>
                  <div>
                    <span className="text-slate-500 line-through">
                      ${product.price}
                    </span>{' '}
                    ${product.price - product.discount}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
