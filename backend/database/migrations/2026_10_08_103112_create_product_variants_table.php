<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');           // e.g. "Size", "Color"
            $table->string('value');          // e.g. "XL", "Red"
            $table->string('sku')->nullable();
            $table->unsignedInteger('price_adjustment')->default(0); // +/- from product price
            $table->unsignedInteger('stock')->default(0);
            $table->boolean('in_stock')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
