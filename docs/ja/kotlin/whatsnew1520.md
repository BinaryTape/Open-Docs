---
title: "Kotlin 1.5.20 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[Released: 2021年6月24日](releases#release-details)_

Kotlin 1.5.20では、1.5.0の新機能で発見された問題の修正が行われ、さまざまなツール改善も含まれています。

変更点の概要は、[リリースブログ記事](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)と以下の動画で確認できます。

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20では、JVMプラットフォームで以下のアップデートが行われました。
* [invokedynamicによる文字列連結](#string-concatenation-via-invokedynamic)
* [JSpecifyのnull可能性アノテーションのサポート](#support-for-jspecify-nullness-annotations)
* [KotlinとJavaのコードを持つモジュール内でのJavaのLombokによって生成されたメソッド呼び出しのサポート](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### invokedynamicによる文字列連結

Kotlin 1.5.20では、文字列連結がJVM 9+ターゲット上の[dynamic invocations](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)
(`invokedynamic`)にコンパイルされるようになり、最新のJavaバージョンに対応しています。
より正確には、文字列連結には[`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)
を使用します。

以前のバージョンで使用されていた[`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-)による連結に戻すには、コンパイラオプション`-Xstring-concat=inline`を追加します。

コンパイラオプションの追加方法については、[Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options)、および[コマンドラインコンパイラ](compiler-reference#compiler-options)を参照してください。

### JSpecifyのnull可能性アノテーションのサポート

Kotlinコンパイラは、さまざまな種類の[nullability annotations](java-interop#nullability-annotations)を読み取って、JavaからKotlinにnull可能性情報を渡すことができます。バージョン1.5.20では、[JSpecify project](https://jspecify.dev/)のサポートが導入されました。これには、Javaのnull可能性アノテーションの標準化された統一セットが含まれます。

JSpecifyを使用すると、より詳細なnull可能性情報を提供して、KotlinがJavaとのnull安全性を維持できるようにすることができます。宣言、パッケージ、またはモジュールのスコープに対してデフォルトのnull可能性を設定したり、パラメトリックなnull可能性を指定したりできます。詳細については、[JSpecify user guide](https://jspecify.dev/docs/user-guide)を参照してください。

KotlinがJSpecifyアノテーションをどのように処理できるかの例を以下に示します。

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

1.5.20では、JSpecifyによって提供されるnull可能性情報に従ったすべてのnull可能性の不一致が警告として報告されます。
JSpecifyを使用する際にstrict mode（エラー報告あり）を有効にするには、`-Xjspecify-annotations=strict`および`-Xtype-enhancement-improvements-strict-mode`コンパイラオプションを使用します。
JSpecifyプロジェクトは活発に開発が進められていることに注意してください。そのAPIと実装はいつでも大幅に変更される可能性があります。

[null-safetyとplatform typesの詳細はこちら](java-interop#null-safety-and-platform-types)。

### KotlinとJavaのコードを持つモジュール内でのJavaのLombokによって生成されたメソッド呼び出しのサポート

:::caution
Lombokコンパイラプラグインは[Experimental](components-stability)です。
いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-7112)でフィードバックをお待ちしております。

:::

Kotlin 1.5.20では、実験的な[Lombok compiler plugin](lombok)が導入されています。このプラグインを使用すると、KotlinとJavaのコードを持つモジュール内でJavaの[Lombok](https://projectlombok.org/)の宣言を生成して使用できます。LombokアノテーションはJavaソースでのみ機能し、Kotlinコードで使用すると無視されます。

このプラグインは、次のアノテーションをサポートしています。
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, および `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

現在もこのプラグインの開発を続けています。詳細な現状については、[LombokコンパイラプラグインのREADME](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)をご覧ください。

現在、`@Builder`アノテーションをサポートする予定はありません。ただし、[YouTrackの`@Builder`](https://youtrack.jetbrains.com/issue/KT-46959)に投票していただければ、検討することができます。

[Lombokコンパイラプラグインの設定方法はこちら](lombok#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20では、新機能のプレビューとツール改善が提供されます。

* [生成されたObjective-CヘッダーへのKDocコメントのオプトインエクスポート](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [コンパイラのバグ修正](#compiler-bug-fixes)
* [配列内のArray.copyInto()のパフォーマンス向上](#improved-performance-of-array-copyinto-inside-one-array)

### 生成されたObjective-CヘッダーへのKDocコメントのオプトインエクスポート

:::caution
生成されたObjective-CヘッダーへのKDocコメントのエクスポート機能は[Experimental](components-stability)です。
いつでも削除または変更される可能性があります。
オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-38600)でフィードバックをお待ちしております。

:::

Kotlin/Nativeコンパイラを設定して、Kotlinコードから[documentation comments (KDoc)](kotlin-doc)をエクスポートできるようになりました。
それから生成されたObjective-Cフレームワークにエクスポートすると、フレームワークの利用者に表示されます。

たとえば、KDocを使用した次のKotlinコード:

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

次のObjective-Cヘッダーが生成されます。

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

これはSwiftでもうまく機能します。

このKDocコメントをObjective-Cヘッダーにエクスポートする機能を試すには、`-Xexport-kdoc`コンパイラオプションを使用します。コメントをエクスポートするGradleプロジェクトの`build.gradle(.kts)`に次の行を追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</TabItem>
</Tabs>

この[YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-38600)を使用して、フィードバックをお寄せいただければ幸いです。

### コンパイラのバグ修正

Kotlin/Nativeコンパイラでは、1.5.20で複数のバグ修正が行われました。完全なリストは[changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)で確認できます。

互換性に影響する重要なバグ修正があります。以前のバージョンでは、不正なUTF [surrogate pairs](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)を含む文字列定数は、コンパイル中に値を失っていました。現在、このような値は保持されます。アプリケーション開発者は1.5.20に安全にアップデートできます。何も壊れることはありません。ただし、1.5.20でコンパイルされたライブラリは、以前のコンパイラバージョンと互換性がありません。
詳細については、[this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-33175)をご覧ください。

### 配列内のArray.copyInto()のパフォーマンス向上

ソースとデスティネーションが同じ配列の場合、`Array.copyInto()`の動作が改善されました。このユースケースでは、メモリ管理の最適化により、コピーされるオブジェクトの数に応じて、最大20倍高速に完了するようになりました。

## Kotlin/JS

1.5.20では、Kotlin/JSの新しい[IR-based backend](js-ir-compiler)にプロジェクトを移行するのに役立つガイドを公開しています。

### JS IR backendの移行ガイド

新しい[migration guide for the JS IR backend](js-ir-migration)では、移行中に発生する可能性のある問題を特定し、その解決策を提供しています。ガイドに記載されていない問題が見つかった場合は、[issue tracker](http://kotl.in/issue)にご報告ください。

## Gradle

Kotlin 1.5.20では、Gradleのエクスペリエンスを向上させる次の機能が導入されています。

* [kaptでのannotation processors classloadersのキャッシング](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project`ビルドプロパティの非推奨](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kaptでのannotation processors classloadersのキャッシング

:::caution
kaptでのannotation processors classloadersのキャッシングは[Experimental](components-stability)です。
いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-28901)でフィードバックをお待ちしております。

:::

[kapt](kapt)でannotation processorsのクラスローダーをキャッシュできる新しい実験的機能が追加されました。
この機能により、連続するGradle実行のkaptの速度を向上させることができます。

この機能を有効にするには、`gradle.properties`ファイルで次のプロパティを使用します。

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

[kapt](kapt)の詳細はこちら。

### kotlin.parallel.tasks.in.projectビルドプロパティの非推奨

このリリースでは、Kotlinの並列コンパイルは[Gradle parallel execution flag `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)によって制御されます。
このフラグを使用すると、Gradleはタスクを同時に実行し、タスクのコンパイル速度を向上させ、リソースをより効率的に利用します。

`kotlin.parallel.tasks.in.project`プロパティを使用する必要はなくなりました。このプロパティは非推奨となり、次のメジャーリリースで削除されます。

## Standard library

Kotlin 1.5.20では、文字を扱ういくつかの関数のプラットフォーム固有の実装が変更され、その結果、プラットフォーム間で統一されました。
* [Kotlin/NativeおよびKotlin/JSでのChar.digitToInt()でのすべてのUnicode数字のサポート](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [プラットフォーム間でのChar.isLowerCase()/isUpperCase()実装の統一](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Kotlin/NativeおよびKotlin/JSでのChar.digitToInt()でのすべてのUnicode数字のサポート

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)は、文字が表す10進数の数値値を返します。1.5.20より前は、この関数はKotlin/JVMでのみすべてのUnicode数字文字をサポートしていました。NativeおよびJSプラットフォームの実装では、ASCII数字のみがサポートされていました。

これからは、Kotlin/NativeとKotlin/JSの両方で、任意のUnicode数字文字に対して`Char.digitToInt()`を呼び出して、その数値表現を取得できます。

```kotlin
fun main() {

    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)

}
```

### プラットフォーム間でのChar.isLowerCase()/isUpperCase()実装の統一

関数[`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)と
[`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)は、文字の大文字と小文字に応じてブール値を返します。Kotlin/JVMの場合、実装は`General_Category`と`Other_Uppercase`/`Other_Lowercase` [Unicode properties](https://en.wikipedia.org/wiki/Unicode_character_property)の両方をチェックします。

1.5.20より前は、他のプラットフォームの実装は異なり、一般的なカテゴリのみを考慮していました。
1.5.20では、実装がプラットフォーム間で統一され、両方のプロパティを使用して文字ケースを判断します。

```kotlin
fun main() {

    val latinCapitalA = 'A' // has "Lu" general category
    val circledLatinCapitalA = 'Ⓐ' // has "Other_Uppercase" property
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())

}
```