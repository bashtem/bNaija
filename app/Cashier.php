<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cashier extends Model
{
    public $fillable = ['cashier_id', 'user_id', 'name', 'email', 'phone', 'created_at', 'updated_at'];
}
