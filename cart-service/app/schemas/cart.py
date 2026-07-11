from decimal import Decimal
from typing import List

from pydantic import BaseModel, Field


class CartItemCreate(BaseModel):
    product_id: int
    product_name: str
    unit_price: Decimal
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    unit_price: Decimal
    quantity: int

    model_config = {"from_attributes": True}


class CartOut(BaseModel):
    id: int
    user_id: int
    items: List[CartItemOut] = []
    total: Decimal = Decimal("0.00")

    model_config = {"from_attributes": True}
