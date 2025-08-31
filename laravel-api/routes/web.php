<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/customers', [\App\Http\Controllers\CustomerController::class, 'index']);         
Route::get('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'findCustomer']);
Route::post('/customers', [\App\Http\Controllers\CustomerController::class, 'store']);        
Route::put('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'update']);   
Route::delete('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'delete']);
