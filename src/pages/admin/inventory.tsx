import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';
import Alert from '@/components/Alert';
import Button from '@/components/Button';
import ProductForm from '@/components/Forms/product.form';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import Select from '@/components/Select';
import Table from '@/components/Table';
import { COLORS } from '@/constants/colors.contant';
import { wrapper } from '@/store';
import {
  getProducts,
  useDeleteProductMutation,
  useLazyGetCategoriesQuery,
  useLazyGetProductsQuery,
  useUpdateProductMutation,
} from '@/store/api/productsApi';
import { IProductType } from '@/types/product.type';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { AiFillCheckSquare, AiOutlineSearch } from 'react-icons/ai';
// export const getServerSideProps: GetServerSideProps =
//   wrapper.getServerSideProps((store) => async (ctx) => {
//     const products = await store.dispatch(
//       getProducts.initiate(ctx.req.cookies?.token)
//     );

//     return {
//       props: {
//         products: products?.data?.data || [],
//       },
//     };
//   });

export default function Dashboard() {
  const router = useRouter();

  const [updateProduct, updateProductState] = useUpdateProductMutation();
  const [deleteProduct, deleteProductState] = useDeleteProductMutation();
  const [searchTxt, setSearchTxt] = useState('');
  const [changeQuantities, setChangeQuantity] = useState<string[]>([]);
  const [currentQuantityTxt, setCurrentQuantityTxt] = useState<{
    id: string;
    quantity: number;
  } | null>(null);

  const [getProducts, getProductsState] = useLazyGetProductsQuery();
  const [products, setProducts] = useState<IProductType[]>([]);
  useEffect(() => {
    getProducts(undefined).then(({ data }) => {
      setProducts(data?.data);
    });
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<IProductType | null>(
    null
  );

  const getProductsHanlders = () => {
    getProducts(undefined).then(({ data }) => {
      setProducts(data?.data);
    });
  };

  const productsTemp = useMemo(() => {
    const temp: IProductType[] = JSON.parse(JSON.stringify(products));
    temp.forEach((item) => {
      if (currentQuantityTxt?.id === item.id) {
        item.quantity = currentQuantityTxt.quantity;
      }
    });
    return temp.filter((product) => product.name.includes(searchTxt));
  }, [searchTxt, currentQuantityTxt, products]);

  useEffect(() => {
    if (router.query?.action === 'edit' && !selectedProduct) {
      router.replace('/admin/inventory');
    }

    if (router.query?.action === 'delete' && !selectedProduct) {
      router.replace('/admin/inventory');
    }
  }, [router.query, selectedProduct]);

  useEffect(() => {}, []);

  return (
    <>
      <main className="">
        {deleteProductState.isLoading && (
          <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
            <BasicLoader />
          </div>
        )}
        <AdminNav />
        <div className="px-5 md:px-[10%] w-full">
          <h1 className="font-bold text-2xl text-slate-500 my-5">Inventory</h1>
          <div className="flex min-h-[80vh] w-full  ">
            <div className="flex-none">
              <AdminMenu defaultValue="Inventory" />
            </div>
            <div className="flex-1">
              {router.query.action === 'delete' && (
                <Alert
                  type={'confirm'}
                  title={'Are you sure want to delete this product?'}
                  message={''}
                  onOk={() => {
                    deleteProduct(selectedProduct?.id!).then(() => {
                      setSelectedProduct(null);
                      router.reload();
                    });
                  }}
                  onCancel={() => {
                    setSelectedProduct(null);
                  }}
                />
              )}
              {router.query?.action === 'create' ||
              router.query?.action === 'edit' ? (
                <ProductForm
                  type={router.query?.action}
                  product={selectedProduct!}
                  onCreated={() => {
                    getProductsHanlders();
                    router.replace('/admin/inventory');
                  }}
                  onEdited={() => {
                    getProductsHanlders();
                    router.replace('/admin/inventory');
                  }}
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

                                      getProductsHanlders()
                                      setChangeQuantity(
                                        changeQuantities.filter(
                                          (selected) => selected !== id
                                        )
                                      );
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
                        router.push(`/admin/inventory?action=${e.type}`);
                      }}
                      selectedItem={selectedProduct}
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
