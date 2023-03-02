<?php

namespace App\Http\Controllers;

use App\Models\Code;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MainController extends Controller
{
    public $number_of_rows;

    public function create(Request $request)
    {
        $time1 = microtime();
        
        $this->number_of_rows = (int) $request->input('num_rows');
        DB::connection()->enableQueryLog();
        
        $this->GenerateAndInsertValue($this->number_of_rows);

        $queries = DB::getQueryLog();
        return response()->json(['success' => $queries, 'response_time' => ((int) microtime() - (int) $time1)], 201);
    }

    public function GenerateAndInsertValue($values) {
        $start_count = DB::table('code')->count();
        dd($start_count);
        $strings = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzz';
        $reminder = $values % 18 ;
        $loops = floor($values / 18);
        $inputData = [];
    
        if ($reminder) {
             $reminderData = (str_split(str_shuffle($strings),7));
             $this->prepareData($reminderData);
             $remaining = array_chunk($reminderData, $reminder);
             $this->insertData ($remaining[0]);
        }
        while($loops > 0) {
            $arrayLoop = (str_split(str_shuffle($strings),7));
            $inputData = array_merge($inputData , $arrayLoop);
            // dd($inputData);
            if(count($inputData) > 1000) {
                $this->prepareData($inputData);
                 $this->insertData ($inputData);
                 $inputData = [];
            }
            $loops--;
           
        }
        
        if(count($inputData)) {
            $this->prepareData($inputData);
            $this->insertData ($inputData);
            $inputData = [];
        }
        $end_count = DB::table('code')->count();

        $remainingCount = $values - ($end_count - $start_count) ;
        if($remainingCount > 0 ) {
            $this->GenerateAndInsertValue($remainingCount);
        }
    }

    public function insertData($array) {
        DB::table('code')->insertOrIgnore($array);
    }

    public function prepareData(&$array) {
        foreach($array as $key => $value) {
            $array[$key] = ['unique_code' => $value];    
        }
    }

}