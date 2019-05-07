<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    {{-- <script src="{{ asset('js/app.js') }}" defer></script> --}}

    <!-- Fonts -->
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">

    <!-- Styles -->
    {{-- <link href="{{ asset('css/app.css') }}" rel="stylesheet"> --}}
    <link rel="stylesheet" href="{{ asset('dist/modules/bootstrap/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('dist/modules/ionicons/css/ionicons.min.css') }}">
    <link rel="stylesheet" href="{{ asset('dist/modules/fontawesome/web-fonts-with-css/css/fontawesome-all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('dist/css/demo.css') }}">
    <link rel="stylesheet" href="{{ asset('dist/css/style.css') }}">
  
</head>
<body>
        <div id="app">
            <section class="section">
                    @yield('content')
            </section>
        </div>
        
        <script src="{{ asset('dist/modules/jquery.min.js') }}"></script>
        <script src="{{ asset('dist/modules/popper.js') }}"></script>
        <script src="{{ asset('dist/modules/tooltip.js') }}"></script>
        <script src="{{ asset('dist/modules/bootstrap/js/bootstrap.min.js') }}"></script>
        <script src="{{ asset('dist/modules/nicescroll/jquery.nicescroll.min.js') }}"></script>
        <script src="{{ asset('dist/modules/scroll-up-bar/dist/scroll-up-bar.min.js') }}"></script>
        <script src="{{ asset('dist/js/sa-functions.js') }}"></script>
        <script src="{{ asset('dist/js/scripts.js') }}"></script>
        <script src="{{ asset('dist/js/custom.js') }}"></script>
        <script src="{{ asset('dist/js/demo.js') }}"></script>
        <script src="{{ asset('js/jQcustom.js') }}"></script>
      
</body>
</html>