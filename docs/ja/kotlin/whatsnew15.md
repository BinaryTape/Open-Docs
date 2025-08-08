[//]: # (title: Kotlin 1.5.0の新機能)

_[リリース日: 2021年5月5日](releases.md#release-details)_

Kotlin 1.5.0では、新しい言語機能、安定版のIRベースJVMコンパイラーバックエンド、パフォーマンス改善、
そして実験的機能の安定化や非推奨化といった進化的な変更が導入されています。

変更点の概要については、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)でも確認できます。

## 言語機能

Kotlin 1.5.0では、[1.4.30でプレビュー版](whatsnew1430.md#language-features)として提供された新しい言語機能の安定版が導入されました。
* [JVMレコードのサポート](#jvm-records-support)
* [Sealedインターフェース](#sealed-interfaces)と[Sealedクラスの改善](#package-wide-sealed-class-hierarchies)
* [インラインクラス](#inline-classes)

これらの機能の詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)と、
Kotlinドキュメントの対応するページで確認できます。

### JVMレコードのサポート

Javaは急速に進化しており、Kotlinとの相互運用性を確保するため、その最新機能の1つである
[レコードクラス](https://openjdk.java.net/jeps/395)のサポートが導入されました。

KotlinのJVMレコードサポートには、双方向の相互運用性が含まれます。
* Kotlinコードでは、Javaのレコードクラスを通常のプロパティを持つクラスと同じように使用できます。
* KotlinクラスをJavaコードでレコードとして使用するには、`data`クラスにして`@JvmRecord`アノテーションを付与します。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[KotlinでJVMレコードを使用する方法の詳細](jvm-records.md)をご覧ください。

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### Sealedインターフェース

Kotlinインターフェースで`sealed`修飾子を使用できるようになりました。これはクラスの場合と同様にインターフェースに適用されます。
sealedインターフェースのすべての実装はコンパイル時に認識されます。

```kotlin
sealed interface Polygon
```

この事実を利用して、例えば、網羅的な`when`式を記述できます。

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle -> // ...
   is Triangle -> // ...
   // else is not needed - all possible implementations are covered
}

```

さらに、sealedインターフェースは、クラスが複数のsealedインターフェースを直接継承できるため、より柔軟な制限されたクラス階層を可能にします。

```kotlin
class FilledRectangle: Polygon, Fillable
```

[sealedインターフェースの詳細](sealed-classes.md)をご覧ください。

<video src="https://www.youtube.com/v/d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### パッケージ全体にわたるSealedクラスの階層

Sealedクラスは、同じコンパイルユニットおよび同じパッケージ内のすべてのファイルにサブクラスを持つことができるようになりました。
以前は、すべてのサブクラスが同じファイル内に存在する必要がありました。

直接のサブクラスは、トップレベル、または任意の数の他の名前付きクラス、名前付きインターフェース、または名前付きオブジェクト内にネストされたものでも構いません。

Sealedクラスのサブクラスは、適切に修飾された名前を持たなければなりません。ローカルオブジェクトまたは匿名オブジェクトにすることはできません。

[Sealedクラスの階層の詳細](sealed-classes.md#inheritance)をご覧ください。

### インラインクラス

インラインクラスは、値のみを保持する[値ベース](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md)クラスのサブセットです。
特定の型の値のラッパーとして使用でき、メモリ割り当てから生じる追加のオーバーヘッドを伴いません。

インラインクラスは、クラス名の前に`value`修飾子を付けて宣言できます。

```kotlin
value class Password(val s: String)
```

JVMバックエンドは、特別な`@JvmInline`アノテーションも必要とします。

```kotlin
@JvmInline
value class Password(val s: String)
```

`inline`修飾子は警告付きで非推奨になりました。

[インラインクラスの詳細](inline-classes.md)をご覧ください。

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVMは、内部およびユーザー向けの双方でいくつかの改善が行われました。その中でも特に注目すべき点は次のとおりです。

* [JVM IRバックエンドの安定化](#stable-jvm-ir-backend)
* [新しいデフォルトJVMターゲット: 1.8](#new-default-jvm-target-1-8)
* [invokedynamic経由のSAMアダプター](#sam-adapters-via-invokedynamic)
* [invokedynamic経由のラムダ](#lambdas-via-invokedynamic)
* [@JvmDefaultおよび古いXjvm-defaultモードの非推奨化](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [null許容アノテーションの取り扱い改善](#improvements-to-handling-nullability-annotations)

### JVM IRバックエンドの安定化

Kotlin/JVMコンパイラー用の[IRベースのバックエンド](whatsnew14.md#new-jvm-ir-backend)が[安定版](components-stability.md)となり、デフォルトで有効になりました。

[Kotlin 1.4.0](whatsnew14.md)以降、IRベースのバックエンドの早期バージョンがプレビュー版として利用可能でしたが、
`1.5`言語バージョンではデフォルトとなりました。古いバックエンドは、以前の言語バージョンでは引き続きデフォルトで使用されます。

IRバックエンドの利点とその将来の開発については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)で詳しく説明されています。

Kotlin 1.5.0で古いバックエンドを使用する必要がある場合は、プロジェクトの構成ファイルに次の行を追加します。

* Gradleの場合：

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

* Mavenの場合：

 ```xml
 <configuration>
     <args>
         <arg>-Xuse-old-backend</arg>
     </args>
 </configuration>
 ```

### 新しいデフォルトJVMターゲット: 1.8

Kotlin/JVMコンパイルのデフォルトターゲットバージョンが`1.8`になりました。`1.6`ターゲットは非推奨です。

JVM 1.6用のビルドが必要な場合は、このターゲットに切り替えることができます。方法については以下をご覧ください。

* [Gradleの場合](gradle-compiler-options.md#attributes-specific-to-jvm)
* [Mavenの場合](maven.md#attributes-specific-to-jvm)
* [コマンドラインコンパイラーの場合](compiler-reference.md#jvm-target-version)

### invokedynamic経由のSAMアダプター

Kotlin 1.5.0では、SAM (Single Abstract Method) 変換のコンパイルに動的呼び出し (`invokedynamic`) を使用するようになりました。
* SAM型が[Javaインターフェース](java-interop.md#sam-conversions)の場合、あらゆる式に対して適用されます。
* SAM型が[Kotlin関数型インターフェース](fun-interfaces.md#sam-conversions)の場合、ラムダに対して適用されます。

新しい実装では[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)を使用し、
コンパイル時に補助ラッパークラスが生成されなくなりました。これにより、アプリケーションのJARサイズが減少し、JVMの起動パフォーマンスが向上します。

匿名クラス生成に基づく古い実装スキームに戻すには、コンパイラーオプション`-Xsam-conversions=class`を追加します。

コンパイラーオプションの追加方法については、[Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options)、
および[コマンドラインコンパイラー](compiler-reference.md#compiler-options)をご覧ください。

### invokedynamic経由のラムダ

> 純粋なKotlinラムダをinvokedynamicにコンパイルする機能は[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> オプトインが必要です（詳細については下記参照）。評価目的のみにご利用ください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-45375)にてフィードバックをお寄せいただけると幸いです。
>
{style="warning"}

Kotlin 1.5.0では、純粋なKotlinラムダ（関数型インターフェースのインスタンスに変換されないもの）を動的呼び出し (`invokedynamic`) にコンパイルする実験的なサポートを導入しています。
この実装は、[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)を使用することでより軽量なバイナリを生成し、
実行時に必要なクラスを効果的に生成します。現在、通常のラムダコンパイルと比較して3つの制限があります。

* invokedynamicにコンパイルされたラムダはシリアライズできません。
* そのようなラムダに対して`toString()`を呼び出すと、読み取りにくい文字列表現が生成されます。
* 実験的な[`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) APIは、`LambdaMetafactory`で作成されたラムダをサポートしていません。

この機能を試すには、コンパイラーオプション`-Xlambdas=indy`を追加してください。
[このYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-45375)を使用して、フィードバックを共有していただけると幸いです。

コンパイラーオプションの追加方法については、[Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options)、
および[コマンドラインコンパイラー](compiler-reference.md#compiler-options)をご覧ください。

### @JvmDefaultおよび古いXjvm-defaultモードの非推奨化

Kotlin 1.4.0より前は、`@JvmDefault`アノテーションと`-Xjvm-default=enable`および`-Xjvm-default=compatibility`モードがありました。
これらはKotlinインターフェース内の特定の非抽象メンバーに対してJVMデフォルトメソッドを作成するために使用されました。

Kotlin 1.4.0では、プロジェクト全体でデフォルトメソッドの生成を切り替える[新しい`Xjvm-default`モードを導入しました](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

Kotlin 1.5.0では、`@JvmDefault`と古いXjvm-defaultモード（`-Xjvm-default=enable`および`-Xjvm-default=compatibility`）を非推奨化します。

[Javaとの相互運用におけるデフォルトメソッドの詳細](java-to-kotlin-interop.md#default-methods-in-interfaces)をご覧ください。

### null許容アノテーションの取り扱い改善

Kotlinは、[null許容アノテーション](java-interop.md#nullability-annotations)を使用してJavaからの型のnull許容情報を処理することをサポートしています。
Kotlin 1.5.0では、この機能に関していくつかの改善が導入されています。

* 依存関係として使用されるコンパイル済みJavaライブラリの型引数上のnull許容アノテーションを読み取ります。
* `TYPE_USE`ターゲットを持つnull許容アノテーションを以下のケースでサポートします。
  * 配列
  * 可変引数 (Varargs)
  * フィールド
  * 型パラメーターとそのバウンド
  * 基底クラスとインターフェースの型引数
* null許容アノテーションが型に適用可能な複数のターゲットを持ち、そのうちの1つが`TYPE_USE`の場合、`TYPE_USE`が優先されます。
  例えば、`@Nullable`が`TYPE_USE`と`METHOD`の両方をターゲットとしてサポートしている場合、メソッドシグネチャ`@Nullable String[] f()`は`fun f(): Array<String?>!`となります。

これらの新しくサポートされたケースでは、KotlinからJavaを呼び出す際に誤った型null許容を使用すると警告が表示されます。
これらのケースで厳格モード（エラー報告付き）を有効にするには、コンパイラーオプション`-Xtype-enhancement-improvements-strict-mode`を使用します。

[null安全性とプラットフォーム型の詳細](java-interop.md#null-safety-and-platform-types)をご覧ください。

## Kotlin/Native

Kotlin/Nativeは、より高いパフォーマンスと安定性を実現しました。主な変更点は次のとおりです。
* [パフォーマンスの改善](#performance-improvements)
* [メモリリークチェッカーの無効化](#deactivation-of-the-memory-leak-checker)

### パフォーマンスの改善

1.5.0では、Kotlin/Nativeはコンパイルと実行の両方を高速化する一連のパフォーマンス改善が施されています。

[コンパイラーキャッシュ](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)が、
`linuxX64`（Linuxホストのみ）と`iosArm64`ターゲットのデバッグモードでサポートされるようになりました。
コンパイラーキャッシュを有効にすると、最初のコンパイルを除き、ほとんどのデバッグコンパイルが大幅に高速化されます。
測定では、テストプロジェクトで約200%の速度向上が示されました。

新しいターゲットでコンパイラーキャッシュを使用するには、プロジェクトの`gradle.properties`に以下の行を追加してオプトインします。
* `linuxX64`の場合: `kotlin.native.cacheKind.linuxX64=static`
* `iosArm64`の場合: `kotlin.native.cacheKind.iosArm64=static`

コンパイラーキャッシュを有効にした後に問題が発生した場合は、弊社の課題トラッカーである[YouTrack](https://kotl.in/issue)までご報告ください。

その他の改善により、Kotlin/Nativeコードの実行が高速化されます。
* 自明なプロパティアクセサーがインライン化されます。
* 文字列リテラル上の`trimIndent()`がコンパイル時に評価されます。

### メモリリークチェッカーの無効化

組み込みのKotlin/Nativeメモリリークチェッカーがデフォルトで無効になりました。

これは元々内部使用向けに設計されており、限られたケースでしかリークを発見できず、すべてのケースには対応していませんでした。
さらに、後にアプリケーションのクラッシュを引き起こす可能性のある問題があることが判明しました。
そのため、メモリリークチェッカーをオフにすることにしました。

メモリリークチェッカーは、例えば単体テストのような特定のケースでは依然として役立ちます。
これらのケースでは、次のコード行を追加することで有効にできます。

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

アプリケーションのランタイムでチェッカーを有効にすることは推奨されません。

## Kotlin/JS

Kotlin/JSは1.5.0で進化的な変更を受けています。[JS IRコンパイラーバックエンド](js-ir-compiler.md)を安定版に移行する作業を継続し、
その他の更新も出荷しています。

* [webpackバージョン5へのアップグレード](#upgrade-to-webpack-5)
* [IRコンパイラー向けフレームワークとライブラリ](#frameworks-and-libraries-for-the-ir-compiler)

### webpackバージョン5へのアップグレード

Kotlin/JS Gradleプラグインは、ブラウザターゲットにwebpack 4の代わりにwebpack 5を使用するようになりました。
これは互換性のない変更をもたらす主要なwebpackアップグレードです。
カスタムwebpack設定を使用している場合は、[webpack 5のリリースノート](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)を必ず確認してください。

[webpackを使用したKotlin/JSプロジェクトのバンドルに関する詳細](js-project-setup.md#webpack-bundling)をご覧ください。

### IRコンパイラー向けフレームワークとライブラリ

> Kotlin/JS IRコンパイラーは[アルファ版](components-stability.md)です。将来的に互換性のない変更があり、手動での移行が必要になる場合があります。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せいただけると幸いです。
>
{style="warning"}

Kotlin/JSコンパイラーのIRベースのバックエンドに取り組むとともに、ライブラリ作者が`both`モードでプロジェクトを構築することを推奨し、支援しています。
これにより、両方のKotlin/JSコンパイラー向けに成果物を生成できるようになり、新しいコンパイラーのエコシステムが成長します。

多くの有名なフレームワークやライブラリがすでにIRバックエンドで利用可能です。
[KVision](https://kvision.io/)、[fritz2](https://www.fritz2.dev/)、[doodle](https://github.com/nacular/doodle)などです。
プロジェクトでこれらを使用している場合は、すでにIRバックエンドでビルドを行い、その利点を確認できます。

独自のライブラリを作成している場合は、[「both」モードでコンパイルします](js-ir-compiler.md#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。
これにより、クライアントも新しいコンパイラーでそれを使用できるようになります。

## Kotlinマルチプラットフォーム

Kotlin 1.5.0では、[各プラットフォームのテスト依存関係の選択が簡素化され](#simplified-test-dependencies-usage-in-multiplatform-projects)、
Gradleプラグインによって自動的に行われるようになりました。

[マルチプラットフォームコードで文字カテゴリを取得するための新しいAPI](new-api-for-getting-a-char-category-now-available-in-multiplatform-code)が利用可能になりました。

## 標準ライブラリ

標準ライブラリは、実験的機能の安定化から新機能の追加まで、幅広い変更と改善を受けています。

* [符号なし整数型の安定化](#stable-unsigned-integer-types)
* [ロケール非依存の文字列大小文字変換APIの安定化](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [Charから整数への変換APIの安定化](#stable-char-to-integer-conversion-api)
* [Path APIの安定化](#stable-path-api)
* [切り捨て除算とmod演算子](#floored-division-and-the-mod-operator)
* [Duration APIの変更点](#duration-api-changes)
* [マルチプラットフォームコードで文字カテゴリ取得のための新しいAPIが利用可能に](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [新しいコレクション関数 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean()の厳格版](#strict-version-of-string-toboolean)

標準ライブラリの変更点の詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released/)をご覧ください。

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="New Standard Library Features"/>

### 符号なし整数型の安定化

`UInt`、`ULong`、`UByte`、`UShort`の符号なし整数型が[安定版](components-stability.md)になりました。
これらの型に対する演算、それらの範囲、およびプログレッションについても同様です。符号なし配列とその演算はベータ版のままです。

[符号なし整数型の詳細](unsigned-integer-types.md)をご覧ください。

### ロケール非依存の文字列大小文字変換APIの安定化

このリリースでは、文字列の大小文字変換のための新しいロケール非依存APIが導入されました。
これは、ロケールに依存する`toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API関数の代替を提供します。
新しいAPIは、異なるロケール設定によるエラーを回避するのに役立ちます。

Kotlin 1.5.0では、以下の完全に[安定版](components-stability.md)の代替機能が提供されます。

* `String`関数について：

  |**以前のバージョン**|**1.5.0の代替**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* `Char`関数について：

  |**以前のバージョン**|**1.5.0の代替**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> Kotlin/JVMの場合、明示的な`Locale`パラメーターを持つオーバーロードされた`uppercase()`、`lowercase()`、`titlecase()`関数も利用できます。
>
{style="note"}

古いAPI関数は非推奨としてマークされており、将来のリリースで削除される予定です。

テキスト処理関数の変更点の全リストについては、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions.md)をご覧ください。

### Charから整数への変換APIの安定化

Kotlin 1.5.0以降、新しい文字からコードへの変換関数と文字から数字への変換関数が[安定版](components-stability.md)になりました。
これらの関数は、類似の文字列からIntへの変換と混同されがちだった現在のAPI関数に代わるものです。

新しいAPIは、この命名の混乱を取り除き、コードの動作をより透過的かつ明確にします。

このリリースでは、明確に命名された以下の関数群に分けられた`Char`変換が導入されます。

* `Char`の整数コードを取得し、指定されたコードから`Char`を構築する関数:

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* `Char`をそれが表す数字の数値に変換する関数:

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* 負でない単一の数字を表す`Int`を対応する`Char`表現に変換するための拡張関数:

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

`Number.toChar()`の実装（`Int.toChar()`を除くすべて）と`Char`の数値型への変換拡張（例: `Char.toInt()`）を含む古い変換APIは、現在非推奨です。

[Charから整数への変換APIの詳細については、KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md)をご覧ください。

### Path APIの安定化

`java.nio.file.Path`の拡張機能を持つ[実験的なPath API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/)が[安定版](components-stability.md)になりました。

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[Path APIの詳細](whatsnew1420.md#extensions-for-java-nio-file-path)をご覧ください。

### 切り捨て除算とmod演算子

標準ライブラリに、モジュラー算術の新しい操作が追加されました。
* `floorDiv()`は、[切り捨て除算](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions)の結果を返します。これは整数型で利用可能です。
* `mod()`は、切り捨て除算の剰余（_modulus_）を返します。これはすべての数値型で利用可能です。

これらの操作は、既存の[整数の除算](numbers.md#operations-on-numbers)および[rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html)関数（または`%`演算子）とよく似ていますが、負の数に対する動作が異なります。
* `a.floorDiv(b)`は、通常の`/`とは異なり、結果を切り捨て（より小さい整数の方に丸める）ますが、`/`は結果を0に近い整数に丸めます。
* `a.mod(b)`は、`a`と`a.floorDiv(b) * b`の差です。これはゼロであるか、`b`と同じ符号を持ちますが、`a % b`は異なる符号を持つことがあります。

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

> Duration APIは[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> 評価目的のみにご利用ください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)にてフィードバックをお寄せいただけると幸いです。
>
{style="warning"}

異なる時間単位で期間量を表す実験的な[Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)クラスがあります。
1.5.0では、Duration APIに以下の変更が加えられました。

* 内部値表現が`Double`から`Long`を使用するようになり、精度が向上しました。
* 特定の時間単位への`Long`での変換のための新しいAPIが追加されました。これは、`Double`値で操作する古いAPIに代わるもので、古いAPIは現在非推奨です。
  例えば、[`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html)は、期間の値を`Long`として返し、`Duration.inMinutes`に代わります。
* 数値から`Duration`を構築するための新しいコンパニオン関数が追加されました。例えば、[`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)は、秒の整数値を表す`Duration`オブジェクトを作成します。
  `Int.seconds`のような古い拡張プロパティは現在非推奨です。

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

### マルチプラットフォームコードで文字カテゴリ取得のための新しいAPIが利用可能に

Kotlin 1.5.0では、Unicodeに従って文字のカテゴリを取得するための新しいAPIがマルチプラットフォームプロジェクトに導入されました。
いくつかの関数が、すべてのプラットフォームと共通コードで利用可能になりました。

文字が文字または数字であるかをチェックする関数：
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

文字のケースをチェックする関数：
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

その他の関数：
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

[`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html)プロパティと、
Unicodeに従った文字の一般的なカテゴリを示すその戻り値のEnumクラス[`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/)も、
マルチプラットフォームプロジェクトで利用できるようになりました。

[文字の詳細](characters.md)をご覧ください。

### 新しいコレクション関数 firstNotNullOf()

新しい[`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)と[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)関数は、
[`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)と[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)または[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)を組み合わせたものです。
これらはカスタムセレクター関数を使用して元のコレクションをマップし、最初の非null値を返します。そのような値がない場合、
`firstNotNullOf()`は例外をスローし、`firstNotNullOfOrNull()`はnullを返します。

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

### String?.toBoolean()の厳格版

既存の[String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html)の
大文字小文字を区別する厳格版として、2つの新しい関数が導入されました。
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

## kotlin-testライブラリ
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリにはいくつかの新機能が導入されています。
* [マルチプラットフォームプロジェクトでのテスト依存関係の利用簡素化](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [Kotlin/JVMソースセット向けのテストフレームワークの自動選択](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [アサーション関数の更新](#assertion-function-updates)

### マルチプラットフォームプロジェクトでのテスト依存関係の利用簡素化

`kotlin-test`依存関係を使用して`commonTest`ソースセットにテストの依存関係を追加できるようになりました。
Gradleプラグインは、各テストソースセットに対応するプラットフォーム依存関係を推測します。
* JVMソースセットの場合は`kotlin-test-junit`。[Kotlin/JVMソースセット向けのテストフレームワークの自動選択](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)を参照してください。
* Kotlin/JSソースセットの場合は`kotlin-test-js`
* 共通ソースセットの場合は`kotlin-test-common`と`kotlin-test-annotations-common`
* Kotlin/Nativeソースセットの場合は追加のアーティファクトなし

さらに、`kotlin-test`依存関係は、任意の共有またはプラットフォーム固有のソースセットで使用できます。

明示的な依存関係を持つ既存のkotlin-test設定は、GradleとMavenの両方で引き続き機能します。

[テストライブラリの依存関係の設定に関する詳細](gradle-configure-project.md#set-dependencies-on-test-libraries)をご覧ください。

### Kotlin/JVMソースセット向けのテストフレームワークの自動選択

Gradleプラグインは、テストフレームワークの依存関係を自動的に選択して追加するようになりました。
`commonTest`ソースセットに`kotlin-test`依存関係を追加するだけで済みます。

GradleはデフォルトでJUnit 4を使用します。したがって、`kotlin("test")`依存関係はJUnit 4のバリアント、
つまり`kotlin-test-junit`として解決されます。

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

[`useJUnitPlatform()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)または
[`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG)をテストタスクで呼び出すことで、
JUnit 5またはTestNGを選択できます。

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

プロジェクトの`gradle.properties`に`kotlin.test.infer.jvm.variant=false`という行を追加することで、
テストフレームワークの自動選択を無効にできます。

[テストライブラリの依存関係の設定に関する詳細](gradle-configure-project.md#set-dependencies-on-test-libraries)をご覧ください。

### アサーション関数の更新

このリリースでは、新しいアサーション関数が追加され、既存のものが改善されました。

`kotlin-test`ライブラリには、以下の機能が追加されました。

* **値の型のチェック**

  新しい`assertIs<T>`および`assertIsNot<T>`を使用して、値の型をチェックできます。

  ```kotlin
  @Test
  fun testFunction() {
      val s: Any = "test"
      assertIs<String>(s)  // throws AssertionError mentioning the actual type of s if the assertion fails
      // can now print s.length because of contract in assertIs
      println("${s.length}")
  }
  ```

  型消去のため、このアサート関数は次の例では`value`が`List`型であることのみをチェックし、特定の`String`要素型のリストであるかはチェックしません: `assertIs<List<String>>(value)`。

* **配列、シーケンス、任意のイテラブルのコンテナ内容の比較**

  [構造的同等性](equality.md#structural-equality)を実装しないさまざまなコレクションのコンテンツを比較するための、オーバーロードされた`assertContentEquals()`関数が新しく追加されました。

  ```kotlin
  @Test
  fun test() {
      val expectedArray = arrayOf(1, 2, 3)
      val actualArray = Array(3) { it + 1 }
      assertContentEquals(expectedArray, actualArray)
  }
  ```

* **`Double`および`Float`数値に対する`assertEquals()`および`assertNotEquals()`の新しいオーバーロード**

  2つの`Double`または`Float`数値を絶対精度で比較できるようにする`assertEquals()`関数の新しいオーバーロードが追加されました。
  精度値は関数の3番目のパラメーターとして指定されます。

  ```kotlin
   @Test
  fun test() {
      val x = sin(PI)

      // precision parameter
      val tolerance = 0.000001

      assertEquals(0.0, x, tolerance)
  }
  ```

* **コレクションと要素の内容をチェックするための新しい関数**

  `assertContains()`関数を使用して、コレクションまたは要素が何かを含んでいるかをチェックできるようになりました。
  これはKotlinコレクション、および`IntRange`、`String`などの`contains()`演算子を持つ要素で使用できます。

  ```kotlin
  @Test
  fun test() {
      val sampleList = listOf<String>("sample", "sample2")
      val sampleString = "sample"
      assertContains(sampleList, sampleString)  // element in collection
      assertContains(sampleString, "amp")       // substring in string
  }
  ```

* **`assertTrue()`、`assertFalse()`、`expect()`関数がインラインになりました**

  これらの関数はインライン関数として使用できるようになり、ラムダ式内で[サスペンド関数](composing-suspending-functions.md)を呼び出すことが可能になりました。

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

Kotlin 1.5.0とともに、kotlinxライブラリの新しいバージョンがリリースされます。
* `kotlinx.coroutines` [1.5.0-RC](#coroutines-1-5-0-rc)
* `kotlinx.serialization` [1.2.1](#serialization-1-2-1)
* `kotlinx-datetime` [0.2.0](#datetime-0-2-0)

### Coroutines 1.5.0-RC

`kotlinx.coroutines` [1.5.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC)には以下が含まれています。
* [新しいチャネルAPI](channels.md)
* 安定版の[リアクティブ統合](async-programming.md#reactive-extensions)
* その他

Kotlin 1.5.0以降、[実験的コルーチン](whatsnew14.md#exclusion-of-the-deprecated-experimental-coroutines)は無効になり、
`-Xcoroutines=experimental`フラグはサポートされなくなります。

詳細については、[変更履歴](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC)と
[`kotlinx.coroutines` 1.5.0リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/05/kotlin-coroutines-1-5-0-released/)をご覧ください。

<video src="https://www.youtube.com/v/EVLnWOcR0is" title="kotlinx.coroutines 1.5.0"/>

### Serialization 1.2.1

`kotlinx.serialization` [1.2.1](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1)には以下が含まれています。
* JSONシリアライズ性能の改善
* JSONシリアライズにおける複数名のサポート
* `@Serializable`クラスからの実験的な.protoスキーマ生成
* その他

詳細については、[変更履歴](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1)と
[`kotlinx.serialization` 1.2.1リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-serialization-1-2-released/)をご覧ください。

<video src="https://www.youtube.com/v/698I_AH8h6s" title="kotlinx.serialization 1.2.1"/>

### dateTime 0.2.0

`kotlinx-datetime` [0.2.0](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0)には以下が含まれています。
* `@Serializable`なDatetimeオブジェクト
* `DateTimePeriod`および`DatePeriod`の正規化されたAPI
* その他

詳細については、[変更履歴](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0)と
[`kotlinx-datetime` 0.2.0リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-datetime-0-2-0-is-out/)をご覧ください。

## Kotlin 1.5.0への移行

IntelliJ IDEAとAndroid Studioは、Kotlinプラグインが利用可能になり次第、1.5.0への更新を提案します。

既存のプロジェクトをKotlin 1.5.0に移行するには、Kotlinバージョンを`1.5.0`に変更し、GradleまたはMavenプロジェクトを再インポートするだけです。
[Kotlin 1.5.0への更新方法](releases.md#update-to-a-new-kotlin-version)をご覧ください。

Kotlin 1.5.0で新しいプロジェクトを開始するには、Kotlinプラグインを更新し、**File** | **New** | **Project**からプロジェクトウィザードを実行します。

新しいコマンドラインコンパイラーは、[GitHubリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.5.0)からダウンロードできます。

Kotlin 1.5.0は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であり、
言語に互換性のない変更をもたらす可能性があります。
これらの変更点の詳細なリストは、[Kotlin 1.5互換性ガイド](compatibility-guide-15.md)で確認できます。