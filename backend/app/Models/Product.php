<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'store_id', 'category_id', 'brand_id',
        'name', 'slug', 'description', 'short_description',
        'regular_price', 'selling_price', 'discount_price',
        'sku', 'stock', 'track_stock', 'in_stock', 'thumbnail',
        'rating', 'review_count', 'sold_count',
        'is_featured', 'is_new_arrival', 'is_active',
        'meta_title', 'meta_description', 'sort_order',
    ];

    protected $casts = [
        'discount_price'  => 'integer',
        'track_stock'     => 'boolean',
        'in_stock'        => 'boolean',
        'is_featured'     => 'boolean',
        'is_new_arrival'  => 'boolean',
        'is_active'       => 'boolean',
        'rating'          => 'float',
    ];

    // ── Relationships ─────────────────────────────
    public function store()    { return $this->belongsTo(Store::class); }
    public function category() { return $this->belongsTo(Category::class); }
    public function brand()    { return $this->belongsTo(Brand::class); }
    public function images()   { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function variants() { return $this->hasMany(ProductVariant::class)->orderBy('sort_order'); }

    // ── Scopes ────────────────────────────────────
    public function scopeActive($q)     { return $q->where('is_active', true); }
    public function scopeFeatured($q)   { return $q->where('is_featured', true); }
    public function scopeNewArrivals($q){ return $q->where('is_new_arrival', true); }
    public function scopeForStore($q, $storeId) { return $q->where('store_id', $storeId); }

    // ── Helpers ───────────────────────────────────
    public function getCurrentPriceAttribute(): int
    {
        return $this->discount_price ?? $this->selling_price;
    }
}
