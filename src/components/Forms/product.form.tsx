import { COLORS } from '@/constants/colors.contant';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';
import { IProductType } from '@/types/product.type';
import { useState } from 'react';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/store/api/productsApi';
import { useRouter } from 'next/router';
import LoadingScreen from '../Loader/LoadingScreen';

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
  if (product && type !== 'edit') {
    if (onError) onError('Product and Type is required.');
  }
  const [isLoading, setLoading] = useState(false);
  const [createProduct, createProductState] = useCreateProductMutation();
  const [updateProduct, updateProductState] = useUpdateProductMutation();
  const [formData, setFormData] = useState({
    id: product?.id || undefined,
    name: product?.name || '',
    brandName: product?.brandName || '',
    category: product?.category || '',
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    status: product?.status || '',
    discount: product?.discount || 0,
    color: product?.color || '',
    contactOptions: product?.contactOptions || '',
    images: product?.images || ['', '', ''],
  });

  return (
    <div className="w-[50%] bg-white">
      {isLoading && (
        <LoadingScreen
          message=""
          className="fixed left-0 top-0 h-screen z-50 bg-slate-500 bg-opacity-50"
          transparent
        />
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          if (type === 'create') {
            const data: any = await createProduct(formData);
            if (data?.error) {
              if (onError) onError('Cannot create product, Please try again.');
            } else {
              if (onCreated) {
                onCreated('success');
              }
            }
          } else {
            const data: any = await updateProduct(formData);

            if (data?.error) {
              if (onError) onError('Cannot update product, Please try again.');
            } else {
              if (onEdited) {
                onEdited('success');
              }
            }
          }

          setLoading(false);
        }}
        className="p-5"
      >
        <h1 className="text-1xl text-slate-800">Create product +</h1>
        <hr />
        <div className="flex flex-col gap-2 mt-2">
          <Input
            type="text"
            placeholder="Enter name.."
            className="bg-slate-100"
            required
            value={formData.name}
            name="name"
            onChange={(e) =>
              setFormData({
                ...formData,
                [e.currentTarget.name]: e.currentTarget.value,
              })
            }
          />
          <Input
            type="text"
            placeholder="Enter brand name.."
            className="bg-slate-100"
            required
            value={formData.brandName}
            name="brandName"
            onChange={(e) =>
              setFormData({
                ...formData,
                [e.currentTarget.name]: e.currentTarget.value,
              })
            }
          />
          <Select
            placeholder="Select Category"
            options={['Category 1', 'Category 2']}
            className="bg-slate-100 "
            required
            value={formData.category}
            name="category"
            onChange={(e) =>
              setFormData({
                ...formData,
                [e.currentTarget.name]: e.currentTarget.value,
              })
            }
          />
          <hr />
          <div>
            <small className="flex gap-2">
              <span className="text-red-500">*</span>
              Price
            </small>
            <Input
              type="number"
              placeholder="Enter price.."
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
              placeholder="Enter quantity.."
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
              placeholder="Enter discount.."
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
          <hr />
          <Select
            placeholder="Select Status"
            options={['Status 1', 'Status 2']}
            className="bg-slate-100 "
            required
            value={formData.status}
            name="status"
            onChange={(e) =>
              setFormData({
                ...formData,
                [e.currentTarget.name]: e.currentTarget.value,
              })
            }
          />
          <Select
            placeholder="Select Color"
            options={COLORS.map((color) => color.name)}
            className="bg-slate-100 "
            required
            value={formData.color}
            name="color"
            onChange={(e) =>
              setFormData({
                ...formData,
                [e.currentTarget.name]: e.currentTarget.value,
              })
            }
          />
          <div className="border bottom-0"></div>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Enter Image 1"
              className="bg-slate-100"
              required
              value={formData.images[0]}
              onChange={(e) => {
                const images = JSON.parse(JSON.stringify(formData.images));
                images[0] = e.target.value;
                setFormData({ ...formData, images: images });
              }}
            />

            <Input
              type="text"
              placeholder="Enter Image 2"
              className="bg-slate-100"
              value={formData.images[1]}
              onChange={(e) => {
                const images = JSON.parse(JSON.stringify(formData.images));
                images[1] = e.target.value;
                setFormData({ ...formData, images: images });
              }}
            />

            <Input
              type="text"
              placeholder="Enter Image 3"
              className="bg-slate-100"
              value={formData.images[2]}
              onChange={(e) => {
                const images = JSON.parse(JSON.stringify(formData.images));
                images[2] = e.target.value;
                setFormData({ ...formData, images: images });
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            title="Save"
            buttonType="submit"
            buttonClass="bg-green-500 text-green-100 my-2"
          />
        </div>
      </form>
    </div>
  );
}
