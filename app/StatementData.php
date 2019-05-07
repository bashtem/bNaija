<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StatementData extends Model
{
    public $fillable = ['id',
                        'user_id',
                        'statement_id',
                        'cashier_id',
                        'bf',
                        'inter_credit',
                        'league_sport',
                        'win_sport',
                        'win_bet49ja',
                        'inter_debit',
                        'sport_stake',
                        'bet49ja_stake',
                        'sport_league',
                        'office_sales',
                        'winnings_paid',
                        'bf_cash',
                        'created_at',
                        'updated_at'];
}
