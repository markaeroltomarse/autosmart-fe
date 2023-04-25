import AdminMenu from '@/components/AdminMenu';
import AdminNav from '@/components/AdminNav';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BasicLoader from '@/components/Loader/basic-loader';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useLazyGetCategoriesQuery,
} from '@/store/api/productsApi';
import { useEffect, useMemo, useState } from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';

export type TCategory = {
  id: string;
  name: string;
  productType: string;
};

export default function Category() {
  const [createCategory, createCategoryState] = useCreateCategoryMutation();
  const [getCategories, getCategoriesState] = useLazyGetCategoriesQuery();
  const [deleteCategory, deleteCategoryState] = useDeleteCategoryMutation();

  const [formCategory, setFormCategory] = useState({
    name: '',
    productType: '',
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await createCategory(formCategory);
    await getCategoriesHandler();
    setFormCategory({
      name: '',
      productType: '',
    });
  };

  const getCategoriesHandler = async () => {
    await getCategories('all');
  };

  const categories: TCategory[] = useMemo(() => {
    if (getCategoriesState.error) return [];

    return getCategoriesState.data?.data;
  }, [getCategoriesState]);

  useEffect(() => {
    getCategoriesHandler();
  }, []);
  return (
    <>
      <main className="">
        {(deleteCategoryState.isLoading ||
          getCategoriesState.isLoading ||
          createCategoryState.isLoading) && (
          <div className="fixed top-0 left-0 flex items-center justify-center bg-slate-800 bg-opacity-50 w-full h-full z-[10]">
            <BasicLoader />
          </div>
        )}
        <AdminNav />
        <div className="px-5 md:px-[10%] w-full">
          <h1 className="font-bold text-2xl text-slate-500 my-5">Categories</h1>
          <div className="flex min-h-[80vh] w-full  ">
            <div className="flex-none">
              <AdminMenu defaultValue="Categories" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-white p-3 rounded-md shadow w-[500px] flex flex-col gap-4">
                <h3 className="font-bold text-slate-600">Categories</h3>
                <form
                  className="border p-3 flex gap-3 "
                  onSubmit={handleSubmit}
                >
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Category name"
                      required
                      label="Name"
                      name="name"
                      value={formCategory.name}
                      onChange={(e) =>
                        setFormCategory({
                          ...formCategory,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="text"
                      name="productType"
                      placeholder="Product Type"
                      required
                      label="Product Type"
                      value={formCategory.productType}
                      onChange={(e) =>
                        setFormCategory({
                          ...formCategory,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    buttonClass="bg-blue-800 w-[150px] text-blue-100"
                    title="Create +"
                    buttonType="submit"
                  />
                </form>

                {categories &&
                  categories.length > 0 &&
                  categories.map((category: TCategory) => (
                    <div
                      className="border rounded p-3 flex justify-between"
                      key={category.id}
                    >
                      <div>
                        <h2 className="text-sm text-slate-500">
                          {category.name}
                        </h2>
                        <small className="text-slate-500">
                          {category.productType}
                        </small>
                      </div>

                      <Button
                        buttonClass="bg-red-500 text-red-100 items-center justify-center"
                        icon={<AiTwotoneDelete size={20} />}
                        onClick={async () => {
                          await deleteCategory(category.id);
                          await getCategoriesHandler();
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
