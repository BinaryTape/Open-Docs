[//]: # (title: Kotlin/JS IRコンパイラ)

Kotlin/JS IRコンパイラバックエンドは、Kotlin/JSにおける革新の主要な焦点であり、このテクノロジーの将来への道を切り開きます。

Kotlin/JS IRコンパイラバックエンドは、KotlinのソースコードからJavaScriptコードを直接生成するのではなく、新しいアプローチを活用します。Kotlinのソースコードはまず[Kotlin中間表現 (IR)](whatsnew14.md#unified-backends-and-extensibility)に変換され、その後JavaScriptにコンパイルされます。Kotlin/JSの場合、これにより積極的な最適化が可能になり、以前のコンパイラにあった課題点、例えば生成されるコードサイズ（[デッドコードエリミネーション](#dead-code-elimination)によるもの）やJavaScriptおよびTypeScriptエコシステムとの相互運用性といった点での改善を可能にします。

IRコンパイラバックエンドは、Kotlin 1.4.0以降、KotlinマルチプラットフォームGradleプラグインを通じて利用可能です。プロジェクトで有効にするには、Gradleビルドスクリプトの`js`関数にコンパイラタイプを渡します。

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
        binaries.executable() // not applicable to BOTH, see details below
    }
}
```

*   `IR` はKotlin/JS用の新しいIRコンパイラバックエンドを使用します。
*   `LEGACY` は古いコンパイラバックエンドを使用します。
*   `BOTH` は、プロジェクトを新しいIRコンパイラとデフォルトのコンパイラバックエンドの両方でコンパイルします。このモードは[両方のバックエンドと互換性のあるライブラリを作成する](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)場合に使用します。

> 古いコンパイラバックエンドはKotlin 1.8.0以降非推奨となりました。Kotlin 1.9.0以降では、`LEGACY`または`BOTH`のコンパイラタイプを使用するとエラーが発生します。
>
{style="warning"}

コンパイラタイプは、`gradle.properties`ファイルで`kotlin.js.compiler=ir`というキーで設定することもできます。ただし、この動作は`build.gradle(.kts)`内の設定によって上書きされます。

## トップレベルプロパティの遅延初期化

アプリケーションの起動パフォーマンスを向上させるため、Kotlin/JS IRコンパイラはトップレベルプロパティを遅延初期化します。これにより、アプリケーションはコード内で使用されるすべてのトップレベルプロパティを初期化することなくロードされます。起動時に必要なものだけが初期化され、他のプロパティは、それらを使用するコードが実際に実行されるときに後から値を受け取ります。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

何らかの理由でプロパティを即時に（アプリケーション起動時に）初期化する必要がある場合は、[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"}アノテーションでマークしてください。

## 開発バイナリのインクリメンタルコンパイル

JS IRコンパイラは、開発プロセスを高速化する_開発バイナリのインクリメンタルコンパイルモード_を提供します。このモードでは、コンパイラは`compileDevelopmentExecutableKotlinJs` Gradleタスクの結果をモジュールレベルでキャッシュします。これにより、変更されていないソースファイルに対してキャッシュされたコンパイル結果が後続のコンパイルで再利用され、特に小さな変更の場合にコンパイルが高速化されます。

インクリメンタルコンパイルはデフォルトで有効になっています。開発バイナリのインクリメンタルコンパイルを無効にするには、プロジェクトの`gradle.properties`または`local.properties`に次の行を追加します。

```none
kotlin.incremental.js.ir=false // true by default
```

> インクリメンタルコンパイルモードでのクリーンビルドは、キャッシュを作成して投入する必要があるため、通常は遅くなります。
>
{style="note"}

## 出力モード

JS IRコンパイラがプロジェクトで`.js`ファイルをどのように出力するかを選択できます。

*   **モジュールごと**。デフォルトでは、JSコンパイラはコンパイル結果としてプロジェクトの各モジュールに対して個別の`.js`ファイルを出力します。
*   **プロジェクト全体**。プロジェクト全体を単一の`.js`ファイルにコンパイルするには、`gradle.properties`に次の行を追加します。

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
    ```

