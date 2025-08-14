export default function EstimateSidebar({ sqft = 0, flooring, paint }) {
    const flooringCost = flooring ? sqft * flooring.price * 1.1 : 0
    const estimatedGallons = sqft > 0 ? Math.ceil(sqft / 350) : 0
    const paintCost = paint?.price ? estimatedGallons * paint.price : 0

    const total = flooringCost + paintCost


    return (
        <aside className="mt-8 bg-white rounded-lg shadow-md p-4 w-full max-w-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Estimated Cost</h3>

      <ul className="text-sm text-gray-700 space-y-2">
        {flooring && (
          <li>
            <strong>Flooring:</strong> ${flooring.price}/sqft × {sqft} sqft ≈ ${flooringCost.toFixed(2)}
          </li>
        )}

        {paint && (
          <li>
            <strong>Paint:</strong> ${paint.price}/gal × {estimatedGallons} gal ≈ ${paintCost.toFixed(2)}
          </li>
        )}

        <li className="border-t pt-2 font-medium">
          <strong>Total:</strong> ${total.toFixed(2)}
        </li>
      </ul>
    </aside>
    )
}