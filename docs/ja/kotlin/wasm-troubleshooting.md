[//]: # (title: トラブルシューティング)

> Kotlin/Wasmは[Alpha](components-stability.md)版です。いつでも変更される可能性があります。プロダクション環境投入前のシナリオでご使用ください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)でのフィードバックをお待ちしております。
>
{style="note"}

Kotlin/Wasmは、WebAssembly内で改善と新機能を導入するために、[ガベージコレクション](#garbage-collection-proposal)や[例外処理](#exception-handling-proposal)のような新しい[WebAssemblyプロポーザル](https://webassembly.org/roadmap/)に依存しています。

しかし、これらの機能が適切に機能するためには、新しいプロポーザルをサポートする環境が必要です。場合によっては、プロポーザルと互換性を持たせるために環境をセットアップする必要があるかもしれません。

## ブラウザのバージョン

Kotlin/Wasmでビルドされたアプリケーションをブラウザで実行するには、新しい[WebAssemblyガベージコレクション (WasmGC) 機能](https://github.com/WebAssembly/gc)をサポートするブラウザバージョンが必要です。お使いのブラウザバージョンが新しいWasmGCをデフォルトでサポートしているか、または環境に変更を加える必要があるかを確認してください。

### Chrome

*   **バージョン 119 以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン:**

    > 古いブラウザでアプリケーションを実行するには、Kotlin 1.9.20 よりも古いバージョンが必要です。
    >
    {style="note"}

    1.  ブラウザで、`chrome://flags/#enable-webassembly-garbage-collection` にアクセスします。
    2.  **WebAssembly Garbage Collection** を有効にします。
    3.  ブラウザを再起動します。

### Chromiumベース

Edge、Brave、Opera、Samsung Internet などのChromiumベースのブラウザが含まれます。

*   **バージョン 119 以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン:**

    > 古いブラウザでアプリケーションを実行するには、Kotlin 1.9.20 よりも古いバージョンが必要です。
    >
    {style="note"}

    アプリケーションを `--js-flags=--experimental-wasm-gc` コマンドライン引数とともに実行します。

### Firefox

*   **バージョン 120 以降の場合:**

    デフォルトで動作します。

*   **バージョン 119 の場合:**

    1.  ブラウザで、`about:config` にアクセスします。
    2.  `javascript.options.wasm_gc` オプションを有効にします。
    3.  ページを更新します。

### Safari/WebKit

*   **バージョン 18.2 以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン:**

    サポートされていません。

> Safari 18.2 は、iOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma、macOS Ventura で利用できます。
> iOS および iPadOS では、Safari 18.2 はオペレーティングシステムにバンドルされています。入手するには、デバイスをバージョン 18.2 以降にアップデートしてください。
>
> 詳細については、[Safariリリースノート](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)を参照してください。
>
{style="note"}

## Wasm プロポーザルのサポート

Kotlin/Wasmの改善は、[WebAssemblyプロポーザル](https://webassembly.org/roadmap/)に基づいています。ここでは、WebAssemblyのガベージコレクションおよび(レガシー)例外処理プロポーザルのサポートに関する詳細をご覧いただけます。

### ガベージコレクションプロポーザル

Kotlin 1.9.20 以降、Kotlinツールチェインは[Wasmガベージコレクション](https://github.com/WebAssembly/gc) (WasmGC) プロポーザルの最新バージョンを使用しています。

このため、Wasmプロジェクトを最新バージョンのKotlinにアップデートすることを強くお勧めします。また、Wasm環境を備えた最新バージョンのブラウザを使用することもお勧めします。

### 例外処理プロポーザル

Kotlinツールチェインは、デフォルトで[レガシー例外処理プロポーザル](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)を使用しており、これにより生成されたWasmバイナリをより幅広い環境で実行できるようにします。

Kotlin 2.0.0 以降、Kotlin/Wasm内でWasmの[例外処理プロポーザル](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)の新しいバージョンのサポートを導入しました。

このアップデートにより、新しい例外処理プロポーザルがKotlinの要件に合致し、プロポーザルの最新バージョンのみをサポートする仮想マシン上でのKotlin/Wasmの使用を可能にします。

新しい例外処理プロポーザルは、`-Xwasm-use-new-exception-proposal` コンパイラオプションを使用してアクティブ化されます。デフォルトでは無効になっています。

<p>&nbsp;</p>

> プロジェクトのセットアップ、依存関係の使用、その他のタスクの詳細については、
> [Kotlin/Wasmの例](https://github.com/Kotlin/kotlin-wasm-examples#readme)をご覧ください。
>
{style="tip"}

## デフォルトインポートの使用

[Kotlin/WasmコードのJavaScriptへのインポート](wasm-js-interop.md)は、デフォルトエクスポートから名前付きエクスポートに移行しました。

引き続きデフォルトインポートを使用したい場合は、新しいJavaScriptラッパーモジュールを生成します。以下のスニペットを含む `.mjs` ファイルを作成します。

```Javascript
// メインの .mjs ファイルへのパスを指定
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

新しい `.mjs` ファイルをresourcesフォルダに配置すると、ビルドプロセス中にメインの `.mjs` ファイルの隣に自動的に配置されます。

また、`.mjs` ファイルをカスタムの場所に配置することもできます。この場合、メインの `.mjs` ファイルの隣に手動で移動するか、インポートステートメントのパスをその場所に合わせて調整する必要があります。

## Kotlin/Wasm のコンパイルが遅い

Kotlin/Wasmプロジェクトで作業していると、コンパイル時間が遅くなることがあります。これは、Kotlin/Wasmツールチェインが変更を行うたびにコードベース全体を再コンパイルするためです。

この問題を軽減するために、Kotlin/Wasmターゲットはインクリメンタルコンパイルをサポートしており、これにより最後のコンパイルからの変更に関連するファイルのみをコンパイラが再コンパイルできるようにします。

インクリメンタルコンパイルを使用すると、コンパイル時間を短縮できます。現時点では開発速度を2倍にし、今後のリリースでさらなる改善を計画しています。

現在の設定では、Wasmターゲットのインクリメンタルコンパイルはデフォルトで無効になっています。
有効にするには、プロジェクトの `local.properties` または `gradle.properties` ファイルに以下の行を追加します。

```text
kotlin.incremental.wasm=true
```

> Kotlin/Wasmのインクリメンタルコンパイルをお試しいただき、[フィードバックを共有](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)してください。
> 皆様の洞察が、この機能をより早く安定させ、デフォルトで有効にするのに役立ちます。
>
{style="note"}