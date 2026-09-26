<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function mostrar(): Response
    {
        return Inertia::render('Admin/Acceso');
    }

    public function entrar(Request $request): RedirectResponse
    {
        $credenciales = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $clave = 'login:'.mb_strtolower($credenciales['email']).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($clave, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Demasiados intentos. Intenta de nuevo en '.RateLimiter::availableIn($clave).' segundos.',
            ]);
        }

        if (! Auth::attempt($credenciales)) {
            RateLimiter::hit($clave, 60);

            throw ValidationException::withMessages([
                'email' => 'Las credenciales no son correctas.',
            ]);
        }

        RateLimiter::clear($clave);
        $request->session()->regenerate();

        if (! Auth::user()->is_admin) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => 'Tu usuario no tiene acceso al panel.',
            ]);
        }

        return redirect()->intended(route('admin.panel'));
    }

    public function salir(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
