import React from "react";

class CartAttribute extends React.Component {
  isSelected = (attributeItem) => {
    return this.props.selectedAttributes.some(
      (selectedAttribute) =>
        selectedAttribute.attributeName === this.props.attribute.key &&
        selectedAttribute.attributeId === attributeItem.id
    );
  };

  toKebabCase = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  };

  render() {
    const { attribute } = this.props;
    const attributeNameKebabCase = this.toKebabCase(attribute.key);

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
                this.isSelected(attributeItem)
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              } pointer-events-none`}
              data-testid={
                this.isSelected(attributeItem)
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
  }
}

export default CartAttribute;
