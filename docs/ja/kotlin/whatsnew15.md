[//]: # (title: Kotlin 1.5.0の新機能)

_[リリース日: 2021年5月5日](releases.md#release-details)_

Kotlin 1.5.0では、新しい言語機能、安定版のIRベースJVMコンパイラバックエンド、パフォーマンスの改善、および実験的機能の安定化や古い機能の非推奨化といった進化的な変更が導入されました。

変更点の概要は、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)でもご覧いただけます。

## 言語機能

Kotlin 1.5.0では、[1.4.30でプレビューとして発表された](whatsnew1430.md#language-features)新しい言語機能の安定版が提供されます。
* [JVMレコードのサポート](#jvm-records-support)
* [シールドインターフェース](#sealed-interfaces)と[シールドクラスの改善](#package-wide-sealed-class-hierarchies)
* [インラインクラス](#inline-classes)

これらの機能の詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)とKotlinドキュメントの対応するページで確認できます。

### JVMレコードのサポート

Javaは急速に進化しており、KotlinがJavaとの相互運用性を維持できるようにするため、最新機能の1つである[レコードクラス](https://openjdk.java.net/jeps/395)のサポートを導入しました。

KotlinのJVMレコードサポートには、双方向の相互運用性が含まれます。
* Kotlinコードでは、Javaのレコードクラスをプロパティを持つ通常のクラスと同じように使用できます。
* KotlinクラスをJavaコードでレコードとして使用するには、`data`クラスにして`@JvmRecord`アノテーションを付けます。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[KotlinでのJVMレコードの使用について詳しく学ぶ](jvm-records.md)。

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### シールドインターフェース

Kotlinのインターフェースは`sealed`修飾子を持つことができるようになりました。これはクラスと同様にインターフェースに作用し、シールドインターフェースのすべての実装がコンパイル時に既知になります。

```kotlin
sealed interface Polygon
```

その事実を利用して、例えば網羅的な`when`式を書くことができます。

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle -> // ...
   is Triangle -> // ...
   // else is not needed - all possible implementations are covered
}

```

さらに、シールドインターフェースは、1つのクラスが複数のシールドインターフェースを直接継承できるため、より柔軟な制限されたクラス階層を可能にします。

```kotlin
class FilledRectangle: Polygon, Fillable
```

[シールドインターフェースについて詳しく学ぶ](sealed-classes.md)。

<video src="https://www.youtube.com/v/d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### パッケージ全体にわたるシールドクラス階層

シールドクラスは、同じコンパイル単位および同じパッケージ内のすべてのファイルにサブクラスを持つことができるようになりました。以前は、すべてのサブクラスは同じファイル内に存在する必要がありました。

直接のサブクラスは、トップレベルであるか、任意の数の名前付きクラス、名前付きインターフェース、または名前付きオブジェクト内にネストされていても構いません。

シールドクラスのサブクラスは、適切に修飾された名前を持つ必要があります。ローカルオブジェクトや匿名オブジェクトにはできません。

[シールドクラス階層について詳しく学ぶ](sealed-classes.md#inheritance)。

### インラインクラス

インラインクラスは、値のみを保持する[値ベース](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md)クラスのサブセットです。これらは、メモリ割り当てによる追加のオーバーヘッドなしに、特定の型の値のラッパーとして使用できます。

インラインクラスは、クラス名の前に`value`修飾子を付けて宣言できます。

```kotlin
value class Password(val s: String)
```

JVMバックエンドでは、特別な`@JvmInline`アノテーションも必要です。

```kotlin
@JvmInline
value class Password(val s: String)
```

現在、`inline`修飾子は警告とともに非推奨となっています。

[インラインクラスについて詳しく学ぶ](inline-classes.md)。

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVMには、内部およびユーザー向けの改善が多数加えられました。特に注目すべき点を以下に示します。

* [安定版JVM IRバックエンド](#stable-jvm-ir-backend)
* [新しいデフォルトのJVMターゲット: 1.8](#new-default-jvm-target-1-8)
* [invokedynamic経由のSAMアダプター](#sam-adapters-via-invokedynamic)
* [invokedynamic経由のラムダ](#lambdas-via-invokedynamic)
* [@JvmDefault と古い Xjvm-default モードの非推奨化](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [nullabilityアノテーションの処理の改善](#improvements-to-handling-nullability-annotations)

### 安定版JVM IRバックエンド

Kotlin/JVMコンパイラの[IRベースバックエンド](whatsnew14.md#new-jvm-ir-backend)が、[Stable](components-stability.md)となり、デフォルトで有効になりました。

[Kotlin 1.4.0](whatsnew14.md)以降、IRベースのバックエンドの初期バージョンがプレビューとして利用可能でしたが、言語バージョン`1.5`ではデフォルトになりました。古いバックエンドは、以前の言語バージョンでは引き続きデフォルトで使用されます。

IRバックエンドの利点とその将来の開発についての詳細は、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)で確認できます。

Kotlin 1.5.0で古いバックエンドを使用する必要がある場合は、プロジェクトの設定ファイルに以下の行を追加できます。

* Gradleの場合:

 <tabs group="build-script">
 <tab title="Kotlin" group-key="kotlin">

 ```kotlin
 tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
   kotlinOptions.useOldBackend = true
 }
 ```

 </tab>
 <tab title="Groovy" group-key="groovy">

 ```groovy
 tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
  kotlinOptions.useOldBackend = true
 }
 ```

 </tab>
 </tabs>

* Mavenの場合:

 ```xml
 <configuration>
     <args>
         <arg>-Xuse-old-backend</arg>
     </args>
 </configuration>
 ```

### 新しいデフォルトのJVMターゲット: 1.8

Kotlin/JVMコンパイルのデフォルトターゲットバージョンが`1.8`になりました。`1.6`ターゲットは非推奨です。

JVM 1.6用のビルドが必要な場合でも、このターゲットに切り替えることができます。方法はこちらです。

* [in Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
* [in Maven](maven.md#attributes-specific-to-jvm)
* [in the command-line compiler](compiler-reference.md#jvm-target-version)

### invokedynamic経由のSAMアダプター

Kotlin 1.5.0では、SAM (Single Abstract Method) 変換のコンパイルに動的呼び出し (`invokedynamic`) を使用するようになりました。
* SAM型が[Javaインターフェース](java-interop.md#sam-conversions)である場合、任意の式に対して
* SAM型が[Kotlin関数型インターフェース](fun-interfaces.md#sam-conversions)である場合、ラムダに対して

新しい実装では[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)を使用し、コンパイル中に補助的なラッパークラスが生成されなくなりました。これにより、アプリケーションのJARサイズが減少し、JVMの起動パフォーマンスが向上します。

匿名クラス生成に基づく古い実装方式に戻すには、コンパイラオプション`-Xsam-conversions=class`を追加します。

[Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options)、および[コマンドラインコンパイラ](compiler-reference.md#compiler-options)でコンパイラオプションを追加する方法を学びます。

### invokedynamic経由のラムダ

> invokedynamicへのプレーンなKotlinラムダのコンパイルは[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。オプトインが必要であり（詳細は下記参照）、評価目的でのみ使用してください。これに関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-45375)でお寄せいただければ幸いです。
>
{style="warning"}

Kotlin 1.5.0では、プレーンなKotlinラムダ（関数型インターフェースのインスタンスに変換されないもの）を動的呼び出し (`invokedynamic`) にコンパイルする実験的なサポートを導入しています。この実装は、[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)を使用することで、必要なクラスを実行時に効果的に生成し、より軽量なバイナリを生成します。現在、通常のラムダコンパイルと比較して3つの制限があります。

* invokedynamicにコンパイルされたラムダはシリアライズできません。
* そのようなラムダで`toString()`を呼び出すと、可読性の低い文字列表現が生成されます。
* 実験的な[`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) APIは、`LambdaMetafactory`で作成されたラムダをサポートしません。

この機能を試すには、`-Xlambdas=indy`コンパイラオプションを追加してください。この[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-45375)を使用してフィードバックを共有していただけると幸いです。

[Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options)、および[コマンドラインコンパイラ](compiler-reference.md#compiler-options)でコンパイラオプションを追加する方法を学びます。

### @JvmDefault と古い Xjvm-default モードの非推奨化

Kotlin 1.4.0より前は、`-Xjvm-default=enable`および`-Xjvm-default=compatibility`モードとともに`@JvmDefault`アノテーションがありました。これらは、Kotlinインターフェース内の特定の非抽象メンバーに対してJVMデフォルトメソッドを作成するために使用されました。

Kotlin 1.4.0では、プロジェクト全体に対してデフォルトメソッドの生成をオンにする[新しい`Xjvm-default`モードを導入しました](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

Kotlin 1.5.0では、`@JvmDefault`と古いXjvm-defaultモード (`-Xjvm-default=enable`および`-Xjvm-default=compatibility`) を非推奨化しています。

[Java相互運用におけるデフォルトメソッドについて詳しく学ぶ](java-to-kotlin-interop.md#default-methods-in-interfaces)。

### nullabilityアノテーションの処理の改善

Kotlinは、[nullabilityアノテーション](java-interop.md#nullability-annotations)を使用してJavaからの型nullability情報を処理することをサポートしています。Kotlin 1.5.0では、この機能に関していくつかの改善が導入されました。

* 依存関係として使用されるコンパイル済みJavaライブラリの型引数にあるnullabilityアノテーションを読み取ります。
* `TYPE_USE`ターゲットを持つnullabilityアノテーションをサポートします。
  * 配列
  * 可変引数
  * フィールド
  * 型パラメータとその境界
  * 基底クラスとインターフェースの型引数
* nullabilityアノテーションが型に適用可能な複数のターゲットを持ち、そのうちの1つが`TYPE_USE`である場合、`TYPE_USE`が優先されます。例えば、`@Nullable`が`TYPE_USE`と`METHOD`の両方をターゲットとしてサポートしている場合、メソッドシグネチャ`@Nullable String[] f()`は`fun f(): Array<String?>!`になります。

これらの新しくサポートされたケースでは、KotlinからJavaを呼び出す際に誤った型nullabilityを使用すると警告が生成されます。これらのケース（エラーレポートを含む）で厳密モードを有効にするには、`-Xtype-enhancement-improvements-strict-mode`コンパイラオプションを使用します。

[null安全性とプラットフォーム型について詳しく学ぶ](java-interop.md#null-safety-and-platform-types)。

## Kotlin/Native

Kotlin/Nativeは、より高性能で安定したものになりました。主な変更点は以下のとおりです。
* [パフォーマンスの改善](#performance-improvements)
* [メモリリークチェッカーの無効化](#deactivation-of-the-memory-leak-checker)

### パフォーマンスの改善

1.5.0では、Kotlin/Nativeはコンパイルと実行の両方を高速化する一連のパフォーマンス改善を受けています。

[コンパイラキャッシュ](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)が、`linuxX64` (Linuxホストのみ) および`iosArm64`ターゲットのデバッグモードでサポートされるようになりました。コンパイラキャッシュを有効にすると、最初のコンパイルを除いて、ほとんどのデバッグコンパイルがはるかに高速に完了します。測定では、テストプロジェクトで約200%の速度向上が示されました。

新しいターゲットでコンパイラキャッシュを使用するには、プロジェクトの`gradle.properties`に以下の行を追加してオプトインしてください。
* `linuxX64`の場合: `kotlin.native.cacheKind.linuxX64=static`
* `iosArm64`の場合: `kotlin.native.cacheKind.iosArm64=static`

コンパイラキャッシュを有効にした後に問題が発生した場合は、イシュートラッカー[YouTrack](https://kotl.in/issue)までご報告ください。

その他の改善により、Kotlin/Nativeコードの実行が高速化されます。
* 自明なプロパティアクセサーはインライン化されます。
* 文字列リテラルの`trimIndent()`はコンパイル中に評価されます。

### メモリリークチェッカーの無効化

組み込みのKotlin/Nativeメモリリークチェッカーがデフォルトで無効になりました。

これは元々内部使用向けに設計されており、限られた数のケースでのみリークを検出でき、すべてを検出できるわけではありません。さらに、後にアプリケーションのクラッシュを引き起こす可能性のある問題があることが判明しました。そのため、メモリリークチェッカーをオフにすることにしました。

メモリリークチェッカーは、例えばユニットテストなど、特定のケースでは依然として役立ちます。これらのケースでは、以下のコード行を追加することで有効にできます。

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

アプリケーションの実行時にチェッカーを有効にすることは推奨されません。

## Kotlin/JS

Kotlin/JSは1.5.0で進化的な変更を受けています。私たちは[JS IRコンパイラバックエンド](js-ir-compiler.md)の安定化に向けて作業を続けており、その他の更新も提供しています。

* [webpack 5へのアップグレード](#upgrade-to-webpack-5)
* [IRコンパイラ用のフレームワークとライブラリ](#frameworks-and-libraries-for-the-ir-compiler)

### webpack 5へのアップグレード

Kotlin/JS Gradleプラグインは、webpack 4の代わりにwebpack 5をブラウザターゲットに使用するようになりました。これは互換性のない変更をもたらすwebpackのメジャーアップグレードです。カスタムwebpack設定を使用している場合は、必ず[webpack 5リリースノート](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)を確認してください。

[webpackを使用したKotlin/JSプロジェクトのバンドルについて詳しく学ぶ](js-project-setup.md#webpack-bundling)。

### IRコンパイラ用のフレームワークとライブラリ

> Kotlin/JS IRコンパイラは現在[アルファ版](components-stability.md)です。将来的に互換性のない変更があり、手動での移行が必要になる可能性があります。これに関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issues/KT)でお寄せいただければ幸いです。
>
{style="warning"}

Kotlin/JSコンパイラ用のIRベースのバックエンドの開発と並行して、ライブラリの作者がプロジェクトを`both`モードでビルドすることを奨励し、支援しています。これにより、両方のKotlin/JSコンパイラ用のアーティファクトを生成できるようになり、新しいコンパイラのエコシステムが成長します。

多くの有名なフレームワークやライブラリは、すでにIRバックエンドで利用可能です。例: [KVision](https://kvision.io/)、[fritz2](https://www.fritz2.dev/)、[doodle](https://github.com/nacular/doodle)など。プロジェクトでこれらを使用している場合、すでにIRバックエンドでビルドしてその利点を確認できます。

独自のライブラリを作成している場合は、[「両方」モードでコンパイルしてください](js-ir-compiler.md#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。そうすることで、クライアントも新しいコンパイラでそれを使用できるようになります。

## Kotlin Multiplatform

Kotlin 1.5.0では、[各プラットフォームのテスト依存関係の選択が簡素化され](#simplified-test-dependencies-usage-in-multiplatform-projects)、Gradleプラグインによって自動的に行われるようになりました。

[文字カテゴリを取得するための新しいAPIがマルチプラットフォームプロジェクトで利用可能になりました](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)。

## 標準ライブラリ

標準ライブラリには、実験的機能の安定化から新機能の追加まで、さまざまな変更と改善が加えられました。

* [安定版の符号なし整数型](#stable-unsigned-integer-types)
* [テキストの大文字/小文字変換のための安定版ロケール非依存API](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [安定版の文字から整数への変換API](#stable-char-to-integer-conversion-api)
* [安定版Path API](#stable-path-api)
* [切り捨て除算とmod演算子](#floored-division-and-the-mod-operator)
* [Duration APIの変更点](#duration-api-changes)
* [文字カテゴリを取得するための新しいAPIがマルチプラットフォームコードで利用可能に](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [新しいコレクション関数 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean()の厳密版](#strict-version-of-string-toboolean)

標準ライブラリの変更点については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released/)で詳しく学ぶことができます。

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="New Standard Library Features"/>

### 安定版の符号なし整数型

符号なし整数型`UInt`、`ULong`、`UByte`、`UShort`は[Stable](components-stability.md)になりました。これらの型に対する操作、範囲、進行も同様です。符号なし配列とその操作はベータ版のままです。

[符号なし整数型について詳しく学ぶ](unsigned-integer-types.md)。

### テキストの大文字/小文字変換のための安定版ロケール非依存API

このリリースでは、テキストの大文字/小文字変換のための新しいロケール非依存APIが提供されます。これは、ロケールに依存する`toLowerCase()`、`toUpperCase()`、`capitalize()`、および`decapitalize()`API関数の代替を提供します。新しいAPIは、異なるロケール設定によるエラーを回避するのに役立ちます。

Kotlin 1.5.0では、以下の完全に[Stable](components-stability.md)な代替機能が提供されます。

* `String`関数について:

  |**以前のバージョン**|**1.5.0の代替**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* `Char`関数について:

  |**以前のバージョン**|**1.5.0の代替**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> Kotlin/JVMには、明示的な`Locale`パラメータを持つオーバーロードされた`uppercase()`、`lowercase()`、`titlecase()`関数もあります。
>
{style="note"}

古いAPI関数は非推奨としてマークされており、将来のリリースで削除されます。

テキスト処理関数の変更点の全リストは、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions.md)を参照してください。

### 安定版の文字から整数への変換API

Kotlin 1.5.0以降、新しい文字からコードへの変換関数と文字から数字への変換関数が[Stable](components-stability.md)になりました。これらの関数は、類似の文字列からIntへの変換と混同されがちだった現在のAPI関数を置き換えます。

新しいAPIは、この命名の混乱を解消し、コードの振る舞いをより透過的で曖昧さのないものにします。

このリリースでは、明確に名前が付けられた以下の関数のセットに分けられた`Char`変換が導入されます。

* `Char`の整数コードを取得し、与えられたコードから`Char`を構築する関数:

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* `Char`が表す数字の数値に変換する関数:

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* `Int`の拡張関数で、表す非負の単一の数字を対応する`Char`表現に変換します。

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

古い変換API、`Number.toChar()`とその実装（`Int.toChar()`を除くすべて）、および`Char.toInt()`のような数値型への変換のための`Char`拡張は、現在非推奨となっています。

[KEEPでの文字から整数への変換APIについて詳しく学ぶ](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md)。

### 安定版Path API

[`java.nio.file.Path`の拡張機能を持つ実験的なPath API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/)が、[Stable](components-stability.md)になりました。

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[Path APIについて詳しく学ぶ](whatsnew1420.md#extensions-for-java-nio-file-path)。

### 切り捨て除算とmod演算子

標準ライブラリにモジュロ算術のための新しい操作が追加されました。
* `floorDiv()`は、[切り捨て除算](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions)の結果を返します。これは整数型で利用可能です。
* `mod()`は、切り捨て除算の剰余（_モジュラス_）を返します。これはすべての数値型で利用可能です。

これらの操作は既存の[整数除算](numbers.md#operations-on-numbers)および[rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html)関数（または`%`演算子）とよく似ていますが、負の数に対しては動作が異なります。
* `a.floorDiv(b)`は通常の`/`とは異なり、`floorDiv`は結果を切り下げ（より小さい整数方向へ）、`/`は結果を0に近い整数に切り詰めます。
* `a.mod(b)`は`a`と`a.floorDiv(b) * b`の差です。これはゼロであるか、`b`と同じ符号を持ちますが、`a % b`は異なる符号を持つことがあります。

```kotlin
fun main() {
//sampleStart
    println("Floored division -5/3: ${(-5).floorDiv(3)}")
    println( "Modulus: ${(-5).mod(3)}")
    
    println("Truncated division -5/3: ${-5 / 3}")
    println( "Remainder: ${-5 % 3}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### Duration APIの変更点

> Duration APIは[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。評価目的でのみ使用してください。これに関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issues/KT)でお寄せいただければ幸いです。
>
{style="warning"}

異なる時間単位での期間量を表現するための実験的な[Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)クラスがあります。1.5.0では、Duration APIに以下の変更が加えられました。

* 内部値表現が`Double`の代わりに`Long`を使用するようになり、より高い精度を提供します。
* 特定の時間単位への`Long`での変換のための新しいAPIがあります。これは、`Double`値で動作し、現在非推奨となっている古いAPIを置き換えるものです。例えば、[`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html)は期間の値を`Long`として表現したものを返し、`Duration.inMinutes`を置き換えます。
* 数値から`Duration`を構築するための新しいコンパニオン関数があります。例えば、[`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)は整数の秒数を表す`Duration`オブジェクトを作成します。`Int.seconds`のような古い拡張プロパティは現在非推奨となっています。

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")
//sampleEnd
}
```
{validate="false"}

### 文字カテゴリを取得するための新しいAPIがマルチプラットフォームコードで利用可能に

Kotlin 1.5.0では、マルチプラットフォームプロジェクトでUnicodeに従った文字のカテゴリを取得するための新しいAPIが導入されました。いくつかの関数が、すべてのプラットフォームおよび共通コードで利用可能になりました。

文字が文字または数字であるかどうかをチェックする関数:
* [`Char.isDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-digit.html)
* [`Char.isLetter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter.html)
* [`Char.isLetterOrDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter-or-digit.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('a', '1', '+')
    val (letterOrDigitList, notLetterOrDigitList) = chars.partition { it.isLetterOrDigit() }
    println(letterOrDigitList) // [a, 1]
    println(notLetterOrDigitList) // [+]
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

文字のケース（大文字/小文字/タイトルケース）をチェックする関数:
* [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
* [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)
* [`Char.isTitleCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-title-case.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('ǅ', 'ǈ', 'ǋ', 'ǲ', '1', 'A', 'a', '+')
    val (titleCases, notTitleCases) = chars.partition { it.isTitleCase() }
    println(titleCases) // [ǅ, ǈ, ǋ, ǲ]
    println(notTitleCases) // [1, A, a, +]
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

その他の関数:
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

Unicodeに従った文字の一般カテゴリを示すプロパティ[`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html)とその戻り値型であるenumクラス[`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/)も、マルチプラットフォームプロジェクトで利用可能になりました。

[文字について詳しく学ぶ](characters.md)。

### 新しいコレクション関数 firstNotNullOf()

新しい[`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)および[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)関数は、[`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)と[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)または[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)を組み合わせたものです。これらはカスタムセレクター関数で元のコレクションをマッピングし、最初の非null値を返します。そのような値がない場合、`firstNotNullOf()`は例外をスローし、`firstNotNullOfOrNull()`はnullを返します。

```kotlin
fun main() {
//sampleStart
    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### String?.toBoolean()の厳密版

既存の[String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html)のケースセンシティブな厳密版を導入する2つの新しい関数が追加されました。
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html)は、リテラル`true`と`false`以外のすべての入力に対して例外をスローします。
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html)は、リテラル`true`と`false`以外のすべての入力に対してnullを返します。

```kotlin
fun main() {
//sampleStart
    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // Exception
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## kotlin-test ライブラリ
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリにはいくつかの新機能が導入されました。
* [マルチプラットフォームプロジェクトにおけるテスト依存関係の使用の簡素化](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [Kotlin/JVMソースセットのテストフレームワークの自動選択](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [アサーション関数の更新](#assertion-function-updates)

### マルチプラットフォームプロジェクトにおけるテスト依存関係の使用の簡素化

これで、`commonTest`ソースセットにテストのための依存関係を追加するために`kotlin-test`依存関係を使用でき、Gradleプラグインは各テストソースセットに対応するプラットフォーム依存関係を推測します。
* JVMソースセット用の`kotlin-test-junit`。詳細は[Kotlin/JVMソースセットのテストフレームワークの自動選択](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)を参照してください。
* Kotlin/JSソースセット用の`kotlin-test-js`
* 共通ソースセット用の`kotlin-test-common`と`kotlin-test-annotations-common`
* Kotlin/Nativeソースセット用の追加アーティファクトなし

さらに、`kotlin-test`依存関係は、共有またはプラットフォーム固有の任意のソースセットで使用できます。

明示的な依存関係を持つ既存のkotlin-test設定は、GradleとMavenの両方で引き続き機能します。

[テストライブラリの依存関係の設定](gradle-configure-project.md#set-dependencies-on-test-libraries)について詳しく学びます。

### Kotlin/JVMソースセットのテストフレームワークの自動選択

Gradleプラグインがテストフレームワークへの依存関係を自動的に選択し、追加するようになりました。必要なのは、`commonTest`ソースセットに`kotlin-test`依存関係を追加することだけです。

GradleはデフォルトでJUnit 4を使用します。したがって、`kotlin("test")`依存関係はJUnit 4のバリアント、つまり`kotlin-test-junit`に解決されます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // This brings the dependency
                                               // on JUnit 4 transitively
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This brings the dependency 
                                              // on JUnit 4 transitively
            }
        }
    }
}
```

</tab>
</tabs>

テストタスク内で[`useJUnitPlatform()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)または[`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG)を呼び出すことで、JUnit 5またはTestNGを選択できます。

```groovy
tasks {
    test {
        // enable TestNG support
        useTestNG()
        // or
        // enable JUnit Platform (a.k.a. JUnit 5) support
        useJUnitPlatform()
    }
}
```

プロジェクトの`gradle.properties`に`kotlin.test.infer.jvm.variant=false`の行を追加することで、テストフレームワークの自動選択を無効にできます。

[テストライブラリの依存関係の設定](gradle-configure-project.md#set-dependencies-on-test-libraries)について詳しく学びます。

### アサーション関数の更新

このリリースでは、新しいアサーション関数が追加され、既存の関数が改善されました。

現在、`kotlin-test`ライブラリには以下の機能があります。

* **値の型のチェック**

  値の型をチェックするために、新しい`assertIs<T>`と`assertIsNot<T>`を使用できます。

  ```kotlin
  @Test
  fun testFunction() {
      val s: Any = "test"
      assertIs<String>(s)  // throws AssertionError mentioning the actual type of s if the assertion fails
      // can now print s.length because of contract in assertIs
      println("${s.length}")
  }
  ```

  型消去のため、このアサート関数は以下の例で`value`が`List`型であるかどうかのみをチェックし、特定の`String`要素型のリストであるかどうかはチェックしません: `assertIs<List<String>>(value)`。

* **配列、シーケンス、および任意のイテラブルのコンテナコンテンツの比較**

  [構造的同等性](equality.md#structural-equality)を実装していない異なるコレクションのコンテンツを比較するための、新しいオーバーロードされた`assertContentEquals()`関数のセットがあります。

  ```kotlin
  @Test
  fun test() {
      val expectedArray = arrayOf(1, 2, 3)
      val actualArray = Array(3) { it + 1 }
      assertContentEquals(expectedArray, actualArray)
  }
  ```

* **`Double`および`Float`数値のための`assertEquals()`および`assertNotEquals()`の新しいオーバーロード**

  2つの`Double`または`Float`数値を絶対精度で比較できるようにする、`assertEquals()`関数の新しいオーバーロードが追加されました。精度値は関数の3番目のパラメータとして指定されます。

  ```kotlin
   @Test
  fun test() {
      val x = sin(PI)

      // precision parameter
      val tolerance = 0.000001

      assertEquals(0.0, x, tolerance)
  }
  ```

* **コレクションと要素のコンテンツをチェックする新機能**

  コレクションまたは要素が何かを含んでいるかどうかを`assertContains()`関数でチェックできるようになりました。これは、`IntRange`、`String`など、`contains()`演算子を持つKotlinコレクションや要素で使用できます。

  ```kotlin
  @Test
  fun test() {
      val sampleList = listOf<String>("sample", "sample2")
      val sampleString = "sample"
      assertContains(sampleList, sampleString)  // element in collection
      assertContains(sampleString, "amp")       // substring in string
  }
  ```

* **`assertTrue()`、`assertFalse()`、`expect()`関数がインライン化**

  今後、これらをインライン関数として使用できるため、ラムダ式内で[中断関数](composing-suspending-functions.md)を呼び出すことが可能になります。

  ```kotlin
  @Test
  fun test() = runBlocking<Unit> {
      val deferred = async { "Kotlin is nice" }
      assertTrue("Kotlin substring should be present") {
          deferred.await() .contains("Kotlin")
      }
  }
  ```

## kotlinxライブラリ

Kotlin 1.5.0とともに、kotlinxライブラリの新しいバージョンをリリースします。
* `kotlinx.coroutines` [1.5.0-RC](#coroutines-1-5-0-rc)
* `kotlinx.serialization` [1.2.1](#serialization-1-2-1)
* `kotlinx-datetime` [0.2.0](#datetime-0-2-0)

### Coroutines 1.5.0-RC

[`kotlinx.coroutines` 1.5.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC)は以下を提供します。
* [新しいチャネルAPI](channels.md)
* 安定版の[リアクティブ統合](async-programming.md#reactive-extensions)
* その他

Kotlin 1.5.0以降、[実験的なコルーチン](whatsnew14.md#exclusion-of-the-deprecated-experimental-coroutines)は無効になり、`-Xcoroutines=experimental`フラグはサポートされなくなりました。

詳細については、[変更ログ](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC)と[`kotlinx.coroutines` 1.5.0リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/05/kotlin-coroutines-1-5-0-released/)を参照してください。

<video src="https://www.youtube.com/v/EVLnWOcR0is" title="kotlinx.coroutines 1.5.0"/>

### Serialization 1.2.1

[`kotlinx.serialization` 1.2.1](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1)は以下を提供します。
* JSONシリアライズパフォーマンスの改善
* JSONシリアライズにおける複数名のサポート
* `@Serializable`クラスからの実験的な.protoスキーマ生成
* その他

詳細については、[変更ログ](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1)と[`kotlinx.serialization` 1.2.1リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-serialization-1-2-released/)を参照してください。

<video src="https://www.youtube.com/v/698I_AH8h6s" title="kotlinx.serialization 1.2.1"/>

### dateTime 0.2.0

[`kotlinx-datetime` 0.2.0](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0)は以下を提供します。
* `@Serializable`なDatetimeオブジェクト
* `DateTimePeriod`と`DatePeriod`の正規化されたAPI
* その他

詳細については、[変更ログ](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0)と[`kotlinx-datetime` 0.2.0リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-datetime-0-2-0-is-out/)を参照してください。

## Kotlin 1.5.0への移行

IntelliJ IDEAとAndroid Studioは、Kotlinプラグインが利用可能になり次第、1.5.0への更新を提案します。

既存のプロジェクトをKotlin 1.5.0に移行するには、Kotlinのバージョンを`1.5.0`に変更し、GradleまたはMavenプロジェクトを再インポートするだけです。[Kotlin 1.5.0への更新方法について学ぶ](releases.md#update-to-a-new-kotlin-version)。

Kotlin 1.5.0で新しいプロジェクトを開始するには、Kotlinプラグインを更新し、**File** | **New** | **Project** からプロジェクトウィザードを実行します。

新しいコマンドラインコンパイラは、[GitHubのリリース](https://github.com/JetBrains/kotlin/releases/tag/v1.5.0)ページからダウンロードできます。

Kotlin 1.5.0は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であり、そのため言語に互換性のない変更をもたらす可能性があります。そのような変更の詳細なリストは、[Kotlin 1.5互換性ガイド](compatibility-guide-15.md)にあります。