var b9ja = angular.module('b9ja', ['ngRoute','datatables', 'ui.bootstrap']);

b9ja.config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl:'template/cashiers.html',
        controller : "cashier"
    }).when('/cashiers', {
        templateUrl:'template/cashiers.html',
        controller : "cashier"
    }).when('/summary', {
        templateUrl:'template/summary.html',
        controller : "summary"
    }).when('/statement', {
        templateUrl:'template/statement.html',
        controller : "statement"
    }).when('/datasetup', {
        templateUrl:'template/datasetup.html',
        controller : "datasetup"
    });
});

b9ja.service("fns", function($http, $filter, $rootScope){
    this.fetchCashier = function(){
        return $http({url:'listcashier', method:"GET" }).then((res)=>{
            return res;
            }, (res)=>{console.log(res.data)});
        }
    this.sumObjNumbers = function( obj ) {
        return Object.keys(obj).reduce((sum,key)=>sum+parseFloat(obj[key]||0),0);
      }
    this.sumArrayNumbers = function(arr){
        return arr.reduce((sum,each)=>{return sum+parseFloat(each||0)},0);
    }

    this.date = function(date){
        return $filter("date")(date,"yyyy-MM-dd");
    }

    this.time = function(){
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var sec = currentTime.getSeconds();
            if(minutes<10){
                minutes='0'+minutes;
            }	
        tm = hours+':'+minutes+':'+sec;
        return tm; 
    }

    // this.showDate = function(){
    //     $rootScope.uiOpen = true;
    //     // console.log("Heello service");
    // }
});

b9ja.filter('range', function() {
    return function(input, total) {
      total = parseInt(total);
      for (var i=0; i<total; i++) {
        input.push(i);
      }
      return input;
    };
});

b9ja.controller('dashboard', function($http, $scope, $parse){

});

b9ja.controller('cashier', function($http, $scope, fns){
    
    $scope.addCashier = function(){
        var datas = {name:$scope.cashierName, phone:$scope.cashierPhone, mail:$scope.cashierMail, cashierId:$scope.cashierId};
        $http({url:'addcashier', method:"POST", data:datas}).then((res)=>{
            $scope.cashierList = res.data.cashiers;
            $scope.cashierList_origin = res.data.cashiers;        
            toastr.success(res.data.response, 'Success');
        }, (res)=>{
            toastr.error('', 'Failed');
        });
    }
    
    fns.fetchCashier().then((res)=>{
        $scope.cashierList = res.data;        
        $scope.cashierList_origin = res.data;        
    });

    $scope.cashier_search = function(){
        if($scope.searchCashier == null){
            $scope.cashierList = angular.copy($scope.cashierList_origin);
        }
            $scope.cashierList = $scope.cashierList_origin.filter((each)=>{
            var {name,phone,email} = each;
            for (x in {name,phone,email}){
                var itm = each[x].toLowerCase();
                var src = $scope.searchCashier.toLowerCase();
                if( itm.search( src ) >= 0){
                    return each;
                }
            }
        })

    }

    $scope.editCashier = function(x){
        console.log(x);
        $scope.cashierId = x.cashier_id;
        $scope.cashierName = x.name;
        $scope.cashierPhone = x.phone;
        $scope.cashierMail = x.email;
    }

    $scope.reset = function(){
        $scope.cashierId = null;
        $scope.cashierName = null;
        $scope.cashierPhone = null;
        $scope.cashierMail = null;
    }
})

