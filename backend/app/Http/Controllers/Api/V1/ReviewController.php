<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Get reviews for a product
     */
    public function index(string $slug): JsonResponse
    {
        $product = Product::active()->where('slug', $slug)->first();
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $reviews = Review::where('product_id', $product->id)
            ->where('is_approved', true)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $reviews,
        ]);
    }

    /**
     * Submit a review for a product
     */
    public function store(Request $request, string $slug): JsonResponse
    {
        $product = Product::active()->where('slug', $slug)->first();
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'reviewer_name'  => 'required|string|max:255',
            'reviewer_phone' => 'nullable|string|max:20',
            'rating'         => 'required|integer|min:1|max:5',
            'comment'        => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $activeStore = Store::where('is_active', true)->first();

        $review = Review::create([
            'store_id'       => $activeStore->id,
            'product_id'     => $product->id,
            'user_id'        => $request->user() ? $request->user()->id : null,
            'reviewer_name'  => $request->reviewer_name,
            'reviewer_phone' => $request->reviewer_phone,
            'rating'         => (int) $request->rating,
            'comment'        => $request->comment,
            'is_approved'    => true,
        ]);

        // Recalculate average rating & review count for product
        $avgRating = Review::where('product_id', $product->id)->where('is_approved', true)->avg('rating');
        $count     = Review::where('product_id', $product->id)->where('is_approved', true)->count();

        $product->update([
            'rating'       => round($avgRating, 1),
            'review_count' => $count,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you! Your review has been submitted.',
            'data'    => $review,
        ], 201);
    }
}
