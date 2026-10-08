<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'store_id', 'title', 'subtitle', 'image',
        'cta_text', 'cta_link', 'badge', 'bg_color',
        'sort_order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function store() { return $this->belongsTo(Store::class); }

    public function scopeActive($q)           { return $q->where('is_active', true); }
    public function scopeForStore($q, $storeId) { return $q->where('store_id', $storeId); }
}
