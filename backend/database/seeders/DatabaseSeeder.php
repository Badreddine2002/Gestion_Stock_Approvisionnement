<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\StockEntry;
use App\Models\StockExit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Nettoyage
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        Role::truncate();
        Category::truncate();
        Supplier::truncate();
        Product::truncate();
        StockEntry::truncate();
        StockExit::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Création des rôles
        $adminRole = Role::create(['name' => 'admin']);
        $managerRole = Role::create(['name' => 'manager']);

        // 3. Utilisateurs
        User::create([
            'name' => 'Admin ISPITS',
            'email' => 'admin@ispits.ma',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);

        User::create([
            'name' => 'Gestionnaire',
            'email' => 'manager@ispits.ma',
            'password' => Hash::make('password'),
            'role_id' => $managerRole->id,
        ]);

        // 4. Catégories
        $cat1 = Category::create(['name' => 'Médicaments']);
        $cat2 = Category::create(['name' => 'Matériel Médical']);

        // 5. Fournisseurs
        $sup1 = Supplier::create(['name' => 'Pharmacie Centrale', 'email' => 'contact@pharma.ma', 'phone' => '0500000000']);
        $sup2 = Supplier::create(['name' => 'MedicalTech', 'email' => 'sales@medtech.ma', 'phone' => '0511111111']);

        // 6. Produits
        $prod1 = Product::create([
            'name' => 'Paracétamol 500mg', 
            'category_id' => $cat1->id, 
            'supplier_id' => $sup1->id,
            'sku' => 'MED-001',
            'quantity' => 100
        ]);

        $prod2 = Product::create([
            'name' => 'Masques FFP2', 
            'category_id' => $cat2->id, 
            'supplier_id' => $sup2->id,
            'sku' => 'MAT-001',
            'quantity' => 500
        ]);

        // 7. Mouvements
        StockEntry::create([
            'product_id' => $prod1->id,
            'supplier_id' => $sup1->id,
            'quantity' => 100,
            'entry_date' => now()
        ]);

        StockExit::create([
            'product_id' => $prod1->id,
            'quantity' => 20,
            'exit_date' => now()
        ]);
    }
}
