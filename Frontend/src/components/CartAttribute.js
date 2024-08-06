import React from "react";

function CartAttribute({ attribute, selectedAttributes }) {
  const isSelected = (attributeItem) => {
    return selectedAttributes.some(
      (selectedAttribute) =>
        selectedAttribute.attributeName === attribute.key &&
        selectedAttribute.attributeId === attributeItem.id
    );
  };

  const toKebabCase = (str) => {
    return str.toLowerCase()
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  };

  const attributeNameKebabCase = toKebabCase(attribute.key);

  switch (attribute.values[0].type) {
    case "text":
      return (
        <div
          className="flex flex-col"
          data-testid={`cart-item-attribute-${attributeNameKebabCase}`}
        >
          <p className="text-sm mt-2">{attribute.key}:</p>
          <div className="flex overflow-x-scroll hide-scrollbar space-x-2 mt-2">
            {attribute.values.map((attributeItem) => (
              <div
                key={attributeItem.id}
                className={`w-10 h-10 text-xs border flex items-center justify-center ${
                  isSelected(attributeItem)
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300"
                } pointer-events-none`}
                data-testid={
                  isSelected(attributeItem)
                    ? `cart-item-attribute-${attributeNameKebabCase}-${attributeItem.displayValue}-selected`
                    : `cart-item-attribute-${attributeNameKebabCase}-${attributeItem.displayValue}`
                }
              >
                {attributeItem.value}
              </div>
            ))}
          </div>
        </div>
      );
    case "swatch":
      return (
        <div
          className="flex flex-col"
          data-testid={`cart-item-attribute-${attributeNameKebabCase}`}
        >
          <p className="text-sm mt-2">{attribute.key}:</p>
          <div className="flex w-36 overflow-x-scroll hide-scrollbar space-x-2 mt-2">
            {attribute.values.map((attributeItem) => (
              <div
                key={attributeItem.id}
                className={`w-5 h-5 border ${
                  isSelected(attributeItem) ? "border-black" : "border-gray-300"
                } pointer-events-none`}
                style={{ backgroundColor: attributeItem.value }}
                data-testid={
                  isSelected(attributeItem)
                    ? `cart-item-attribute-${attributeNameKebabCase}-${attributeNameKebabCase}-selected`
                    : `cart-item-attribute-${attributeNameKebabCase}-${attributeNameKebabCase}`
                }
              ></div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default CartAttribute;
