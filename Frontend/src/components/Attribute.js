import React from "react";

function Attribute({ attribute, selectedAttributes, setSelectedAttributes }) {
  const [selectedValue, setSelectedValue] = React.useState(
    attribute.values[0].id || ""
  );

  React.useEffect(() => {
    setSelectedAttributes((prevState) => ({
      ...prevState,
      [attribute.key]: selectedValue,
    }));
  }, [selectedValue, attribute.key, setSelectedAttributes]);

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
          className="flex flex-col overflow-x-auto hide-scrollbar"
          data-testid={`product-attribute-${attributeNameKebabCase}`}
        >
          <p className="text-sm font-bold mt-4">
            {attribute.key.toUpperCase()}:
          </p>
          <div className="flex space-x-2 mt-2">
            {attribute.values.map((attributeItem) => (
              <button
                key={attributeItem.id}
                className={`w-14 h-10 border ${
                  selectedValue === attributeItem.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300"
                }`}
                data-testid={`product-attribute-${attributeNameKebabCase}-${attributeItem.displayValue}`}
                onClick={() => setSelectedValue(attributeItem.id)}
              >
                {attributeItem.value}
              </button>
            ))}
          </div>
        </div>
      );
    case "swatch":
      return (
        <div
          className="flex flex-col overflow-x-auto hide-scrollbar"
          data-testid={`product-attribute-${attributeNameKebabCase}`}
        >
          <p className="text-sm font-bold mt-4">
            {attribute.key.toUpperCase()}:
          </p>
          <div className="flex space-x-2 mt-2">
            {attribute.values.map((attributeItem) => (
              <button
                key={attributeItem.id}
                className={`w-7 h-7 border ${
                  selectedValue === attributeItem.id
                    ? "border-black"
                    : "border-gray-300"
                }`}
                data-testid={`product-attribute-${attributeNameKebabCase}-${attributeItem.displayValue}`}
                style={{ backgroundColor: attributeItem.value }} 
                onClick={() => setSelectedValue(attributeItem.id)}
              />
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default Attribute;
