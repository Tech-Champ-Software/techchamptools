import type { OrderItem, SiteSettings } from "./types"
import { DEFAULT_SETTINGS } from "./types"

// Generate WhatsApp URL with order details
// Uses the free wa.me link - no API required!
export function generateWhatsAppUrl(
  items: OrderItem[],
  settings: SiteSettings = DEFAULT_SETTINGS
): string {
  const { whatsapp_number, business_name, currency_symbol } = settings

  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  // Format the message
  const productLines = items
    .map(
      (item) =>
        `- ${item.product.name} x ${item.quantity} = ${currency_symbol}${(
          item.product.price * item.quantity
        ).toLocaleString("en-IN")}`
    )
    .join("\n")

  const message = `Hello ${business_name}! 👋

I would like to order:

${productLines}

*Total: ${currency_symbol}${total.toLocaleString("en-IN")}*

Please confirm availability and payment details.`

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message)

  // Return the WhatsApp URL
  return `https://wa.me/${whatsapp_number}?text=${encodedMessage}`
}

// Generate URL for a single product
export function generateSingleProductWhatsAppUrl(
  productName: string,
  quantity: number,
  price: number,
  settings: SiteSettings = DEFAULT_SETTINGS
): string {
  const { whatsapp_number, business_name, currency_symbol } = settings

  const total = price * quantity

  const message = `Hello ${business_name}! 👋

I would like to order:

- ${productName} x ${quantity} = ${currency_symbol}${total.toLocaleString("en-IN")}

Please confirm availability and payment details.`

  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${whatsapp_number}?text=${encodedMessage}`
}