b9ja.controller('statement', function($http, $scope, fns, $parse, $filter){
    $scope.colorClass = {officeSales:[],winPaid:[], bfCash:'', bankPayment:'', expenses:'', float:'', agentDeposit:'', agentWithdraw:'' };
    // console.log($scope.colorClass);
    $scope.showDate = function(){
        $scope.uiOpen = true;
    }
    
    $scope.statementDate = new Date();

    $scope.checkInput = function(obj, data, index=0){
        if(data == null){
            $scope.colorClass[obj][index] = "empty-input";            // CSS CLASS from demo.css
        }else{
            $scope.colorClass[obj][index] = "filled-input";          // CSS CLASS
        }
    }

    $scope.checkChanges = function(data,colorData){
        Object.keys(data).forEach((key, index)=>{
            if(data[key] == null){
                colorData[key] = 'empty-input';
            }else{
                colorData[key] = 'filled-input';
            }
        })
    }

    $scope.chkChanges = function(data,key){
        if(data == null){
            $scope.colorClass[key] = 'empty-input';
        }else{
            $scope.colorClass[key] = 'filled-input';
        }
    }

    // WATCH LIST.....................

    $scope.$watch('office_sales', ()=>{
        $scope.checkChanges($scope.office_sales, $scope.colorClass.officeSales);
    }, true);

    $scope.$watch('win_paid', ()=>{
        $scope.checkChanges($scope.win_paid, $scope.colorClass.winPaid);
    }, true);

    $scope.$watch('cash_movement.bf_cash', (newValues, oldValues, scope)=>{
        $scope.chkChanges($scope.cash_movement.bf_cash, 'bfCash');
    })
    
    $scope.$watch('cash_movement.bank_payment', (newValues, oldValues, scope)=>{
        $scope.chkChanges($scope.cash_movement.bank_payment, 'bankPayment');
    })

    $scope.$watch('cash_movement.expenses', (newValues, oldValues, scope)=>{
        $scope.chkChanges($scope.cash_movement.expenses, 'expenses');
    })

    $scope.$watch('cash_movement.float', (newValues, oldValues, scope)=>{
        $scope.chkChanges($scope.cash_movement.float, 'float');
    })

    $scope.$watch('summary_account.agent_deposit', (newValues, oldValues, scope)=>{
        $scope.chkChanges($scope.summary_account.agent_deposit, 'agentDeposit');
    })

    $scope.$watch('summary_account.agent_withdrawal', (newValues, oldValues, scope)=>{
        $scope.chkChanges($scope.summary_account.agent_withdrawal, 'agentWithdraw');
    })
    


    $scope.summary_account = {};
    credit_array = [];
    sales_array = [];
    $scope.sum_total_credit = {};
    $scope.sum_total_withdrawl = {};
    $scope.sum_total_dailyBalance = {};
    $scope.sum_total_virtual_stake = {};
    $scope.sum_total_bet49ja = {};
    $scope.sum_total_sales = {};

    $scope.summary_account.approved_credit = 1000000;

    // OBJECT FOR DATA INPUTS
    $scope.bf = {};
    $scope.inter_credit = {};
    $scope.lea_sport = {};
    $scope.win_sport = {};
    $scope.win_bet49ja = {};

    $scope.inter_debit = {};
    $scope.sport = {};
    $scope.bet49ja = {};
    $scope.sport_lea = {};

    $scope.office_sales = {};
    $scope.win_paid = {};

   
    // CALCULATED DATA OBJETS
    $scope.sport_bet_stake_obj = {};



    fns.fetchCashier().then((res)=>{
        $scope.cashierList = res.data;
    });

    $scope.clearCashierDatas = function(){
        $scope.summary_account.commission = 0;
        $scope.summary_account.deduction = 0;
        $scope.summary_account.agent_deposit = 0;
        $scope.summary_account.agent_withdrawal = 0;
        return fns.fetchCashier().then((res)=>{
            res.data.forEach((x)=>{
                $scope.bf[x.cashier_id] = null;
                $scope.inter_credit[x.cashier_id] = null;
                $scope.lea_sport[x.cashier_id] = null;
                $scope.win_sport[x.cashier_id] = null;
                $scope.win_bet49ja[x.cashier_id] = null;
                $scope.inter_debit[x.cashier_id] = null;
                $scope.sport[x.cashier_id] = null;
                $scope.bet49ja[x.cashier_id] = null;
                $scope.sport_lea[x.cashier_id] = null;
                $scope.office_sales[x.cashier_id] = null;
                $scope.win_paid[x.cashier_id] = null;
            });
        })
    }

    // CREDIT
    $scope.sum_credit_column = function(cashierId) {
        credit_array = [$scope.bf[cashierId], $scope.inter_credit[cashierId], $scope.lea_sport[cashierId],$scope.win_sport[cashierId], $scope.win_bet49ja[cashierId] ];
        var credit_sum = fns.sumArrayNumbers(credit_array);
        $scope.sum_total_credit[cashierId] = credit_sum;
        return credit_sum;
    };

    $scope.total_credit_row = function(obj){
        return fns.sumObjNumbers(eval(obj));
    }

    $scope.total_credit = function(){
        return fns.sumObjNumbers($scope.sum_total_credit);
    }
    

    // WITHDRAWAL
    $scope.sum_withdrawl_column = function(cashierId){
        withdrawl_array = [$scope.inter_debit[cashierId], $scope.sport[cashierId], $scope.bet49ja[cashierId], $scope.sport_lea[cashierId] ];
        var withdrawl_sum = fns.sumArrayNumbers(withdrawl_array);
        $scope.sum_total_withdrawl[cashierId] = withdrawl_sum;
        return withdrawl_sum;
    }

    $scope.total_withdrawl_row = function(obj){
        return fns.sumObjNumbers(eval(obj));
    } 

    $scope.total_withdrawl = function(){
        return fns.sumObjNumbers($scope.sum_total_withdrawl);
    }
    
    $scope.sum_dailyBalance = function(cashierId){
        var s =  parseFloat($scope.sum_total_credit[cashierId]||0) - parseFloat($scope.sum_total_withdrawl[cashierId]||0);
        $scope.sum_total_dailyBalance[cashierId] = s;
        return s;
    }

    $scope.total_dailyBalance = function(){
        return fns.sumObjNumbers($scope.sum_total_dailyBalance);
    }

    /// SALES
    $scope.sport_bet_stake = function(cashierId){
        var res = $scope.sport_bet_stake_obj[cashierId] = parseFloat($scope.sport[cashierId]||0);
        return res;
    }

    $scope.total_sport_bet_stake_row = function(obj){
        return fns.sumObjNumbers(eval(obj));
    }

    $scope.virtual_stake = function(cashierId){
        var s =  parseFloat($scope.sport_lea[cashierId]||0) - parseFloat($scope.lea_sport[cashierId]||0);
        $scope.sum_total_virtual_stake[cashierId] = s;
        return s;
    }

    $scope.total_virtual_stake = function(){
        return fns.sumObjNumbers($scope.sum_total_virtual_stake);
    }

    $scope.bet49ja_row = function(cashierId){
        var b = parseFloat($scope.bet49ja[cashierId]||0) - parseFloat($scope.win_bet49ja[cashierId]||0);
        $scope.sum_total_bet49ja[cashierId] = b;
        return b;
    }

    $scope.total_bet49ja = function(){
        return fns.sumObjNumbers($scope.sum_total_bet49ja);
    }

    $scope.sales = function(cashierId){
        sales_data_array = [$scope.sport_bet_stake_obj[cashierId], $scope.sum_total_virtual_stake[cashierId], $scope.sum_total_bet49ja[cashierId] ];
        var sales_sum = fns.sumArrayNumbers(sales_data_array);
        $scope.sum_total_sales[cashierId] = sales_sum;
        return sales_sum;
    }

    $scope.total_sales = function(){
        return fns.sumObjNumbers($scope.sum_total_sales);
    }

    $scope.total_office_sales = function(){
        return fns.sumObjNumbers($scope.office_sales);
    }

    $scope.total_winnings_paid = function(){
        return fns.sumObjNumbers($scope.win_paid);
    }

    $scope.actual_sales = function(cashierId){
        var b = parseFloat($scope.office_sales[cashierId]||0) - parseFloat($scope.win_paid[cashierId]||0);
        return b;
    }

    $scope.actual_sales_last = function(){
        return fns.sumObjNumbers($scope.office_sales) - fns.sumObjNumbers($scope.win_paid);
    }

    $scope.diff_office_total_sales = function(cashierId){
        return  parseFloat($scope.office_sales[cashierId]||0) - $scope.sales(cashierId);
    }

    $scope.diff_office_total_sales_last = function(){
        return $scope.total_office_sales() - $scope.total_sales();
    }

    $scope.total_cash = function(){
        return parseFloat($scope.cash_movement.bf_cash ||0) + $scope.actual_sales_last();
    }

    $scope.cash_balance = function(){
        return $scope.total_cash() - parseFloat($scope.cash_movement.bank_payment||0) - parseFloat($scope.cash_movement.expenses||0) - parseFloat($scope.cash_movement.float||0);
    }

    $scope.credit_balance = function(){
        return $scope.cash_balance() + parseFloat($scope.cash_movement.float||0);
    }


    // WINNINGS TRACKER
    $scope.winBf = {};      // INITIALIZED in Fetch statement datas fn
    $scope.out_win_bal = [];
    $scope.cal_win_track_bf = function(){
        var sum = 0;
        if($scope.bfsFlag == false){
            return $scope.total_credit_row('$scope.win_sport');
        }else{
            Object.keys($scope.winBf).forEach((keys,index)=>{
                var res = $scope.win_sport[keys] + $scope.winBf[keys] - $scope.win_paid[keys];
                sum+= $scope.out_win_bal[keys] = res; //(res > 0 )? res:0;
            })
            // console.log(sum);
            return sum;
        }
    }


    // SUMMARY

    $scope.available_credit = function(){
        $scope.summary_account.available_credit = $scope.summary_account.approved_credit + $scope.web_balance();
        return $scope.summary_account.available_credit
    }

    $scope.cal_web_balance = function(){
        return $scope.summary_account.opening_balance + $scope.balance_commission() + $scope.summary_account.agent_deposit + $scope.total_withdrawl_row('$scope.inter_debit') - $scope.summary_account.agent_withdrawal - $scope.total_credit_row("$scope.inter_credit");
    }

    $scope.web_balance = function(){
        return $scope.cal_web_balance() - $scope.summary_account.approved_credit;
    }

    $scope.payable_bet9ja = function(){
        var calc = $scope.total_dailyBalance() + $scope.web_balance();
        return (calc < 0)? calc:0;
    }

    $scope.credit_withdrawalable = function(){
        var ca = $scope.total_dailyBalance() + $scope.web_balance();
        return (ca > 0)? ca:0;
    }

    $scope.outstanding_winnings = function(){
        var compute = ($scope.cal_win_track_bf() * (-1));
        // console.log(compute);
        return compute;
    }

    $scope.agent_total_debt = function(){
        var value =  ($scope.payable_bet9ja() + $scope.outstanding_winnings());
        return (value > 0)? 0:value;
    }

    $scope.balance_commission = function(){
        return parseFloat($scope.summary_account.commission||0) - parseFloat($scope.summary_account.deduction||0);
    }

    $scope.sport_sales = function(){
        $scope.summary_account.sport_sales_new = $scope.total_sport_bet_stake_row('$scope.sport') + $scope.summary_account.sport_sales;
        return $scope.summary_account.sport_sales_new;
    }

    $scope.total_winnings = function(){
        $scope.summary_account.total_winnings_new =  $scope.total_credit_row('$scope.win_sport') + $scope.summary_account.total_winnings;
        return $scope.summary_account.total_winnings_new;
    }

    $scope.profit_loss = function(){
        return $scope.sport_sales() - $scope.total_winnings();
    }


    $scope.fetchSearch = function(){
        $scope.statementId ='';
        // CASH MOVEMENT
        $scope.cash_movement = {bank_payment:null, expenses:null, float:null, bf_cash:null};
        $scope.clearCashierDatas().then((res)=>{
            if($scope.statementDate !=''){
                var date = fns.date($scope.statementDate);
                var previousDay = moment(date, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
                $http({method:"POST", url:"fetchstatement", data:{date:date, preDate:previousDay}}).then((res)=>{
                    console.log(res.data);
                    if(res.data.statement != null){
                        res.data.statement.statement_data.forEach((val)=>{
                            $scope.bf[val.cashier_id] = parseFloat(val.bf);
                            $scope.inter_credit[val.cashier_id] = parseFloat(val.inter_credit);
                            $scope.lea_sport[val.cashier_id] = parseFloat(val.league_sport);
                            $scope.win_sport[val.cashier_id] = parseFloat(val.win_sport);
                            $scope.win_bet49ja[val.cashier_id] = parseFloat(val.win_bet49ja);
                            $scope.inter_debit[val.cashier_id] = parseFloat(val.inter_debit);
                            $scope.sport[val.cashier_id] = parseFloat(val.sport_stake);
                            $scope.bet49ja[val.cashier_id] = parseFloat(val.bet49ja_stake);
                            $scope.sport_lea[val.cashier_id] = parseFloat(val.sport_league);
                            $scope.office_sales[val.cashier_id] = parseFloat(val.office_sales);
                            $scope.win_paid[val.cashier_id] = parseFloat(val.winnings_paid);
                        });
                        $scope.statementId = res.data.statement.statement_id;

                        // CASH
                        var cash = res.data.statement.cash;
                        $scope.cash_movement.bank_payment = parseFloat(cash.bank_payment);
                        $scope.cash_movement.expenses = parseFloat(cash.expenses);
                        $scope.cash_movement.float = parseFloat(cash.float);

                        // SUMMARY
                        var summary = res.data.statement.summary;
                        $scope.summary_account.approved_credit = parseFloat(summary.approved_credit);
                        $scope.summary_account.commission = parseFloat(summary.commission);
                        $scope.summary_account.deduction = parseFloat(summary.deduction);
                        $scope.summary_account.agent_deposit = parseFloat(summary.agent_deposit);
                        $scope.summary_account.agent_withdrawal = parseFloat(summary.agent_withdrawal);

                    }

                    if(res.data.preSummary != null ){
                        // SUMMARY
                        // var summary = res.data.statement.summary;
                        var preSummary = res.data.preSummary;
                        $scope.summary_account.opening_balance = (preSummary == null)? parseFloat(summary.opening_balance) : parseFloat(preSummary.available_credit);
                        console.log(preSummary.available_credit);
                        $scope.summary_account.sport_sales = (preSummary == null)? parseFloat(summary.sport_sales) : parseFloat(preSummary.sport_sales);
                        $scope.summary_account.total_winnings = (preSummary == null)? parseFloat(summary.total_winnings) : parseFloat(preSummary.total_winnings);
                    }
                        
                        
                        $scope.cash_movement.bf_cash = (res.data.bf != null)? (parseFloat(res.data.bf.credit_balance)) : (res.data.statement != null)? parseFloat(res.data.statement.cash.bf):0;
                    if(res.data.bfs != null){
                        res.data.bfs.statement_data.forEach((i,index)=>{
                            var totalCredit = (parseFloat(i.bf) + parseFloat(i.inter_credit) + parseFloat(i.league_sport) + parseFloat(i.win_sport) + parseFloat(i.win_bet49ja));
                            var totalWithdraw = (parseFloat(i.inter_debit) + parseFloat(i.sport_stake) + parseFloat(i.bet49ja_stake) + parseFloat(i.sport_league));
                            $scope.bf[i.cashier_id] = parseFloat((totalCredit - totalWithdraw).toFixed(3));
                            // WINNINGS TRACKER BFS
                            $scope.winBf[i.cashier_id] = parseFloat(i.outstnd_win_bal);
                        })
                        $scope.bfsFlag = true;
                                //    console.log($scope.winBf);
                    }else{
                        $scope.bfsFlag = false;
                    }

                }, (res)=>{console.log(res.data)});
            }
        })
    }
    $scope.fetchSearch();

    $scope.saveStatement = function(){
        var datas = []; var sendData = {};
        // datas = [$scope.bf, $scope.inter_credit, $scope.lea_sport, $scope.win_sport, $scope.win_bet49ja, $scope.inter_debit, $scope.sport, $scope.bet49ja, $scope.sport_lea, $scope.office_sales, $scope.win_paid];
        $scope.cashierList.forEach((dat)=>{
            obj = {cashier_id:dat.cashier_id, bf:parseFloat($scope.bf[dat.cashier_id]||0), 
                interCredit:parseFloat($scope.inter_credit[dat.cashier_id]||0), 
                leaSport:parseFloat($scope.lea_sport[dat.cashier_id]||0),
                winSport:parseFloat($scope.win_sport[dat.cashier_id]||0),
                winBet49ja:parseFloat($scope.win_bet49ja[dat.cashier_id]||0),
                interDebit:parseFloat($scope.inter_debit[dat.cashier_id]||0),
                sport:parseFloat($scope.sport[dat.cashier_id]||0),
                bet49ja:parseFloat($scope.bet49ja[dat.cashier_id]||0),
                sportLea:parseFloat($scope.sport_lea[dat.cashier_id]||0),
                officeSales:parseFloat($scope.office_sales[dat.cashier_id]||0),
                winPaid:parseFloat($scope.win_paid[dat.cashier_id]||0),
                outWinBal:parseFloat($scope.out_win_bal[dat.cashier_id]||0),
            };
            datas.push(obj);
        })
        var cashMov = {bf:parseFloat($scope.cash_movement.bf_cash||0), bankPayment:parseFloat($scope.cash_movement.bank_payment||0), expenses:parseFloat($scope.cash_movement.expenses||0), float:parseFloat($scope.cash_movement.float||0), creditBalance:parseFloat($scope.credit_balance()||0) };
        var summary = {approvedCredit:parseFloat($scope.summary_account.approved_credit||0), openingBalance:parseFloat($scope.summary_account.opening_balance||0), commission:parseFloat($scope.summary_account.commission||0), deduction:parseFloat($scope.summary_account.deduction||0), agentDeposit:parseFloat($scope.summary_account.agent_deposit||0), agentWithdraw:parseFloat($scope.summary_account.agent_withdrawal||0), availableCredit:parseFloat($scope.summary_account.available_credit||0), sportSales:parseFloat($scope.summary_account.sport_sales_new||0) , totalWinnings:parseFloat($scope.summary_account.total_winnings_new||0) };
        sendData['data'] = datas;
        sendData['cash'] = cashMov;
        sendData['summary'] = summary;
        sendData['statementId'] = $scope.statementId;
        sendData['date'] = fns.date($scope.statementDate);
        sendData['time'] = fns.time();
        $http({method:"POST", url:"savestatement", data:sendData}).then((res)=>{
            // console.log(res.data);
            $scope.statementId = res.data.statementId;
            toastr.success(res.data.response);
        }, (res)=>{console.log(res.data)});
    }
    
})

b9ja.controller('datasetup', function($http, $scope, fns, $filter){
    $scope.showDate = function(){
        $scope.uiOpen = true;
    }
    $scope.setupDate = new Date();

    $scope.fetchOpenCredit = function(){
        var month = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"fetchopencredit", data:{month:month}}).then((res)=>{
            $scope.monthLabel = $scope.setupDate;
            $scope.openCreditAmount = parseFloat(res.data);
        },(res)=>{console.log(res.data)});
    }
    $scope.fetchOpenCredit();

    $scope.saveOpenCredit = function(){
        var month = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"saveopencredit", data:{month:month,amount:$scope.openCreditAmount}}).then((res)=>{
            toastr.success(res.data.response, 'Success');
        },(res)=>{console.log(res.data)});
    }

    $scope.fetchCommission = function(){
        $scope.amountCom = [];
        $scope.remark = [];
        var comDays = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"fetchcommission", data:{month:comDays}}).then((res)=>{
            $scope.monthLabel = $scope.setupDate;
            $scope.comDays = res.data.days;
            for(x=1; x<=res.data.days; x++){
                $scope.amountCom[x] = null;
                $scope.remark[x] = null;
            }
            res.data.datas.forEach((val, index)=>{
                var point = parseInt(val.date.substr(8,2));
                $scope.amountCom[point] = parseFloat(val.amount);
                $scope.remark[point] = val.remarks;
            })
        },(res)=>{console.log(res.data)});
    }

    $scope.saveCommission = function(){
        var month = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"savecommission", data:{data:$scope.amountCom, month:month, remarks:$scope.remark}}).then((res)=>{
            toastr.success(res.data.response, 'Success');
        },(res)=>{console.log(res.data)});
    }

    $scope.fetchAgentWithdraw = function(){
        $scope.amountAgentWithdraw = [];
        $scope.remarkAgentWithdraw = [];
        var comDays = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"fetchagentwithdraw", data:{month:comDays}}).then((res)=>{
            $scope.monthLabel = $scope.setupDate;
            $scope.comDays = res.data.days;
            for(x=1; x<=res.data.days; x++){
                $scope.amountAgentWithdraw[x] = null;
                $scope.remarkAgentWithdraw[x] = null;
            }
            res.data.datas.forEach((val, index)=>{
                var point = parseInt(val.date.substr(8,2));
                $scope.amountAgentWithdraw[point] = parseFloat(val.amount);
                $scope.remarkAgentWithdraw[point] = val.remarks;
            })
        },(res)=>{console.log(res.data)});
    }

    $scope.saveAgentWithdraw = function(){
        var month = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"saveagentwithdraw", data:{data:$scope.amountAgentWithdraw, month:month, remarks:$scope.remarkAgentWithdraw}}).then((res)=>{
            toastr.success(res.data.response, 'Success');
        },(res)=>{console.log(res.data)});
    }

    $scope.fetchBet9jaPayment = function(){
        $scope.amountBet9jaPayment = [];
        $scope.remarkBet9jaPayment = [];
        var comDays = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"fetchbet9japayment", data:{month:comDays}}).then((res)=>{
            $scope.monthLabel = $scope.setupDate;
            $scope.comDays = res.data.days;
            for(x=1; x<=res.data.days; x++){
                $scope.amountBet9jaPayment[x] = null;
                $scope.remarkBet9jaPayment[x] = null;
            }
            res.data.datas.forEach((val, index)=>{
                var point = parseInt(val.date.substr(8,2));
                $scope.amountBet9jaPayment[point] = parseFloat(val.amount);
                $scope.remarkBet9jaPayment[point] = val.remarks;
            })
        },(res)=>{console.log(res.data)});
    }

    $scope.saveBet9jaPayment = function(){
        var month = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"savebet9japayment", data:{data:$scope.amountBet9jaPayment, month:month, remarks:$scope.remarkBet9jaPayment}}).then((res)=>{
            toastr.success(res.data.response, 'Success');
        },(res)=>{console.log(res.data)});
    }
    
    $scope.fetchBankWithdraw = function(){
        $scope.amountBankWithdraw = [];
        $scope.remarkBankWithdraw = [];
        var comDays = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"fetchbankwithdraw", data:{month:comDays}}).then((res)=>{
            $scope.monthLabel = $scope.setupDate;
            $scope.comDays = res.data.days;
            for(x=1; x<=res.data.days; x++){
                $scope.amountBankWithdraw[x] = null;
                $scope.remarkBankWithdraw[x] = null;
            }
            res.data.datas.forEach((val, index)=>{
                var point = parseInt(val.date.substr(8,2));
                $scope.amountBankWithdraw[point] = parseFloat(val.amount);
                $scope.remarkBankWithdraw[point] = val.remarks;
            })
        },(res)=>{console.log(res.data)});
    }

    $scope.saveBankWithdraw = function(){
        var month = $filter("date")($scope.setupDate,"yyyy-MM");
        $http({method:"POST", url:"savebankwithdraw", data:{data:$scope.amountBankWithdraw, month:month, remarks:$scope.remarkBankWithdraw}}).then((res)=>{
            toastr.success(res.data.response, 'Success');
        },(res)=>{console.log(res.data)});
    }
    
})

