[//]: # (title: Kotlin 1.5.20 の新機能)

_[リリース日: 2021年6月24日](releases.md#release-details)_

Kotlin 1.5.20 では、1.5.0 の新機能で発見された問題の修正に加え、さまざまなツール改善が含まれています。

変更点の概要については、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)と、以下の動画で確認できます。

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20 では、JVMプラットフォームで以下のアップデートが適用されます。
* [invokedynamic を介した文字列連結](#string-concatenation-via-invokedynamic)
* [JSpecify nullness アノテーションのサポート](#support-for-jspecify-nullness-annotations)
* [Kotlin および Java コードを持つモジュール内での Java の Lombok 生成メソッドの呼び出しサポート](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### invokedynamic を介した文字列連結

Kotlin 1.5.20 は、JVM 9+ ターゲットで文字列連結を[動的呼び出し](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic) (`invokedynamic`) にコンパイルすることで、最新の Java バージョンに対応しています。
より正確には、文字列連結のために [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) を使用します。

以前のバージョンで使用されていた [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) を介した連結に戻すには、コンパイラオプション `-Xstring-concat=inline` を追加します。

コンパイラオプションの追加方法については、[Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options)、および[コマンドラインコンパイラ](compiler-reference.md#compiler-options)を参照してください。

### JSpecify nullness アノテーションのサポート

Kotlin コンパイラは、さまざまな種類の[null許容性アノテーション](java-interop.md#nullability-annotations)を読み取り、Java から Kotlin へ null許容性情報を渡すことができます。バージョン 1.5.20 では、Java nullness アノテーションの標準統一セットを含む [JSpecify プロジェクト](https://jspecify.dev/)のサポートが導入されました。

JSpecify を使用すると、Kotlin が Java との null安全性相互運用を維持するのに役立つ、より詳細な null許容性情報を提供できます。宣言、パッケージ、またはモジュールスコープのデフォルトの null許容性を設定したり、パラメトリックな null許容性を指定したりできます。これに関する詳細は、[JSpecify ユーザーガイド](https://jspecify.dev/docs/user-guide)で確認できます。

Kotlin が JSpecify アノテーションをどのように扱うかの例を以下に示します。

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

1.5.20 では、JSpecify が提供する null許容性情報に基づくすべての null許容性の不一致が警告として報告されます。
JSpecify を使用する際に厳格モード（エラー報告あり）を有効にするには、`-Xjspecify-annotations=strict` および `-Xtype-enhancement-improvements-strict-mode` コンパイラオプションを使用してください。
JSpecify プロジェクトは活発に開発中であることに注意してください。その API と実装は、いつでも大幅に変更される可能性があります。

[null安全性とプラットフォーム型についてさらに詳しく学ぶ](java-interop.md#null-safety-and-platform-types)。

### Kotlin および Java コードを持つモジュール内での Java の Lombok 生成メソッドの呼び出しサポート

> Lombok コンパイラプラグインは[実験的](components-stability.md)です。
> これはいつでも削除または変更される可能性があります。評価目的のみにご使用ください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.5.20 では、実験的な [Lombok コンパイラプラグイン](lombok.md)が導入されました。このプラグインにより、Kotlin と Java のコードを持つモジュール内で、Java の [Lombok](https://projectlombok.org/) 宣言を生成して使用することが可能になります。Lombok アノテーションは Java ソース内でのみ機能し、Kotlin コードで使用しても無視されます。

このプラグインは以下の注釈をサポートしています。
* `@Getter`、`@Setter`
* `@NoArgsConstructor`、`@RequiredArgsConstructor`、`@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

私たちはこのプラグインの作業を続けています。現在の詳細な状況については、[Lombok コンパイラプラグインの README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok) を参照してください。

現在、`@Builder` アノテーションをサポートする計画はありません。しかし、[YouTrack で `@Builder` に投票](https://youtrack.jetbrains.com/issue/KT-46959)していただければ、検討する可能性があります。

[Lombok コンパイラプラグインの設定方法を学ぶ](lombok.md#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 では、新機能のプレビューとツール改善が提供されています。

* [生成された Objective-C ヘッダーへの KDoc コメントのオプトインエクスポート](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [コンパイラのバグ修正](#compiler-bug-fixes)
* [単一配列内での `Array.copyInto()` のパフォーマンス向上](#improved-performance-of-array-copyinto-inside-one-array)

### 生成された Objective-C ヘッダーへの KDoc コメントのオプトインエクスポート

> 生成された Objective-C ヘッダーへの KDoc コメントのエクスポート機能は[実験的](components-stability.md)です。
> これはいつでも削除または変更される可能性があります。
> オプトインが必要であり（詳細は下記参照）、評価目的のみにご使用ください。
> [YouTrack](https://youtrack.com/issue/KT-38600) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin/Native コンパイラで、Kotlin コードの[ドキュメンテーションコメント (KDoc)](kotlin-doc.md) を、そこから生成される Objective-C フレームワークにエクスポートできるようになり、フレームワークの利用者から見えるようになりました。

例えば、KDoc を含む以下の Kotlin コードは、

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

以下の Objective-C ヘッダーを生成します。

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

これは Swift でも同様に機能します。

Objective-C ヘッダーへの KDoc コメントのエクスポート機能を試すには、`-Xexport-kdoc` コンパイラオプションを使用してください。コメントをエクスポートしたい Gradle プロジェクトの `build.gradle(.kts)` に以下の行を追加します。

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

この [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-38600) でフィードバックを共有していただけると幸いです。

### コンパイラのバグ修正

Kotlin/Native コンパイラは 1.5.20 で複数のバグ修正を受けました。完全なリストは[変更履歴](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)で確認できます。

互換性に影響する重要なバグ修正があります。以前のバージョンでは、不正な UTF [サロゲートペア](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)を含む文字列定数はコンパイル中に値が失われていました。現在、そのような値は保持されます。アプリケーション開発者は安全に 1.5.20 に更新でき、何も壊れません。ただし、1.5.20 でコンパイルされたライブラリは、以前のコンパイラバージョンとは互換性がありません。
詳細については、[この YouTrack の問題](https://youtrack.jetbrains.com/issue/KT-33175)を参照してください。

### 単一配列内での Array.copyInto() のパフォーマンス向上

`Array.copyInto()` がソースとデスティネーションが同じ配列である場合の動作が改善されました。このユースケースにおけるメモリ管理の最適化により、そのような操作は最大で20倍高速になります（コピーされるオブジェクトの数によります）。

## Kotlin/JS

1.5.20 では、新しい [IRベースのバックエンド](js-ir-compiler.md)にプロジェクトを移行するのに役立つガイドを公開しています。

### JS IR バックエンドの移行ガイド

新しい [JS IR バックエンドの移行ガイド](js-ir-migration.md)は、移行中に発生する可能性のある問題を特定し、それらに対する解決策を提供します。ガイドに記載されていない問題が見つかった場合は、[イシュートラッカー](http://kotl.in/issue)に報告してください。

## Gradle

Kotlin 1.5.20 では、Gradle エクスペリエンスを向上させる以下の機能が導入されています。

* [kapt におけるアノテーションプロセッサのクラスローダーのキャッシュ](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project` ビルドプロパティの非推奨化](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt におけるアノテーションプロセッサのクラスローダーのキャッシュ

> kapt におけるアノテーションプロセッサのクラスローダーのキャッシュは[実験的](components-stability.md)です。
> これはいつでも削除または変更される可能性があります。評価目的のみにご使用ください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) でのフィードバックをお待ちしております。
>
{style="warning"}

[kapt](kapt.md) のアノテーションプロセッサのクラスローダーをキャッシュできる新しい実験的機能が追加されました。
この機能は、連続した Gradle 実行において kapt の速度を向上させることができます。

この機能を有効にするには、`gradle.properties` ファイルに以下のプロパティを使用します。

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

[kapt](kapt.md) についてさらに詳しく学ぶ。

### kotlin.parallel.tasks.in.project ビルドプロパティの非推奨化

このリリースにより、Kotlin の並列コンパイルは、[Gradle の並列実行フラグ `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)によって制御されるようになりました。
このフラグを使用すると、Gradle はタスクを並行して実行し、コンパイルタスクの速度を向上させ、リソースをより効率的に利用します。

`kotlin.parallel.tasks.in.project` プロパティを使用する必要はなくなりました。このプロパティは非推奨となり、次のメジャーリリースで削除されます。

## 標準ライブラリ

Kotlin 1.5.20 では、文字を扱ういくつかの関数のプラットフォーム固有の実装が変更され、その結果、プラットフォーム間での統一がもたらされます。
* [Kotlin/Native および Kotlin/JS における `Char.digitToInt()` でのすべての Unicode 数字のサポート](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [プラットフォーム間での `Char.isLowerCase()/isUpperCase()` 実装の統一](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Kotlin/Native および Kotlin/JS における Char.digitToInt() でのすべての Unicode 数字のサポート

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) は、文字が表す10進数字の数値値を返します。1.5.20 より前は、この関数は Kotlin/JVM のみで全ての Unicode 数字文字をサポートしており、Native および JS プラットフォームの実装は ASCII 数字のみをサポートしていました。

今後、Kotlin/Native と Kotlin/JS の両方で、任意の Unicode 数字文字に対して `Char.digitToInt()` を呼び出し、その数値表現を取得できます。

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

[`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) と [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 関数は、文字のケースに応じてブール値を返します。Kotlin/JVM の場合、実装は `General_Category` と `Other_Uppercase`/`Other_Lowercase` の両方の [Unicode プロパティ](https://en.wikipedia.org/wiki/Unicode_character_property)をチェックします。

1.5.20 より前は、他のプラットフォームの実装は異なり、一般カテゴリのみを考慮していました。
1.5.20 では、実装がプラットフォーム間で統一され、文字のケースを決定するために両方のプロパティを使用するようになりました。

```kotlin
fun main() {
//sampleStart
    val latinCapitalA = 'A' // has "Lu" general category
    val circledLatinCapitalA = 'Ⓐ' // has "Other_Uppercase" property
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}