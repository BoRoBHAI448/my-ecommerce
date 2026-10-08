<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminStoreController extends Controller
{
    /**
     * Update active store configuration / settings
     */
    public function update(Request $request): JsonResponse
    {
        $store = Store::where('is_active', true)->first();
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'                    => 'nullable|string|max:255',
            'tagline'                 => 'nullable|string|max:255',
            'contact_email'           => 'nullable|email|max:255',
            'contact_phone'           => 'nullable|string|max:50',
            'whatsapp_number'         => 'nullable|string|max:50',
            'address'                 => 'nullable|string',
            'delivery_charge_inside'  => 'nullable|integer|min:0',
            'delivery_charge_outside' => 'nullable|integer|min:0',
            'free_delivery_above'     => 'nullable|integer|min:0',
            'notice_text'             => 'nullable|string',
            'primary_color'           => 'nullable|string',
            'secondary_color'         => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $store->update($request->only([
            'name', 'tagline', 'contact_email', 'contact_phone',
            'whatsapp_number', 'address', 'delivery_charge_inside',
            'delivery_charge_outside', 'free_delivery_above',
            'notice_text', 'primary_color', 'secondary_color',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Store settings updated successfully',
            'data'    => $store->fresh(),
        ]);
    }
}
