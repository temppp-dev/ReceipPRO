import nodemailer from 'nodemailer';
import type { Receipt } from '@shared/schema';
import { generateCartierReceiptHTML } from './cartierEmailTemplate';

const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'tempybusinessinquiries@gmail.com',
    pass: 'ktmchoaegzwnpwly'
  }
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

export async function sendReceiptEmail(receipt: Receipt): Promise<boolean> {
  try {
    // Use Cartier template for luxury items, Apple template for tech items
    const isCartierProduct = receipt.productName.toLowerCase().includes('cartier') || 
                           receipt.productName.toLowerCase().includes('watch') ||
                           receipt.productName.toLowerCase().includes('bracelet') ||
                           receipt.productName.toLowerCase().includes('ring') ||
                           receipt.productName.toLowerCase().includes('necklace') ||
                           receipt.productPrice >= 300000; // $3000+ items use Cartier template
    
    const html = isCartierProduct ? generateCartierReceiptHTML(receipt) : generateReceiptHTML(receipt);
    const brandName = isCartierProduct ? 'Cartier' : 'Apple Store';
    
    const mailOptions = {
      from: `"${brandName}" <tempybusinessinquiries@gmail.com>`,
      to: receipt.customerEmail,
      subject: `Your ${brandName} Receipt - Order #${receipt.orderNumber}`,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`${brandName} receipt email sent successfully to ${receipt.customerEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send receipt email:', error);
    return false;
  }
}

export function generateReceiptHTML(receipt: Receipt): string {
  const orderDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const subtotal = receipt.subtotal / 100;
  const tax = receipt.tax / 100;
  const shipping = receipt.shipping / 100;
  const total = receipt.total / 100;
  const productPrice = receipt.productPrice / 100;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            background-color: #FFFFFF;
        }
        .main-table {
            width: 660px;
        }
        .apple-logo-td {
            padding-top: 32px;
        }
        .heading-email {
            font-family: 'SF UI Display Medium', system, -apple-system, -webkit-system-font, 'SFNSText', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: normal;
            color: #333333;
            line-height: 47px;
            font-size: 34px;
            margin: 0 0 2px 0;
        }
        .sub-heading {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 17px;
            line-height: 24px;
            color: #333333;
            margin: 0;
            padding-top: 13px;
        }
        .order-num-td {
            padding-bottom: 14px;
        }
        .moe-line-col {
            background-color: #D6D6D6 !important;
            font-size: 1px !important;
            height: 1px !important;
        }
        .section-heading-table {
            width: 29%;
        }
        .section-items-heading-td {
            font-family: 'SF UI Display Medium', system, -apple-system, -webkit-system-font, SFNSText, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: 500;
            letter-spacing: 0px;
            font-size: 22px;
            line-height: 27px;
            margin: 0px;
            color: #333333;
        }
        .sectionHeading {
            font-family: 'SF UI Display Medium', system, -apple-system, -webkit-system-font, SFNSText, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: 500;
            letter-spacing: 0px;
            font-size: 22px;
            line-height: 27px;
            margin: 0px;
            color: #333333;
        }
        .product-list-table {
            width: 66.5%;
        }
        .pad-lr {
            padding-left: 0;
            padding-right: 0;
        }
        .gap-30 {
            height: 21px;
            font-size: 21px;
            line-height: 21px;
        }
        .gap-24 {
            height: 28px;
            font-size: 28px;
            line-height: 28px;
        }
        .product-image-td {
            padding-right: 10px;
        }
        .product-image-img {
            display: block;
            outline: none;
        }
        .product-name-td {
            font-weight: 600;
            letter-spacing: 0px;
            font-size: 17px;
            line-height: 26px;
            color: #333333;
            margin: 0;
        }
        .base-price-td {
            padding-top: 6px;
            font-size: 17px;
            line-height: 26px;
            color: #333333;
        }
        .qty-price-divider {
            padding-top: 6px;
        }
        .moe-line-col div {
            background-color: #D6D6D6;
        }
        .qty-price-td {
            padding-top: 6px;
        }
        .payment-section-td {
            padding-top: 43px;
            padding-bottom: 32px;
        }
        .section-details-table {
            width: 66.5%;
        }
        .section-details-td {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 17px;
            line-height: 26px;
            color: #333333;
        }
        .amts-section-td {
            padding-bottom: 42px;
        }
        .amt-row-table {
            width: 66.5%;
        }
        .amt-row-td {
            width: 100%;
            padding-top: 4px;
        }
        .amt-label-td {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            font-size: 17px;
            line-height: 24px;
        }
        .amt-value-td {
            white-space: nowrap;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 17px;
            line-height: 24px;
            color: #333333;
        }
        .note-td {
            padding-top: 16px;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 21px;
            color: #666666;
        }
    </style>
</head>
<body>
<center>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" align="center" style="margin:0px; padding-bottom:0px;">
        <tbody>
        <tr>
            <td align="center">
                <table class="main-table" cellpadding="0" cellspacing="0" border="0" width="660" align="center">
                    <tbody>
                    <tr>
                        <td class="apple-logo-td" valign="top" align="left">
                            <img src="https://email.images.apple.com/rover/aos/moe/apple_icon_2x.png" alt="Apple" border="0" height="25" width="auto" style="display:block;outline:none;">
                        </td>
                    </tr>

                    <tr>
                        <td valign="top" align="left" style="padding-top:75px; padding-bottom:51px;">
                            <h1 class="heading-email">
                                Thank you for your order.
                            </h1>
                            <p class="sub-heading">
                                One or more of your items will be delivered by a courier service.<br>
                                Someone must be present to receive these items.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td class="order-num-td">
                            <div style="color:#333333; font-weight:normal; font-size:14px; line-height:21px; margin:0px;">
                                <span style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight:600;">
                                    Order Number:
                                </span>
                                <span style="color:#0070C9; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                                    ${receipt.orderNumber}
                                </span>
                            </div>
                            <div style="color:#333333; font-weight:normal; font-size:14px; line-height:21px; margin:0px;">
                                <span style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight:600;">
                                    Ordered on:
                                </span>
                                <span style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight:normal;">
                                    ${orderDate}
                                </span>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="left" height="1" bgcolor="D6D6D6" valign="top" class="moe-line-col">
                            <div style="background-color:#D6D6D6; height:1px; font-size:1px;"></div>
                        </td>
                    </tr>

                    <tr>
                        <td valign="top" align="center">
                            <table class="render-lineitems-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top:43px;">
                                <tbody>
                                <tr>
                                    <td>
                                        <table class="section-heading-table" border="0" cellpadding="0" cellspacing="0" width="29%" align="left">
                                            <tbody>
                                            <tr>
                                                <td class="section-items-heading-td" valign="top" align="left">
                                                    <h2 class="sectionHeading">Items to be Dispatched</h2>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <table class="product-list-table" width="66.5%" align="right" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="pad-lr" valign="top" align="left">
                                                    <div style="padding-bottom:3px; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif; font-weight:600; font-size:17px; line-height:26px; color:#333333; margin:0;">
                                                        Shipment 1
                                                    </div>
                                                    <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif; font-size:17px; line-height:26px; color:#333333;">
                                                        <span style="font-weight:600;">Delivery:</span>
                                                        ${deliveryDate}
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td valign="top" align="left">
                                                    <table border="0" cellpadding="0" cellspacing="0" align="left" width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td class="pad-lr" align="left" valign="top">
                                                                <table align="center" width="100%" style="width:100%; min-width:100%;" cellpadding="0" cellspacing="0" border="0">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="gap-30"></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="moe-line-col" bgcolor="D6D6D6" height="1" align="left" valign="top">
                                                                            <div style="background-color:#D6D6D6; height:1px; font-size:1px;"></div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="gap-24"></td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                    <table align="left" width="100%" cellpadding="0" cellspacing="0" border="0" class="line-item-table">
                                                        <tbody>
                                                        <tr>
                                                            <td class="product-image-td" valign="top" align="center" width="96">
                                                                <img src="${receipt.productImageUrl || 'https://via.placeholder.com/100x100'}" alt="image" width="100" height="100" style="display:block;outline:none;" class="product-image-img">
                                                            </td>
                                                            <td valign="top" align="left">
                                                                <table align="left" width="100%" cellpadding="0" cellspacing="0" border="0" class="item-details-table">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="product-name-td" align="left" valign="top">
                                                                            ${receipt.productName}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="base-price-td" align="left">
                                                                            $${productPrice.toFixed(2)}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="qty-price-divider" width="100%">
                                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="height:1px; font-size:1px; line-height:1px;">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td class="moe-line-col" bgcolor="D6D6D6" height="1" align="left" valign="top">
                                                                                        <div style="background-color:#D6D6D6; font-size:1px; height:1px;"></div>
                                                                                    </td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding-top:6px;">
                                                                            <table align="left" width="45%" cellpadding="0" cellspacing="0" border="0" class="product-quantity-table">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td align="left" style="font-size:17px; line-height:26px; color:#333333;">
                                                                                        Qty ${receipt.quantity}
                                                                                    </td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table align="right" width="50%" cellpadding="0" cellspacing="0" border="0" class="total-price-table">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td align="right" style="font-weight:600; font-size:17px; line-height:26px; color:#333333;">
                                                                                        $${total.toFixed(2)}
                                                                                    </td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                <tr>
                                    <td>
                                        <table class="section-details-table" align="right" width="66.5%" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="section-details-td" valign="top" align="left">
                                                    <table align="center" width="100%" style="min-width:100%;" border="0" cellpadding="0" cellspacing="0">
                                                        <tbody>
                                                        <tr>
                                                            <td style="height:30px; font-size:30px; line-height:30px; min-width:100%;"></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="moe-line-col" bgcolor="D6D6D6" height="1" valign="top" align="left">
                                                                <div style="background-color:#D6D6D6; height:1px; font-size:1px;"></div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="height:30px; font-size:30px; line-height:30px; min-width:100%;"></td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                    <h3 style="font-weight:600; font-size:17px; line-height:26px; color:#333333; margin:0;" class="subsec-heading">
                                                        Shipping Address:
                                                    </h3>
                                                    <div style="width:100%; font-size:17px; line-height:26px; color:#333333;">
                                                        ${receipt.customerName}
                                                    </div>
                                                    <div style="width:100%; font-size:17px; line-height:26px; color:#333333;">
                                                        ${receipt.billingAddress}
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <table align="center" width="100%" style="min-width:100%;" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                <tr>
                                    <td style="height:41px; font-size:41px; line-height:41px; min-width:100%;"></td>
                                </tr>
                                <tr>
                                    <td bgcolor="D6D6D6" height="1" valign="top" align="left" class="moe-line-col">
                                        <div style="background-color:#D6D6D6; height:1px; font-size:1px;"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:1px; font-size:1px; line-height:1px; min-width:100%;"></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="payment-section-td" style="padding-top:43px; padding-bottom:32px;">
                            <table width="29%" class="section-heading-table" align="left" cellspacing="0" cellpadding="0" border="0" style="width:29%">
                                <tbody>
                                <tr>
                                    <td class="section-items-heading-td" valign="top" align="left">
                                        <h2 class="sectionHeading">Billing and Payment</h2>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <table class="section-details-table" width="66.5%" align="right" cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                <tr>
                                    <td class="section-details-td" valign="top" align="left">
                                        <h3 style="font-weight:600; font-size:17px; line-height:26px; color:#333333; margin:0;" class="subsec-heading">
                                            Bill To:
                                        </h3>
                                        <div style="width:100%; font-size:17px; line-height:26px; color:#333333;">
                                            ${receipt.customerName}
                                        </div>

                                        <h3 style="padding-top:23px; font-weight:600; font-size:17px; line-height:26px; color:#333333; margin:0;" class="subsec-heading">
                                            Billing Address:
                                        </h3>
                                        <div style="width:100%; font-size:17px; line-height:26px; color:#333333;">
                                            ${receipt.billingAddress}
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="amts-section-td" align="center">
                            <table class="amt-row-table" width="66.5%" align="right" cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                <tr>
                                    <td align="center">
                                        <table width="100%" style="min-width:100%;" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td style="height:1px; font-size:1px; line-height:1px; min-width:100%;"></td>
                                            </tr>
                                            <tr>
                                                <td class="moe-line-col" bgcolor="D6D6D6" height="1" align="left" valign="top">
                                                    <div style="background-color:#D6D6D6; height:1px; font-size:1px;"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:18px; font-size:18px; line-height:18px; min-width:100%;"></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="amt-row-td">
                                        <table class="amt-label-table" width="49%" align="left" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="amt-label-td" valign="top" align="left">
                                                    Subtotal
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table class="amt-value-table" width="49%" align="right" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="amt-value-td" align="right" valign="top" nowrap="">
                                                    <nobr>$${subtotal.toFixed(2)}</nobr>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="amt-row-td">
                                        <table class="amt-label-table" width="49%" align="left" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="amt-label-td" align="left" valign="top">
                                                    Tax
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table class="amt-value-table" width="49%" align="right" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="amt-value-td" align="right" valign="top" nowrap="">
                                                    <nobr>$${tax.toFixed(2)}</nobr>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="amt-row-td">
                                        <table class="amt-label-table" width="49%" align="left" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="amt-label-td" align="left" valign="top">
                                                    Shipping
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table class="amt-value-table" width="49%" align="right" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="amt-value-td" align="right" valign="top" nowrap="">
                                                    <nobr>$${shipping.toFixed(2)}</nobr>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="amt-row-td">
                                        <table class="amt-divider-table" width="100%" align="right" cellpadding="0" cellspacing="0" border="0" style="margin-top:11px;">
                                            <tbody>
                                            <tr>
                                                <td class="amt-divider" bgcolor="D6D6D6" height="1" align="left" valign="top" style="background-color:#D6D6D6;"></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="amt-row-td">
                                        <table class="amt-label-table" width="49%" align="left" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="amt-label-td" style="font-weight:600;" valign="top" align="left">
                                                    Order Total
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table class="amt-value-table" width="49%" align="right" cellpadding="0" cellspacing="0" border="0">
                                            <tbody>
                                            <tr>
                                                <td class="amt-value-td" style="font-weight:600;" align="right" valign="top" nowrap="">
                                                    <nobr>$${total.toFixed(2)}</nobr>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
    </table>
</center>
</body>
</html>`;
}

