<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStatementDatasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('statement_datas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_id');
            $table->string('statement_id');
            $table->string('cashier_id');
            $table->decimal('bf',10,2)->default(0);
            $table->decimal('inter_credit',10,2)->default(0);
            $table->decimal('league_sport',10,2)->default(0);
            $table->decimal('win_sport',10,2)->default(0);
            $table->decimal('win_bet49ja',10,2)->default(0);
            $table->decimal('inter_debit',10,2)->default(0);
            $table->decimal('sport_stake',10,2)->default(0);
            $table->decimal('bet49ja_stake',10,2)->default(0);
            $table->decimal('sport_league',10,2)->default(0);
            $table->decimal('office_sales',10,2)->default(0);
            $table->decimal('winnings_paid',10,2)->default(0);
            // $table->decimal('bf_cash',10,2)->default(0);
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
        Schema::dropIfExists('statement_datas');
    }
}