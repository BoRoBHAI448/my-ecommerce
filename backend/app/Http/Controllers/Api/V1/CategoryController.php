<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get list of categories (Tree structure: Root categories with children)
     */
    public function index(Request $request): JsonResponse
    {
        $tree = $request->boolean('tree', true);

        if ($tree) {
            $categories = Category::active()
                ->roots()
                ->with(['children' => function ($q) {
                    $q->active()->withCount('products');
                }])
                ->withCount('products')
                ->orderBy('sort_order')
                ->get();
        } else {
            $categories = Category::active()
                ->withCount('products')
                ->orderBy('sort_order')
                ->get();
        }

        return response()->json([
            'success' => true,
            'data'    => $categories,
        ]);
    }

    /**
     * Get single category detail by slug
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::active()
            ->where('slug', $slug)
            ->with(['children' => function ($q) {
                $q->active()->withCount('products');
            }, 'parent'])
            ->withCount('products')
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $category,
        ]);
    }
}
