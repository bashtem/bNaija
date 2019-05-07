@extends('layouts.app')

@section('content')
    <div class="container mt-3">
        <div class="row">
          <div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2">
            <div class="login-brand">
              {{config('app.name')}}
            </div>

            <div class="card card-primary">
              <div class="card-header"><h4>Register</h4></div>
              <div class="card-body">
                <form method="POST" action="{{ route('register')}}" enctype="multipart/form-data" >
                        @csrf

                  <div class="row">
                    <div class="form-group col-6">
                      <label for="full_name">Full Name</label>
                      <input id="full_name" type="text" class="form-control{{ $errors->has('name') ? ' is-invalid' : '' }}" name="name" autofocus required>
                      @if ($errors->has('name'))
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $errors->first('name') }}</strong>
                        </span>
                      @endif
                    </div>
                    <div class="form-group col-6">
                      <label for="phone">Phone</label>
                      <input id="phone" type="number" class="form-control{{ $errors->has('phone') ? ' is-invalid' : '' }}" name="phone" autofocus required>
                                @if ($errors->has('phone'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('phone') }}</strong>
                                    </span>
                                @endif
                    </div>
                  </div>

                  <div class="row">
                    <div class="form-group col-6">
                      <label for="username">Username</label>
                      <input id="username" type="text" class="form-control{{ $errors->has('username') ? ' is-invalid' : '' }}" name="username" autofocus required>
                                @if ($errors->has('username'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('username') }}</strong>
                                    </span>
                                @endif
                    </div>
                    <div class="form-group col-6 ">
                            <label for="pix">Profile Picture</label>
                            <div class="d-flex justify-content-between">
                                <span>
                                    <input id="pix" type="file" class="form-control{{ $errors->has('profile_picture') ? ' is-invalid' : '' }}" name="profile_picture" autofocus accept="image/*" >
                                    @if ($errors->has('profile_picture'))
                                    <div class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('profile_picture') }}</strong>
                                    </div>
                                @endif
                                </span>
                                <span><img class="mr-3 rounded-circle" width="50" height="50" id="regAvatar" alt="avatar" src="../dist/img/avatar/avatar.svg"></span>
                            </div>
                                
                            
                    </div>
                  </div>

                  <div class="form-group ">
                    <label for="email">Email</label>
                    <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email"  autofocus>
                        @if ($errors->has('email'))
                            <div class="invalid-feedback" role="alert">
                                <strong>{{ $errors->first('email') }}</strong>
                            </div>
                        @endif
                  </div>

                  <div class="row">
                    <div class="form-group col-6">
                      <label for="password" class="d-block">Password</label>
                      <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" autofocus required>
                                @if ($errors->has('password'))
                                    <div class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </div>
                                @endif
                    </div>
                    <div class="form-group col-6">
                        <label for="password-confirm" class="d-block">Password Confirmation</label>
                        <input id="password-confirm" type="password" class="form-control" name="password_confirmation" autofocus required>
                    </div>
                  </div>

                  <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-block">Register</button>
                  </div>

                </form>
              </div>
            </div>
            <div class="simple-footer">
              Copyright &copy; {{config('app.name')}} {{date('Y')}}
            </div>
          </div>
        </div>
    </div>
@endsection
