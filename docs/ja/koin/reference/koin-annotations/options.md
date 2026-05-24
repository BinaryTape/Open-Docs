---
title: コンパイラプラグインオプション
---

Koin コンパイラプラグインは、その動作をカスタマイズするための設定オプションをサポートしています。

## 設定

`build.gradle.kts` でコンパイラプラグインを構成します：

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    compileSafety = true
    strictSafety = true       // デフォルトでは自動検出されます
    skipDefaultValues = true
    unsafeDslChecks = true
}
```

## 利用可能なオプション

### userLogs

- **型**: Boolean
- **デフォルト**: `false`
- **説明**: コンポーネント検出および DSL/アノテーション処理のログを有効にします。プラグインによってどのコンポーネントが検出され、処理されたかを表示します。
- **用途**: コンポーネント検出の問題をデバッグするために、開発中に有効にします。

```kotlin
koinCompiler {
    userLogs = true
}
```

### debugLogs

- **型**: Boolean
- **デフォルト**: `false`
- **説明**: 内部プラグイン処理（FIR/IR フェーズ、モジュール検出）の詳細なデバッグログを有効にします。
- **用途**: プラグインの問題をトラブルシューティングする場合や、バグを報告する場合に有効にします。

```kotlin
koinCompiler {
    debugLogs = true
}
```

### compileSafety

- **型**: Boolean
- **デフォルト**: `true`
- **説明**: コンパイル時の依存関係検証を有効にします。有効にすると、ビルド時にすべての依存関係が解決可能であることをプラグインが検証します。これにより、実行前に定義の欠落、クオリファイアの不一致、および壊れた呼び出し箇所を特定できます。
- **用途**: デフォルトで有効です。移行中に検証を回避する必要がある場合は、一時的に無効にします。

```kotlin
koinCompiler {
    compileSafety = true
}
```

検証対象の詳細については、[コンパイル時の安全性](/docs/reference/koin-compiler/compile-safety)を参照してください。

### strictSafety

- **型**: Boolean
- **デフォルト**: 自動検出（`startKoin`、`koinApplication`、または `@KoinApplication` を含むアグリゲーターモジュールで有効になります）
- **Description**: ビルドごとにフルグラフの安全性パス（A3）の再実行を強制し、アグリゲーターモジュールにおける Kotlin の増分コンパイルキャッシュをバイパスします。ライブラリモジュールおよび機能モジュールは完全に増分（incremental）な状態を維持します。
- **用途**: デフォルトのままにしてください。自動検出がアグリゲーターを見逃す場合は明示的に `true` に設定し、オプトアウトする場合は `false` に設定します（例：テストフィクスチャがコメント内でのみ `startKoin` を参照しており、検出器が誤動作する場合など）。

```kotlin
koinCompiler {
    strictSafety = true   // 強制的に有効化
    // または
    strictSafety = false  // 自動検出をオプトアウト
}
```

**なぜこのオプションが必要なのか**: K2 の増分コンパイル（AGP が使用する Build Tools API 経由）は現在、DI グラフが依存する 2 つの事項を追跡しません。それは、`module { … }` ラムダ本体内の DSL 定義（宣言の ABI の一部ではない）と、`@ComponentScan` パッケージスコープ検出（スキャナーから新しく追加されたクラスへのソースレベルのエッジがない）です。アグリゲーターの `compileKotlin` タスクは、グラフが変更された場合でも UP-TO-DATE（最新）とマークされることがあります。`strictSafety` は、現在の K2 IC（増分コンパイル）の仕様に対する、最小限の正しい回避策です。毎回のビルドでアグリゲーターのみが再実行されるため、コストは限定的です。

`compileSafety = false` の場合は効果がありません。背景については [koin-compiler-plugin issue #32](https://github.com/InsertKoinIO/koin-compiler-plugin/issues/32) を参照してください。

### skipDefaultValues

- **型**: Boolean
- **デフォルト**: `true`
- **説明**: 有効にすると、Kotlin のデフォルト値を持つパラメータは、DI コンテナから解決される代わりにデフォルト値を使用します。Nullable なパラメータやアノテーション付きのパラメータ（`@Named`、`@InjectedParam` など）は、引き続き通常通り解決されます。
- **用途**: デフォルトで有効です。常にすべてのパラメータを DI コンテナから注入する場合は、無効にします。

```kotlin
koinCompiler {
    skipDefaultValues = true
}
```

### unsafeDslChecks

- **型**: Boolean
- **デフォルト**: `true`
- **説明**: ラムダ内の DSL 関数呼び出し（`create()` など）が唯一の命令であることを検証します。よくある間違いを防ぐのに役立ちます。
- **用途**: 必要に応じて、従来の DSL からの移行中に一時的に無効にします。

```kotlin
koinCompiler {
    unsafeDslChecks = false  // 移行中に無効にする
}
```

## 完全な例

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

koinCompiler {
    userLogs = true           // コンポーネント検出をログ出力
    debugLogs = false         // 詳細ログ（デフォルトはオフ）
    compileSafety = true      // コンパイル時の依存関係検証
    strictSafety = true       // アグリゲーターに安全性パスの再実行を強制（デフォルトで自動検出）
    skipDefaultValues = true  // DI 解決の代わりに Kotlin のデフォルト値を使用
    unsafeDslChecks = true    // DSL の使用法を検証
}
```

## ベストプラクティス

- コンパイル時の依存関係検証のために、**`compileSafety` を有効**（デフォルト）のままにする。
- **`strictSafety` は自動検出のまま**にする。検出器がアグリゲーターを見逃したり、アグリゲーター以外のファイルで誤動作したりする場合のみオーバーライドする。
- Kotlin のデフォルト値を尊重するために、**`skipDefaultValues` を有効**（デフォルト）のままにする。
- どのコンポーネントが検出されているかを確認するために、開発中は **`userLogs` を有効**にする。
- より安全な DSL の使用のために、**`unsafeDslChecks` を有効**（デフォルト）のままにする。
- **`debugLogs` はプラグインの問題をトラブルシューティングする場合のみ**使用する。

## 関連項目

- **[コンパイル時の安全性](/docs/reference/koin-compiler/compile-safety)** — 何がどのように検証されるか
- **[コンパイラプラグインのセットアップ](/docs/setup/compiler-plugin)** — 完全なセットアップガイド
- **[アノテーションの使用開始](/docs/reference/koin-annotations/start)** — クイックスタートガイド