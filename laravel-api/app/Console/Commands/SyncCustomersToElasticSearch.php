<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Customer;
use Illuminate\Support\Facades\Http;

class SyncCustomersToElasticsearch extends Command
{
    protected $signature = 'customers:sync-es';
    protected $description = 'Sync all customers to Elasticsearch';

    public function handle()
    {
        $this->info("🔍 Syncing customers to Elasticsearch...");

        $customers = Customer::all();

        foreach ($customers as $customer) {
            try {
                $response = Http::put("http://elasticsearch:9200/customers/_doc/{$customer->id}", [
                    'id' => $customer->id,
                    'first_name' => $customer->first_name,
                    'last_name' => $customer->last_name,
                    'email' => $customer->email,
                    'contact_no' => $customer->contact_no,
                ]);

                if ($response->failed()) {
                    $this->error("Failed to sync customer {$customer->id}");
                }
            } catch (\Exception $e) {
                $this->error("Error syncing customer {$customer->id}: {$e->getMessage()}");
            }
        }

        $this->info("✅ All customers synced to Elasticsearch");
        return 0;
    }
}
