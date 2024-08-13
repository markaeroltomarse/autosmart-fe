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
          <h1 className="font-bold text-2xl text-slate-700 my-5">Categories</h1>
          <div className="flex min-h-[80vh] w-full gap-6">
            <div className="flex-none w-64">
              <AdminMenu defaultValue="Categories" />
            </div>
            <div className="flex-grow">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-slate-600 mb-4">Create New Category</h3>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      placeholder="Category name"
                      required
                      label="Product Type"
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
                      label="Brand"
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
                    buttonClass="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    title="Create +"
                    buttonType="submit"
                  />
                </form>
              </div>
              <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-slate-600 mb-4">Existing Categories</h3>
                {categories && categories.length > 0 ? (
                  categories.map((category: TCategory) => (
                    <div
                      className="border-b last:border-0 p-3 flex justify-between items-center"
                      key={category.id}
                    >
                      <div>
                        <h2 className="text-sm font-medium text-slate-700">
                          {category.name}
                        </h2>
                        <small className="text-slate-500">
                          {category.productType}
                        </small>
                      </div>
                      <Button
                        buttonClass="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                        icon={<AiTwotoneDelete size={20} />}
                        onClick={async () => {
                          await deleteCategory(category.id);
                          await getCategoriesHandler();
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No categories available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