b9ja.controller('summary', function($http, $scope, fns, $filter){
    $scope.summaryMonth = new Date();
    $scope.statementMonth = new Date();

    $scope.showDate = function(){
        $scope.uiOpen = true;
    }

    $scope.dailySummarySearch = function(){
        $scope.commission = [];
        $scope.agentWithdraw = [];
        $scope.bet9jaPayment = [];
        $scope.bankWithdraw = [];
        var month = $filter('date')($scope.statementMonth,"yyyy-MM");
        $http({method:"POST", url:"dailysummary", data:{month:month}}).then((res)=>{
            $scope.summaryMonth = $filter('date')($scope.statementMonth,"MMMM");
            console.log(res.data);
            $scope.listDailySummary = res.data.statement;
            $scope.lastMonth = res.data.cashData;
            return res;
        }, (res)=>{console.log(res.data)}).then((res)=>{
            for(x in $scope.listDailySummary){
                if(res.data.statement[x]!=0){
                    var objData = res.data.statement[x];
                    $scope.commission[x] = (objData.com != null)? objData.com.amount:0;
                    $scope.agentWithdraw[x] = (objData.agentWithdraw != null)? objData.agentWithdraw.amount:0;
                    $scope.bet9jaPayment[x] = (objData.bet9jaPay != null)? objData.bet9jaPay.amount:0;
                    $scope.bankWithdraw[x] = (objData.bankWithdraw != null)? objData.bankWithdraw.amount:0;
                }else{
                    $scope.commission[x] = 0;
                    $scope.agentWithdraw[x] = 0;
                    $scope.bet9jaPayment[x] = 0;
                    $scope.bankWithdraw[x] = 0;
                }
            }
            $scope.openCredit = res.data.openCredit.amount;
        });
    }
    $scope.dailySummarySearch();

    $scope.credit_total = function(x){
        if(x!=0){
            var total = 0
            x.statement_data.forEach((each)=>{
                total+= parseFloat(each.bf) + parseFloat(each.inter_credit) + parseFloat(each.league_sport) + parseFloat(each.win_sport) + parseFloat(each.win_bet49ja); 
            })
            return total;
        }else{
            return 0;
        }
    }

    $scope.total_withdrawal = function(x){
        if(x!=0){
            var total = 0
            x.statement_data.forEach((each)=>{
                total+= parseFloat(each.inter_debit) + parseFloat(each.sport_stake) + parseFloat(each.bet49ja_stake) + parseFloat(each.sport_league); 
            })
            return total;
        }else{
            return 0;
        }
    }

    $scope.daily_balance = function(x){
        return $scope.credit_total(x) - $scope.total_withdrawal(x);
    }

    $scope.office_sales = function(x){
        if(x!=0){
            var total = 0
            x.statement_data.forEach((each)=>{
                total+= parseFloat(each.office_sales); 
            })
            return total;
        }else{
            return 0;
        }
    }

    $scope.winnings = function(x){
        if(x!=0){
            var total = 0
            x.statement_data.forEach((each)=>{
                total+= parseFloat(each.win_sport); 
            })
            return total;
        }else{
            return 0;
        }
    }

    $scope.winnings_paid = function(x){
        if(x!=0){
            var total = 0
            x.statement_data.forEach((each)=>{
                total+= parseFloat(each.winnings_paid); 
            })
            return total;
        }else{
            return 0;
        }
    }

    $scope.winnings_pending = function(x){
        return $scope.winnings(x) - $scope.winnings_paid(x);
    }

    $scope.office_sales = function(x){
        if(x!=0){
            var total = 0
            x.statement_data.forEach((each)=>{
                total+= parseFloat(each.office_sales); 
            })
            return total;
        }else{
            return 0;
        }
    }

    $scope.actual_sales = function(x){
        return $scope.office_sales(x) - $scope.winnings_paid(x);
    }
    
    $scope.ops_expenses = function(x){
        if(x!=0){
            return  parseFloat(x.cash.expenses);
        }else{
            return 0;
        }
    }

    $scope.bank_payment = function(x){
        if(x!=0){
            return  parseFloat(x.cash.bank_payment);
        }else{
            return 0;
        }
    }

    $scope.total_cash = function(x, index){
        $mul = ($scope.office_sales(x) > 0)? 1:0;
        if((index+1) == 1){
            var last_credit_balance  = ($scope.lastMonth == null)? 0:$scope.lastMonth.credit_balance;
            $scope.temp_totalCash =  ($scope.actual_sales(x) * $mul) + (last_credit_balance * $mul);
            return $scope.temp_totalCash;
        }else{
            $scope.temp_totalCash =  ($scope.actual_sales(x) * $mul) + ($scope.temp_totalCash * $mul);
            return $scope.temp_totalCash;
        }
    }

    $scope.closing_balance = function(x){
        $scope.temp_totalCash = $scope.temp_totalCash - $scope.ops_expenses(x) - $scope.bank_payment(x);
        return $scope.temp_totalCash;
    }

    $scope.b9ja_open_credit = function(x, index){
        if((index+1) == 1){
             $scope.previousWinnings = angular.copy($scope.winnings(x));
             $scope.previousBet9jaPayment = angular.copy($scope.bet9jaPayment[index]);
             $scope.newOpenCredit = $scope.openCredit + $scope.winnings(x) + $scope.commission[index] + $scope.bet9jaPayment[index] - $scope.office_sales(x) - $scope.agentWithdraw[index];
            return $scope.newOpenCredit;
        }else{
            $mul = ($scope.office_sales(x) > 0)? 1:0;
            $scope.newOpenCredit = ($scope.newOpenCredit * $mul) + ($scope.previousWinnings * $mul) + ($scope.commission[index] * $mul) + ($scope.previousBet9jaPayment * $mul) - $scope.office_sales(x) - $scope.agentWithdraw[index];
            $scope.previousWinnings = angular.copy($scope.winnings(x));
            $scope.previousBet9jaPayment = angular.copy($scope.bet9jaPayment[index]);
            return $scope.newOpenCredit;
        }
    }

    $scope.balancePayableToBet9ja = function(x, index){
        $scope.balancePayableToBet9jaValue =  $scope.openCredit - $scope.b9ja_open_credit(x,index);
        return $scope.balancePayableToBet9jaValue;
    }

    $scope.agentDailyCreditPos = function(x,index){
        var res = $scope.closing_balance(x) + $scope.commission[index] + $scope.agentWithdraw[index] - $scope.balancePayableToBet9ja(x,index);
        return (res > 0)? res:0;
    }

    $scope.bankDeposit = function(x, index){
        $scope.bankDepositValue = $scope.bank_payment(x) + $scope.agentWithdraw[index];
        return $scope.bankDepositValue;
    }

    $scope.balanceColumn = function(x, index){
        if((index+1) == 1){
            $scope.balanceColumnValue = $scope.bankDeposit(x, index) - $scope.bankWithdraw[index];
            return $scope.balanceColumnValue;
        }else{
            $scope.balanceColumnValue = $scope.balanceColumnValue + $scope.bankDeposit(x, index) - $scope.bankWithdraw[index];
            return $scope.balanceColumnValue;
        }
    }

    $scope.dailyBankBalance = function(x, index){
        if($scope.credit_total(x) > 1){
            return $scope.balanceColumn(x, index);
        }
    }
})