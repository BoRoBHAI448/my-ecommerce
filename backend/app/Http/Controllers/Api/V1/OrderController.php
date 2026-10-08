<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\IncompleteOrder;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Create a new order (Checkout submission)
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_name'    => 'required|string|max:255',
            'customer_phone'   => 'required|string|max:20',
            'customer_email'   => 'nullable|email|max:255',
            'shipping_address' => 'required|string',
            'city'             => 'nullable|string|max:100',
            'zone'             => 'nullable|string|max:100',
            'payment_method'   => 'nullable|string|in:cod,bkash,nagad,card',
            'notes'            => 'nullable|string',
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.product_variant_id' => 'nullable|integer',
            'items.*.quantity'   => 'required|integer|min:1',
            'shipping_cost'    => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $activeStore = Store::where('is_active', true)->first();
        if (!$activeStore) {
            return response()->json([
                'success' => false,
                'message' => 'Active store not configured',
            ], 400);
        }

        try {
            $order = DB::transaction(function () use ($request, $activeStore) {
                $subtotal = 0;
                $orderItemsData = [];

                foreach ($request->items as $item) {
                    $product = Product::find($item['product_id']);
                    if (!$product || !$product->is_active) {
                        throw new \Exception("Product #{$item['product_id']} is unavailable.");
                    }

                    $variant = null;
                    if (!empty($item['product_variant_id'])) {
                        $variant = ProductVariant::find($item['product_variant_id']);
                    }

                    $unitPrice = $product->discount_price ?? $product->selling_price;
                    $itemQty = (int) $item['quantity'];
                    $itemSubtotal = $unitPrice * $itemQty;
                    $subtotal += $itemSubtotal;

                    // Stock deduction if tracking enabled
                    if ($variant && $variant->stock >= $itemQty) {
                        $variant->decrement('stock', $itemQty);
                    } elseif ($product->track_stock && $product->stock >= $itemQty) {
                        $product->decrement('stock', $itemQty);
                        if ($product->fresh()->stock <= 0) {
                            $product->update(['in_stock' => false]);
                        }
                    }

                    $orderItemsData[] = [
                        'product_id'         => $product->id,
                        'product_variant_id' => $variant ? $variant->id : null,
                        'product_name'       => $product->name,
                        'variant_name'       => $variant ? $variant->name : null,
                        'product_image'      => $product->thumbnail,
                        'unit_price'         => $unitPrice,
                        'quantity'           => $itemQty,
                        'subtotal'           => $itemSubtotal,
                    ];
                }

                // Determine shipping cost
                $zone = $request->input('zone', 'Inside Dhaka');
                $shippingCost = $request->input('shipping_cost');
                if ($shippingCost === null) {
                    $shippingCost = str_contains(strtolower($zone), 'outside')
                        ? $activeStore->delivery_charge_outside
                        : $activeStore->delivery_charge_inside;
                }

                $totalAmount = $subtotal + (int)$shippingCost;

                // Create Order record
                $orderNumber = Order::generateOrderNumber();
                $newOrder = Order::create([
                    'store_id'         => $activeStore->id,
                    'order_number'     => $orderNumber,
                    'customer_name'    => $request->customer_name,
                    'customer_phone'   => $request->customer_phone,
                    'customer_email'   => $request->customer_email,
                    'shipping_address' => $request->shipping_address,
                    'city'             => $request->input('city', 'Dhaka'),
                    'zone'             => $zone,
                    'subtotal'         => $subtotal,
                    'shipping_cost'    => (int) $shippingCost,
                    'discount_amount'  => 0,
                    'total_amount'     => $totalAmount,
                    'payment_method'   => $request->input('payment_method', 'cod'),
                    'payment_status'   => 'pending',
                    'order_status'     => 'pending',
                    'notes'            => $request->input('notes'),
                    'ip_address'       => $request->ip(),
                ]);

                // Insert items
                foreach ($orderItemsData as $itemData) {
                    $itemData['order_id'] = $newOrder->id;
                    OrderItem::create($itemData);
                }

                // Mark any incomplete order as converted
                IncompleteOrder::where('store_id', $activeStore->id)
                    ->where('customer_phone', $request->customer_phone)
                    ->where('is_converted', false)
                    ->update(['is_converted' => true]);

                return $newOrder->load('items');
            });

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data'    => $order,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order details by order number (Track order)
     */
    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['items.product', 'items.variant'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $order,
        ]);
    }

    /**
     * Save partial checkout / abandoned cart info
     */
    public function incomplete(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_phone'   => 'required|string|max:20',
            'customer_name'    => 'nullable|string|max:255',
            'shipping_address' => 'nullable|string',
            'cart_data'        => 'nullable|array',
            'last_step'        => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $activeStore = Store::where('is_active', true)->first();
        if (!$activeStore) {
            return response()->json([
                'success' => false,
                'message' => 'Active store not configured',
            ], 400);
        }

        $incomplete = IncompleteOrder::updateOrCreate(
            [
                'store_id'       => $activeStore->id,
                'customer_phone' => $request->customer_phone,
                'is_converted'   => false,
            ],
            [
                'customer_name'    => $request->customer_name,
                'shipping_address' => $request->shipping_address,
                'cart_data'        => $request->cart_data,
                'last_step'        => $request->input('last_step', 'checkout_form'),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Incomplete order captured',
            'data'    => $incomplete,
        ]);
    }
}
