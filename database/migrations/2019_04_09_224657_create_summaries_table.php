<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSummariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('summaries', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_id');
            $table->string('statement_id');
            $table->decimal('approved_credit',10,2)->default(0);
            $table->decimal('opening_balance',10,2)->default(0);
            $table->decimal('available_credit',10,2)->default(0);
            $table->decimal('commission',10,2)->default(0);
            $table->decimal('deduction',10,2)->default(0);
            $table->decimal('agent_deposit',10,2)->default(0);
            $table->decimal('agent_withdrawal',10,2)->default(0);
            $table->decimal('sport_sales',10,2)->default(0);
            $table->decimal('total_winnings',10,2)->default(0);
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
        Schema::dropIfExists('summaries');
    }
}
