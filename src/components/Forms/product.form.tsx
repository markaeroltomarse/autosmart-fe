import { COLORS } from '@/constants/colors.contant';
import { TCategory } from '@/pages/admin/category';
import {
  useCreateProductMutation,
  useLazyGetCategoriesQuery,
  useUpdateProductMutation
} from '@/store/api/productsApi';
import { IProductType } from '@/types/product.type';
import { useEffect, useMemo, useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import LoadingScreen from '../Loader/LoadingScreen';
import Select from '../Select';

interface IProductTypeProps {
  product?: IProductType;
  type?: 'create' | 'edit';
  onCreated?: (data: any) => void;
  onEdited?: (data: any) => void;
  onError?: (data: any) => void;
}

export default function ProductForm({
  product,
  type,
  onCreated,
  onEdited,
  onError,
}: IProductTypeProps) {
  const [getCategories, getCategoriesState] = useLazyGetCategoriesQuery();
  const [isLoading, setLoading] = useState(false);
  const [createProduct, createProductState] = useCreateProductMutation();
  const [updateProduct, updateProductState] = useUpdateProductMutation();
  const [formData, setFormData] = useState({
    id: product?.id || undefined,
    name: product?.name || '',
    brandName: product?.brandName || '',
    category: product?.category || '',
    price: product?.price,
    quantity: product?.quantity,
    status: product?.status || '',
    discount: product?.discount,
    color: product?.color || '',
    contactOptions: product?.contactOptions || '',
    images: product?.images || ['', '', ''],
  });

  const categories = useMemo(() => {
    if (!getCategoriesState.isSuccess) return [];
    return getCategoriesState.data?.data.map(
      (category: TCategory) => category.name
    );
  }, [getCategoriesState]);

  const getCategoriesHandler = async () => {
    await getCategories('all');
  };

  useEffect(() => {
    getCategoriesHandler();
  }, []);

  const handleSubmitProductForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data: any;
      if (type === 'create') {
        data = await createProduct(formData as any);
        onCreated?.('success');
      } else {
        data = await updateProduct(formData);
        onEdited?.('success');
      }
      if (data?.error) {
        throw new Error('Operation failed');
      }
    } catch (error) {
      onError?.('Cannot process the request, Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded p-6">
      {isLoading && (
        <LoadingScreen
          message="Processing..."
          className="fixed left-0 top-0 h-screen z-50 bg-slate-500 bg-opacity-50"
          transparent
        />
      )}

      <form onSubmit={handleSubmitProductForm} className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">
          {product ? 'Update' : 'Create'} Product
        </h1>
        <hr />
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter name"
            className="bg-slate-100"
            required
            value={formData.name}
            name="name"
            onChange={(e) =>
              setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value })
            }
          />
          <Input
            type="text"
            placeholder="Enter brand name"
            className="bg-slate-100"
            required
            value={formData.brandName}
            name="brandName"
            onChange={(e) =>
              setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value })
            }
          />
          <Select
            placeholder="Select Category"
            options={categories}
            className="bg-slate-100"
            required
            value={formData.category}
            name="category"
            onChange={(e) =>
              setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <small className="flex gap-2">
                <span className="text-red-500">*</span>
                Price
              </small>
              <Input
                type="number"
                placeholder="Enter price"
                className="bg-slate-100"
                required
                value={formData.price}
                name="price"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.currentTarget.name]: Number(e.currentTarget.value),
                  })
                }
              />
            </div>
            <div>
              <small className="flex gap-2">
                <span className="text-red-500">*</span>
                Quantity
              </small>
              <Input
                type="number"
                placeholder="Enter quantity"
                className="bg-slate-100"
                required
                value={formData.quantity}
                name="quantity"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.currentTarget.name]: Number(e.currentTarget.value),
                  })
                }
              />
            </div>
            <div>
              <small className="flex gap-2">
                <span className="text-red-500">*</span>
                Discount
              </small>
              <Input
                type="number"
                placeholder="Enter discount"
                className="bg-slate-100"
                pattern="[0-9]*"
                title="Please enter an integer value"
                required
                value={formData.discount}
                name="discount"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.currentTarget.name]: Number(e.currentTarget.value),
                  })
                }
              />
            </div>
          </div>
          <Select
            placeholder="Select Status"
            options={['Brand New', 'Surplus']}
            className="bg-slate-100"
            required
            value={formData.status}
            name="status"
            onChange={(e) =>
              setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value })
            }
          />
          <Select
            placeholder="Select Color"
            options={COLORS.map(color => color.name)}
            className="bg-slate-100"
            required
            value={formData.color}
            name="color"
            onChange={(e) =>
              setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value })
            }
          />
          <div className="space-y-2">
            {formData.images.map((image, index) => (
              <Input
                key={index}
                type="text"
                placeholder={`Enter Image ${index + 1}`}
                className="bg-slate-100"
                required
                value={image}
                onChange={(e) => {
                  const images = [...formData.images];
                  images[index] = e.target.value;
                  setFormData({ ...formData, images });
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            title="Save"
            buttonType="submit"
            buttonClass="bg-green-500 text-white py-2 px-4 rounded"
          />
        </div>
      </form>
    </div>
  );
}
