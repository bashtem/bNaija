<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Statement extends Model
{
    public $primaryKey = "statement_id";
    public function statementData(){
        return $this->hasMany("App\StatementData", "statement_id");
    }
    
    public function cash(){
        return $this->hasOne("App\Cash_movement", "statement_id");
    }
    
    public function summary(){
        return $this->hasOne("App\Summary", "statement_id");
    }
}
