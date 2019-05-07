<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCashMovementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cash_movements', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_id');
            $table->string('statement_id');
            $table->decimal('bank_payment',10,2)->default(0);
            $table->decimal('expenses',10,2)->default(0);
            $table->decimal('float',10,2)->default(0);
            $table->decimal('credit_balance',10,2)->default(0);
            $table->decimal('bf',10,2)->default(0);
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cash_movements');
    }
}
