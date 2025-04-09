---
title: "Kotlin 1.5.0 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[リリース: 2021年5月5日](releases#release-details)_

Kotlin 1.5.0では、新しい言語機能、安定版のIRベースのJVMコンパイラバックエンド、パフォーマンスの改善、そして実験的機能の安定化や旧式の機能の廃止など、進化的な変更が導入されています。

変更点の概要は、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)でも確認できます。

## 言語機能

Kotlin 1.5.0では、[1.4.30のプレビュー](whatsnew1430#language-features)で紹介された新しい言語機能の安定版が導入されました。
* [JVM records のサポート](#jvm-records-support)
* [Sealed interfaces](#sealed-interfaces) と [sealed class の改善](#package-wide-sealed-class-hierarchies)
* [Inline classes](#inline-classes)

これらの機能の詳細な説明は、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)とKotlinドキュメントの対応するページで確認できます。

### JVM records のサポート

Javaは急速に進化しており、KotlinがJavaとの相互運用性を維持できるように、最新機能の1つである[record classes](https://openjdk.java.net/jeps/395)のサポートを導入しました。

KotlinのJVM recordsのサポートには、双方向の相互運用性が含まれます。
* Kotlinコードでは、Javaのrecord classesをプロパティを持つ通常のクラスのように使用できます。
* KotlinクラスをJavaコードでrecordとして使用するには、`data`クラスにして`@JvmRecord`アノテーションを付けます。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[KotlinでのJVM recordsの使用に関する詳細はこちら](jvm-records)。

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### Sealed interfaces

Kotlinのインターフェースは、`sealed`修飾子を持つことができるようになりました。これは、クラスの場合と同じようにインターフェースで機能します。sealed interfaceのすべての実装は、コンパイル時に認識されます。

```kotlin
sealed interface Polygon
```

たとえば、この事実を利用して、網羅的な`when`式を記述できます。

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle `->` // ...
   is Triangle `->` // ...
   // else は不要です - 考えられるすべての実装が網羅されています
}

```

さらに、sealed interfacesを使用すると、クラスは複数のsealed interfaceを直接継承できるため、より柔軟な制限付きクラス階層が可能になります。

```kotlin
class FilledRectangle: Polygon, Fillable
```

[sealed interfacesの詳細はこちら](sealed-classes)。

<video src="https://www.youtube.com/v/d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### パッケージ全体の sealed class 階層

Sealed classesは、同じコンパイルユニットおよび同じパッケージのすべてのファイルにサブクラスを持つことができるようになりました。以前は、すべてのサブクラスが同じファイルに存在する必要がありました。

直接のサブクラスは、トップレベルにすることも、他の名前付きクラス、名前付きインターフェース、または名前付きオブジェクト内にネストすることもできます。

Sealed classのサブクラスは、適切に修飾された名前を持っている必要があります。ローカルオブジェクトまたは匿名オブジェクトにすることはできません。

[sealed class 階層の詳細はこちら](sealed-classes#inheritance)。

### Inline classes

Inline classesは、値を保持するだけの[value-based](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes)クラスのサブセットです。メモリ割り当ての使用による追加のオーバーヘッドなしに、特定の型の値のラッパーとして使用できます。

Inline classesは、クラス名の前に`value`修飾子を付けて宣言できます。

```kotlin
value class Password(val s: String)
```

JVMバックエンドでは、特別な`@JvmInline`アノテーションも必要です。

```kotlin
@JvmInline
value class Password(val s: String)
```

`inline`修飾子は、現在警告付きで非推奨となっています。

[Inline classesの詳細はこちら](inline-classes)。

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVMは、内部的にもユーザー向けにも、いくつかの改善が加えられています。その中で最も注目すべき点は次のとおりです。

* [安定版のJVM IRバックエンド](#stable-jvm-ir-backend)
* [新しいデフォルトのJVMターゲット: 1.8](#new-default-jvm-target-1-8)
* [invokedynamicを介したSAMアダプター](#sam-adapters-via-invokedynamic)
* [invokedynamicを介したラムダ](#lambdas-via-invokedynamic)
* [@JvmDefaultおよび古いXjvm-defaultモードの非推奨](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [nullabilityアノテーションの処理の改善](#improvements-to-handling-nullability-annotations)

### 安定版のJVM IRバックエンド

Kotlin/JVMコンパイラー用の[IRベースのバックエンド](whatsnew14#new-jvm-ir-backend)が[安定版](components-stability)になり、デフォルトで有効になっています。

[Kotlin 1.4.0](whatsnew14)以降、IRベースのバックエンドの初期バージョンがプレビューで利用可能になり、言語バージョン`1.5`のデフォルトになりました。古いバックエンドは、以前の言語バージョンでは引き続きデフォルトで使用されます。

IRバックエンドの利点とその将来の開発の詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)をご覧ください。

Kotlin 1.5.0で古いバックエンドを使用する必要がある場合は、プロジェクトの構成ファイルに次の行を追加できます。

* Gradleの場合:

 <Tabs groupId="build-script">
 <TabItem value="kotlin" label="Kotlin" default>

 ```kotlin
 tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
   kotlinOptions.useOldBackend = true
 }
 ```

 </TabItem>
 <TabItem value="groovy" label="Groovy" default>

 ```groovy
 tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
  kotlinOptions.useOldBackend = true
 }
 ```

 </TabItem>
 </Tabs>

* Mavenの場合:

 ```xml
 <configuration>
     <args>
         <arg>-Xuse-old-backend</arg>
     </args>
 </configuration>
 ```

### 新しいデフォルトのJVMターゲット: 1.8

Kotlin/JVMコンパイルのデフォルトのターゲットバージョンは、`1.8`になりました。`1.6`ターゲットは非推奨になりました。

JVM 1.6用のビルドが必要な場合は、このターゲットに切り替えることができます。方法はこちらをご覧ください。

* [Gradleの場合](gradle-compiler-options#attributes-specific-to-jvm)
* [Mavenの場合](maven#attributes-specific-to-jvm)
* [コマンドラインコンパイラーの場合](compiler-reference#jvm-target-version)

### invokedynamicを介したSAMアダプター

Kotlin 1.5.0では、SAM (Single Abstract Method) 変換のコンパイルに動的呼び出し (`invokedynamic`) が使用されるようになりました。
* SAM型が[Javaインターフェース](java-interop#sam-conversions)の場合、任意の式に対して
* SAM型が[Kotlin関数型インターフェース](fun-interfaces#sam-conversions)の場合、ラムダに対して

新しい実装では、[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)が使用され、コンパイル中に補助ラッパークラスが生成されなくなりました。これにより、アプリケーションのJARのサイズが縮小され、JVMの起動パフォーマンスが向上します。

匿名クラス生成に基づく古い実装スキームにロールバックするには、コンパイラーオプション`-Xsam-conversions=class`を追加します。

[Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options)、および[コマンドラインコンパイラー](compiler-reference#compiler-options)でコンパイラーオプションを追加する方法をご覧ください。

### invokedynamicを介したラムダ

:::note
プレーンなKotlinラムダを invokedynamic にコンパイルすることは、[実験的](components-stability)です。これはいつでも削除または変更される可能性があります。
オプトインが必要です（詳細は以下を参照）、評価目的でのみ使用する必要があります。[YouTrack](https://youtrack.jetbrains.com/issue/KT-45375)でフィードバックをお待ちしております。

Kotlin 1.5.0では、プレーンなKotlinラムダ（関数型インターフェースのインスタンスに変換されない）を動的呼び出し (`invokedynamic`) にコンパイルするための実験的サポートが導入されています。この実装では、[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)を使用して、より軽量なバイナリを生成します。これにより、必要なクラスが実行時に効果的に生成されます。現在、通常のラムダコンパイルと比較して、3つの制限があります。

* invokedynamicにコンパイルされたラムダはシリアライズできません。
* このようなラムダで`toString()`を呼び出すと、読みやすい文字列表現が生成されません。
* 実験的な[`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) APIは、`LambdaMetafactory`で作成されたラムダをサポートしていません。

