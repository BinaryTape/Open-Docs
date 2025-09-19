[//]: # (title: Kotlin/JSコンパイラの機能)

Kotlin/JSには、パフォーマンス、サイズ、開発速度のためにコードを最適化するコンパイラ機能が含まれています。
これは、KotlinコードをJavaScriptコードの生成前に中間表現 (IR) に変換するコンパイルプロセスを通じて機能します。

## トップレベルプロパティの遅延初期化

アプリケーションの起動パフォーマンスを向上させるため、Kotlin/JSコンパイラはトップレベルプロパティを遅延初期化します。これにより、
アプリケーションはコード内で使用されるすべてのトップレベルプロパティを初期化することなくロードされます。起動時に必要なものだけが初期化され、
他のプロパティは、それらを使用するコードが実際に実行されるときに後から値を受け取ります。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

何らかの理由でプロパティを即時に（アプリケーション起動時に）初期化する必要がある場合は、
[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"}アノテーションでマークしてください。

## 開発バイナリのインクリメンタルコンパイル

Kotlin/JSコンパイラは、開発プロセスを高速化する_開発バイナリのインクリメンタルコンパイルモード_を提供します。
このモードでは、コンパイラは`compileDevelopmentExecutableKotlinJs` Gradleタスクの結果をモジュールレベルでキャッシュします。
これにより、変更されていないソースファイルに対してキャッシュされたコンパイル結果が後続のコンパイルで再利用され、
特に小さな変更の場合にコンパイルが高速化されます。

インクリメンタルコンパイルはデフォルトで有効になっています。開発バイナリのインクリメンタルコンパイルを無効にするには、プロジェクトの`gradle.properties`
または`local.properties`に次の行を追加します。

```none
kotlin.incremental.js.ir=false // true by default
```

> インクリメンタルコンパイルモードでのクリーンビルドは、キャッシュを作成して投入する必要があるため、通常は遅くなります。
>
{style="note"}

## プロダクションにおけるメンバー名のミニファイ化

Kotlin/JSコンパイラは、Kotlinのクラスと関数の関係に関する内部情報を使用して、関数、プロパティ、クラスの名前を短縮する、より効率的なミニファイ化を適用します。これにより、結果として生成されるバンドルされたアプリケーションのサイズが削減されます。

この種のミニファイ化は、Kotlin/JSアプリケーションを[プロダクション](js-project-setup.md#building-executables)モードでビルドする際に自動的に適用され、デフォルトで有効になっています。メンバー名のミニファイ化を無効にするには、`-Xir-minimized-member-names`コンパイラオプションを使用します。

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

## デッドコードエリミネーション

[デッドコードエリミネーション](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) は、
未使用のプロパティ、関数、クラスを削除することで、結果として生成されるJavaScriptコードのサイズを削減します。

未使用の宣言は、次のような場合に発生する可能性があります。

*   関数がインライン化され、直接呼び出されない場合（一部のケースを除いて常に発生します）。
*   モジュールが共有ライブラリを使用している場合。DCEがないと、使用しないライブラリの一部も結果のバンドルに含まれます。
    例えば、Kotlin標準ライブラリには、リスト、配列、文字シーケンスの操作、DOM用のアダプターなどの関数が含まれています。これらの機能すべてをJavaScriptファイルとして含めると約1.3MBが必要になります。「Hello, world」のような単純なアプリケーションでは、コンソールルーチンのみが必要であり、ファイル全体でもわずか数キロバイトで済みます。

Kotlin/JSコンパイラでは、DCEは自動的に処理されます。

*   DCEは、以下のGradleタスクに対応する_development_バンドルタスクでは無効化されます。

    *   `jsBrowserDevelopmentRun`
    *   `jsBrowserDevelopmentWebpack`
    *   `jsNodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   名前に"development"を含むその他のGradleタスク

*   _production_バンドルをビルドすると、DCEが有効になります。これは以下のGradleタスクに対応します。

    *   `jsBrowserProductionRun`
    *   `jsBrowserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   名前に"production"を含むその他のGradleタスク

[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation)アノテーションを使用すると、
DCEがルートとして扱う宣言を指定できます。