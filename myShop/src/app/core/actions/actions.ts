import { Action } from '@ngrx/store';

import * as types from '../constants/constants';
import { Product } from '../../shared/classes/product';
import { CartItem } from '../../shared/classes/cart-item';

/************************** Cart Action ***************************/

/**
 * Add to Cart
 */
export class AddToCartAction implements Action {
    readonly type = types.ADD_TO_CART;
    constructor(public payload: { product: Product, qty: number }) { }
}

/**
 * Remove from Cart
 */
export class RemoveFromCartAction implements Action {
    readonly type = types.REMOVE_FROM_CART;
    constructor(public payload: { product: CartItem }) { }
}

/**
 * Update Cart Items with qtys
 */
export class UpdateCartAction implements Action {
    readonly type = types.UPDATE_CART;
    constructor(public payload: { cartItems: CartItem[] }) { }
}

/**
 * Refresh store when demo changes
 */
export class RefreshStoreAction implements Action {
    readonly type = types.REFRESH_STORE;
    constructor() { }
}