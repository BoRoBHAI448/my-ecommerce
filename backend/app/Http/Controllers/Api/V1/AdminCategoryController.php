<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class AdminCategoryController extends Controller
{
    /**
     * Create category
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'parent_id'   => 'nullable|integer|exists:categories,id',
            'image'       => 'nullable|string',
            'description' => 'nullable|string',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $activeStore = Store::where('is_active', true)->first();

        $slug = Str::slug($request->name);
        $originalSlug = $slug;
        $count = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $category = Category::create([
            'store_id'    => $activeStore->id,
            'parent_id'   => $request->parent_id,
            'name'        => $request->name,
            'slug'        => $slug,
            'image'       => $request->image,
            'description' => $request->description,
            'sort_order'  => $request->input('sort_order', 0),
            'is_active'   => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data'    => $category,
        ], 201);
    }

    /**
     * Update category
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'nullable|string|max:255',
            'parent_id'   => 'nullable|integer|exists:categories,id',
            'image'       => 'nullable|string',
            'description' => 'nullable|string',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $category->update($request->only([
            'name', 'parent_id', 'image', 'description', 'sort_order', 'is_active',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data'    => $category->fresh(),
        ]);
    }

    /**
     * Delete category
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }
}
