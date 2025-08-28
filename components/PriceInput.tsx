import React from "react"

export function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  // Set minimum price to 1 USD
  const minPrice = 1
  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium">Price (USD)</label>
      <input
        type="number"
        id="price"
        min={minPrice}
        step="0.01"
        value={value}
        onChange={e => {
          const next = parseFloat(e.target.value)
          onChange(isNaN(next) ? minPrice : Math.max(minPrice, next))
        }}
        className="mt-1 block w-full border rounded-md p-2"
      />
      <span className="text-xs text-muted-foreground">Minimum price: ${minPrice}</span>
    </div>
  )
}