この機能を試すには、`-Xlambdas=indy`コンパイラーオプションを追加します。この[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-45375)を使用してフィードバックをお寄せいただければ幸いです。

[Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options)、および[コマンドラインコンパイラー](compiler-reference#compiler-options)でコンパイラーオプションを追加する方法をご覧ください。

### @JvmDefaultおよび古いXjvm-defaultモードの非推奨

Kotlin 1.4.0より前には、`@JvmDefault`アノテーションと`-Xjvm-default=enable`および`-Xjvm-default=compatibility`モードがありました。これらは、Kotlinインターフェースの特定の非抽象メンバーに対してJVMデフォルトメソッドを作成するために使用されました。

Kotlin 1.4.0では、[新しい`Xjvm-default`モードを導入しました](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。これにより、プロジェクト全体のデフォルトメソッドの生成がオンになります。

Kotlin 1.5.0では、`@JvmDefault`と古いXjvm-defaultモード: `-Xjvm-default=enable`および`-Xjvm-default=compatibility`を非推奨にしています。

[Java interopのデフォルトメソッドの詳細はこちら](java-to-kotlin-interop#default-methods-in-interfaces)。

### nullabilityアノテーションの処理の改善

Kotlinは、[nullabilityアノテーション](java-interop#nullability-annotations)を使用してJavaからの型のnullability情報を処理することをサポートしています。Kotlin 1.5.0では、この機能に対していくつかの改善が導入されています。

* 依存関係として使用されるコンパイル済みのJavaライブラリの型引数に関するnullabilityアノテーションを読み取ります。
* 次のターゲットに対して`TYPE_USE`ターゲットを持つnullabilityアノテーションをサポートします。
  * 配列
  * Varargs
  * フィールド
  * 型パラメーターとその境界
  * 基底クラスとインターフェースの型引数
* nullabilityアノテーションに型に適用可能な複数のターゲットがあり、これらのターゲットの1つが`TYPE_USE`である場合、`TYPE_USE`が優先されます。
  たとえば、メソッドシグネチャ`@Nullable String[] f()`は、`@Nullable`が`TYPE_USE`と`METHOD`の両方をターゲットとしてサポートする場合、`fun f(): Array<String?>!`になります。

これらの新しくサポートされるケースでは、KotlinからJavaを呼び出すときに誤った型のnullabilityを使用すると、警告が生成されます。`-Xtype-enhancement-improvements-strict-mode`コンパイラーオプションを使用して、これらのケースの厳密モード（エラー報告付き）を有効にします。

[null-safetyとプラットフォーム型の詳細はこちら](java-interop#null-safety-and-platform-types)。

## Kotlin/Native

Kotlin/Nativeは、より高性能で安定しています。注目すべき変更点は次のとおりです。
* [パフォーマンスの改善](#performance-improvements)
* [メモリーリークチェッカーの無効化](#deactivation-of-the-memory-leak-checker)

### パフォーマンスの改善

1.5.0では、Kotlin/Nativeは、コンパイルと実行の両方を高速化する一連のパフォーマンス改善を受けています。

[コンパイラーキャッシュ](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)が、`linuxX64`（Linuxホストのみ）および`iosArm64`ターゲットのデバッグモードでサポートされるようになりました。コンパイラーキャッシュを有効にすると、最初のコンパイルを除き、ほとんどのデバッグコンパイルがはるかに高速に完了します。測定では、テストプロジェクトで約200%の速度向上が見られました。

新しいターゲットでコンパイラーキャッシュを使用するには、プロジェクトの`gradle.properties`に次の行を追加してオプトインします。
* `linuxX64`の場合: `kotlin.native.cacheKind.linuxX64=static`
* `iosArm64`の場合: `kotlin.native.cacheKind.iosArm64=static`

コンパイラーキャッシュを有効にした後に問題が発生した場合は、[YouTrack](https://kotl.in/issue)の問題追跡ツールに報告してください。

その他の改善により、Kotlin/Nativeコードの実行が高速化されます。
* トリビアルなプロパティアクセサーはインライン化されます。
* 文字列リテラルに対する`trimIndent()`は、コンパイル中に評価されます。

### メモリーリークチェッカーの無効化

組み込みのKotlin/Nativeメモリーリークチェッカーは、デフォルトで無効になっています。

これは当初、内部で使用するために設計されており、限られた数のケースでしかリークを見つけることができませんでした。さらに、アプリケーションのクラッシュを引き起こす可能性のある問題があることが後で判明しました。そのため、メモリーリークチェッカーをオフにすることにしました。

メモリーリークチェッカーは、特定のケース（ユニットテストなど）では引き続き役立つ可能性があります。これらのケースでは、次のコード行を追加して有効にすることができます。

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

アプリケーションのランタイムでチェッカーを有効にすることはお勧めしません。

## Kotlin/JS

Kotlin/JSは、1.5.0で進化的な変更を受けています。[JS IRコンパイラーバックエンド](js-ir-compiler)を安定化させ、他のアップデートを出荷する作業を継続しています。

* [webpackのバージョン5へのアップグレード](#upgrade-to-webpack-5)
* [IRコンパイラー用のフレームワークとライブラリ](#frameworks-and-libraries-for-the-ir-compiler)

### webpackのバージョン5へのアップグレード

Kotlin/JS Gradleプラグインは、webpack 4の代わりにwebpack 5をブラウザターゲットで使用するようになりました。これはwebpackのメジャーアップグレードであり、互換性のない変更が加えられています。カスタムwebpack構成を使用している場合は、[webpack 5のリリースノート](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)を確認してください。

[webpackを使用したKotlin/JSプロジェクトのバンドルの詳細はこちら](js-project-setup#webpack-bundling)。

### IRコンパイラー用のフレームワークとライブラリ

Kotlin/JS IRコンパイラーは[Alpha](components-stability)段階です。互換性のない変更が必要になる場合があり、将来手動での移行が必要になる場合があります。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお待ちしております。

Kotlin/JSコンパイラー用のIRベースのバックエンドの開発とともに、ライブラリ作成者が`both`モードでプロジェクトを構築することを推奨し、支援しています。これは、両方のKotlin/JSコンパイラー用の成果物を生成できることを意味し、新しいコンパイラーのエコシステムを成長させます。

多くの有名なフレームワークとライブラリがすでにIRバックエンドで利用可能です: [KVision](https://kvision.io/)、[fritz2](https://www.fritz2.dev/)、[doodle](https://github.com/nacular/doodle)など。プロジェクトで使用している場合は、IRバックエンドでビルドして、そのメリットを確認できます。

独自のライブラリを作成する場合は、[「both」モードでコンパイルします](js-ir-compiler#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。これにより、クライアントも新しいコンパイラーで使用できるようになります。

## Kotlin Multiplatform

Kotlin 1.5.0では、[プラットフォームごとのテスト依存関係の選択が簡素化されました](#simplified-test-dependencies-usage-in-multiplatform-projects)。これは、Gradleプラグインによって自動的に行われるようになりました。

[charカテゴリーを取得するための新しいAPIが、マルチプラットフォームプロジェクトで利用できるようになりました](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)。

## 標準ライブラリ

標準ライブラリは、実験的な部分の安定化から新機能の追加まで、さまざまな変更と改善を受けています。

* [安定版の符号なし整数型](#stable-unsigned-integer-types)
* [大文字/小文字テキストの安定版ロケール非依存API](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [安定版のChar-to-integer変換API](#stable-char-to-integer-conversion-api)
* [安定版のPath API](#stable-path-api)
* [フロア除算とmod演算子](#floored-division-and-the-mod-operator)
* [Duration APIの変更](#duration-api-changes)
* [charカテゴリーを取得するための新しいAPIが、マルチプラットフォームコードで利用できるようになりました](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [新しいコレクション関数firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean()の厳密バージョン](#strict-version-of-string-toboolean)

標準ライブラリの変更の詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released)をご覧ください。

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="New Standard Library Features"/>

### 安定版の符号なし整数型

`UInt`、`ULong`、`UByte`、`UShort`符号なし整数型が[安定版](components-stability)になりました。これらの型、範囲、およびその進捗状況に対する操作も同様です。符号なし配列とその操作は、ベータ版のままです。

[符号なし整数型の詳細はこちら](unsigned-integer-types)。

### 大文字/小文字テキストの安定版ロケール非依存API

このリリースでは、大文字/小文字のテキスト変換用の新しいロケール非依存APIが提供されます。これは、ロケール依存の`toLowerCase()`、`toUpperCase()`、`capitalize()`、および`decapitalize()` API関数の代替手段を提供します。新しいAPIは、さまざまなロケール設定によるエラーを回避するのに役立ちます。

Kotlin 1.5.0は、完全に[安定版](components-stability)の代替手段を以下に示します。

* `String`関数の場合:

  |**以前のバージョン**|**1.5.0の代替手段**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* `Char`関数の場合:

  |**以前のバージョン**|**1.5.0の代替手段**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

Kotlin/JVMの場合、明示的な`Locale`パラメーターを持つオーバーロードされた`uppercase()`、`lowercase()`、および`titlecase()`関数もあります。

:::

古いAPI関数は非推奨としてマークされており、今後のリリースで削除されます。

テキスト処理関数の変更の完全なリストについては、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions)を参照してください。

### 安定版のchar-to-integer変換API

Kotlin 1.5.0以降、新しいchar-to-codeおよびchar-to-digit変換関数は[安定版](components-stability)です。これらの関数は、類似のstring-to-Int変換と混同されることが多かった現在のAPI関数を置き換えます。

新しいAPIは、この名前の混乱を取り除き、コードの動作をより透過的かつ明確にします。

このリリースでは、次の明確に名前が付けられた関数セットに分割された`Char`変換が導入されています。

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

* それが表す負でない1桁の数字を対応する`Char`表現に変換する`Int`の拡張関数:

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

`Number.toChar()`とその実装（`Int.toChar()`を除くすべて）や、数値型への変換のための`Char`拡張機能（`Char.toInt()`など）を含む古い変換APIは、非推奨になりました。

[char-to-integer変換APIの詳細については、KEEPを参照してください](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions)。

### 安定版のPath API

`java.nio.file.Path`の拡張機能を含む[実験的なPath API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/)が[安定版](components-stability)になりました。

```kotlin
// div (/)演算子を使用してパスを構築する
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// ディレクトリ内のファイルを一覧表示する
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[Path APIの詳細はこちら](whatsnew1420#extensions-for-java-nio-file-path)。

### フロア除算とmod演算子

モジュラ演算用の新しい操作が標準ライブラリに追加されました。
* `floorDiv()`は、[フロア除算](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions)の結果を返します。これは、整数型で使用できます。
* `mod()`は、フロア除算の剰余（_モジュラス_）を返します。これは、すべての数値型で使用できます。

これらの操作は、既存の[整数の除算](numbers#operations-on-numbers)および[rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html)関数（または`%`演算子）と非常によく似ていますが、負の数では動作が異なります。
* `a.floorDiv(b)`は、`floorDiv`が結果を切り下げる（小さい整数に向かって）点で通常の`/`と異なりますが、`/`は結果を0に近い整数に切り捨てます。
* `a.mod(b)`は、`a`と`a.floorDiv(b) * b`の差です。これはゼロであるか、`b`と同じ符号を持つかのいずれかですが、`a % b`は異なる符号を持つ可能性があります。

```kotlin
fun main() {

    println("フロア除算 -5/3: ${(-5).floorDiv(3)}")
    println( "モジュラス: ${(-5).mod(3)}")
    
    println("切り捨てられた除算 -5/3: ${-5 / 3}")
    println( "剰余: ${-5 % 3}")

}
```

### Duration APIの変更

:::caution
Duration APIは[実験的](components-stability)です。これはいつでも削除または変更される可能性があります。
評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお待ちしております。

:::

異なる時間単位で期間量を表すための実験的な[Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)クラスがあります。1.5.0では、Duration APIに次の変更が加えられました。

* 内部値の表現では、より高い精度を提供するために、`Double`ではなく`Long`を使用するようになりました。
* `Long`の特定の時間単位への変換のための新しいAPIがあります。これは、`Double`値で動作し、非推奨になった古いAPIを置き換えるために提供されます。たとえば、[`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html)は、`Long`として表される期間の値を返し、`Duration.inMinutes`を置き換えます。
* 数値から`Duration`を構築するための新しいコンパニオン関数があります。たとえば、[`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)は、整数の秒数を表す`Duration`オブジェクトを作成します。`Int.seconds`のような古い拡張プロパティは非推奨になりました。

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {

    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")

}
```

### charカテゴリーを取得するための新しいAPIが、マルチプラットフォームコードで利用できるようになりました

Kotlin 1.5.0では、マルチプラットフォームプロジェクトでUnicodeに従って文字のカテゴリーを取得するための新しいAPIが導入されました。いくつかの関数がすべてのプラットフォームと共通コードで利用できるようになりました。

文字が文字または数字であるかどうかを確認する関数:
* [`Char.isDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-digit.html)
* [`Char.isLetter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter.html)
* [`Char.isLetterOrDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter-or-digit.html)

```kotlin
fun main() {

    val chars = listOf('a', '1', '+')
    val (letterOrDigitList, notLetterOrDigitList) = chars.partition { it.isLetterOrDigit() }
    println(letterOrDigitList) // [a, 1]
    println(notLetterOrDigitList) // [+]

}
```

文字の大文字と小文字を確認する関数:
* [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
* [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)
* [`Char.isTitleCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-title-case.html)

```kotlin
fun main() {

    val chars = listOf('ǅ', 'ǈ', 'ǋ', 'ǲ', '1', 'A', 'a', '+')
    val (titleCases, notTitleCases) = chars.partition { it.isTitleCase() }
    println(titleCases) // [ǅ, ǈ, ǋ, ǲ]
    println(notTitleCases) // [1, A, a, +]

}
```

その他の関数:
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

プロパティ[`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html)とその戻り値の型
enum class [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/)。これは、Unicodeに従って文字の一般的なカテゴリーを示します。これも、マルチプラットフォームプロジェクトで利用できるようになりました。

[文字の詳細はこちら](characters)。

### 新しいコレクション関数firstNotNullOf()

新しい[`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)および[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
関数は、[`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)を[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)または[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)と組み合わせます。
カスタムセレクター関数を使用して元のコレクションをマップし、最初のnull以外の値を返します。そのような値がない場合、
`firstNotNullOf()`は例外をスローし、`firstNotNullOfOrNull()`はnullを返します。

```kotlin
fun main() {

    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))

}
```

### String?.toBoolean()の厳密バージョン

2つの新しい関数は、既存の[String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html)の大文字と小文字を区別する厳密なバージョンを導入します。
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html)は、リテラル`true`および`false`を除くすべての入力に対して例外をスローします。
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html)は、リテラル`true`および`false`を除くすべての入力に対してnullを返します。

```kotlin
fun main() {

    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // 例外

}
```

## kotlin-test ライブラリ
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリには、いくつかの新機能が導入されています。
* [マルチプラットフォームプロジェクトでのテスト依存関係の簡素化された使用法](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [Kotlin/JVMソースセットのテストフレームワークの自動選択](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [アサーション関数の更新](#assertion-function-updates)

### マルチプラットフォームプロジェクトでのテスト依存関係の簡素化された使用法

`kotlin-test`依存関係を使用して`commonTest`ソースセットにテスト用の依存関係を追加できるようになりました。
Gradleプラグインは、各テストソースセットの対応するプラットフォーム依存関係を推測します。
* JVMソースセットの`kotlin-test-junit`。 [Kotlin/JVMソースセットのテストフレームワークの自動選択](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)を参照してください。
* Kotlin/JSソースセットの`kotlin-test-js`
* 共通ソースセットの`kotlin-test-common`および`kotlin-test-annotations-common`
* Kotlin/Nativeソースセット用の追加のアーティファクトはありません

さらに、共有またはプラットフォーム固有のソースセットで`kotlin-test`依存関係を使用できます。

明示的な依存関係を持つ既存のkotlin-testセットアップは、GradleとMavenの両方で引き続き機能します。

[テストライブラリへの依存関係の設定](gradle-configure-project#set-dependencies-on-test-libraries)の詳細をご覧ください。

### Kotlin/JVMソースセットのテストフレームワークの自動選択

Gradleプラグインは、テストフレームワークを自動的に選択して依存関係を追加するようになりました。必要なのは、共通ソースセットに依存関係`kotlin-test`を追加することだけです。

GradleはデフォルトでJUnit 4を使用します。したがって、`kotlin("test")`依存関係はJUnit 4のバリアント、つまり`kotlin-test-junit`に解決されます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // これにより、依存関係がもたらされます
                                               // JUnit 4へのトラン
```
</TabItem>
</Tabs>