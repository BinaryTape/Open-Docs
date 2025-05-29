[//]: # (title: Kotlin/JS IR コンパイラ)

Kotlin/JS IR コンパイラバックエンドは、Kotlin/JS におけるイノベーションの主要な焦点であり、このテクノロジーの将来への道筋を示します。

Kotlin/JS IR コンパイラバックエンドは、Kotlin ソースコードから JavaScript コードを直接生成するのではなく、新しいアプローチを採用しています。Kotlin ソースコードはまず [Kotlin 中間表現 (IR)](whatsnew14.md#unified-backends-and-extensibility) に変換され、その後 JavaScript にコンパイルされます。Kotlin/JS の場合、これにより積極的な最適化が可能になり、以前のコンパイラに存在した課題点（生成されるコードサイズ（デッドコード除去による）や JavaScript および TypeScript エコシステムとの相互運用性など）の改善が可能になります。

IR コンパイラバックエンドは、Kotlin 1.4.0 以降、Kotlin Multiplatform Gradle プラグインを介して利用できます。プロジェクトでこれを有効にするには、Gradle ビルドスクリプトの `js` 関数にコンパイラのタイプを渡します。

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
        binaries.executable() // not applicable to BOTH, see details below
    }
}
```

*   `IR` は Kotlin/JS に新しい IR コンパイラバックエンドを使用します。
*   `LEGACY` は古いコンパイラバックエンドを使用します。
*   `BOTH` は、新しい IR コンパイラとデフォルトのコンパイラバックエンドの両方でプロジェクトをコンパイルします。[両方のバックエンドと互換性のあるライブラリを作成する](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility) にはこのモードを使用します。

> 古いコンパイラバックエンドは Kotlin 1.8.0 以降非推奨となりました。Kotlin 1.9.0 以降、コンパイラのタイプ `LEGACY` または `BOTH` を使用するとエラーになります。
>
{style="warning"}

コンパイラのタイプは、`gradle.properties` ファイルで `kotlin.js.compiler=ir` というキーで設定することもできます。ただし、この動作は `build.gradle(.kts)` のすべての設定によって上書きされます。

## トップレベルプロパティの遅延初期化

アプリケーションの起動パフォーマンスを向上させるため、Kotlin/JS IR コンパイラはトップレベルプロパティを遅延初期化します。これにより、アプリケーションはそのコードで使用されるすべてのトップレベルプロパティを初期化することなくロードされます。起動時に必要なもののみを初期化し、他のプロパティはそれらを使用するコードが実際に実行されるときに後で値を受け取ります。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

何らかの理由でプロパティを即時（アプリケーション起動時に）初期化する必要がある場合は、[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} アノテーションでマークしてください。

## 開発バイナリ向けのインクリメンタルコンパイル

JS IR コンパイラは、開発プロセスを高速化する _開発バイナリ向けのインクリメンタルコンパイルモード_ を提供します。このモードでは、コンパイラは `compileDevelopmentExecutableKotlinJs` Gradle タスクの結果をモジュールレベルでキャッシュします。これにより、後続のコンパイル時に変更されていないソースファイルに対してキャッシュされたコンパイル結果が使用され、特に小さな変更の場合に完了が高速化されます。

インクリメンタルコンパイルはデフォルトで有効です。開発バイナリのインクリメンタルコンパイルを無効にするには、プロジェクトの `gradle.properties` または `local.properties` に次の行を追加します。

```none
kotlin.incremental.js.ir=false // true by default
```

> インクリメンタルコンパイルモードでのクリーンビルドは、キャッシュを作成し、投入する必要があるため、通常は遅くなります。
>
{style="note"}

## 出力モード

JS IR コンパイラがプロジェクトで `.js` ファイルを出力する方法を選択できます。

*   **モジュールごと**。デフォルトでは、JS コンパイラはコンパイル結果としてプロジェクトの各モジュールに対して個別の `.js` ファイルを出力します。
*   **プロジェクトごと**。`gradle.properties` に次の行を追加することで、プロジェクト全体を単一の `.js` ファイルにコンパイルできます。

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
    ```

