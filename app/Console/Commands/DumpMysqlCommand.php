<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use PDO;

class DumpMysqlCommand extends Command
{
    protected $signature = 'db:dump-mysql
        {--path=database/sql : Carpeta de salida}
        {--file=disfruta.sql : Nombre del archivo}
        {--datos : Incluir solo los INSERT de datos, sin el esquema}';

    protected $description = 'Genera un dump MySQL (esquema + datos) a partir de la base actual';

    private array $map = [
        'integer' => 'int unsigned',
        'bigint' => 'bigint unsigned',
        'real' => 'double',
        'text' => 'text',
        'blob' => 'longblob',
    ];

    public function handle(): int
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            $this->components->error('Este comando lee una base SQLite. Correlo con la base local de desarrollo.');

            return self::FAILURE;
        }

        $carpeta = base_path($this->option('path'));
        $ruta = $carpeta.DIRECTORY_SEPARATOR.$this->option('file');

        if (! is_dir($carpeta)) {
            mkdir($carpeta, 0755, true);
        }

        $sql = $this->option('datos')
            ? $this->encabezado().$this->datos()
            : $this->encabezado().$this->esquema().$this->datos();

        $sql .= "-- ============================================================\n"
            ."-- FIN DEL DUMP\n"
            ."-- ============================================================\n\n"
            ."SET FOREIGN_KEY_CHECKS = 1;\n";

        file_put_contents($ruta, $sql);

        $this->components->info("Dump generado: {$ruta}");

        return self::SUCCESS;
    }

    private function encabezado(): string
    {
        return "-- DISFRUTA · esquema y datos para MySQL 8 / MariaDB 10.6\n"
            ."-- Generado con: php artisan db:dump-mysql\n"
            ."-- IMPORTANTE: credenciales de base de datos NO se incluyen en este archivo.\n\n"
            ."SET NAMES utf8mb4;\n"
            ."SET FOREIGN_KEY_CHECKS = 0;\n"
            ."SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n\n";
    }

    private function esquema(): string
    {
        $salida = '';
        $tablas = $this->tablas();

        foreach ($tablas as $tabla) {
            if (Str::startsWith($tabla, ['sqlite_', 'migrations', 'cache', 'sessions', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens'])) {
                continue;
            }

            $sql = $this->crearTabla($tabla);

            foreach ($this->indices($tabla) as $indice) {
                $sql .= $this->crearIndice($tabla, $indice);
            }

            foreach ($this->clavesForaneas($tabla) as $fk) {
                $sql .= $this->crearForeignKey($tabla, $fk);
            }

            $salida .= $sql."\n\n";
        }

        return "-- ============================================================\n"
            ."-- ESQUEMA\n"
            ."-- ============================================================\n\n"
            .$salida;
    }

    private function indices(string $tabla): array
    {
        return DB::select("PRAGMA index_list({$tabla})");
    }

    private function clavesForaneas(string $tabla): array
    {
        return DB::select("PRAGMA foreign_key_list({$tabla})");
    }

    private function crearTabla(string $tabla): string
    {
        $columnas = DB::select("PRAGMA table_info({$tabla})");
        $pk = null;
        $definiciones = [];

        foreach ($columnas as $col) {
            if ($col->pk) {
                $pk ??= $col->name;
            }

            $definiciones[] = $this->columna($col);
        }

        if ($pk) {
            $definiciones[] = "  PRIMARY KEY (`{$pk}`)";
        }

        return "CREATE TABLE IF NOT EXISTS `{$tabla}` (\n".implode(",\n", $definiciones)."\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n";
    }

    private function columna(object $col): string
    {
        $tipo = strtolower($col->type);

        $esPkAutoinc = $col->pk
            && ! str_contains($tipo, 'primary key')
            && ($tipo === 'integer' || str_starts_with($tipo, 'integer'));

        $sql = "  `{$col->name}` {$this->tipoMySql($tipo, $esPkAutoinc)}";

        if ($col->notnull === 0 && $esPkAutoinc === false && $col->dflt_value === null) {
            $sql .= ' DEFAULT NULL';
        } elseif ($col->dflt_value !== null && ! str_contains(strtoupper((string) $col->dflt_value), 'NULL')) {
            $sql .= ' DEFAULT '.$col->dflt_value;
        }

        return $sql;
    }

    private function tipoMySql(string $tipo, bool $autoinc): string
    {
        $esTexto = str_contains($tipo, 'char') || str_contains($tipo, 'clob') || str_contains($tipo, 'text');

        if ($esTexto) {
            $largo = preg_match('/\((\d+)\)/', $tipo, $m) ? (int) $m[1] : 255;

            return $largo > 255 ? 'text' : "varchar({$largo})";
        }

        if (str_contains($tipo, 'tinyint(1)') || str_contains($tipo, 'bool')) {
            return 'tinyint(1)';
        }

        if (str_contains($tipo, 'int')) {
            return $autoinc ? 'int unsigned NOT NULL AUTO_INCREMENT' : 'int unsigned';
        }

        if (str_contains($tipo, 'real') || str_contains($tipo, 'floa') || str_contains($tipo, 'doub')) {
            return 'double';
        }

        if (str_contains($tipo, 'bool')) {
            return 'tinyint(1)';
        }

        if (str_contains($tipo, 'blob')) {
            return 'longblob';
        }

        if (str_contains($tipo, 'datetime') || str_contains($tipo, 'timestamp')) {
            return 'datetime';
        }

        if (str_contains($tipo, 'date')) {
            return 'date';
        }

        return $this->map[$tipo] ?? 'text';
    }

    private function crearIndice(string $tabla, object $indice): string
    {
        if ($indice->origin === 'pk') {
            return '';
        }

        $columnas = collect(DB::select("PRAGMA index_info({$indice->name})"))
            ->pluck('name')
            ->map(fn ($n) => "`{$n}`")
            ->implode(', ');

        if ($columnas === '') {
            return '';
        }

        $unico = (int) $indice->unique === 1 ? 'UNIQUE ' : '';

        return "ALTER TABLE `{$tabla}` ADD {$unico}INDEX `{$indice->name}` ({$columnas});\n";
    }

    private function crearForeignKey(string $tabla, object $fk): string
    {
        $nombre = "fk_{$tabla}_{$fk->table}_{$fk->from}";

        return "ALTER TABLE `{$tabla}` ADD CONSTRAINT `{$nombre}`\n"
            ."  FOREIGN KEY (`{$fk->from}`) REFERENCES `{$fk->table}` (`{$fk->to}`)\n"
            ."  ON DELETE {$this->accion($fk->on_delete)}\n"
            ."  ON UPDATE {$this->accion($fk->on_update)};\n";
    }

    private function accion(string $accion): string
    {
        return match (strtoupper($accion)) {
            'CASCADE' => 'CASCADE',
            'SET NULL' => 'SET NULL',
            'RESTRICT', 'NO ACTION' => 'RESTRICT',
            default => 'RESTRICT',
        };
    }

    private function datos(): string
    {
        $salida = "-- ============================================================\n"
            ."-- DATOS\n"
            ."-- ============================================================\n\n";

        foreach ($this->tablas() as $tabla) {
            if (Str::startsWith($tabla, ['sqlite_', 'migrations', 'cache', 'sessions', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens'])) {
                continue;
            }

            $filas = DB::table($tabla)->get();

            if ($filas->isEmpty()) {
                continue;
            }

            $primera = (array) $filas->first();
            $columnas = implode(', ', array_map(fn ($c) => "`{$c}`", array_keys($primera)));
            $valores = $filas->map(fn ($fila) => '('.implode(', ', array_map(
                fn ($v) => $v === null ? 'NULL' : $this->literal((string) $v),
                array_values((array) $fila)
            )).')')->implode(",\n  ");

            $salida .= "INSERT INTO `{$tabla}` ({$columnas}) VALUES\n  {$valores};\n\n";
        }

        return $salida;
    }

    private function literal(string $valor): string
    {
        if (preg_match('/^-?\d+(\.\d+)?$/', $valor)) {
            return $valor;
        }

        return "'".str_replace(["\\", "'"], ["\\\\", "\\'"], $valor)."'";
    }

    private function tablas(): array
    {
        return collect(DB::select("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"))
            ->pluck('name')
            ->all();
    }
}
