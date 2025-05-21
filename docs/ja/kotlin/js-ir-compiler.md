---
title: "Kotlin/JS IR コンパイラ"
---
Kotlin/JS IRコンパイラバックエンドは、Kotlin/JSに関するイノベーションの中心であり、この技術の将来を切り開くものです。

Kotlinソースコードから直接JavaScriptコードを生成するのではなく、Kotlin/JS IRコンパイラバックエンドは新しいアプローチを活用します。Kotlinソースコードはまず、[Kotlin中間表現（IR: Kotlin intermediate representation）](whatsnew14#unified-backends-and-extensibility)に変換され、その後JavaScriptにコンパイルされます。Kotlin/JSの場合、これにより積極的な最適化が可能になり、生成されるコードサイズ（デッドコードエリミネーションによる）やJavaScriptおよびTypeScriptエコシステムとの相互運用性など、以前のコンパイラに存在した問題点を改善できます。

IRコンパイラバックエンドは、Kotlin 1.4.0以降、Kotlin Multiplatform Gradleプラグインを通じて利用可能です。プロジェクトで有効にするには、Gradleビルドスクリプトの`js`関数にコンパイラタイプを渡します。

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
        binaries.executable() // not applicable to BOTH, see details below
    }
}
```

* `IR`は、Kotlin/JS用の新しいIRコンパイラバックエンドを使用します。
* `LEGACY`は、古いコンパイラバックエンドを使用します。
* `BOTH`は、新しいIRコンパイラとデフォルトのコンパイラバックエンドの両方でプロジェクトをコンパイルします。このモードは、[両方のバックエンドと互換性のあるライブラリを作成する](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)場合に使用します。

:::note
古いコンパイラバックエンドはKotlin 1.8.0から非推奨になっています。Kotlin 1.9.0以降では、コンパイラタイプ`LEGACY`または`BOTH`を使用するとエラーが発生します。

コンパイラタイプは、`gradle.properties`ファイルで`kotlin.js.compiler=ir`というキーで設定することもできます。ただし、この動作は`build.gradle(.kts)`の設定によって上書きされます。

## トップレベルプロパティの遅延初期化

アプリケーションの起動パフォーマンスを向上させるため、Kotlin/JS IRコンパイラはトップレベルプロパティを遅延初期化します。これにより、アプリケーションはコードで使用されるすべてのトップレベルプロパティを初期化せずにロードされます。起動時に必要なものだけが初期化され、他のプロパティは、それらを使用するコードが実際に実行されるときに後で値を受け取ります。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

何らかの理由で、プロパティを（アプリケーションの起動時に）すぐに初期化する必要がある場合は、[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/)アノテーションを付けてください。

## 開発バイナリのインクリメンタルコンパイル

JS IRコンパイラは、開発プロセスを高速化する_開発バイナリのインクリメンタルコンパイルモード_を提供します。このモードでは、コンパイラはモジュールレベルで`compileDevelopmentExecutableKotlinJs` Gradleタスクの結果をキャッシュします。後続のコンパイル中に変更されていないソースファイルに対してキャッシュされたコンパイル結果を使用するため、特に小さな変更の場合に完了が速くなります。

インクリメンタルコンパイルはデフォルトで有効になっています。開発バイナリのインクリメンタルコンパイルを無効にするには、プロジェクトの`gradle.properties`または`local.properties`に次の行を追加します。

```none
kotlin.incremental.js.ir=false // true by default
```

インクリメンタルコンパイルモードでのクリーンビルドは、キャッシュを作成して入力する必要があるため、通常は遅くなります。

:::

## 出力モード

JS IRコンパイラがプロジェクトで`.js`ファイルを出力する方法を選択できます。

* **モジュールごと**. デフォルトでは、JSコンパイラはコンパイル結果として、プロジェクトの各モジュールに対して個別の`.js`ファイルを出力します。
* **プロジェクトごと**. 次の行を`gradle.properties`に追加することで、プロジェクト全体を単一の`.js`ファイルにコンパイルできます。

  ```none
  kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
  ```
  
* **ファイルごと**. 各Kotlinファイルごとに1つ（またはファイルにエクスポートされた宣言が含まれている場合は2つ）のJavaScriptファイルを生成する、より詳細な出力を設定できます。ファイルごとのコンパイルモードを有効にするには：

  1. ECMAScriptモジュールをサポートするために、ビルドファイルに`useEsModules()`関数を追加します。

     ```kotlin
     // build.gradle.kts
     kotlin {
         js(IR) {
             useEsModules() // Enables ES2015 modules
             browser()
         }
     }
     ```
  
     または、`es2015` [コンパイルターゲット](js-project-setup#support-for-es2015-features)を使用して、プロジェクトでES2015機能をサポートすることもできます。
  
  2. `-Xir-per-file`コンパイラオプションを適用するか、`gradle.properties`ファイルを次のように更新します。
  
     ```none
     # gradle.properties
     kotlin.js.ir.output.granularity=per-file // `per-module` is the default
     ```

## プロダクションでのメンバー名の最小化

Kotlin/JS IRコンパイラは、Kotlinのクラスと関数の関係に関する内部情報を使用して、より効率的な最小化を適用し、関数、プロパティ、およびクラスの名前を短縮します。これにより、バンドルされたアプリケーションのサイズが削減されます。

このタイプの最小化は、[プロダクション](js-project-setup#building-executables)モードでKotlin/JSアプリケーションをビルドするときに自動的に適用され、デフォルトで有効になっています。メンバー名の最小化を無効にするには、`-Xir-minimized-member-names`コンパイラオプションを使用します。

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

## プレビュー：TypeScript宣言ファイル（d.ts）の生成

:::caution
TypeScript宣言ファイル（`d.ts`）の生成は[Experimental](components-stability)です。いつでも削除または変更される可能性があります。
オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D)でフィードバックをお待ちしております。

:::

Kotlin/JS IRコンパイラは、KotlinコードからTypeScript定義を生成できます。これらの定義は、ハイブリッドアプリで作業するときに、JavaScriptツールやIDEで使用して、オートコンプリートを提供し、静的アナライザーをサポートし、KotlinコードをJavaScriptおよびTypeScriptプロジェクトに簡単に含めることができます。

プロジェクトが実行可能ファイル（`binaries.executable()`）を生成する場合、Kotlin/JS IRコンパイラは、[`@JsExport`](js-to-kotlin-interop#jsexport-annotation)でマークされたトップレベルの宣言を収集し、`.d.ts`ファイルにTypeScript定義を自動的に生成します。

TypeScript定義を生成する場合は、Gradleビルドファイルでこれを明示的に構成する必要があります。[`js`セクション](js-project-setup#execution-environments)の`build.gradle.kts`ファイルに`generateTypeScriptDefinitions()`を追加します。
例：

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

定義は、対応するwebpackされていないJavaScriptコードとともに、`build/js/packages/<package_name>/kotlin`にあります。

## IRコンパイラの現在の制限事項

新しいIRコンパイラバックエンドの大きな変更点は、デフォルトバックエンドとの**バイナリ互換性がない**ことです。
新しいIRコンパイラで作成されたライブラリは[`klib`形式](native-libraries#library-format)を使用し、デフォルトのバックエンドからは使用できません。一方、古いコンパイラで作成されたライブラリは`js`ファイルを含む`jar`であり、IRバックエンドからは使用できません。

プロジェクトでIRコンパイラバックエンドを使用する場合は、**すべてのKotlin依存関係をこの新しいバックエンドをサポートするバージョンに更新する**必要があります。JetBrainsがKotlin/JSを対象としてKotlin 1.4以降向けに公開しているライブラリには、新しいIRコンパイラバックエンドで使用するために必要なすべてのアーティファクトがすでに含まれています。

**あなたがライブラリの作成者である**場合、現在のコンパイラバックエンドと新しいIRコンパイラバックエンドとの互換性を提供したい場合は、[IRコンパイラ用のライブラリの作成に関するセクション](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)も確認してください。

IRコンパイラバックエンドには、デフォルトのバックエンドと比較していくつかの相違点もあります。新しいバックエンドを試すときは、これらの潜在的な落とし穴に注意することが重要です。

* `kotlin-wrappers`など、デフォルトのバックエンドの**特定の特性に依存する一部のライブラリ**は、いくつかの問題を表示する可能性があります。[YouTrack](https://youtrack.jetbrains.com/issue/KT-40525)で調査と進捗状況を追跡できます。
* IRバックエンドは、デフォルトでは**Kotlinの宣言をJavaScriptで使用できるようにしません**。Kotlinの宣言をJavaScriptから見えるようにするには、[`@JsExport`](js-to-kotlin-interop#jsexport-annotation)でアノテーションを**付ける必要があります**。

## 既存のプロジェクトをIRコンパイラに移行する

2つのKotlin/JSコンパイラの間に大きな違いがあるため、Kotlin/JSコードをIRコンパイラで動作させるには、いくつかの調整が必要になる場合があります。[Kotlin/JS IRコンパイラ移行ガイド](js-ir-migration)で、既存のKotlin/JSプロジェクトをIRコンパイラに移行する方法を学びます。

## 後方互換性のあるIRコンパイラ用のライブラリの作成

デフォルトのバックエンドと新しいIRコンパイラバックエンドとの互換性を提供したいライブラリメンテナの場合、コンパイラの選択に関する設定を使用すると、両方のバックエンド用のアーティファクトを作成できます。これにより、既存のユーザーの互換性を維持しながら、次世代のKotlinコンパイラのサポートを提供できます。
このいわゆる`both`モードは、`gradle.properties`ファイルの`kotlin.js.compiler=both`設定を使用して有効にするか、`build.gradle(.kts)`ファイルの`js`ブロック内のプロジェクト固有のオプションの1つとして設定できます。

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

`both`モードの場合、IRコンパイラバックエンドとデフォルトのコンパイラバックエンドの両方が、ソースからライブラリを構築するときに使用されます（そのため、名前が付けられています）。これは、Kotlin IRを使用した`klib`ファイルと、デフォルトコンパイラ用の`jar`ファイルの両方が生成されることを意味します。同じMaven座標で公開されると、Gradleはユースケースに応じて適切なアーティファクトを自動的に選択します – 古いコンパイラの場合は`js`、新しいコンパイラの場合は`klib`。これにより、2つのコンパイラバックエンドのいずれかを使用しているプロジェクト用にライブラリをコンパイルして公開できます。