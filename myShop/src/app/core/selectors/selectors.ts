// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CartItemState } from '../reducers/cart.reducer';

export const getCartItemsState = createFeatureSelector<CartItemState>('cart');

/************************    CartItem Selectors   ***********************/
export const cartItemsSelector = createSelector(
    getCartItemsState, cartItemState => {
        return cartItemState.data;
    }
);