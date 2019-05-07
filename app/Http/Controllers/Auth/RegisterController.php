<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Agent;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|max:255|unique:users',
            'phone' => 'required|unique:users',
            'password' => 'required|string|min:4|confirmed',
            'profile_picture' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
            $request = request();
            if($request->hasFile('profile_picture')){
                $profileImage = $request->file('profile_picture');
                $profileImageSaveAsName = time() .'_'. $request->name."_profile." .$profileImage->getClientOriginalExtension();

                $upload_path = 'public/profile_pictures/';
                $success = $profileImage->storeAs($upload_path, $profileImageSaveAsName);
                $profile_image_url = 'storage/profile_pictures/'. $profileImageSaveAsName;
            }else{
                $profile_image_url ='dist/img/avatar/avatar.svg';
            }

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'username' => $data['username'],
            'phone' => $data['phone'],
            'profile_picture' => $profile_image_url,
            'password' => Hash::make($data['password']),
        ]);
    }
    
}
