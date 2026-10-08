<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /**
     * Get list of active hero/promo banners
     */
    public function index(Request $request): JsonResponse
    {
        $position = $request->input('position');

        $query = Banner::active()->orderBy('sort_order');

        if ($position) {
            $query->byPosition($position);
        }

        $banners = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $banners,
        ]);
    }
}
