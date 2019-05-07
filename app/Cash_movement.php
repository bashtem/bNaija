<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cash_movement extends Model
{
    public $fillable = ["id", "bf", "user_id", "statement_id", "bank_payment", "expenses", "float", "credit_balance", "date", "created_at", "updated_at"];
}
