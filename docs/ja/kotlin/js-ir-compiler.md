[//]: # (title: Kotlin/JS コンパイラの機能)

Kotlin/JS には、パフォーマンス、サイズ、および開発スピードのためにコードを最適化するコンパイラ機能が含まれています。
これは、JavaScript コードを生成する前に Kotlin コードを中間表現 (IR) に変換するコンパイルプロセスを通じて機能します。

## トップレベルプロパティの遅延初期化

アプリケーションの起動パフォーマンスを向上させるため、Kotlin/JS コンパイラはトップレベルプロパティを遅延初期化（レイジー初期化）します。これにより、アプリケーションのコードで使用されているすべてのトップレベルプロパティを初期化することなく、アプリケーションをロードできます。起動時に必要なものだけが初期化され、その他のプロパティは、それらを使用するコードが実際に実行されるときに値を受け取ります。

```kotlin
val a = run {
    val result = // 重い計算
    println(result)
    result
} // 最初に使用されたときに値が計算される
```

何らかの理由でプロパティを即時（アプリケーションの開始時）に初期化する必要がある場合は、[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} アノテーションを付けてください。

## 開発用バイナリのインクリメンタルコンパイル

Kotlin/JS コンパイラは、開発プロセスを高速化する「開発用バイナリのインクリメンタルコンパイルモード」を提供しています。
このモードでは、コンパイラは `compileDevelopmentExecutableKotlinJs` Gradle タスクの結果をモジュールレベルでキャッシュします。
次回のコンパイル時に、変更されていないソースファイルに対してキャッシュされたコンパイル結果を使用するため、特に小さな変更の場合にコンパイルがより速く完了します。

インクリメンタルコンパイルはデフォルトで有効になっています。開発用バイナリのインクリメンタルコンパイルを無効にするには、プロジェクトの `gradle.properties` または `local.properties` に以下の行を追加してください。

```none
kotlin.incremental.js.ir=false // デフォルトは true
```

> インクリメンタルコンパイルモードでのクリーンビルドは、キャッシュを作成して保存する必要があるため、通常は遅くなります。
>
{style="note"}

## プロダクションにおけるメンバー名のミニファイ

Kotlin/JS コンパイラは、Kotlin のクラスや関数の関係に関する内部情報を使用して、より効率的なミニファイ（縮小化）を適用し、関数、プロパティ、クラスの名前を短縮します。これにより、生成されるバンドルされたアプリケーションのサイズが削減されます。

このタイプのミニファイは、Kotlin/JS アプリケーションを [プロダクション](js-project-setup.md#building-executables) モードでビルドする際に自動的に適用され、デフォルトで有効になっています。メンバー名のミニファイを無効にするには、`-Xir-minimized-member-names` コンパイラオプションを使用します。

```kotlin
kotlin {
    js {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## デッドコード削除

[デッドコード削除](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) は、未使用のプロパティ、関数、およびクラスを削除することで、生成される JavaScript コードのサイズを削減します。

未使用の宣言は、以下のようなケースで発生する可能性があります。

* 関数がインライン化され、直接呼び出されることがなくなった場合（いくつかの例外を除き、常に発生します）。
* モジュールが共有ライブラリを使用している場合。DCE がないと、ライブラリのうち使用していない部分も生成されたバンドルに含まれたままになります。
  例えば、Kotlin 標準ライブラリには、リスト、配列、文字列の操作、DOM 用のアダプターなどのための関数が含まれています。これらの機能すべてを JavaScript ファイルにすると約 1.3 MB 必要になります。シンプルな "Hello, world" アプリケーションに必要なのはコンソールのルーチンだけであり、ファイル全体では数キロバイトにしかなりません。

Kotlin/JS コンパイラでは、DCE は自動的に処理されます。

* DCE は「開発用」のバンドルタスクでは無効になっています。これには以下の Gradle タスクが含まれます。

  * `jsBrowserDevelopmentRun`
  * `jsBrowserDevelopmentWebpack`
  * `jsNodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 名前に "development" を含むその他の Gradle タスク

* DCE は「プロダクション用」のバンドルをビルドする場合に有効になります。これには以下の Gradle タスクが含まれます。

  * `jsBrowserProductionRun`
  * `jsBrowserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * 名前に "production" を含むその他の Gradle タスク

[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) アノテーションを使用すると、DCE にルートとして扱わせたい宣言を指定できます。