from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import CurrentUser, get_current_user
from app.models.cart import Cart, CartItem
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartOut

router = APIRouter(prefix="/api/cart", tags=["cart"])


def _get_or_create_cart(db: Session, user_id: int) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if cart is None:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def _serialize(cart: Cart) -> CartOut:
    total = sum((item.unit_price * item.quantity for item in cart.items), Decimal("0.00"))
    out = CartOut.model_validate(cart)
    out.total = total
    return out


@router.get("", response_model=CartOut)
def get_cart(db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    cart = _get_or_create_cart(db, user.user_id)
    return _serialize(cart)


@router.post("/items", response_model=CartOut, status_code=status.HTTP_201_CREATED)
def add_item(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user.user_id)

    existing = next((i for i in cart.items if i.product_id == item.product_id), None)
    if existing:
        existing.quantity += item.quantity
    else:
        db.add(
            CartItem(
                cart_id=cart.id,
                product_id=item.product_id,
                product_name=item.product_name,
                unit_price=item.unit_price,
                quantity=item.quantity,
            )
        )

    db.commit()
    db.refresh(cart)
    return _serialize(cart)


@router.put("/items/{item_id}", response_model=CartOut)
def update_item(
    item_id: int,
    payload: CartItemUpdate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user.user_id)
    target = next((i for i in cart.items if i.id == item_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Cart item not found")

    target.quantity = payload.quantity
    db.commit()
    db.refresh(cart)
    return _serialize(cart)


@router.delete("/items/{item_id}", response_model=CartOut)
def remove_item(
    item_id: int,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, user.user_id)
    target = next((i for i in cart.items if i.id == item_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(target)
    db.commit()
    db.refresh(cart)
    return _serialize(cart)


@router.delete("", response_model=CartOut)
def clear_cart(db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    cart = _get_or_create_cart(db, user.user_id)
    for item in list(cart.items):
        db.delete(item)
    db.commit()
    db.refresh(cart)
    return _serialize(cart)
