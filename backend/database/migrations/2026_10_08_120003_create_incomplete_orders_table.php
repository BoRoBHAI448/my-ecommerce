<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incomplete_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->string('customer_phone');
            $table->string('customer_name')->nullable();
            $table->text('shipping_address')->nullable();
            $table->jsonb('cart_data')->nullable();
            $table->string('last_step')->default('phone_entered');
            $table->boolean('is_contacted')->default(false);
            $table->boolean('is_converted')->default(false);
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'customer_phone']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incomplete_orders');
    }
};
