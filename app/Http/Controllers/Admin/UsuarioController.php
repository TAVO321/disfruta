<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => User::orderByDesc('is_admin')
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'is_admin', 'created_at'])
                ->map(fn (User $u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'is_admin' => $u->is_admin,
                    'creado' => $u->created_at?->toDateString(),
                ]),
            'actual' => auth()->id(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $datos = $this->validar($request);

        $usuario = DB::transaction(function () use ($datos) {
            $usuario = User::create($datos);
            $this->sincronizarSesiones($usuario);

            return $usuario;
        });

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', "Cuenta de {$usuario->name} creada.");
    }

    public function update(Request $request, User $usuario): RedirectResponse
    {
        $datos = $this->validar($request, $usuario);

        // No dejar la aplicacion sin ningun administrador con acceso.
        if ($usuario->is_admin && ! $datos['is_admin'] && $this->esElUnicoAdmin($usuario)) {
            throw ValidationException::withMessages([
                'is_admin' => 'No podes quitarle el acceso al unico administrador que queda.',
            ]);
        }

        $pierdeAcceso = $usuario->is_admin && ! $datos['is_admin'];

        DB::transaction(function () use ($datos, $usuario, $pierdeAcceso) {
            $usuario->fill($datos);
            $usuario->save();

            // Editar una cuenta que ya era normal no cierra su sesion: solo
            // importa invalidarla cuando pierde el acceso al panel.
            if ($pierdeAcceso) {
                $this->sincronizarSesiones($usuario);
            }
        });

        return back()->with('success', "Cuenta de {$usuario->name} actualizada.");
    }

    public function destroy(Request $request, User $usuario): RedirectResponse
    {
        if ($request->user()->is($usuario)) {
            throw ValidationException::withMessages([
                'usuario' => 'No podes eliminar tu propia cuenta.',
            ]);
        }

        if ($usuario->is_admin && $this->esElUnicoAdmin($usuario)) {
            throw ValidationException::withMessages([
                'usuario' => 'No podes eliminar al unico administrador que queda.',
            ]);
        }

        DB::transaction(function () use ($usuario) {
            $usuario->delete();
            $this->sincronizarSesiones($usuario);
        });

        return back()->with('success', "Cuenta de {$usuario->name} eliminada.");
    }

    private function validar(Request $request, ?User $usuario = null): array
    {
        $datos = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => [
                'required',
                'string',
                'email',
                'max:180',
                Rule::unique('users', 'email')->ignore($usuario?->id),
            ],
            'password' => $usuario ? ['nullable', 'string', 'min:8', 'max:200'] : ['required', 'string', 'min:8', 'max:200'],
            'is_admin' => ['boolean'],
        ]);

        $datos['is_admin'] = (bool) ($datos['is_admin'] ?? false);

        if (blank($datos['password'] ?? null)) {
            unset($datos['password']);
        }

        return $datos;
    }

    /**
     * Un administrador siempre puede perder el acceso, pero nunca el sistema
     * puede quedarse sin ninguno.
     */
    private function esElUnicoAdmin(User $usuario): bool
    {
        return User::where('is_admin', true)->whereKeyNot($usuario->id)->doesntExist();
    }

    /**
     * Al perder el permiso hay que cerrar las sesiones abiertas para que el
     * usuario no siga operando con la sesion que ya tenia.
     */
    private function sincronizarSesiones(User $usuario): void
    {
        if ($usuario->is_admin) {
            return;
        }

        DB::table(config('session.table', 'sessions'))
            ->where('user_id', $usuario->id)
            ->delete();
    }
}
