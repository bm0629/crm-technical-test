<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Sample initial customers
        $customers = [
            [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'email' => 'juan_dela_cruz@gmail.com',
                'contact_no' => '1234567890'
            ],
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'email' => 'maria_santos@gmail.com',
                'contact_no' => '0987654321'
            ],
            [
                'first_name' => 'Jose',
                'last_name' => 'Rizal',
                'email' => 'jose_rizal@gmail.com',
                'contact_no' => '1112223333'
            ],
            [
                'first_name' => 'Ana',
                'last_name' => 'Garcia',
                'email' => 'ana_garcia@gmail.com',
                'contact_no' => '4445556666'
            ],
            [
                'first_name' => 'Pedro',
                'last_name' => 'Reyes',
                'email' => 'pedro_reyes@gmail.com',
                'contact_no' => '7778889999'
            ],
        ];

        foreach ($customers as $c) {
            Customer::firstOrCreate(
                ['email' => $c['email']],
                [
                    'first_name' => $c['first_name'],
                    'last_name' => $c['last_name'],
                    'contact_no' => $c['contact_no']
                ]
            );
        }
    }
}