*   **ファイルごと**。より細かな出力として、Kotlinファイルごとに1つ（または、ファイルにエクスポートされた宣言が含まれる場合は2つ）のJavaScriptファイルを生成するように設定できます。ファイルごとのコンパイルモードを有効にするには：

    1.  ECMAScriptモジュールをサポートするために、ビルドファイルに`useEsModules()`関数を追加します。

        ```kotlin
        // build.gradle.kts
        kotlin {
            js(IR) {
                useEsModules() // Enables ES2015 modules
                browser()
            }
        }
        ```

        あるいは、プロジェクトでES2015機能をサポートするために`es2015` [コンパイルターゲット](js-project-setup.md#support-for-es2015-features)を使用することもできます。

    2.  `-Xir-per-file`コンパイラオプションを適用するか、`gradle.properties`ファイルを更新します。

        ```none
        # gradle.properties
        kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
        ```

## プロダクションにおけるメンバー名のミニファイ化

Kotlin/JS IRコンパイラは、Kotlinのクラスと関数の関係に関する内部情報を使用して、関数、プロパティ、クラスの名前を短縮する、より効率的なミニファイ化を適用します。これにより、結果として生成されるバンドルされたアプリケーションのサイズが削減されます。

この種のミニファイ化は、Kotlin/JSアプリケーションを[プロダクションモード](js-project-setup.md#building-executables)でビルドする際に自動的に適用され、デフォルトで有効になっています。メンバー名のミニファイ化を無効にするには、`-Xir-minimized-member-names`コンパイラオプションを使用します。

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

## デッドコードエリミネーション

[デッドコードエリミネーション](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) は、未使用のプロパティ、関数、クラスを削除することで、結果として生成されるJavaScriptコードのサイズを削減します。

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

[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation)アノテーションを使用すると、DCEがルートとして扱う宣言を指定できます。

## プレビュー: TypeScript宣言ファイル (d.ts) の生成

> TypeScript宣言ファイル (`d.ts`) の生成は[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> オプトインが必要であり（詳細は下記参照）、評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin/JS IRコンパイラは、KotlinコードからTypeScript定義を生成できます。これらの定義は、ハイブリッドアプリで作業する際にJavaScriptツールやIDEが自動補完を提供し、静的アナライザーをサポートし、JavaScriptおよびTypeScriptプロジェクトにKotlinコードを含めることを容易にするために使用できます。

プロジェクトが実行可能ファイル (`binaries.executable()`) を生成する場合、Kotlin/JS IRコンパイラは[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation)でマークされたすべてのトップレベル宣言を収集し、自動的に`.d.ts`ファイルにTypeScript定義を生成します。

TypeScript定義を生成したい場合は、Gradleビルドファイルで明示的に設定する必要があります。[`js`セクション](js-project-setup.md#execution-environments)の`build.gradle.kts`ファイルに`generateTypeScriptDefinitions()`を追加します。例：

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

定義は、対応するwebpack化されていないJavaScriptコードとともに`build/js/packages/<package_name>/kotlin`にあります。

## IRコンパイラの現在の制限事項

新しいIRコンパイラバックエンドの大きな変更点は、デフォルトのバックエンドとの**バイナリ互換性がない**ことです。新しいIRコンパイラで作成されたライブラリは[`klib`形式](native-libraries.md#library-format)を使用するため、デフォルトのバックエンドからは使用できません。一方、古いコンパイラで作成されたライブラリは`js`ファイルを含む`jar`であり、IRバックエンドからは使用できません。

プロジェクトでIRコンパイラバックエンドを使用したい場合は、**すべてのKotlin依存関係をこの新しいバックエンドをサポートするバージョンに更新する**必要があります。Kotlin/JSをターゲットとするKotlin 1.4以降のJetBrainsから公開されているライブラリには、新しいIRコンパイラバックエンドで使用するために必要なすべてのアーティファクトがすでに含まれています。

**ライブラリ開発者の方**で、現在のコンパイラバックエンドと新しいIRコンパイラバックエンドの両方との互換性を提供したい場合は、さらに[IRコンパイラ用のライブラリの作成に関するセクション](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)を確認してください。

IRコンパイラバックエンドには、デフォルトのバックエンドと比較していくつかの相違点もあります。新しいバックエンドを試す際には、これらの潜在的な落とし穴に注意することが重要です。

*   デフォルトのバックエンドの**特定の特性に依存する一部のライブラリ**、例えば`kotlin-wrappers`は、いくつかの問題を示す可能性があります。[YouTrack](https://youtrack.jetbrains.com/issue/KT-40525)で調査と進捗を追うことができます。
*   IRバックエンドは、デフォルトではKotlinの宣言をJavaScriptから利用できるようにしません。Kotlinの宣言をJavaScriptから可視にするには、[`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation)で**アノテーションを付ける必要があります**。

## 既存プロジェクトをIRコンパイラに移行する

2つのKotlin/JSコンパイラ間には大きな違いがあるため、既存のKotlin/JSコードをIRコンパイラで動作させるには、いくつかの調整が必要になる場合があります。既存のKotlin/JSプロジェクトをIRコンパイラに移行する方法については、[Kotlin/JS IRコンパイラ移行ガイド](js-ir-migration.md)で確認してください。

## 後方互換性を持つIRコンパイラ用ライブラリの作成

既存のコンパイラバックエンドと新しいIRコンパイラバックエンドの両方との互換性を提供したいライブラリメンテナーの場合、両方のバックエンド用のアーティファクトを作成できるコンパイラ選択の設定が利用可能です。これにより、既存のユーザーとの互換性を維持しつつ、次世代のKotlinコンパイラをサポートすることができます。このいわゆる`both`モードは、`gradle.properties`ファイルで`kotlin.js.compiler=both`設定を使用するか、`build.gradle(.kts)`ファイル内の`js`ブロック内でプロジェクト固有のオプションの1つとして設定できます。

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

`both`モードの場合、ソースからライブラリをビルドする際にIRコンパイラバックエンドとデフォルトのコンパイラバックエンドの両方が使用されます（そのため、この名前が付けられています）。これは、Kotlin IRを含む`klib`ファイルと、デフォルトコンパイラ用の`jar`ファイルの両方が生成されることを意味します。同じMaven座標で公開される場合、Gradleはユースケースに応じて適切なアーティファクト（古いコンパイラの場合は`js`、新しいコンパイラの場合は`klib`）を自動的に選択します。これにより、両方のコンパイラバックエンドを使用するプロジェクト向けにライブラリをコンパイルおよび公開することができます。