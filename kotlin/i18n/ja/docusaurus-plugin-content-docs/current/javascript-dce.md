---
title: "Kotlin/JS dead code elimination"
---
:::note
dead code elimination (DCE)ツールは非推奨になりました。DCEツールはレガシーJSバックエンド用に設計されたもので、現在は廃止されています。現在の[JS IR backend](#dce-and-javascript-ir-compiler)はDCEを標準でサポートしており、[@JsExport annotation](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)を使用すると、DCE中に保持するKotlinの関数とクラスを指定できます。

Kotlin Multiplatform Gradleプラグインには、_[dead code elimination](https://wikipedia.org/wiki/Dead_code_elimination)_（_DCE_）ツールが含まれています。dead code eliminationは、_tree shaking_とも呼ばれます。これは、未使用のプロパティ、関数、クラスを削除することで、結果として得られるJavaScriptコードのサイズを縮小します。

未使用の宣言は、次のような場合に発生する可能性があります。

* 関数がインライン化され、直接呼び出されることがない（これは、いくつかの状況を除いて常に発生します）。
* モジュールが共有ライブラリを使用している。DCEがないと、使用しないライブラリの部分も結果のバンドルに含まれます。たとえば、Kotlin標準ライブラリには、リスト、配列、文字シーケンス、DOMのアダプターなどを操作するための関数が含まれています。このすべての機能は、JavaScriptファイルとして約1.3 MBを必要とします。単純な「Hello, world」アプリケーションでは、コンソールルーチンのみが必要であり、これはファイル全体でわずか数キロバイトです。

Kotlin Multiplatform Gradleプラグインは、`browserProductionWebpack`タスクを使用するなど、**production bundle**をビルドするときにDCEを自動的に処理します。**Development bundling**タスク（`browserDevelopmentWebpack`など）にはDCEは含まれません。

## DCE and JavaScript IR compiler

IRコンパイラーでのDCEの適用は次のとおりです。

* 開発用にコンパイルする場合、DCEは無効になります。これは、次のGradleタスクに対応します。
  * `browserDevelopmentRun`
  * `browserDevelopmentWebpack`
  * `nodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 名前に「development」を含むその他のGradleタスク
* 本番用にコンパイルする場合、DCEは有効になります。これは、次のGradleタスクに対応します。
  * `browserProductionRun`
  * `browserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * 名前に「production」を含むその他のGradleタスク

@JsExport annotationを使用すると、DCEがルートとして扱う宣言を指定できます。

## Exclude declarations from DCE

モジュールで使用していなくても、結果のJavaScriptコードに関数またはクラスを保持する必要がある場合があります。たとえば、クライアントJavaScriptコードで使用する場合などです。

特定の宣言が削除されないようにするには、Gradleビルドスクリプトに`dceTask`ブロックを追加し、宣言を`keep`関数の引数としてリストします。引数は、モジュール名をプレフィックスとする、宣言の完全修飾名である必要があります：`moduleName.dot.separated.package.name.declarationName`

特に指定がない限り、関数とモジュールの名前は、生成されたJavaScriptコードで[mangled](js-to-kotlin-interop#jsname-annotation)される場合があります。このような関数が削除されないようにするには、生成されたJavaScriptコードに表示される`keep`引数で、mangledされた名前を使用します。

:::

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

パッケージまたはモジュール全体を削除から保護する場合は、生成されたJavaScriptコードに表示される完全修飾名を使用できます。

:::note
パッケージまたはモジュール全体を削除から保護すると、DCEが多くの未使用の宣言を削除できなくなる可能性があります。このため、DCEから除外する必要がある個々の宣言を1つずつ選択することをお勧めします。

:::

## Disable DCE

DCEを完全にオフにするには、`dceTask`で`devMode`オプションを使用します。

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
```