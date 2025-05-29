[//]: # (title: トラブルシューティング)

> Kotlin/Wasmは[アルファ版](components-stability.md)です。いつでも変更される可能性があります。本番環境リリース前のシナリオでのみご利用ください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)でフィードバックをいただけますと幸いです。
>
{style="note"}

Kotlin/Wasmは、WebAssembly内で改善と新機能を導入するために、[ガベージコレクション](#garbage-collection-proposal)や[例外処理](#exception-handling-proposal)といった新しい[WebAssemblyプロポーザル](https://webassembly.org/roadmap/)に依存しています。

ただし、これらの機能が適切に動作するためには、新しいプロポーザルをサポートする環境が必要です。場合によっては、プロポーザルと互換性を持たせるために環境をセットアップする必要があるかもしれません。

## ブラウザバージョン

Kotlin/Wasmでビルドされたアプリケーションをブラウザで実行するには、新しい[WebAssemblyガベージコレクション (WasmGC) 機能](https://github.com/WebAssembly/gc)をサポートするブラウザバージョンが必要です。お使いのブラウザバージョンが新しいWasmGCをデフォルトでサポートしているか、または環境に変更を加える必要があるかを確認してください。

### Chrome

*   **バージョン119以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン (119未満) の場合:**

    > 古いブラウザでアプリケーションを実行するには、1.9.20より古いKotlinバージョンが必要です。
    >
    {style="note"}

    1.  ブラウザで `chrome://flags/#enable-webassembly-garbage-collection` にアクセスします。
    2.  **WebAssembly Garbage Collection** を有効にします。
    3.  ブラウザを再起動します。

### Chromiumベースのブラウザ

Edge、Brave、Opera、Samsung InternetなどのChromiumベースのブラウザを含みます。

*   **バージョン119以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン (119未満) の場合:**

    > 古いブラウザでアプリケーションを実行するには、1.9.20より古いKotlinバージョンが必要です。
    >
    {style="note"}

    アプリケーションを `--js-flags=--experimental-wasm-gc` コマンドライン引数とともに実行します。

### Firefox

*   **バージョン120以降の場合:**

    デフォルトで動作します。

*   **バージョン119の場合:**

    1.  ブラウザで `about:config` にアクセスします。
    2.  `javascript.options.wasm_gc` オプションを有効にします。
    3.  ページを更新します。

### Safari/WebKit

*   **バージョン18.2以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン (18.2未満) の場合:**

    サポートされていません。

> Safari 18.2は、iOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma、およびmacOS Venturaで利用可能です。
> iOSおよびiPadOSでは、Safari 18.2はオペレーティングシステムにバンドルされています。これを入手するには、デバイスをバージョン18.2以降にアップデートしてください。
>
> 詳細については、[Safariリリースノート](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)を参照してください。
>
{style="note"}

## Wasmプロポーザルのサポート

Kotlin/Wasmの改善は、[WebAssemblyプロポーザル](https://webassembly.org/roadmap/)に基づいています。ここでは、WebAssemblyのガベージコレクションおよび（レガシーな）例外処理プロポーザルのサポートに関する詳細が確認できます。

### ガベージコレクションプロポーザル

Kotlin 1.9.20以降、Kotlinツールチェインは[Wasmガベージコレクション](https://github.com/WebAssembly/gc)（WasmGC）プロポーザルの最新バージョンを使用しています。

このため、Wasmプロジェクトを最新バージョンのKotlinにアップデートすることを強くお勧めします。また、Wasm環境では最新バージョンのブラウザを使用することをお勧めします。

### 例外処理プロポーザル

Kotlinツールチェインは、生成されたWasmバイナリをより広範な環境で実行できるように、デフォルトで[レガシー例外処理プロポーザル](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)を使用しています。

Kotlin 2.0.0以降、Kotlin/Wasm内で新しいバージョンのWasm[例外処理プロポーザル](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)のサポートを導入しました。

このアップデートにより、新しい例外処理プロポーザルがKotlinの要件に適合し、プロポーザルの最新バージョンのみをサポートする仮想マシン上でKotlin/Wasmを使用できるようになります。

新しい例外処理プロポーザルは、`-Xwasm-use-new-exception-proposal` コンパイラオプションを使用して有効化されます。これはデフォルトで無効になっています。

<p>&nbsp;</p>

> プロジェクトのセットアップ、依存関係の使用、その他のタスクについては、[Kotlin/Wasmの例](https://github.com/Kotlin/kotlin-wasm-examples#readme)で詳しく学ぶことができます。
>
{style="tip"}

## デフォルトインポートの使用

[Kotlin/WasmコードをJavaScriptにインポートする](wasm-js-interop.md)方法は、デフォルトエクスポートから名前付きエクスポートに移行しました。

デフォルトインポートを引き続き使用したい場合は、新しいJavaScriptラッパーモジュールを生成します。以下のスニペットを含む `.mjs` ファイルを作成します。

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

新しい`.mjs`ファイルをリソースフォルダーに配置すると、ビルドプロセス中にメインの`.mjs`ファイルの隣に自動的に配置されます。

`.mjs`ファイルをカスタムの場所に配置することもできます。この場合、手動でメインの`.mjs`ファイルの隣に移動するか、インポートステートメントのパスをその場所に一致するように調整する必要があります。

## Kotlin/Wasmコンパイルの遅延

Kotlin/Wasmプロジェクトで作業していると、コンパイル時間が遅くなることがあります。これは、変更を加えるたびにKotlin/Wasmツールチェインがコードベース全体を再コンパイルするためです。

この問題を軽減するために、Kotlin/Wasmターゲットはインクリメンタルコンパイルをサポートしており、これによりコンパイラは前回のコンパイルからの変更に関連するファイルのみを再コンパイルできるようになります。

インクリメンタルコンパイルを使用すると、コンパイル時間が短縮されます。現時点では開発速度が2倍になりますが、将来のリリースでさらに改善される予定です。

現在のセットアップでは、Wasmターゲットのインクリメンタルコンパイルはデフォルトで無効になっています。
これを有効にするには、プロジェクトの `local.properties` または `gradle.properties` ファイルに以下の行を追加します。

```text
kotlin.incremental.wasm=true
```

> Kotlin/Wasmのインクリメンタルコンパイルを試して、[フィードバックを共有](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)してください。
> あなたの洞察は、この機能をより早く安定させ、デフォルトで有効にするのに役立ちます。
>
{style="note"}