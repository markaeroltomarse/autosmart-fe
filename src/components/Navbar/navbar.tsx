import TopBarBg from '@/assets/images/top_bar.png';
import Searchbar from '@/components/Searchbar';
import { TCategory } from '@/pages/admin/category';
import { useLazyGetCategoriesQuery } from '@/store/api/productsApi';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { MdExpandMore } from 'react-icons/md';
import { delete_cookie, read_cookie } from 'sfcookies';
import Logo from '../Logo';

type Props = {
  onSelectedCategory?: (e: string) => void;
};

function Navbar(props: Props) {
  const [getCategories, getCategoriesState] = useLazyGetCategoriesQuery();
  const [selectedProductType, setSelectedProductType] = useState(null);
  const categories: any[] = useMemo(() => {
    if (getCategoriesState.error) return [];

    return getCategoriesState.data?.data.reduce(
      (accumulator: any[], current: TCategory) => {
        const existingProduct = accumulator.find(
          (product) => product.productType === current.productType
        );
        if (existingProduct) {
          existingProduct.children.push(current);
        } else {
          accumulator.push({
            productType: current.productType,
            children: [current],
          });
        }
        return accumulator;
      },
      []
    );
  }, [getCategoriesState]);

  useEffect(() => {
    getCategories('all');
  }, []);
  return (
    <div className="pt-12 bg-blue-950 relative flex flex-col">
      <Image
        className="z-[0]"
        src={
          TopBarBg
        }
        fill
        alt="asmartheader2"
      />
      <div className="flex justify-between md:px-[5%] items-center">
        <Logo className="z-[1] w-[100px] h-[65px] border-2 border-blue-900 rounded-md flex" />

        <Searchbar />

        <div className="z-[2] flex gap-5 p-3 items-center ">
          <div className="z-[3] text-center font-bold ">
            {read_cookie('token').length === 0 ||
              read_cookie('token') === undefined ? (
              <div className="hover:text-gray-300">
                <Link href={'/account/authentication'}>LOGIN / SIGN UP</Link>
                <br />
              </div>
            ) : (
              <>
                <div className="hover:text-gray-300">
                  <Link
                    href={'/api/auth/logout'}
                    onClick={() => delete_cookie('token')}
                  >
                    Logout
                  </Link>
                  <br />
                </div>

                <Link href={'/customer'}>My Account</Link>
              </>
            )}
          </div>
          <Link href="/cart ">
            <BsFillCartCheckFill size={30} color="black" />
          </Link>
        </div>
      </div>

      <div className=" z-[1] flex justify-between md:px-[5%] items-center ">
        <div className="p-2 text-white font-bold flex gap-3">
          {categories &&
            categories.map((category, i) => (
              <div key={JSON.stringify(category.children) + '-' + i}>
                <div

                  onClick={() => {
                    setSelectedProductType(
                      selectedProductType !== category.productType &&
                      category.productType
                    );

                    if (
                      props?.onSelectedCategory &&
                      selectedProductType === category.productType
                    ) {
                      props.onSelectedCategory!('');
                    }
                  }}
                  className="flex justify-between items-center"
                >
                  {category.productType} <MdExpandMore size={25} />
                </div>

                {selectedProductType === category.productType && (
                  <div className="absolute bg-white text-red-500 p-3 shadow-md rounded flex flex-col gap-3 cursor-pointer ">
                    {category.children.map((category: TCategory, i: number) => (
                      <div
                        key={category.name + '-' + i}
                        onClick={() => {
                          if (props?.onSelectedCategory)
                            props.onSelectedCategory!(category.name);
                        }}
                        className="border-b hover:bg-red-100"
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
