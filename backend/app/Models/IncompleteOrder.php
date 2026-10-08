<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncompleteOrder extends Model
{
    protected $fillable = [
        'store_id', 'customer_phone', 'customer_name',
        'shipping_address', 'cart_data', 'last_step',
        'is_contacted', 'is_converted', 'admin_notes',
    ];

    protected $casts = [
        'cart_data'    => 'array',
        'is_contacted' => 'boolean',
        'is_converted' => 'boolean',
    ];

    public function store() { return $this->belongsTo(Store::class); }
}
