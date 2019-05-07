<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Cashier;
use App\Statement;
use App\StatementData;
use App\Cash_movement;
use App\OpenCredit;
use App\Commission;
use App\AgentWithdraw;
use App\Bet9jaPayment;
use App\BankWithdraw;
use App\Summary;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('index');
    }

    public function logout(){
        Auth::logout();
        return redirect('/');
    }

    public function addCashier(Request $req){
        if($req->mail == "")
            $mail = "N/A";
        else
            $mail = $req->mail;
        try{
            Cashier::updateOrInsert(["user_id"=>Auth::user()->user_id, "cashier_id"=>$req->cashierId],['user_id'=>Auth::user()->user_id, 'name'=>$req->name, 'email'=>$mail, 'phone'=>$req->phone, 'created_at'=>Carbon::now(), 'updated_at'=>Carbon::now()]);
            $response = "Cashier Saved";
        }catch(\Exception $e){
            if ($e->errorInfo[1] == 1062){
                $response = "Cashier Exists!";
            }
        }
        $cashiers = $this->listCashier();
        return response()->json(["response"=>$response, "cashiers"=>$cashiers]);
    }

    public function listCashier(){
        return Cashier::where('user_id', Auth::user()->user_id)->orderBy('updated_at', 'DESC')->get();
    }
    
    public function saveStatement(Request $req){
        if($req->statementId != ''){  // UPDATE STATEMENT BLOCK
            DB::beginTransaction();
            try{
                foreach($req->data as $each) {
                    $sDatas = ['user_id'=>Auth::user()->user_id,
                    'bf'=>$each['bf'],
                    'inter_credit'=>$each['interCredit'],
                    'league_sport'=>$each['leaSport'],
                    'win_sport'=>$each['winSport'],
                    'win_bet49ja'=>$each['winBet49ja'],
                    'inter_debit'=>$each['interDebit'],
                    'sport_stake'=>$each['sport'],
                    'bet49ja_stake'=>$each['bet49ja'],
                    'sport_league'=>$each['sportLea'],
                    'office_sales'=>$each['officeSales'],
                    'winnings_paid'=>$each['winPaid'],
                    'created_at'=>Carbon::now(),
                    'updated_at'=>Carbon::now() ];
                    StatementData::where("user_id", Auth::user()->user_id)->where("statement_id", $req->statementId)->where("cashier_id",$each['cashier_id'])->update($sDatas);
                }
                Cash_movement::where("user_id", Auth::user()->user_id)->where("statement_id", $req->statementId)->update(["bf"=>$req['cash']['bf'], "bank_payment"=>$req['cash']['bankPayment'], "expenses"=>$req['cash']['expenses'], "float"=>$req['cash']['float'], "credit_balance"=>$req['cash']['creditBalance'], "updated_at"=>Carbon::now()]);
                Summary::where("user_id", Auth::user()->user_id)->where("statement_id", $req->statementId)->update(["approved_credit"=>$req['summary']['approvedCredit'], "opening_balance"=>$req['summary']['openingBalance'], "commission"=>$req['summary']['commission'], "deduction"=>$req['summary']['deduction'], "agent_deposit"=>$req['summary']['agentDeposit'], "agent_withdrawal"=>$req['summary']['agentWithdraw'],"updated_at"=>Carbon::now()]);
            }catch(\Exception $e){
                DB::rollback();
                throw $e;
            }
            DB::commit();
            return response()->json(["response"=>"Statement Updated", "statementId"=>$req->statementId]);
        }else{
        DB::beginTransaction();
        try{
            $statementId = Statement::insertGetId(["user_id"=>Auth::user()->user_id, "year"=>date('Y'), "date"=>$req->date, "time"=>$req->time, "created_at"=>Carbon::now(), "updated_at"=>Carbon::now()],'statement_id'); 
            foreach($req->data as $each) {
                $sDatas[] = ['user_id'=>Auth::user()->user_id,
                'statement_id'=>$statementId,
                'cashier_id'=>$each['cashier_id'],
                'bf'=>$each['bf'],
                'inter_credit'=>$each['interCredit'],
                'league_sport'=>$each['leaSport'],
                'win_sport'=>$each['winSport'],
                'win_bet49ja'=>$each['winBet49ja'],
                'inter_debit'=>$each['interDebit'],
                'sport_stake'=>$each['sport'],
                'bet49ja_stake'=>$each['bet49ja'],
                'sport_league'=>$each['sportLea'],
                'office_sales'=>$each['officeSales'],
                'winnings_paid'=>$each['winPaid'],
                'created_at'=>Carbon::now(),
                'updated_at'=>Carbon::now() ];
            }
            StatementData::insert($sDatas);
            Cash_movement::create(["bf"=>$req['cash']['bf'], "user_id"=>Auth::user()->user_id, "statement_id"=>$statementId, "bank_payment"=>$req['cash']['bankPayment'], "expenses"=>$req['cash']['expenses'], "float"=>$req['cash']['float'], "credit_balance"=>$req['cash']['creditBalance'], "date"=>$req->date, "created_at"=>Carbon::now(), "updated_at"=>Carbon::now()]);
            // Summary::create(["bf"=>$req['cash']['bf'], "user_id"=>Auth::user()->user_id, "statement_id"=>$statementId, "bank_payment"=>$req['cash']['bankPayment'], "expenses"=>$req['cash']['expenses'], "float"=>$req['cash']['float'], "credit_balance"=>$req['cash']['creditBalance'], "date"=>$req->date, "created_at"=>Carbon::now(), "updated_at"=>Carbon::now()]);
            Summary::create(["user_id"=>Auth::user()->user_id, "statement_id"=>$statementId, "approved_credit"=>$req['summary']['approvedCredit'], "opening_balance"=>$req['summary']['openingBalance'], "commission"=>$req['summary']['commission'], "deduction"=>$req['summary']['deduction'], "agent_deposit"=>$req['summary']['agentDeposit'], "agent_withdrawal"=>$req['summary']['agentWithdraw'], "date"=>$req->date, "created_at"=>Carbon::now(), "updated_at"=>Carbon::now()]);

        }catch(\Exception $e){
            DB::rollback();
            throw $e;
        }
            DB::commit();
            return response()->json(["response"=>"Statement Saved", "statementId"=>$statementId]);
        }
    }

    public function fetchStatement(Request $req){
        $bfs = Statement::with('statementData')->where("user_id",Auth::user()->user_id)->where("date", $req->preDate)->first();
        $bf = Cash_movement::where("user_id",Auth::user()->user_id)->where("date", $req->preDate)->first();
        $preSummary = Summary::where("user_id",Auth::user()->user_id)->where("date", $req->preDate)->first();
        return ["bfs"=> $bfs, "bf"=> $bf, "preSummary"=>$preSummary, "statement" => Statement::with('cash','statementData', 'summary')->where("date", $req->date)->where("user_id",Auth::user()->user_id)->first()];
    }

    public function dailySummary(Request $req){
        $statements = [];
        $monthArr = explode("-",$req->month);
        $year = ($monthArr[1] == 1)? ($monthArr[0]-1):$monthArr[0];
        $month = ($monthArr[1] == 1)? 12:($monthArr[1] - 1);
        $lastMonthDate =  cal_days_in_month(CAL_GREGORIAN,$month,$year);
        $preDate =  $year."-".$month."-".$lastMonthDate;
        $cashData = Cash_movement::where("date",$preDate)->where("user_id", Auth::user()->user_id)->first();
        $days = cal_days_in_month(CAL_GREGORIAN,$monthArr[1],$monthArr[0]);
        for($x=1; $x<=$days; $x++){
            $data = Statement::where("date", $req->month."-".$x)->where("user_id", Auth::user()->user_id)->with(["statementData","cash"])->first();
            $com = Commission::where("user_id", Auth::user()->user_id)->where('date', $req->month."-".$x)->first();
            $agentwithdraw = AgentWithdraw::where("user_id", Auth::user()->user_id)->where('date', $req->month."-".$x)->first();
            $bet9japay = Bet9jaPayment::where("user_id", Auth::user()->user_id)->where('date', $req->month."-".$x)->first();
            $bankwithdraw = BankWithdraw::where("user_id", Auth::user()->user_id)->where('date', $req->month."-".$x)->first();
            // $com = Commission::where("user_id", Auth::user()->user_id)->where('date', $req->month."-".$x)->first();
            if(!empty($data)){
                $data['com'] = $com;
                $data['agentWithdraw'] = $agentwithdraw;
                $data['bet9jaPay'] = $bet9japay;
                $data['bankWithdraw'] = $bankwithdraw;
            }
            $statements[] = (empty($data))? 0:$data;
        }
        $openCredit = OpenCredit::where("user_id", Auth::user()->user_id)->where('date', 'like', $req->month.'%')->first();
        return response()->json(["statement"=>$statements, "cashData"=>$cashData, "openCredit"=>$openCredit]);
    }

    public function fetchOpenCredit(Request $req){
        $data = OpenCredit::where('date','like',$req->month.'%')->where('user_id',Auth::user()->user_id)->first();
        $data = ($data !='')? $data->amount:0;
        return $data;
    }

    public function saveOpenCredit(Request $req){
        $month = $req->month.'-01';
        $data = OpenCredit::updateOrInsert(['date'=>$month, 'user_id'=>Auth::user()->user_id],['user_id'=>Auth::user()->user_id,'amount'=>$req->amount,'date'=>$month]);
        return ["response"=>"Saved", "data"=>$data];
    }

    public function fetchCommission(Request $req){
        $montharr = explode("-", $req->month);
        $days = cal_days_in_month(CAL_GREGORIAN,$montharr[1],$montharr[0]);
        $data = Commission::where('user_id',Auth::user()->user_id)->where('date','like',$req->month.'%')->get();
        return ["days"=>$days, "datas"=>$data];
    }

    public function saveCommission(Request $req){
        // return $req;
        $month = $req->month;
        $values = $req->data;
        foreach($values as $key => $amount){
            $index = $key;
            $key = ($key <=9)? '0'.$key:$key;
            $day = $month.'-'.$key;
            if($amount !=''){
                $data = Commission::updateOrInsert(['date'=>$day, 'user_id'=>Auth::user()->user_id], ['user_id'=>Auth::user()->user_id,'amount'=>$amount,'date'=>$day, 'remarks'=>$req->remarks[$index]]);
            }
        }
        return ["response"=>"Saved"];
    }

    public function fetchAgentWithdraw(Request $req){
        $montharr = explode("-", $req->month);
        $days = cal_days_in_month(CAL_GREGORIAN,$montharr[1],$montharr[0]);
        $data = AgentWithdraw::where('user_id',Auth::user()->user_id)->where('date','like',$req->month.'%')->get();
        return ["days"=>$days, "datas"=>$data];
    }

    public function saveAgentWithdraw(Request $req){
        $month = $req->month;
        $values = $req->data;
        foreach($values as $key => $amount){
            $index = $key;
            $key = ($key <=9)? '0'.$key:$key;
            $day = $month.'-'.$key;
            if($amount !=''){
                $data = AgentWithdraw::updateOrInsert(['date'=>$day, 'user_id'=>Auth::user()->user_id], ['user_id'=>Auth::user()->user_id,'amount'=>$amount,'date'=>$day, 'remarks'=>$req->remarks[$index]]);
            }
        }
        return ["response"=>"Saved"];
    }

    public function fetchBet9jaPayment(Request $req){
        $montharr = explode("-", $req->month);
        $days = cal_days_in_month(CAL_GREGORIAN,$montharr[1],$montharr[0]);
        $data = Bet9jaPayment::where('user_id',Auth::user()->user_id)->where('date','like',$req->month.'%')->get();
        return ["days"=>$days, "datas"=>$data];
    }

    public function saveBet9jaPayment(Request $req){
        $month = $req->month;
        $values = $req->data;
        foreach($values as $key => $amount){
            $index = $key;
            $key = ($key <=9)? '0'.$key:$key;
            $day = $month.'-'.$key;
            if($amount !=''){
                $data = Bet9jaPayment::updateOrInsert(['date'=>$day, 'user_id'=>Auth::user()->user_id], ['user_id'=>Auth::user()->user_id,'amount'=>$amount,'date'=>$day, 'remarks'=>$req->remarks[$index]]);
            }
        }
        return ["response"=>"Saved"];
    }
    
    public function fetchBankWithdraw(Request $req){
        $montharr = explode("-", $req->month);
        $days = cal_days_in_month(CAL_GREGORIAN,$montharr[1],$montharr[0]);
        $data = BankWithdraw::where('user_id',Auth::user()->user_id)->where('date','like',$req->month.'%')->get();
        return ["days"=>$days, "datas"=>$data];
    }

    public function saveBankWithdraw(Request $req){
        $month = $req->month;
        $values = $req->data;
        foreach($values as $key => $amount){
            $index = $key;
            $key = ($key <=9)? '0'.$key:$key;
            $day = $month.'-'.$key;
            if($amount !=''){
                $data = BankWithdraw::updateOrInsert(['date'=>$day, 'user_id'=>Auth::user()->user_id], ['user_id'=>Auth::user()->user_id,'amount'=>$amount,'date'=>$day, 'remarks'=>$req->remarks[$index]]);
            }
        }
        return ["response"=>"Saved"];
    }


}