*   **ファイルごと**。各 Kotlin ファイルにつき1つ（または、ファイルにエクスポートされた宣言が含まれる場合は2つ）の JavaScript ファイルを生成する、より詳細な出力設定を行うことができます。ファイルごとのコンパイルモードを有効にするには：

    1.  ECMAScript モジュールをサポートするために、ビルドファイルに `useEsModules()` 関数を追加します。

        ```kotlin
        // build.gradle.kts
        kotlin {
            js(IR) {
                useEsModules() // Enables ES2015 modules
                browser()
            }
        }
        ```

        または、`es2015` [コンパイルターゲット](js-project-setup.md#support-for-es2015-features) を使用して、プロジェクトで ES2015 機能をサポートすることもできます。

    2.  `-Xir-per-file` コンパイラオプションを適用するか、`gradle.properties` ファイルを次のように更新します。

        ```none
        # gradle.properties
        kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
        ```

## プロダクション環境におけるメンバー名のミニファイ

Kotlin/JS IR コンパイラは、Kotlin のクラスと関数の関係に関する内部情報を使用して、関数、プロパティ、およびクラスの名前を短縮する、より効率的なミニファイを適用します。これにより、結果として生成されるバンドルされたアプリケーションのサイズが削減されます。

このタイプのミニファイは、Kotlin/JS アプリケーションを[プロダクションモード](js-project-setup.md#building-executables)でビルドするときに自動的に適用され、デフォルトで有効になっています。メンバー名のミニファイを無効にするには、`-Xir-minimized-member-names` コンパイラオプションを使用します。

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## プレビュー: TypeScript 宣言ファイル (d.ts) の生成

> TypeScript 宣言ファイル (`d.ts`) の生成は[試験的](components-stability.md)です。この機能はいつでも削除または変更される可能性があります。オプトインが必要であり（詳細は下記参照）、評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin/JS IR コンパイラは、Kotlin コードから TypeScript 定義を生成することができます。これらの定義は、ハイブリッドアプリで作業する際に JavaScript ツールや IDE によって使用され、オートコンプリートを提供したり、静的アナライザをサポートしたり、JavaScript および TypeScript プロジェクトに Kotlin コードを含めるのを容易にしたりします。

プロジェクトが実行可能ファイルを生成する場合 (`binaries.executable()`)、Kotlin/JS IR コンパイラは [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) でマークされたトップレベル宣言を収集し、`.d.ts` ファイルに TypeScript 定義を自動的に生成します。

TypeScript 定義を生成したい場合は、Gradle ビルドファイルで明示的にこれを設定する必要があります。`build.gradle.kts` ファイルの [`js` セクション](js-project-setup.md#execution-environments)に `generateTypeScriptDefinitions()` を追加します。例：

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

定義は `build/js/packages/<package_name>/kotlin` に、対応する webpack 化されていない JavaScript コードとともに見つけることができます。

## IR コンパイラの現在の制限

新しい IR コンパイラバックエンドにおける主要な変更点は、デフォルトのバックエンドとの**バイナリ互換性がない**ことです。新しい IR コンパイラで作成されたライブラリは [`klib` 形式](native-libraries.md#library-format)を使用しており、デフォルトのバックエンドからは使用できません。一方、古いコンパイラで作成されたライブラリは `js` ファイルを含む `jar` であり、IR バックエンドからは使用できません。

プロジェクトで IR コンパイラバックエンドを使用したい場合は、**すべての Kotlin 依存関係をこの新しいバックエンドをサポートするバージョンに更新する**必要があります。Kotlin/JS をターゲットとする Kotlin 1.4 以降向けに JetBrains が公開しているライブラリは、すでに新しい IR コンパイラバックエンドでの使用に必要なすべてのアーティファクトを含んでいます。

**ライブラリ作者である場合**で、現在のコンパイラバックエンドと新しい IR コンパイラバックエンドの両方との互換性を提供したい場合は、さらに[IR コンパイラ向けライブラリ作成に関するセクション](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)も参照してください。

IR コンパイラバックエンドには、デフォルトのバックエンドと比較していくつかの不一致も存在します。新しいバックエンドを試す際には、これらの潜在的な落とし穴に注意することが重要です。

*   `kotlin-wrappers` など、デフォルトのバックエンドの**特定の特性に依存するライブラリ**は、いくつかの問題を示す可能性があります。[YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) で調査と進捗を追跡できます。
*   IR バックエンドは、デフォルトでは**Kotlin 宣言をJavaScriptで全く利用可能にしません**。Kotlin 宣言を JavaScript から見えるようにするには、[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) で**必須で**アノテーションを付ける必要があります。

## 既存のプロジェクトを IR コンパイラに移行する

2つの Kotlin/JS コンパイラ間の大きな違いにより、Kotlin/JS コードを IR コンパイラで動作させるにはいくつかの調整が必要になる場合があります。[Kotlin/JS IR コンパイラ移行ガイド](js-ir-migration.md)で、既存の Kotlin/JS プロジェクトを IR コンパイラに移行する方法を学びましょう。

## 後方互換性を持つ IR コンパイラ向けライブラリの作成

デフォルトのバックエンドと新しい IR コンパイラバックエンドの両方との互換性を提供しようとしているライブラリメンテナーの場合、コンパイラの選択に関する設定が利用できます。これにより、両方のバックエンド向けにアーティファクトを作成でき、既存ユーザーとの互換性を維持しながら、次世代の Kotlin コンパイラをサポートすることができます。このいわゆる`both`モードは、`gradle.properties` ファイルで `kotlin.js.compiler=both` 設定を使用することでオンにできます。または、`build.gradle(.kts)` ファイル内の `js` ブロック内でプロジェクト固有のオプションの1つとして設定することもできます。

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

`both`モードの場合、ソースからライブラリをビルドする際に、IR コンパイラバックエンドとデフォルトコンパイラバックエンドの両方が使用されます（それゆえその名前です）。これは、Kotlin IR を含む `klib` ファイルと、デフォルトコンパイラ用の `jar` ファイルの両方が生成されることを意味します。同じ Maven 座標で公開されると、Gradle はユースケースに応じて適切なアーティファクト（古いコンパイラには `js`、新しいコンパイラには `klib`）を自動的に選択します。これにより、いずれかのコンパイラバックエンドを使用しているプロジェクト向けにライブラリをコンパイルおよび公開できるようになります。