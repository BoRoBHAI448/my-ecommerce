<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = [
        'name', 'slug', 'domain', 'tagline', 'logo', 'favicon',
        'currency', 'currency_symbol', 'colors', 'contact', 'social',
        'whatsapp', 'announcement_enabled', 'announcement_text',
        'delivery_inside_dhaka', 'delivery_sub_dhaka',
        'delivery_outside_dhaka', 'free_delivery_threshold', 'is_active',
    ];

    protected $casts = [
        'colors'                 => 'array',
        'contact'                => 'array',
        'social'                 => 'array',
        'announcement_enabled'   => 'boolean',
        'is_active'              => 'boolean',
    ];

    // ── Relationships ─────────────────────────────
    public function categories() { return $this->hasMany(Category::class); }
    public function brands()     { return $this->hasMany(Brand::class); }
    public function products()   { return $this->hasMany(Product::class); }
    public function banners()    { return $this->hasMany(Banner::class); }

    // ── Scopes ────────────────────────────────────
    public function scopeActive($q)           { return $q->where('is_active', true); }
    public function scopeByDomain($q, $domain){ return $q->where('domain', $domain); }
}
