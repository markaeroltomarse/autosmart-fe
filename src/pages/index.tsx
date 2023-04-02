import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useLazyGetProductsQuery } from '@/store/api/productsApi'
import { useEffect } from 'react'


export default function Home() {
  const [getProducts, productsState] = useLazyGetProductsQuery()


  useEffect(() => {
    // const { isLoading, isError, data } = productsState
    getProducts(undefined).then(({ data }) => {
      console.log(data)
    })
  }, [])
  return (
    <>
      <Head>
        
      </Head>
      <main>
        <h1 className='text-2xl'>Products {productsState?.data.data.length}</h1>
        {/* <div className='flex'>
          
          {productsState.isSuccess && productsState?.data.data.map((product: any) => 
          <div className='border p-5 rounded text-white'  key={product.id}>
            {product.name}
          </div>)}
        </div> */}
      </main>
    </>
  )
}
