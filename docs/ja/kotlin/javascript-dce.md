[//]: # (title: Kotlin/JS デッドコード除去)

> デッドコード除去 (DCE) ツールは非推奨です。DCEツールは、現在廃止されたレガシーJSバックエンド向けに設計されていました。現在の
> [JS IRバックエンド](#dce-and-javascript-ir-compiler)はDCEをそのままサポートしており、[`@JsExport`アノテーション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)を
> 使用して、DCE中に保持するKotlinの関数とクラスを指定できます。
>
{style="warning"}

Kotlin Multiplatform Gradleプラグインには、_[デッドコード除去](https://wikipedia.org/wiki/Dead_code_elimination)_ (_DCE_) ツールが含まれています。
デッドコード除去は、しばしば_ツリーシェイキング_とも呼ばれます。これは、未使用のプロパティ、関数、およびクラスを削除することで、生成されるJavaScriptコードのサイズを削減します。

未使用の宣言は、以下のような場合に現れることがあります。

* 関数がインライン化され、直接呼び出されることがない場合（これは、いくつかの状況を除いて常に起こります）。
* モジュールが共有ライブラリを使用している場合。DCEがない場合、使用しないライブラリの一部が、生成されるバンドルに依然として含まれてしまいます。
  例えば、Kotlin標準ライブラリには、リスト、配列、文字シーケンス、DOM用アダプターなどを操作する関数が含まれています。
  このすべての機能は、JavaScriptファイルとして約1.3MBを必要とします。単純な「Hello, world」アプリケーションはコンソールルーチンのみを必要とし、ファイル全体でも数キロバイトにすぎません。

Kotlin Multiplatform Gradleプラグインは、例えば`browserProductionWebpack`タスクを使用して**本番用バンドル**をビルドする際に、DCEを自動的に処理します。
**開発用バンドル**タスク（`browserDevelopmentWebpack`など）にはDCEは含まれません。

## DCEとJavaScript IRコンパイラ

IRコンパイラでのDCEの適用は次のとおりです。

* 開発用にコンパイルする場合、DCEは無効になります。これは以下のGradleタスクに相当します。
  * `browserDevelopmentRun`
  * `browserDevelopmentWebpack`
  * `nodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 名前に"development"を含むその他のGradleタスク
* 本番用にコンパイルする場合、DCEは有効になります。これは以下のGradleタスクに相当します。
  * `browserProductionRun`
  * `browserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * 名前に"production"を含むその他のGradleタスク

`@JsExport`アノテーションを使用すると、DCEがルートとして扱うべき宣言を指定できます。

## DCEから宣言を除外する

モジュール内で使用しない場合でも、関数やクラスを生成されるJavaScriptコードに保持する必要がある場合があります。例えば、クライアント側のJavaScriptコードで使用する予定がある場合などです。

特定の宣言が除去されないようにするには、Gradleビルドスクリプトに`dceTask`ブロックを追加し、`keep`関数の引数として宣言をリストします。引数は、モジュール名をプレフィックスとして含む、宣言の完全修飾名（`moduleName.dot.separated.package.name.declarationName`）でなければなりません。

> 特に指定がない限り、関数やモジュールの名前は生成されるJavaScriptコードにおいて[マングル化される](js-to-kotlin-interop.md#jsname-annotation)ことがあります。
> そのような関数が除去されないようにするには、`keep`引数に、生成されるJavaScriptコードに現れるマングル化された名前を使用します。
>
{style="note"}

```groovy
kotlin {
    js {
        browser {
            dceTask {
                keep("myKotlinJSModule.org.example.getName", "myKotlinJSModule.org.example.User" )
            }
            binaries.executable()
        }
    }
}
```

パッケージ全体またはモジュール全体が除去されないようにしたい場合、生成されるJavaScriptコードに現れるその完全修飾名を使用できます。

> パッケージ全体またはモジュール全体が除去されないようにすると、DCEが多くの未使用宣言を削除するのを妨げる可能性があります。
> このため、DCEから除外すべき個々の宣言を一つずつ選択することが望ましいです。
>
{style="note"}

## DCEを無効にする

DCEを完全に無効にするには、`dceTask`内の`devMode`オプションを使用します。

```groovy
kotlin {
    js {
        browser {
            dceTask {
                dceOptions.devMode = true
            }
        }
        binaries.executable()
    }
}