<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        if ($search) {
            $esResponse = Http::post('http://elasticsearch:9200/customers/_search', [
                'query' => [
                    'multi_match' => [
                        'query' => $search,
                        'fields' => ['first_name', 'last_name', 'email'],
                    ]
                ]
            ]);

            $hits = $esResponse->json()['hits']['hits'] ?? [];
        
            if (count($hits) === 0) {
                $customers = Customer::where('first_name', 'like', "%$search%")
                    ->orWhere('last_name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->get();
            } else {
                $customers = collect($hits)->map(fn($hit) => $hit['_source']);
            }

            return response()->json($customers);
        }
    
        return response()->json(Customer::all());
    }


    public function findCustomer($id)
    {
        return response()->json(Customer::findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'contact_no' => 'required|string|max:20',
        ]);

        $customer = Customer::create($validated);
    
        Http::put("http://elasticsearch:9200/customers/_doc/{$customer->id}", [
            'id' => $customer->id,
            'first_name' => $customer->first_name,
            'last_name' => $customer->last_name,
            'email' => $customer->email,
            'contact_no' => $customer->contact_no,
        ]);

        return response()->json($customer, 201);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:customers,email,' . $id,
            'contact_no' => 'sometimes|required|string|max:20',
        ]);

        $customer->update($validated);
    
        Http::put("http://elasticsearch:9200/customers/_doc/{$customer->id}", [
            'id' => $customer->id,
            'first_name' => $customer->first_name,
            'last_name' => $customer->last_name,
            'email' => $customer->email,
            'contact_no' => $customer->contact_no,
        ]);

        return response()->json($customer);
    }

    public function delete($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
    
        Http::delete("http://elasticsearch:9200/customers/_doc/{$id}");

        return response()->json(['message' => 'Customer deleted successfully']);
    }
}
