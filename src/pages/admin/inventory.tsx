import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';
import Alert from '@/components/Alert';
import Button from '@/components/Button';
import ProductForm from '@/components/Forms/product.form';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import Table from '@/components/Table';
import useAlert from '@/hooks/useAlert';
import {
  useDeleteProductMutation,
  useLazyGetProductsQuery,
  useUpdateProductMutation
} from '@/store/api/productsApi';
import { IProductType } from '@/types/product.type';
import Image from 'next/image';
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

  useEffect(() => {
    if (deleteProductState?.error) {
      const err: any = deleteProductState?.error
      alert.execute({
        title: "Cannot delete product.",
        message: err?.data?.message,
        type: 'error'
      })
    }
  }, [deleteProductState?.error])

  const alert = useAlert()

  const [selectedProduct, setSelectedProduct] = useState<IProductType | null>(
    null
  );

  const getProductsHandlers = async () => {
    return getProducts(undefined).then(({ data }) => {
      setProducts(data?.data);
      return data?.data
    });
  };

  const productsTemp = useMemo(() => {
    const temp: IProductType[] = JSON.parse(JSON.stringify(products));

    console.log('temp', temp)
    temp.forEach((item) => {
      if (currentQuantityTxt?.id === item.id) {
        item.quantity = currentQuantityTxt.quantity;
      }

      if (item.images?.length > 0) {
        item.thumbnail = item.images[0]
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
                    })
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
                  onCreated={async () => {
                    await getProductsHandlers();
                    router.replace('/admin/inventory');
                  }}
                  onEdited={async () => {
                    await getProductsHandlers();
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
                          key: 'thumbnail',
                          value: 'Image',
                        },
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
                          key: 'thumbnail',
                          customElement: (data, id) => {
                            return <Image width={100} height={100} src={data} alt='' />
                          }
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
                                  min={0}
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
                                  className={`${data <= 5 && (data === 0 ? 'text-red-500' : 'text-yellow-500')}`}
                                />
                                {changeQuantities.includes(id) && (
                                  <div>
                                    <AiFillCheckSquare
                                      size={40}
                                      color="green"
                                      className="cursor-pointer"
                                      onClick={async () => {
                                        updateProduct({
                                          id: currentQuantityTxt?.id,
                                          quantity: currentQuantityTxt?.quantity,
                                        }).then(async () => {
                                          await getProductsHandlers()
                                          setChangeQuantity(
                                            changeQuantities.filter(
                                              (selected) => selected !== id
                                            )
                                          );
                                        })
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          },
                        },
                      ]}
                      onSelectAction={(e: any) => {
                        const selectedProduct = products.find(
                          (product) => product.id === e.id
                        );
                        setSelectedProduct(selectedProduct!);
                        router.push(`/admin/inventory?action=${e.type}`);
                      }}
                      selectedItem={selectedProduct}
                    />
                    <br /><br />
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
