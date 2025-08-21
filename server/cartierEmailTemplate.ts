import type { Receipt } from '@shared/schema';

export function generateCartierReceiptHTML(receipt: Receipt): string {
  const orderDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const productPrice = receipt.productPrice / 100;
  const subtotal = receipt.subtotal / 100;
  const tax = receipt.tax / 100;
  const shipping = receipt.shipping / 100;
  const total = receipt.total / 100;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: Georgia, 'Times New Roman', Times, serif; 
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 620px; 
            margin: 0 auto; 
            background-color: white;
        }
        .cartier-red { 
            background-color: #730000; 
            color: white; 
        }
        .text-center { 
            text-align: center; 
        }
        .georgia-font { 
            font-family: Georgia, 'Times New Roman', Times, serif; 
        }
        .product-section {
            background-color: #f8f8f8;
            border: 1px solid #d8d8d8;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div style="height: 30px;"></div>
        
        <!-- Cartier Header -->
        <div style="text-align: center; padding: 20px;">
            <img src="https://media.yoox.biz/ytos/resources/CARTIER/mail/old-images/cartierHead.png" alt="Cartier" style="max-width: 200px;">
        </div>
        
        <div style="height: 30px;"></div>
        
        <!-- Order Acknowledgment -->
        <div style="text-align: center; padding: 0 35px;">
            <h2 style="font-family: Georgia, serif; font-size: 12px; color: #000000; font-weight: bold;">
                Acknowledgment of your order
            </h2>
            
            <div style="height: 30px;"></div>
            
            <h3 style="font-family: Georgia, serif; font-size: 12px; color: #000000; font-weight: bold;">
                Dear ${receipt.customerName},
            </h3>
            
            <div style="height: 30px;"></div>
            
            <p style="font-family: Georgia, serif; font-size: 12px; color: #8c8c8c; line-height: 1.5;">
                Thank you for shopping online with Cartier.<br><br>
                We are pleased to acknowledge receipt of your order, the main details of which are set out below.<br>
                Please check this email in order to ensure that the details are accurate.
            </p>
        </div>
        
        <div style="height: 30px;"></div>
        
        <!-- Order Number Header -->
        <div style="text-align: center;">
            <div class="cartier-red" style="padding: 8px; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase; font-weight: bold;">
                ORDER Nº ${receipt.orderNumber}
            </div>
        </div>
        
        <div style="height: 6px;"></div>
        
        <!-- Product Details -->
        <div class="product-section">
            <div style="height: 20px;"></div>
            
            <div style="display: flex; align-items: flex-start; gap: 40px;">
                <div style="flex-shrink: 0;">
                    <img src="${receipt.productImageUrl || 'https://via.placeholder.com/135x110/8B0000/ffffff?text=Cartier'}" 
                         alt="${receipt.productName}" 
                         style="width: 135px; height: 110px; object-fit: cover; border-radius: 4px;">
                </div>
                
                <div style="flex: 1;">
                    <h3 style="font-family: Arial, sans-serif; font-size: 11px; color: #000000; font-weight: bold; margin: 0 0 10px 0;">
                        ${receipt.productName}
                    </h3>
                    
                    <div style="font-family: Arial, sans-serif; font-size: 11px; color: #666;">
                        <div>Price: $${productPrice.toFixed(2)}</div>
                        <div>Quantity: ${receipt.quantity}</div>
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #d8d8d8;">
                            <strong>Total: $${total.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="height: 30px;"></div>
            
            <!-- Shipping Address -->
            <div style="border-top: 1px solid #d8d8d8; padding-top: 30px;">
                <h4 style="font-family: Arial, sans-serif; font-size: 11px; color: #000; font-weight: bold; margin-bottom: 10px;">
                    Shipping Address:
                </h4>
                <div style="font-family: Arial, sans-serif; font-size: 11px; color: #666;">
                    ${receipt.customerName}<br>
                    ${receipt.billingAddress}
                </div>
            </div>
        </div>
        
        <div style="height: 1px;"></div>
        
        <!-- Billing Section -->
        <div style="padding: 43px 35px 32px;">
            <div style="display: flex; justify-content: space-between;">
                <div style="width: 29%;">
                    <h3 style="font-family: Arial, sans-serif; font-size: 11px; color: #000; font-weight: bold;">
                        Billing and Payment
                    </h3>
                </div>
                
                <div style="width: 66.5%;">
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-family: Arial, sans-serif; font-size: 11px; color: #000; font-weight: bold; margin: 0 0 5px 0;">
                            Subtotal:
                        </h4>
                        <div style="font-family: Arial, sans-serif; font-size: 11px; color: #666;">
                            $${subtotal.toFixed(2)}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-family: Arial, sans-serif; font-size: 11px; color: #000; font-weight: bold; margin: 0 0 5px 0;">
                            Tax:
                        </h4>
                        <div style="font-family: Arial, sans-serif; font-size: 11px; color: #666;">
                            $${tax.toFixed(2)}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-family: Arial, sans-serif; font-size: 11px; color: #000; font-weight: bold; margin: 0 0 5px 0;">
                            Shipping:
                        </h4>
                        <div style="font-family: Arial, sans-serif; font-size: 11px; color: #666;">
                            $${shipping.toFixed(2)}
                        </div>
                    </div>
                    
                    <div style="border-top: 1px solid #d8d8d8; padding-top: 20px;">
                        <h3 style="font-family: Arial, sans-serif; font-size: 13px; color: #000; font-weight: bold; margin: 0 0 5px 0;">
                            Total:
                        </h3>
                        <div style="font-family: Arial, sans-serif; font-size: 13px; color: #000; font-weight: bold;">
                            $${total.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 40px 0; background-color: #f5f5f5;">
            <div style="font-family: Arial, sans-serif; font-size: 10px; color: #999999; line-height: 1.6;">
                Thank you for choosing Cartier.<br>
                For any inquiries, please contact our customer service.
            </div>
        </div>
    </div>
</body>
</html>
  `;
}