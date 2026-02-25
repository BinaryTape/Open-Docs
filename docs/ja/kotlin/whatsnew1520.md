[//]: # (title: Kotlin 1.5.20 の新機能)

<web-summary>Kotlin 1.5.20 リリースノート：言語の新機能、Kotlin Multiplatform、JVM、Native、JS へのアップデート、および Gradle と Maven のビルドツールサポートについて紹介します。</web-summary>

_[リリース日: 2021年6月24日](releases.md#release-history)_

Kotlin 1.5.20 には、1.5.0 の新機能で見つかった問題の修正が含まれているほか、さまざまなツールの改善も行われています。

変更点の概要については、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)およびこちらの動画をご覧ください：

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)をご覧ください。
>
{style="tip"}

## Kotlin/JVM

Kotlin 1.5.20 では、JVM プラットフォーム向けに以下のアップデートが行われています：
* [invokedynamic による文字列連結](#string-concatenation-via-invokedynamic)
* [JSpecify nullness アノテーションのサポート](#support-for-jspecify-nullness-annotations)
* [Kotlin と Java のコードが混在するモジュール内での Java の Lombok 生成メソッドの呼び出しサポート](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### invokedynamic による文字列連結

Kotlin 1.5.20 は、最新の Java バージョンに追随するため、JVM 9+ ターゲットにおいて文字列連結を[動的呼び出し](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)（`invokedynamic`）にコンパイルします。
より正確には、文字列連結に [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) を使用します。

以前のバージョンで使用されていた [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) による連結に戻すには、コンパイラオプション `-Xstring-concat=inline` を追加してください。

コンパイラオプションの追加方法は、[Gradle](gradle-compiler-options.md)、[Maven](maven-compile-package.md#specify-compiler-options)、および[コマンドラインコンパイラ](compiler-reference.md#compiler-options)で確認できます。

### JSpecify nullness アノテーションのサポート

Kotlin コンパイラは、Java から Kotlin へ null 性情報を渡すために、さまざまな種類の [null 性アノテーション](java-interop.md#nullability-annotations)を読み取ることができます。バージョン 1.5.20 では、標準化された統一 Java nullness アノテーションセットを含む [JSpecify プロジェクト](https://jspecify.dev/)のサポートが導入されました。

JSpecify を使用すると、より詳細な null 性情報を提供でき、Kotlin が Java と相互運用する際の null 安全性を維持するのに役立ちます。宣言、パッケージ、またはモジュールのスコープに対してデフォルトの null 性を設定したり、パラメータ化された null 性を指定したりすることなどが可能です。詳細は [JSpecify ユーザーガイド](https://jspecify.dev/docs/user-guide)で見つけることができます。

以下は、Kotlin が JSpecify アノテーションをどのように処理するかの例です：

```java
// JavaClass.java
import org.jspecify.nullness.*;

@NullMarked
public class JavaClass {
  public String notNullableString() { return ""; }
  public @Nullable String nullableString() { return ""; }
}
```

```kotlin
// Test.kt
fun kotlinFun() = with(JavaClass()) {
  notNullableString().length // OK
  nullableString().length    // Warning: receiver nullability mismatch
}
```

1.5.20 では、JSpecify が提供する null 性情報に基づくすべての null 性の不一致は、警告として報告されます。JSpecify を使用する際に厳格モード（エラー報告あり）を有効にするには、`-Xjspecify-annotations=strict` および `-Xtype-enhancement-improvements-strict-mode` コンパイラオプションを使用してください。
なお、JSpecify プロジェクトは活発に開発中であることに注意してください。その API や実装は、いつでも大幅に変更される可能性があります。

[null 安全性とプラットフォーム型について詳しく学ぶ](java-interop.md#null-safety-and-platform-types)。

### Kotlin と Java のコードが混在するモジュール内での Java の Lombok 生成メソッドの呼び出しサポート

> Lombok コンパイラプラグインは[実験的](components-stability.md)なものです。
> いつでも変更または廃止される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.5.20 では、実験的な [Lombok コンパイラプラグイン](lombok.md)が導入されました。このプラグインにより、Kotlin と Java のコードが含まれるモジュール内で、Java の [Lombok](https://projectlombok.org/) 宣言を生成して使用することが可能になります。Lombok アノテーションは Java ソース内でのみ機能し、Kotlin コード内で使用した場合は無視されます。

このプラグインは以下のアノテーションをサポートしています：
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, および `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

現在もこのプラグインの開発を継続しています。詳細な現在のステータスを確認するには、[Lombok コンパイラプラグインの README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok) をご覧ください。

現在、`@Builder` アノテーションをサポートする計画はありません。ただし、[YouTrack の @Builder](https://youtrack.jetbrains.com/issue/KT-46959) に投票いただければ、検討する可能性があります。

[Lombok コンパイラプラグインの設定方法を学ぶ](lombok.md#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 では、新機能のプレビューとツールの改善が提供されています：

* [生成された Objective-C ヘッダーへの KDoc コメントのエクスポート（オプトイン）](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [コンパイラのバグ修正](#compiler-bug-fixes)
* [単一配列内での Array.copyInto() のパフォーマンス向上](#improved-performance-of-array-copyinto-inside-one-array)

### 生成された Objective-C ヘッダーへの KDoc コメントのエクスポート（オプトイン）

> KDoc コメントを生成された Objective-C ヘッダーにエクスポートする機能は[実験的](components-stability.md)なものです。
> いつでも変更または廃止される可能性があります。
> オプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin/Native コンパイラを設定して、Kotlin コードからの[ドキュメントコメント (KDoc)](kotlin-doc.md) を、そこから生成された Objective-C フレームワークにエクスポートし、フレームワークの利用者がそれらを確認できるようにすることが可能になりました。

例えば、以下の KDoc 付きの Kotlin コードは：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

次のような Objective-C ヘッダーを生成します：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

これは Swift でも同様に機能します。

KDoc コメントを Objective-C ヘッダーにエクスポートする機能を試すには、`-Xexport-kdoc` コンパイラオプションを使用します。コメントをエクスポートしたい Gradle プロジェクトの `build.gradle(.kts)` に、以下の行を追加してください：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</tab>
</tabs>

この [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-38600) を通じてフィードバックを共有いただければ幸いです。

### コンパイラのバグ修正

Kotlin/Native コンパイラでは、1.5.20 において複数のバグ修正が行われました。完全なリストは [変更履歴（changelog）](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20) で確認できます。

互換性に影響する重要なバグ修正があります。以前のバージョンでは、不適切な UTF [サロゲートペア](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates) を含む文字列定数が、コンパイル中にその値を失っていました。現在はそれらの値が保持されるようになっています。アプリケーション開発者は安全に 1.5.20 にアップデートでき、何も壊れることはありません。ただし、1.5.20 でコンパイルされたライブラリは、以前のコンパイラバージョンとは互換性がありません。
詳細は [こちらの YouTrack 課題](https://youtrack.jetbrains.com/issue/KT-33175) をご覧ください。

### 単一配列内での Array.copyInto() のパフォーマンス向上

ソースとデスティネーションが同じ配列である場合の `Array.copyInto()` の動作を改善しました。このユースケースにおけるメモリ管理の最適化により、このような操作が（コピーされるオブジェクトの数によりますが）最大 20 倍高速になりました。

## Kotlin/JS

1.5.20 のリリースにあわせて、Kotlin/JS プロジェクトを新しい [IR ベースのバックエンド](js-ir-compiler.md) に移行するのに役立つガイドを公開しました。

### JS IR バックエンドへの移行ガイド

新しい JS IR バックエンドへの移行ガイドでは、移行中に遭遇する可能性のある問題を特定し、それらに対する解決策を提供しています。ガイドでカバーされていない問題を見つけた場合は、[課題トラッカー](http://kotl.in/issue) に報告してください。

## Gradle

Kotlin 1.5.20 では、Gradle の使用感を向上させる以下の機能が導入されています：

* [kapt におけるアノテーションプロセッサのクラスローダーのキャッシュ](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project` ビルドプロパティの非推奨化](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt におけるアノテーションプロセッサのクラスローダーのキャッシュ

> kapt におけるアノテーションプロセッサのクラスローダーのキャッシュは[実験的](components-stability.md)なものです。
> いつでも変更または廃止される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) でのフィードバックをお待ちしております。
>
{style="warning"}

[kapt](kapt.md) においてアノテーションプロセッサのクラスローダーをキャッシュすることを可能にする、新しい実験的な機能が導入されました。この機能により、連続した Gradle 実行における kapt の速度が向上する可能性があります。

この機能を有効にするには、`gradle.properties` ファイルで以下のプロパティを使用してください：

```none
# 正の値を指定するとキャッシュが有効になります
# kapt を使用するモジュールの数と同じ値を使用してください
kapt.classloaders.cache.size=5

# キャッシュを機能させるために false に設定してください
kapt.include.compile.classpath=false
```

[kapt](kapt.md) について詳しく学ぶ。

### kotlin.parallel.tasks.in.project ビルドプロパティの非推奨化

本リリースより、Kotlin の並列コンパイルは [Gradle の並列実行フラグ `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) によって制御されます。このフラグを使用すると、Gradle はタスクを並行して実行し、コンパイルタスクの速度を向上させ、リソースをより効率的に利用します。

今後、`kotlin.parallel.tasks.in.project` プロパティを使用する必要はありません。このプロパティは非推奨となり、次のメジャーリリースで削除される予定です。

## 標準ライブラリ

Kotlin 1.5.20 では、文字（Character）を扱うためのいくつかの関数のプラットフォーム固有の実装が変更され、その結果、プラットフォーム間での統一が図られました：
* [Kotlin/Native および Kotlin/JS における Char.digitToInt() でのすべての Unicode 数字のサポート](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [プラットフォーム間での Char.isLowerCase()/isUpperCase() 実装の統一](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Kotlin/Native および Kotlin/JS における Char.digitToInt() でのすべての Unicode 数字のサポート

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) は、その文字が表す 10 進数字の数値を返します。1.5.20 以前は、この関数がすべての Unicode 数字文字をサポートしていたのは Kotlin/JVM のみで、Native および JS プラットフォームの実装では ASCII 数字のみをサポートしていました。

これからは、Kotlin/Native と Kotlin/JS の両方で、任意の Unicode 数字文字に対して `Char.digitToInt()` を呼び出し、その数値表現を取得できるようになります。

```kotlin
fun main() {
//sampleStart
    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### プラットフォーム間での Char.isLowerCase()/isUpperCase() 実装の統一

関数 [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) および [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) は、文字のケース（大文字・小文字）に応じて boolean 値を返します。Kotlin/JVM の実装では、`General_Category` と `Other_Uppercase`/`Other_Lowercase` の両方の [Unicode プロパティ](https://en.wikipedia.org/wiki/Unicode_character_property) をチェックします。

1.5.20 以前は、他のプラットフォームの実装は動作が異なり、一般カテゴリ（General Category）のみを考慮していました。1.5.20 では、実装がプラットフォーム間で統一され、両方のプロパティを使用して文字のケースを判定するようになりました。

```kotlin
fun main() {
//sampleStart
    val latinCapitalA = 'A' // "Lu" 一般カテゴリを持つ
    val circledLatinCapitalA = 'Ⓐ' // "Other_Uppercase" プロパティを持つ
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}