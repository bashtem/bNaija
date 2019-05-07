<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Summary extends Model
{
    public $fillable = ["id", "user_id", "statement_id", "approved_credit", "opening_balance", "available_credit", "commission", "deduction", "agent_deposit", "agent_withdrawal", "sport_sales", "total_winnings", "date", "created_at", "updated_at"];
}
