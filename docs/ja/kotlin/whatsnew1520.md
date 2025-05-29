[//]: # (title: Kotlin 1.5.20 の新機能)

_[リリース日: 2021年6月24日](releases.md#release-details)_

Kotlin 1.5.20 には、1.5.0 の新機能で発見された問題の修正が含まれており、様々なツール改善も含まれています。

変更点の概要は、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)と以下のビデオで確認できます:

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20 は JVM プラットフォームで以下のアップデートを受けます:
* [invokedynamic による文字列結合](#string-concatenation-via-invokedynamic)
* [JSpecify nullness アノテーションのサポート](#support-for-jspecify-nullness-annotations)
* [Kotlin と Java コードを持つモジュール内での Java の Lombok が生成したメソッド呼び出しのサポート](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### invokedynamic による文字列結合

Kotlin 1.5.20 は、JVM 9 以降をターゲットとする文字列結合を [動的呼び出し](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic) (`invokedynamic`) にコンパイルすることで、モダンな Java バージョンに対応します。
より具体的には、文字列結合に [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) を使用します。

以前のバージョンで使用されていた [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) による結合に戻すには、コンパイラオプション `-Xstring-concat=inline` を追加します。

コンパイラオプションの追加方法については、[Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options)、[コマンドラインコンパイラ](compiler-reference.md#compiler-options)を参照してください。

### JSpecify nullness アノテーションのサポート

Kotlin コンパイラは、様々な種類の[null可能性アノテーション](java-interop.md#nullability-annotations)を読み取って、Java から Kotlin へ null可能性情報を渡すことができます。バージョン 1.5.20 では、Java nullness アノテーションの標準的な統一セットを含む [JSpecify プロジェクト](https://jspecify.dev/)のサポートが導入されました。

JSpecify を使用すると、より詳細な null可能性情報を提供し、Kotlin が Java とヌル安全性を相互運用するのに役立ちます。宣言、パッケージ、またはモジュールのスコープのデフォルトの null可能性を設定したり、パラメトリックな null可能性を指定したりすることができます。詳細については、[JSpecify ユーザーガイド](https://jspecify.dev/docs/user-guide)を参照してください。

Kotlin が JSpecify アノテーションをどのように処理できるかの例を次に示します:

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

1.5.20 では、JSpecify が提供する null可能性情報に従ったすべての null可能性の不一致は警告として報告されます。
JSpecify を使用する際に strict モード (エラー報告あり) を有効にするには、コンパイラオプション `-Xjspecify-annotations=strict` と `-Xtype-enhancement-improvements-strict-mode` を使用します。
JSpecify プロジェクトは活発に開発中であることに注意してください。その API と実装は、いつでも大きく変更される可能性があります。

[ヌル安全性とプラットフォームタイプについてさらに学ぶ](java-interop.md#null-safety-and-platform-types)。

### Kotlin と Java コードを持つモジュール内での Java の Lombok が生成したメソッド呼び出しのサポート

> Lombok コンパイラプラグインは[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.5.20 では、実験的な [Lombok コンパイラプラグイン](lombok.md)が導入されました。このプラグインにより、Kotlin と Java コードを持つモジュール内で Java の [Lombok](https://projectlombok.org/) 宣言を生成および使用することが可能になります。Lombok アノテーションは Java ソースでのみ機能し、Kotlin コードで使用しても無視されます。

このプラグインは次のアノテーションをサポートしています:
* `@Getter`、`@Setter`
* `@NoArgsConstructor`、`@RequiredArgsConstructor`、および `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

このプラグインの開発は継続しています。現在の詳細な状態については、[Lombok コンパイラプラグインの README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok) を参照してください。

現在、`@Builder` アノテーションのサポートは計画していません。ただし、[YouTrack で `@Builder` に投票](https://youtrack.jetbrains.com/issue/KT-46959)していただければ、検討することができます。

[Lombok コンパイラプラグインの設定方法を学ぶ](lombok.md#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 は、新機能とツール改善のプレビューを提供します:

* [KDoc コメントを生成された Objective-C ヘッダーへオプトインでエクスポートする機能](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [コンパイラのバグ修正](#compiler-bug-fixes)
* [単一配列内での Array.copyInto() のパフォーマンス改善](#improved-performance-of-array-copyinto-inside-one-array)

### KDoc コメントを生成された Objective-C ヘッダーへオプトインでエクスポートする機能

> KDoc コメントを生成された Objective-C ヘッダーへエクスポートする機能は[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。
> オプトインが必要であり (詳細は下記参照)、評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin/Native コンパイラで、Kotlin コードの[ドキュメントコメント (KDoc)](kotlin-doc.md) を、そこから生成される Objective-C フレームワークにエクスポートできるようになり、フレームワークの利用者から見えるようになりました。

例えば、KDoc を含む以下の Kotlin コードは:

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

以下の Objective-C ヘッダーを生成します:

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

これは Swift とも良好に連携します。

KDoc コメントを Objective-C ヘッダーにエクスポートするこの機能を試すには、`-Xexport-kdoc` コンパイラオプションを使用します。コメントをエクスポートしたい Gradle プロジェクトの `build.gradle(.kts)` に以下の行を追加してください:

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

この [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-38600)を使用してフィードバックを共有していただけると大変ありがたいです。

### コンパイラのバグ修正

Kotlin/Native コンパイラは 1.5.20 で複数のバグ修正を受けました。完全なリストは[チェンジログ](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)で確認できます。

互換性に影響する重要なバグ修正があります。以前のバージョンでは、不正な UTF [サロゲートペア](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)を含む文字列定数は、コンパイル中にその値を失っていました。現在はそのような値も保持されます。アプリケーション開発者は 1.5.20 に安全に更新でき、何も壊れることはありません。ただし、1.5.20 でコンパイルされたライブラリは、以前のコンパイラバージョンとは互換性がありません。
詳細については、[この YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-33175)を参照してください。

### 単一配列内での Array.copyInto() のパフォーマンス改善

`Array.copyInto()` が、ソースとデスティネーションが同じ配列である場合に機能する方法を改善しました。このユースケースにおけるメモリ管理の最適化により、そのような操作は最大で20倍高速化されます（コピーされるオブジェクトの数によります）。

## Kotlin/JS

1.5.20 では、[新しい IR ベースのバックエンド](js-ir-compiler.md)である Kotlin/JS へプロジェクトを移行するのに役立つガイドを公開します。

### JS IR バックエンド向け移行ガイド

新しい [JS IR バックエンド向け移行ガイド](js-ir-migration.md)は、移行中に遭遇する可能性のある問題を特定し、それらの解決策を提供します。ガイドに記載されていない問題を見つけた場合は、[イシュー追跡システム](http://kotl.in/issue)に報告してください。

## Gradle

Kotlin 1.5.20 では、Gradle エクスペリエンスを向上させる以下の機能が導入されました:

* [kapt におけるアノテーションプロセッサのクラスローダーのキャッシュ](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project` ビルドプロパティの非推奨化](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt におけるアノテーションプロセッサのクラスローダーのキャッシュ

> kapt におけるアノテーションプロセッサのクラスローダーのキャッシュは[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) でのフィードバックをお待ちしております。
>
{style="warning"}

[kapt](kapt.md) におけるアノテーションプロセッサのクラスローダーをキャッシュできる、新しい実験的な機能が追加されました。
この機能は、連続した Gradle 実行における kapt の速度を向上させることができます。

この機能を有効にするには、`gradle.properties` ファイルに以下のプロパティを使用します:

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

[kapt](kapt.md) について詳しく学ぶ。

### kotlin.parallel.tasks.in.project ビルドプロパティの非推奨化

このリリースから、Kotlin の並列コンパイルは [Gradle の並列実行フラグ `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) によって制御されます。
このフラグを使用すると、Gradle はタスクを並行して実行し、コンパイルタスクの速度を向上させ、リソースをより効率的に活用します。

`kotlin.parallel.tasks.in.project` プロパティを使用する必要はなくなりました。このプロパティは非推奨となり、次のメジャーリリースで削除されます。

## 標準ライブラリ

Kotlin 1.5.20 では、文字を扱ういくつかの関数のプラットフォーム固有の実装が変更され、結果としてプラットフォーム間の統一が図られました:
* [Kotlin/Native と Kotlin/JS における Char.digitToInt() のすべての Unicode 数字への対応](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [Char.isLowerCase()/isUpperCase() の実装のプラットフォーム間での統一](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Kotlin/Native と Kotlin/JS における Char.digitToInt() のすべての Unicode 数字への対応

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) は、文字が表す10進数字の数値的値を返します。1.5.20 より前は、この関数は Kotlin/JVM に対してのみすべての Unicode 数字文字をサポートしていました。Native および JS プラットフォームの実装は ASCII 数字のみをサポートしていました。

今後は、Kotlin/Native と Kotlin/JS の両方で、任意の Unicode 数字文字に対して `Char.digitToInt()` を呼び出し、その数値表現を取得できます。

```kotlin
fun main() {
//sampleStart
    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### Char.isLowerCase()/isUpperCase() の実装のプラットフォーム間での統一

[`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) および [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 関数は、文字のケースに応じて真偽値を返します。Kotlin/JVM の場合、実装は `General_Category` と `Other_Uppercase`/`Other_Lowercase` の両方の [Unicode プロパティ](https://en.wikipedia.org/wiki/Unicode_character_property)をチェックします。

1.5.20 より前は、他のプラットフォームの実装は異なっており、一般的なカテゴリのみを考慮していました。
1.5.20 では、実装がプラットフォーム間で統一され、両方のプロパティを使用して文字のケースを決定するようになりました:

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