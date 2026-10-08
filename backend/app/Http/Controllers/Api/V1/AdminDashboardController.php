<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\IncompleteOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Get dashboard summary statistics
     */
    public function index(): JsonResponse
    {
        $today = Carbon::today();

        // Financial & Order stats
        $totalOrdersCount = Order::count();
        $totalRevenue     = Order::where('order_status', '!=', 'cancelled')->sum('total_amount');

        $todayOrdersCount = Order::whereDate('created_at', $today)->count();
        $todayRevenue     = Order::whereDate('created_at', $today)
            ->where('order_status', '!=', 'cancelled')
            ->sum('total_amount');

        $pendingOrdersCount   = Order::where('order_status', 'pending')->count();
        $processingOrdersCount= Order::where('order_status', 'processing')->count();
        $deliveredOrdersCount = Order::where('order_status', 'delivered')->count();
        $incompleteOrdersCount= IncompleteOrder::where('is_converted', false)->count();

        // Product stats
        $totalProductsCount = Product::count();
        $lowStockCount      = Product::where('track_stock', true)->where('stock', '<=', 5)->count();

        // Recent 5 orders
        $recentOrders = Order::with('items')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        // Top 5 selling products
        $topProducts = Product::active()
            ->orderBy('sold_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'stats' => [
                    'total_orders'      => $totalOrdersCount,
                    'total_revenue'     => (int) $totalRevenue,
                    'today_orders'      => $todayOrdersCount,
                    'today_revenue'     => (int) $todayRevenue,
                    'pending_orders'    => $pendingOrdersCount,
                    'processing_orders' => $processingOrdersCount,
                    'delivered_orders'  => $deliveredOrdersCount,
                    'incomplete_orders' => $incompleteOrdersCount,
                    'total_products'    => $totalProductsCount,
                    'low_stock_products'=> $lowStockCount,
                ],
                'recent_orders' => $recentOrders,
                'top_products'  => $topProducts,
            ],
        ]);
    }
}
