import { useLazyGetCartQuery, useRemoveCartItemsMutation } from "@/store/api/cartApi";
import { addToCart, setCart, } from "@/store/reducers/cartsReducers";
import { IProductType } from "@/types/product.type";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

export interface ICartItem {
    color: string;
    application: string;
    product: IProductType;
    quantity: number;
    id: string
    productId: string
}

export interface ICartType {
    id: string;
    customerId: string;
    products: ICartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface useCartProps {

}

const useCart = (props?: useCartProps) => {
    const dispatch = useAppDispatch()
    const [getCart, getCartState] = useLazyGetCartQuery();
    const [removeCartItems, removeCartItemsState] = useRemoveCartItemsMutation()

    const cart: ICartType | null = useAppSelector(store => store.cartReducer.cart)

    const handleAddToCart = (cartItem: ICartItem) => dispatch(addToCart(cartItem))
    const handleSetCart = (cart: ICartType) => {
        dispatch(setCart(cart))
    }

    const removeCartRemoveItems = async (productCartRecordIds: string[]) => {
        if (!cart) {
            return null
        }

        await removeCartItems({
            cartId: cart.id,
            productCartRecordIds
        }).then(() => {
            const updatedCart: ICartType = {
                ...cart,
                products: cart.products.filter((product: ICartItem) => !productCartRecordIds.includes(product.id))
            }
            dispatch(setCart(updatedCart))
        })
    }

    const handleGetProducts = async () => {
        const { isError, data }: any = await getCart(undefined)

        if (!isError) {
            const cartResponse: ICartType = data.data;
            console.log(cartResponse);
            handleSetCart(cartResponse)

            return cartResponse
        } else {
            return null
        }
    };


    return {
        handleGetProducts,
        handleAddToCart,
        handleSetCart,
        removeCartRemoveItems,
        getCartState,
        removeCartItemsState,
        cart
    };
};

export default useCart;
