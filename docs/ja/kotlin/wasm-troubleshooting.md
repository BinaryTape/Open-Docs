---
title: トラブルシューティング
---
:::note
Kotlin/Wasmは[Alpha](components-stability)版です。予告なく変更される場合があります。本番環境以外でのシナリオで使用してください。
フィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)でお待ちしております。

:::

Kotlin/Wasmは、[WebAssembly proposals](https://webassembly.org/roadmap/)の[garbage collection](#garbage-collection-proposal)や[exception handling](#exception-handling-proposal)などの新しい提案に依存して、WebAssembly内で改善と新機能を導入しています。

ただし、これらの機能が正常に動作するためには、新しい提案をサポートする環境が必要です。場合によっては、提案と互換性を持たせるために環境をセットアップする必要があります。

## ブラウザのバージョン

Kotlin/Wasmで構築されたアプリケーションをブラウザで実行するには、新しい[WebAssembly garbage collection (WasmGC) feature](https://github.com/WebAssembly/gc)をサポートするブラウザのバージョンが必要です。ブラウザのバージョンが新しいWasmGCをデフォルトでサポートしているか、環境を変更する必要があるかを確認してください。

### Chrome

* **バージョン119以降の場合:**

  デフォルトで動作します。

* **古いバージョン:**

  > 古いブラウザでアプリケーションを実行するには、1.9.20より前のKotlinバージョンが必要です。
  >
  

  1. ブラウザで、`chrome://flags/#enable-webassembly-garbage-collection`にアクセスします。
  2. **WebAssembly Garbage Collection**を有効にします。
  3. ブラウザを再起動します。

### Chromiumベース

Edge、Brave、Opera、Samsung InternetなどのChromiumベースのブラウザを含みます。

* **バージョン119以降の場合:**

  デフォルトで動作します。

* **古いバージョン:**

   > 古いブラウザでアプリケーションを実行するには、1.9.20より前のKotlinバージョンが必要です。
   >
   

  `--js-flags=--experimental-wasm-gc`コマンドライン引数を指定してアプリケーションを実行します。

### Firefox

* **バージョン120以降の場合:**

  デフォルトで動作します。

* **バージョン119の場合:**

  1. ブラウザで、`about:config`にアクセスします。
  2. `javascript.options.wasm_gc`オプションを有効にします。
  3. ページを更新します。

### Safari/WebKit

* **バージョン18.2以降の場合:**

  デフォルトで動作します。

* **古いバージョン:**

   サポートされていません。

:::note
Safari 18.2は、iOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma、およびmacOS Venturaで利用できます。
iOSおよびiPadOSでは、Safari 18.2はオペレーティングシステムにバンドルされています。入手するには、デバイスをバージョン18.2以降にアップデートしてください。

詳細については、[Safari release notes](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)を参照してください。

:::

## Wasm proposals support

Kotlin/Wasmの改善は、[WebAssembly proposals](https://webassembly.org/roadmap/)に基づいています。ここでは、WebAssemblyのgarbage collectionと（レガシー）exception handling proposalsのサポートに関する詳細を確認できます。

### Garbage collection proposal

Kotlin 1.9.20以降、Kotlinツールチェーンは[Wasm garbage collection](https://github.com/WebAssembly/gc) (WasmGC) proposalの最新バージョンを使用します。

このため、Wasmプロジェクトを最新バージョンのKotlinに更新することを強くお勧めします。また、Wasm環境を備えた最新バージョンのブラウザを使用することをお勧めします。

### Exception handling proposal

Kotlinツールチェーンは、デフォルトで[legacy exception handling proposal](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions)を使用しており、生成されたWasmバイナリをより広範な環境で実行できます。

Kotlin 2.0.0以降、Kotlin/Wasm内で新しいバージョンのWasm [exception handling proposal](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions)のサポートを導入しました。

このアップデートにより、新しいexception handling proposalがKotlinの要件に適合し、最新バージョンのproposalのみをサポートする仮想マシンでKotlin/Wasmを使用できるようになります。

新しいexception handling proposalは、`-Xwasm-use-new-exception-proposal`コンパイラオプションを使用して有効にします。デフォルトではオフになっています。
<p>
   &nbsp;
</p>
:::note
プロジェクトのセットアップ、依存関係の使用、その他のタスクについては、
[Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples#readme)をご覧ください。

## Use default import

[Importing Kotlin/Wasm code into Javascript](wasm-js-interop)は、default exportsから移行し、named exportsに移行しました。

default importを引き続き使用する場合は、新しいJavaScriptラッパーモジュールを生成します。次のスニペットを含む`.mjs`ファイルを作成します。

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

新しい`.mjs`ファイルをresourcesフォルダに配置すると、ビルドプロセス中にメインの`.mjs`ファイルの隣に自動的に配置されます。

`.mjs`ファイルをカスタムの場所に配置することもできます。この場合、手動でメインの`.mjs`ファイルの隣に移動するか、importステートメントのパスをその場所に合わせて調整する必要があります。

## Slow Kotlin/Wasm compilation

Kotlin/Wasmプロジェクトに取り組む際に、コンパイル時間が遅くなる場合があります。これは、Kotlin/Wasmツールチェーンが変更を行うたびにコードベース全体を再コンパイルするために発生します。

この問題を軽減するために、Kotlin/Wasmターゲットはインクリメンタルコンパイルをサポートしています。これにより、コンパイラは最後のコンパイルからの変更に関連するファイルのみを再コンパイルできます。

インクリメンタルコンパイルを使用すると、コンパイル時間が短縮されます。これにより、開発速度が当面の間2倍になり、今後のリリースでさらに改善する予定です。

現在のセットアップでは、Wasmターゲットのインクリメンタルコンパイルはデフォルトで無効になっています。
有効にするには、プロジェクトの`local.properties`または`gradle.properties`ファイルに次の行を追加します。

```text
kotlin.incremental.wasm=true
```

Kotlin/Wasmのインクリメンタルコンパイルを試して、[share your feedback](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)をお願いします。
皆様からのご意見は、この機能を安定させ、より早くデフォルトで有効にするのに役立ちます。

:::