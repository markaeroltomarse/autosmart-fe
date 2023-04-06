import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';
import Button from '@/components/Button';
import ProductForm from '@/components/Forms/product.form';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import Table from '@/components/Table';
import { COLORS } from '@/constants/colors.contant';
import { wrapper } from '@/store';
import { getProducts, useUpdateProductMutation } from '@/store/api/productsApi';
import { IProductType } from '@/types/product.type';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { AiFillCheckSquare, AiOutlineSearch } from 'react-icons/ai';
export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    const products = await store.dispatch(
      getProducts.initiate(ctx.req.cookies?.token)
    );

    return {
      props: {
        products: products?.data?.data || [],
      },
    };
  });

export default function Dashboard({ products }: { products: IProductType[] }) {
  const router = useRouter();

  const [updateProduct, updateProductState] = useUpdateProductMutation();
  const [searchTxt, setSearchTxt] = useState('');
  const [changeQuantities, setChangeQuantity] = useState<string[]>([]);
  const [currentQuantityTxt, setCurrentQuantityTxt] = useState<{
    id: string;
    quantity: number;
  } | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<IProductType | null>(
    null
  );

  const productsTemp = useMemo(() => {
    const temp: IProductType[] = JSON.parse(JSON.stringify(products));
    temp.forEach((item) => {
      if (currentQuantityTxt?.id === item.id) {
        item.quantity = currentQuantityTxt.quantity;
      }
    });
    return temp.filter((product) => product.name.includes(searchTxt));
  }, [searchTxt, currentQuantityTxt]);

  useEffect(() => {
    if (router.query?.action === 'edit' && !selectedProduct) {
      router.replace('/admin/inventory');
    }
  }, [router.query, selectedProduct]);

  return (
    <>
      <main className="">
        <AdminNav />
        <div className="px-5 md:px-[10%] w-full">
          <h1 className="font-bold text-2xl text-slate-500 my-5">Inventory</h1>
          <div className="flex min-h-[80vh] w-full  ">
            <div className="flex-none">
              <AdminMenu defaultValue="Inventory" />
            </div>
            <div className="flex-1">
              {router.query?.action === 'create' ||
              router.query?.action === 'edit' ? (
                <ProductForm
                  type={router.query?.action}
                  product={selectedProduct!}
                />
              ) : (
                <div className="overflow-x-scroll ">
                  <div className="PRODUCTS_TABLE">
                    <div className="pb-5">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                        }}
                        className="flex justify-between"
                      >
                        <div></div>
                        <div className="flex gap-2">
                          <Button
                            title="Create +"
                            buttonClass="bg-green-500 text-green-100"
                            onClick={() => {
                              router.replace('/admin/inventory?action=create');
                            }}
                          />
                          <Input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) =>
                              setSearchTxt(e.currentTarget.value)
                            }
                            width={200}
                            icon={<AiOutlineSearch size={20} />}
                          />
                        </div>
                      </form>
                    </div>
                    <Table
                      title="Products"
                      headers={[
                        {
                          key: 'brandName',
                          value: 'Brand name',
                        },
                        {
                          key: 'name',
                          value: 'Product',
                        },
                        {
                          key: 'color',
                          value: 'Color',
                        },
                        {
                          key: 'contactOptions',
                          value: 'Contact Options',
                        },
                        {
                          key: 'quantity',
                          value: 'Quantity',
                        },
                        {
                          key: 'action',
                          value: 'Action',
                        },
                      ]}
                      data={productsTemp}
                      rowClassName={[
                        {
                          key: 'color',
                          customElement: (data, id) => {
                            return (
                              <div className="flex gap-1">
                                <select
                                  name=""
                                  id=""
                                  onChange={(e) => {
                                    // const originalQuantity =
                                    //     products.find(
                                    //       (product) => product.id === id
                                    //     )?.color || 'black';
                                  }}
                                >
                                  {COLORS.map((color) => (
                                    <option value={color.hexCode}>
                                      {color.name}
                                    </option>
                                  ))}
                                </select>

                                <div className={`p-3 bg-[${data}]`}></div>
                              </div>
                            );
                          },
                        },
                        {
                          key: 'quantity',
                          customElement: (data, id) => {
                            return updateProductState.isLoading &&
                              currentQuantityTxt?.id === id ? (
                              <BasicLoader />
                            ) : (
                              <div className="relative flex justify-between items-center">
                                <Input
                                  type="number"
                                  value={data}
                                  width={100}
                                  onChange={(e) => {
                                    const originalQuantity =
                                      products.find(
                                        (product) => product.id === id
                                      )?.quantity || 0;
                                    if (
                                      Number(e.currentTarget.value) !==
                                        originalQuantity &&
                                      !changeQuantities.includes(id)
                                    ) {
                                      setChangeQuantity([
                                        ...changeQuantities,
                                        id,
                                      ]);
                                    }

                                    if (
                                      Number(e.currentTarget.value) ===
                                      originalQuantity
                                    ) {
                                      setChangeQuantity(
                                        changeQuantities.filter(
                                          (selected) => selected !== id
                                        )
                                      );
                                    }

                                    setCurrentQuantityTxt({
                                      id: id,
                                      quantity: Number(e.currentTarget.value),
                                    });
                                  }}
                                />
                                {changeQuantities.includes(id) && (
                                  <AiFillCheckSquare
                                    size={40}
                                    color="green"
                                    className="cursor-pointer"
                                    onClick={async (e) => {
                                      await updateProduct({
                                        id: currentQuantityTxt?.id,
                                        quantity: currentQuantityTxt?.quantity,
                                      });
                                    }}
                                  />
                                )}
                              </div>
                            );
                          },
                        },
                      ]}
                      onSelectAction={(e) => {
                        const selectedProduct = products.find(
                          (product) => product.id === e.id
                        );

                        setSelectedProduct(selectedProduct!);

                        if (e.type === 'edit') {
                          router.push('/admin/inventory?action=edit');
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
