<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get paginated products list with filtering, searching, and sorting
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::active()->with(['category', 'brand', 'images', 'variants']);

        // Filter by category slug
        if ($categorySlug = $request->input('category')) {
            $category = Category::where('slug', $categorySlug)->first();
            if ($category) {
                // include children IDs if it's a parent category
                $categoryIds = Category::where('parent_id', $category->id)->pluck('id')->toArray();
                $categoryIds[] = $category->id;
                $query->whereIn('category_id', $categoryIds);
            }
        }

        // Filter by brand slug
        if ($brandSlug = $request->input('brand')) {
            $brand = Brand::where('slug', $brandSlug)->first();
            if ($brand) {
                $query->where('brand_id', $brand->id);
            }
        }

        // Filter by search keyword
        if ($search = $request->input('q') ?? $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('description', 'ILIKE', "%{$search}%")
                  ->orWhere('sku', 'ILIKE', "%{$search}%");
            });
        }

        // Filter by flags
        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->boolean('new')) {
            $query->newArrivals();
        }

        // Price filtering
        if ($minPrice = $request->input('min_price')) {
            $query->where('selling_price', '>=', (int) $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('selling_price', '<=', (int) $maxPrice);
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_asc'  => $query->orderBy('selling_price', 'asc'),
            'price_desc' => $query->orderBy('selling_price', 'desc'),
            'popular'    => $query->orderBy('sold_count', 'desc'),
            'rating'     => $query->orderBy('rating', 'desc'),
            default      => $query->orderBy('id', 'desc'),
        };

        $perPage = (int) $request->input('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $products->items(),
            'meta'    => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
            ],
        ]);
    }

    /**
     * Get single product detail by slug
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::active()
            ->where('slug', $slug)
            ->with(['category', 'brand', 'images', 'variants'])
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $product,
        ]);
    }

    /**
     * Get related products for a product
     */
    public function related(string $slug): JsonResponse
    {
        $product = Product::active()->where('slug', $slug)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $related = Product::active()
            ->where('id', '!=', $product->id)
            ->where(function ($q) use ($product) {
                $q->where('category_id', $product->category_id);
                if ($product->brand_id) {
                    $q->orWhere('brand_id', $product->brand_id);
                }
            })
            ->with(['category', 'brand', 'images'])
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $related,
        ]);
    }
}
