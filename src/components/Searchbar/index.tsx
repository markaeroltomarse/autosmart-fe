import { TCategory } from '@/pages/admin/category';
import { useLazyGetCategoriesQuery } from '@/store/api/productsApi';
import React, { useEffect, useMemo, useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoClose } from "react-icons/io5";
import Select from '../Select';

export interface ISearchBarFormData {
  search: string,
  category: string
}

export interface SearchBarProps {
  // Add any additional props you might need in the future
  wrapperClassName?: string
  placeholder?: string
  onChange?: (formData: ISearchBarFormData) => void
  dropdownValues?: string[]
}

const SearchBar: React.FC<SearchBarProps> = ({ wrapperClassName, placeholder, onChange, dropdownValues }) => {
  const [formData, setFormData] = useState({
    search: '',
    category: ''
  })

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

  const dropdownFinalValue = dropdownValues || (categories?.length > 0 ? categories.map(category => category.productType) : [])

  useEffect(() => {
    if (!dropdownValues || dropdownValues?.length === 0) {
      getCategories('all');
    }
  }, [dropdownValues]);

  return (
    <div className={`flex bg-white w-[400px] items-center rounded-md border border-gray-300 shadow-md hover:shadow-lg ${wrapperClassName} hover:scale-105 transition-all`}>
      <input
        className='flex-grow px-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500'
        type="text"
        placeholder={placeholder || "Search..."}
        onChange={(e) => {
          setFormData({ ...formData, search: e.target.value })
          onChange?.({ ...formData, search: e.target.value })
        }}
        value={formData?.search}
      />
      <Select
        onChange={(e) => {
          setFormData({ ...formData, category: e.target.value })
          onChange?.({ ...formData, category: e.target.value })
        }}
        className='ml-2 flex-shrink-0 border-l border-gray-300 bg-gray-200'
        options={dropdownFinalValue}
        value={formData?.category}
      />
      <div className='px-3 flex gap-4'>
        <BiSearchAlt2 size={25} className='text-gray-700' />
        {Object.values(formData).some(value => !!value) && <IoClose
          size={25}
          className='text-gray-700 cursor-pointer hover:scale-105'
          onClick={() => {
            setFormData({
              search: '',
              category: ''
            })
            onChange?.({
              search: '',
              category: ''
            })
          }}
        />}
      </div>
    </div>
  );
};

export default SearchBar;
