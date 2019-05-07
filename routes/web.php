<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes();

Route::get('/', 'HomeController@index')->name('home');
Route::get('/logout', 'HomeController@logout')->name('logout');

Route::post('/addcashier', 'HomeController@addCashier');
Route::post('/editcashier', 'HomeController@editCashier');
Route::get('/listcashier', 'HomeController@listCashier');
Route::post('/savestatement', 'HomeController@saveStatement');
Route::post('/fetchstatement', 'HomeController@fetchStatement');
Route::post('/dailysummary', 'HomeController@dailySummary');
Route::post('/fetchcommission', 'HomeController@fetchCommission');
Route::post('/savecommission', 'HomeController@saveCommission');
Route::post('/fetchopencredit', 'HomeController@fetchOpenCredit');
Route::post('/saveopencredit', 'HomeController@saveOpenCredit');
Route::post('/fetchagentwithdraw', 'HomeController@fetchAgentWithdraw');
Route::post('/saveagentwithdraw', 'HomeController@saveAgentWithdraw');
Route::post('/fetchbet9japayment', 'HomeController@fetchBet9jaPayment');
Route::post('/savebet9japayment', 'HomeController@saveBet9jaPayment');
Route::post('/fetchbankwithdraw', 'HomeController@fetchBankWithdraw');
Route::post('/savebankwithdraw', 'HomeController@saveBankWithdraw');

