<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminProductController extends Controller
{
    /**
     * Create product
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'category_id'    => 'required|integer|exists:categories,id',
            'brand_id'       => 'nullable|integer|exists:brands,id',
            'regular_price'  => 'required|integer|min:0',
            'selling_price'  => 'required|integer|min:0',
            'discount_price' => 'nullable|integer|min:0',
            'stock'          => 'required|integer|min:0',
            'description'    => 'nullable|string',
            'thumbnail'      => 'nullable|string',
            'is_featured'    => 'nullable|boolean',
            'is_new_arrival' => 'nullable|boolean',
            'is_active'      => 'nullable|boolean',
            'images'         => 'nullable|array',
            'variants'       => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $activeStore = Store::where('is_active', true)->first();

        try {
            $product = DB::transaction(function () use ($request, $activeStore) {
                $slug = Str::slug($request->name);
                // Ensure unique slug
                $originalSlug = $slug;
                $count = 1;
                while (Product::where('slug', $slug)->exists()) {
                    $slug = "{$originalSlug}-{$count}";
                    $count++;
                }

                $product = Product::create([
                    'store_id'         => $activeStore->id,
                    'category_id'      => $request->category_id,
                    'brand_id'         => $request->brand_id,
                    'name'             => $request->name,
                    'slug'             => $slug,
                    'description'      => $request->description,
                    'regular_price'    => $request->regular_price,
                    'selling_price'    => $request->selling_price,
                    'discount_price'   => $request->discount_price,
                    'stock'            => $request->stock,
                    'track_stock'      => true,
                    'in_stock'         => $request->stock > 0,
                    'thumbnail'        => $request->thumbnail,
                    'is_featured'      => $request->boolean('is_featured', false),
                    'is_new_arrival'   => $request->boolean('is_new_arrival', false),
                    'is_active'        => $request->boolean('is_active', true),
                ]);

                // Attach additional images if provided
                if (!empty($request->images)) {
                    foreach ($request->images as $index => $imageUrl) {
                        ProductImage::create([
                            'product_id' => $product->id,
                            'image'      => $imageUrl,
                            'sort_order' => $index,
                        ]);
                    }
                }

                // Attach variants if provided
                if (!empty($request->variants)) {
                    foreach ($request->variants as $index => $v) {
                        ProductVariant::create([
                            'product_id' => $product->id,
                            'name'       => $v['name'],
                            'sku'        => $v['sku'] ?? null,
                            'price'      => $v['price'] ?? $product->selling_price,
                            'stock'      => $v['stock'] ?? 10,
                            'sort_order' => $index,
                        ]);
                    }
                }

                return $product->load(['images', 'variants', 'category', 'brand']);
            });

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data'    => $product,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update product
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'           => 'nullable|string|max:255',
            'category_id'    => 'nullable|integer|exists:categories,id',
            'brand_id'       => 'nullable|integer|exists:brands,id',
            'regular_price'  => 'nullable|integer|min:0',
            'selling_price'  => 'nullable|integer|min:0',
            'discount_price' => 'nullable|integer|min:0',
            'stock'          => 'nullable|integer|min:0',
            'description'    => 'nullable|string',
            'thumbnail'      => 'nullable|string',
            'is_featured'    => 'nullable|boolean',
            'is_new_arrival' => 'nullable|boolean',
            'is_active'      => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $fields = $request->only([
            'category_id', 'brand_id', 'name', 'description',
            'regular_price', 'selling_price', 'discount_price',
            'stock', 'thumbnail', 'is_featured', 'is_new_arrival', 'is_active',
        ]);

        if (isset($fields['stock'])) {
            $fields['in_stock'] = $fields['stock'] > 0;
        }

        $product->update($fields);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data'    => $product->fresh(['category', 'brand', 'images', 'variants']),
        ]);
    }

    /**
     * Delete product
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
}
