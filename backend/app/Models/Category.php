<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'store_id', 'parent_id', 'name', 'slug',
        'image', 'description', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ── Relationships ─────────────────────────────
    public function store()    { return $this->belongsTo(Store::class); }
    public function parent()   { return $this->belongsTo(Category::class, 'parent_id'); }
    public function children() { return $this->hasMany(Category::class, 'parent_id')->where('is_active', true)->orderBy('sort_order'); }
    public function products() { return $this->hasMany(Product::class); }

    // ── Scopes ────────────────────────────────────
    public function scopeActive($q)      { return $q->where('is_active', true); }
    public function scopeRoots($q)       { return $q->whereNull('parent_id'); }
    public function scopeForStore($q, $storeId) { return $q->where('store_id', $storeId); }
}
