<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\IncompleteOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminOrderController extends Controller
{
    /**
     * List all orders with filters & pagination
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('items')->orderBy('id', 'desc');

        if ($status = $request->input('status')) {
            $query->where('order_status', $status);
        }

        if ($search = $request->input('q') ?? $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'ILIKE', "%{$search}%")
                  ->orWhere('customer_name', 'ILIKE', "%{$search}%")
                  ->orWhere('customer_phone', 'ILIKE', "%{$search}%");
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        $orders  = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $orders->items(),
            'meta'    => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    /**
     * Get single order detail
     */
    public function show(int $id): JsonResponse
    {
        $order = Order::with(['items.product', 'items.variant'])->find($id);

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
     * Update order status
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'order_status'   => 'nullable|string|in:pending,confirmed,processing,shipped,delivered,cancelled,returned',
            'payment_status' => 'nullable|string|in:pending,paid,failed,refunded',
            'notes'          => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $order = Order::find($id);
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        if ($request->has('order_status')) {
            $order->order_status = $request->order_status;
            if ($request->order_status === 'delivered') {
                $order->payment_status = 'paid';
            }
        }

        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }

        if ($request->has('notes')) {
            $order->notes = $request->notes;
        }

        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data'    => $order->fresh(['items']),
        ]);
    }

    /**
     * List incomplete orders (abandoned carts)
     */
    public function incompleteOrders(Request $request): JsonResponse
    {
        $query = IncompleteOrder::orderBy('id', 'desc');

        if ($request->has('is_contacted')) {
            $query->where('is_contacted', $request->boolean('is_contacted'));
        }

        $perPage    = (int) $request->input('per_page', 15);
        $incompletes = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $incompletes->items(),
            'meta'    => [
                'current_page' => $incompletes->currentPage(),
                'last_page'    => $incompletes->lastPage(),
                'per_page'     => $incompletes->perPage(),
                'total'        => $incompletes->total(),
            ],
        ]);
    }

    /**
     * Toggle contacted status on incomplete order
     */
    public function markIncompleteContacted(Request $request, int $id): JsonResponse
    {
        $incomplete = IncompleteOrder::find($id);

        if (!$incomplete) {
            return response()->json([
                'success' => false,
                'message' => 'Incomplete order record not found',
            ], 404);
        }

        $incomplete->is_contacted = $request->boolean('is_contacted', !$incomplete->is_contacted);
        if ($request->has('admin_notes')) {
            $incomplete->admin_notes = $request->admin_notes;
        }
        $incomplete->save();

        return response()->json([
            'success' => true,
            'message' => 'Record updated',
            'data'    => $incomplete,
        ]);
    }
}
