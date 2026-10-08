<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\StoreController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\BannerController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\AdminAuthController;
use App\Http\Controllers\Api\V1\AdminDashboardController;
use App\Http\Controllers\Api\V1\AdminOrderController;
use App\Http\Controllers\Api\V1\AdminProductController;
use App\Http\Controllers\Api\V1\AdminCategoryController;
use App\Http\Controllers\Api\V1\AdminStoreController;
use App\Http\Controllers\Api\V1\CustomerAuthController;
use App\Http\Controllers\Api\V1\ReviewController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ── API Version 1 Routes ──────────────────────────────
Route::prefix('v1')->group(function () {
    // ── Storefront Public Endpoints ───────────────────
    Route::get('/store', [StoreController::class, 'show']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/products/related/{slug}', [ProductController::class, 'related']);

    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/banners', [BannerController::class, 'index']);

    // Reviews
    Route::get('/products/{slug}/reviews', [ReviewController::class, 'index']);
    Route::post('/products/{slug}/reviews', [ReviewController::class, 'store']);

    // Orders & Checkout
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
    Route::post('/orders/incomplete', [OrderController::class, 'incomplete']);

    // ── Customer Auth & Account ───────────────────────
    Route::post('/customer/register', [CustomerAuthController::class, 'register']);
    Route::post('/customer/login', [CustomerAuthController::class, 'login']);

    Route::prefix('customer')->middleware('auth:sanctum')->group(function () {
        Route::get('/me', [CustomerAuthController::class, 'me']);
        Route::get('/orders', [CustomerAuthController::class, 'orders']);
        Route::post('/logout', [CustomerAuthController::class, 'logout']);
    });

    // ── Admin Authentication ──────────────────────────
    Route::post('/admin/login', [AdminAuthController::class, 'login']);

    // ── Protected Admin Endpoints ─────────────────────
    Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);

        // Dashboard & Analytics
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Orders Management
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/incomplete', [AdminOrderController::class, 'incompleteOrders']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::patch('/orders/incomplete/{id}', [AdminOrderController::class, 'markIncompleteContacted']);

        // Products Management
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::match(['put', 'patch'], '/products/{id}', [AdminProductController::class, 'update']);
        Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

        // Categories Management
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::match(['put', 'patch'], '/categories/{id}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);

        // Store Settings
        Route::patch('/store', [AdminStoreController::class, 'update']);
    });
});
