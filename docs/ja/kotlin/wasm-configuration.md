[//]: # (title: サポートされるバージョンと設定)

<primary-label ref="beta"/> 

このページでは、[WebAssemblyプロポーザル](https://webassembly.org/roadmap/)、サポートされるブラウザ、およびKotlin/Wasmを用いた効率的な開発のための推奨設定について詳しく説明します。

## ブラウザのバージョン

Kotlin/Wasmは、[ガベージコレクション (WasmGC)](#garbage-collection-proposal)や[例外処理](#exception-handling-proposal)といった最新のWebAssemblyプロポーザルに依拠し、WebAssembly内で改善と新機能を導入しています。

これらの機能が正しく動作することを確認するために、最新のプロポーザルをサポートする環境を提供してください。お使いのブラウザバージョンが新しいWasmGCをデフォルトでサポートしているか、または環境に変更を加える必要があるかを確認してください。

### Chrome 

*   **バージョン119以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン (119より古い) の場合:**

    > 古いブラウザでアプリケーションを実行するには、1.9.20より古いKotlinバージョンが必要です。
    >
    {style="note"}

    1.  ブラウザで`chrome://flags/#enable-webassembly-garbage-collection`にアクセスします。
    2.  **WebAssembly Garbage Collection**を有効にします。
    3.  ブラウザを再起動します。

### Chromiumベース

Edge、Brave、Opera、Samsung InternetなどのChromiumベースのブラウザを含みます。

*   **バージョン119以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン (119より古い) の場合:**

    > 古いブラウザでアプリケーションを実行するには、1.9.20より古いKotlinバージョンが必要です。
    >
    {style="note"}

    `--js-flags=--experimental-wasm-gc`コマンドライン引数を使用してアプリケーションを実行します。

### Firefox

*   **バージョン120以降の場合:**

    デフォルトで動作します。

*   **バージョン119の場合:**

    1.  ブラウザで`about:config`にアクセスします。
    2.  `javascript.options.wasm_gc`オプションを有効にします。
    3.  ページを再読み込みします。

### Safari/WebKit

*   **バージョン18.2以降の場合:**

    デフォルトで動作します。

*   **以前のバージョン (18.2より古い) の場合:**

    サポートされていません。

> Safari 18.2はiOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma、およびmacOS Venturaで利用可能です。
> iOSおよびiPadOSでは、Safari 18.2はオペレーティングシステムにバンドルされています。これを入手するには、デバイスをバージョン18.2以降にアップデートしてください。
>
> 詳細については、[Safariリリースノート](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)を参照してください。
>
{style="note"}

## Wasmプロポーザルのサポート

Kotlin/Wasmの改善は[WebAssemblyプロポーザル](https://webassembly.org/roadmap/)に基づいています。ここでは、WebAssemblyのガベージコレクションプロポーザルと (レガシーな) 例外処理プロポーザルのサポートに関する詳細を見つけることができます。

### ガベージコレクションプロポーザル

Kotlin 1.9.20以降、Kotlinツールチェインは[Wasmガベージコレクション](https://github.com/WebAssembly/gc) (WasmGC) プロポーザルの最新バージョンを使用しています。

このため、Wasmプロジェクトを最新バージョンのKotlinにアップデートすることを強く推奨します。また、Wasm環境では最新バージョンのブラウザを使用することをお勧めします。

### 例外処理プロポーザル

Kotlinツールチェインは、デフォルトで[レガシー例外処理プロポーザル](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)を使用しており、生成されたWasmバイナリをより広範な環境で実行できるようにしています。

Kotlin 2.0.0以降、Kotlin/Wasm内でWasm[例外処理プロポーザル](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)の新しいバージョンのサポートを導入しました。

このアップデートにより、新しい例外処理プロポーザルがKotlinの要件に合致し、プロポーザルの最新バージョンのみをサポートする仮想マシンでKotlin/Wasmを使用できるようになります。

新しい例外処理プロポーザルは、`-Xwasm-use-new-exception-proposal`コンパイラオプションを使用して有効化されます。これはデフォルトで無効になっています。

<p>&nbsp;</p>

> プロジェクトのセットアップ、依存関係の使用、およびその他のタスクについては、[Kotlin/Wasmの例](https://github.com/Kotlin/kotlin-wasm-examples#readme)で詳しく学ぶことができます。
>
{style="tip"}

## デフォルトインポートの使用

[Kotlin/WasmコードをJavascriptにインポートする](wasm-js-interop.md)方法は、デフォルトエクスポートから名前付きエクスポートに移行しました。

引き続きデフォルトインポートを使用したい場合は、新しいJavaScriptラッパーモジュールを生成します。次のスニペットを含む`.mjs`ファイルを作成します。

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

新しい`.mjs`ファイルをリソースフォルダに配置すると、ビルドプロセス中にメインの`.mjs`ファイルの隣に自動的に配置されます。

`.mjs`ファイルをカスタムの場所に配置することもできます。この場合、手動でメインの`.mjs`ファイルの隣に移動するか、インポートステートメント内のパスをその場所に一致するように調整する必要があります。

## Kotlin/Wasmのコンパイルが遅い

Kotlin/Wasmプロジェクトで作業しているときに、コンパイルに時間がかかることがあります。これは、Kotlin/Wasmツールチェインが変更を加えるたびにコードベース全体を再コンパイルするためです。

この問題を軽減するために、Kotlin/Wasmターゲットはインクリメンタルコンパイルをサポートしています。これにより、コンパイラは前回のコンパイルからの変更に関連するファイルのみを再コンパイルできます。

インクリメンタルコンパイルを使用すると、コンパイル時間が短縮されます。これにより、現時点での開発速度は2倍になり、将来のリリースでさらに改善される予定です。

現在の設定では、Wasmターゲットのインクリメンタルコンパイルはデフォルトで無効になっています。
これを有効にするには、プロジェクトの`local.properties`または`gradle.properties`ファイルに次の行を追加します。

```text
kotlin.incremental.wasm=true
```

> Kotlin/Wasmのインクリメンタルコンパイルを試して、[フィードバックを共有してください](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。
> 皆様の洞察は、この機能をより早く安定させ、デフォルトで有効にするのに役立ちます。
>
{style="note"}

## 完全修飾クラス名の診断

Kotlin/Wasmでは、アプリケーションサイズの増加を避けるため、デフォルトではコンパイラがクラスの完全修飾名 (FQNs) を生成されたバイナリに保存しません。

このため、完全修飾名機能を明示的に有効にしない限り、Kotlin/Wasmプロジェクトで`KClass::qualifiedName`プロパティを呼び出すと、コンパイラはエラーを報告します。

この診断はデフォルトで有効になっており、エラーは自動的に報告されます。この診断を無効にし、Kotlin/Wasmで`qualifiedName`を許可するには、`build.gradle.kts`ファイルに次のオプションを追加して、すべてのクラスの完全修飾名を保存するようにコンパイラに指示します。

```kotlin
// build.gradle.kts
kotlin {
   wasmJs {
       ...
       compilerOptions {
           freeCompilerArgs.add("-Xwasm-kclass-fqn")
       }
   }
}
```

このオプションを有効にすると、アプリケーションサイズが増加することに注意してください。

## 配列の範囲外アクセスとトラップ

Kotlin/Wasmでは、配列に範囲外のインデックスでアクセスすると、通常のKotlin例外ではなくWebAssemblyトラップがトリガーされます。トラップは現在の実行スタックを直ちに停止します。

JavaScript環境で実行される場合、これらのトラップは`WebAssembly.RuntimeError`として現れ、JavaScript側でキャッチできます。

実行可能ファイルをリンクする際に、コマンドラインで次のコンパイラオプションを使用することで、Kotlin/Wasm環境でのこのようなトラップを回避できます。

```
-Xwasm-enable-array-range-checks
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwasm-enable-array-range-checks")
    }
}
```

このコンパイラオプションを有効にすると、トラップの代わりに`IndexOutOfBoundsException`がスローされます。

詳細については、この[YouTrack issue](https://youtrack.jetbrains.com/issue/KT-73452/K-Wasm-turning-on-range-checks-by-default)を参照し、フィードバックを共有してください。

## 実験的アノテーション

Kotlin/Wasmは、一般的なWebAssemblyの相互運用性のためにいくつかの実験的アノテーションを提供しています。

[`@WasmImport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-import/)と[`@WasmExport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-export/)を使用すると、Kotlin/Wasmモジュールの外部で定義された関数を呼び出したり、Kotlin関数をホストまたは他のWasmモジュールに公開したりできます。

これらのメカニズムはまだ進化中のため、すべてのアノテーションは実験的としてマークされています。
これらを使用するには明示的に[オプトイン](opt-in-requirements.md)する必要があり、その設計や動作は将来のKotlinバージョンで変更される可能性があります。

## デバッグ中の再読み込み

[モダンブラウザ](#browser-versions)でのアプリケーションの[デバッグ](wasm-debugging.md)は、特別な設定なしで動作します。
開発用Gradleタスク (`*DevRun`) を実行すると、Kotlinは自動的にソースファイルをブラウザに提供します。

ただし、ソースをデフォルトで提供すると、Kotlinのコンパイルとバンドルが完了する前に、[ブラウザでアプリケーションが繰り返し再読み込みされる](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0)問題が発生する可能性があります。
回避策として、Kotlinのソースファイルを無視し、提供される静的ファイルの監視を無効にするようにwebpack設定を調整します。プロジェクトのルートにある`webpack.config.d`ディレクトリに、以下の内容の`.js`ファイルを追加します。

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
            return {
                directory: file,
                watch: false,
            }
        } else {
            return file
        }
    })
}