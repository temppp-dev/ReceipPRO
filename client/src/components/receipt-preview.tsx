interface ReceiptPreviewProps {
  data: {
    customerName?: string;
    billingAddress?: string;
    productName?: string;
    productImageUrl?: string;
    productPrice?: number;
    quantity?: number;
    taxRate?: number;
    shipping?: number;
  };
}

export function ReceiptPreview({ data }: ReceiptPreviewProps) {
  const {
    customerName = "Customer Name",
    billingAddress = "Billing address will appear here",
    productName = "Product Name",
    productImageUrl = "https://via.placeholder.com/60x60",
    productPrice = 0,
    quantity = 1,
    taxRate = 0,
    shipping = 0,
  } = data;

  const subtotal = productPrice * quantity;
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax + shipping;

  const orderDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="receipt-preview bg-white rounded-lg p-8 text-black max-h-[600px] overflow-y-auto">
      <div className="text-center mb-8">
        <img 
          src="https://email.images.apple.com/rover/aos/moe/apple_icon_2x.png" 
          alt="Apple" 
          className="h-8 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank you for your order.</h1>
        <p className="text-gray-600">
          One or more of your items will be delivered by a courier service.<br />
          Someone must be present to receive these items.
        </p>
      </div>
      
      <div className="border-b border-gray-300 pb-4 mb-6">
        <div className="text-sm text-gray-600">
          <strong>Order Number:</strong> <span className="text-blue-600">#W4204629698</span>
        </div>
        <div className="text-sm text-gray-600">
          <strong>Ordered on:</strong> <span>{orderDate}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Items to be Dispatched</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={productImageUrl} 
                alt="Product" 
                className="w-16 h-16 rounded object-cover border border-gray-200" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/64x64";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 mb-1">{productName}</div>
              <div className="text-gray-600 text-sm">${productPrice.toFixed(2)} × {quantity}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-semibold text-gray-900">${total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>Bill to:</p>
        <div className="whitespace-pre-line">{billingAddress}</div>
      </div>
    </div>
  );
}
