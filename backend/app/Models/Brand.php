<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = [
        'store_id', 'name', 'slug', 'logo', 'description', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function store()    { return $this->belongsTo(Store::class); }
    public function products() { return $this->hasMany(Product::class); }

    public function scopeActive($q)           { return $q->where('is_active', true); }
    public function scopeForStore($q, $storeId) { return $q->where('store_id', $storeId); }
}
