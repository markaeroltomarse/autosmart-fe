import AAPHeader from '@/assets/images/HEADER.png';
import Searchbar, { ISearchBarFormData } from '@/components/Searchbar';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ICartType } from '@/hooks/useCart';
import { TCategory } from '@/pages/admin/category';
import { useLazyGetCategoriesQuery } from '@/store/api/productsApi';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { MdExpandMore } from 'react-icons/md';
import { delete_cookie } from 'sfcookies';
import Badge from '../Badge';
import Logo from '../Logo';

type Props = {
  onChangeFormData?: (formData: ISearchBarFormData) => void;
};

function extractProductNamesAndTypes(items: any[]) {
  let result: any[] = [];

  items.forEach(item => {
    // Add the product type or name to the result array
    if (item.productType) {
      result.push(item.name);
    }

    // Recursively process children if they exist
    if (item.children && item.children.length > 0) {
      result = result.concat(extractProductNamesAndTypes(item.children));
    }
  });

  return [...new Set(result)]
}

function Navbar(props: Props) {
  const user = useAppSelector(state => state.userReducer.user)
  const [formData, setFormData] = useState({
    search: '',
    category: ''
  })

  const cart: ICartType = useAppSelector(store => store.cartReducer.cart)

  const [getCategories, getCategoriesState] = useLazyGetCategoriesQuery();
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
  // [
  //   {
  //     productType: "type 1",
  //     children: [

  //     ]
  //   },
  //   {
  //     productType: "type 2",
  //     children: [
  //       {
  //         name: "type 2 product 1",
  //         productType: "name"
  //       },
  //       {
  //         name: "type 2 product 2",
  //         productType: "name"
  //       }
  //     ]
  //   }
  // ]

  // expected result

  // ["type 1", "type 2 product 1", "type 2 product 2"]

  useEffect(() => {
    getCategories('all');
  }, []);

  return (
    <div className="pt-12 bg-blue-950 relative flex flex-col">
      <Image
        className="z-[0]"
        src={
          AAPHeader
        }
        fill
        alt="asmartheader2"
      />
      <div className="flex justify-between md:px-[5%] items-center">
        <Logo className="z-[1] w-[180px] h-[80px] border-2 border-blue-900 rounded-md flex bg-white"
        />
        <Searchbar
          wrapperClassName='z-[10]'
          placeholder='Enter product name, Category'
          onChange={(formData) => {
            setFormData(formData)
            props?.onChangeFormData?.(formData)
          }}
          dropdownValues={categories?.length > 0 ? extractProductNamesAndTypes(categories) : []}
        />
        <div className="z-[2] flex gap-5 p-3 items-center ">
          <div className="z-[3] text-center font-bold ">
            {!user
              ? (
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

                  <Link href={user?.role === "customer" ? '/customer' : "/admin"}>My Account</Link>
                </>
              )}
          </div>
          <Link href="/cart ">
            <Badge text={cart?.products?.length > 0 ? String(cart?.products?.length) : undefined} color='bg-red-500' >
              <BsFillCartCheckFill size={30} color="black" />
            </Badge>
          </Link>
        </div>
      </div>

      <div className=" flex justify-between md:px-[5%] items-center ">
        <div className="z-20 p-2 text-blue-950 font-bold flex gap-3">
          {categories &&
            categories.map((category, i) => (
              <div key={JSON.stringify(category.children) + '-' + i}>
                <div
                  onClick={() => {
                    setFormData({
                      ...formData,
                      category: formData?.category !== category.productType &&
                        category.productType
                    })
                    if (
                      props?.onChangeFormData &&
                      formData?.category === category.productType
                    ) {
                      props.onChangeFormData?.({
                        ...formData,
                        category: ''
                      });
                    }
                  }}
                  className="flex justify-between items-center"
                >
                  {category.productType} <MdExpandMore size={25} />
                </div>

                {formData?.category === category.productType && (
                  <div className="absolute bg-white text-blue-950 p-3 shadow-md rounded flex flex-col gap-3 cursor-pointer ">
                    {category.children.map((category: TCategory, i: number) => (
                      <div
                        key={category.name + '-' + i}
                        onClick={() => {
                          props.onChangeFormData?.({
                            ...formData,
                            category: category.name
                          });
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
