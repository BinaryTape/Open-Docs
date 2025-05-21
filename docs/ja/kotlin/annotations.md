---
title: アノテーション
---
アノテーションは、メタデータをコードに付加する手段です。アノテーションを宣言するには、クラスの前に `annotation` 修飾子を記述します。

```kotlin
annotation class Fancy
```

アノテーションの追加属性は、メタアノテーションでアノテーションクラスを修飾することで指定できます。

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) は、アノテーションを付与できる要素の種類（クラス、関数、プロパティ、式など）を指定します。
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) は、アノテーションがコンパイルされたクラスファイルに保存されるかどうか、また実行時にリフレクションを通じて表示されるかどうかを指定します（デフォルトでは、両方ともtrueです）。
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) は、同じアノテーションを単一の要素に複数回使用できるようにします。
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) は、アノテーションがパブリックAPIの一部であり、生成されたAPIドキュメントに表示されるクラスまたはメソッドのシグネチャに含める必要があることを指定します。

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER, 
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 使用法

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

クラスのプライマリコンストラクタにアノテーションを付ける必要がある場合は、`constructor`キーワードをコンストラクタの宣言に追加し、その前にアノテーションを追加する必要があります。

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

プロパティアクセサにアノテーションを付けることもできます。

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## コンストラクタ

アノテーションは、パラメータを取るコンストラクタを持つことができます。

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

使用できるパラメータ型は次のとおりです。

 * Javaのプリミティブ型に対応する型（Int、Longなど）
 * 文字列
 * クラス (`Foo::class`)
 * 列挙型
 * 他のアノテーション
 * 上記の型の配列

アノテーションのパラメータは、nullable型を持つことはできません。これは、JVMがアノテーション属性の値として `null` を格納することをサポートしていないためです。

アノテーションが別のアノテーションのパラメータとして使用される場合、その名前には `@` 文字が付きません。

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

クラスをアノテーションの引数として指定する必要がある場合は、Kotlinクラス
([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html))を使用します。Kotlinコンパイラは、
Javaコードがアノテーションと引数に正常にアクセスできるように、自動的にJavaクラスに変換します。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## インスタンス化

Javaでは、アノテーション型はインターフェースの一種であるため、それを実装してインスタンスを使用できます。
このメカニズムの代替として、Kotlinでは、任意にコード内でアノテーションクラスのコンストラクタを呼び出して、同様に結果のインスタンスを使用できます。

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker): Unit = TODO()

fun main(args: Array<String>) {
    if (args.isNotEmpty())
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

アノテーションクラスのインスタンス化の詳細については、[このKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation)を参照してください。

## ラムダ

アノテーションはラムダでも使用できます。ラムダの本体が生成される `invoke()` メソッドに適用されます。これは、並行性制御にアノテーションを使用する[Quasar](https://docs.paralleluniverse.co/quasar/)などのフレームワークに役立ちます。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## アノテーションの使用場所ターゲット

プロパティまたはプライマリコンストラクタパラメータにアノテーションを付ける場合、対応するKotlin要素から複数のJava要素が生成されるため、生成されたJavaバイトコード内のアノテーションの配置場所が複数存在する可能性があります。アノテーションを正確にどのように生成するかを指定するには、次の構文を使用します。

```kotlin
class Example(@field:Ann val foo,    // Javaフィールドにアノテーションを付ける
              @get:Ann val bar,      // Javaゲッターにアノテーションを付ける
              @param:Ann val quux)   // Javaコンストラクタパラメータにアノテーションを付ける
```

同じ構文を使用して、ファイル全体にアノテーションを付けることができます。これを行うには、ターゲット `file` を持つアノテーションを、ファイルの最上位、packageディレクティブの前、またはファイルがデフォルトパッケージにある場合はすべてのインポートの前に配置します。

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

同じターゲットを持つ複数のアノテーションがある場合は、ターゲットの後に括弧を追加し、すべての注釈を括弧内に入れることで、ターゲットの繰り返しを回避できます。

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

サポートされている使用場所ターゲットの完全なリストは次のとおりです。

  * `file`
  * `property` (このターゲットを持つアノテーションはJavaには表示されません)
  * `field`
  * `get` (プロパティゲッター)
  * `set` (プロパティセッター)
  * `receiver` (拡張関数またはプロパティのレシーバーパラメータ)
  * `param` (コンストラクタパラメータ)
  * `setparam` (プロパティセッターパラメータ)
  * `delegate` (委譲されたプロパティのデリゲートインスタンスを格納するフィールド)

拡張関数のレシーバーパラメータにアノテーションを付けるには、次の構文を使用します。

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

使用場所ターゲットを指定しない場合、ターゲットは使用されているアノテーションの `@Target` アノテーションに従って選択されます。適用可能なターゲットが複数ある場合は、次のリストから最初に適用可能なターゲットが使用されます。

  * `param`
  * `property`
  * `field`

## Javaアノテーション

JavaアノテーションはKotlinと100%互換性があります。

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // @Ruleアノテーションをプロパティゲッターに適用する
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

Javaで記述されたアノテーションのパラメータの順序は定義されていないため、引数を渡すために通常の関数呼び出し構文を使用することはできません。代わりに、名前付き引数構文を使用する必要があります。

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

```kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```

Javaと同様に、特別なケースは `value` パラメータです。その値は、明示的な名前なしで指定できます。

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

```kotlin
// Kotlin
@AnnWithValue("abc") class C
```

### アノテーションパラメータとしての配列

Javaの `value` 引数が配列型の場合、Kotlinでは `vararg` パラメータになります。

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

```kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```

配列型を持つ他の引数については、配列リテラル構文または
`arrayOf(...)`を使用する必要があります。

``` java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```

```kotlin
@AnnWithArrayMethod(names = ["abc", "foo", "bar"]) 
class C
```

### アノテーションインスタンスのプロパティへのアクセス

アノテーションインスタンスの値は、Kotlinコードにプロパティとして公開されます。

``` java
// Java
public @interface Ann {
    int value();
}
```

```kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```

### JVM 1.8+のアノテーションターゲットを生成しない機能

KotlinアノテーションにKotlinターゲットの中に `TYPE` がある場合、アノテーションはJavaアノテーションターゲットのリストで `java.lang.annotation.ElementType.TYPE_USE` にマップされます。これは、`TYPE_PARAMETER` Kotlinターゲットが
`java.lang.annotation.ElementType.TYPE_PARAMETER` Javaターゲットにマップされるのと同様です。これは、APIレベルが26未満のAndroidクライアントにとっては問題です。これらのターゲットがAPIにないためです。

`TYPE_USE` および `TYPE_PARAMETER` アノテーションターゲットの生成を避けるには、新しいコンパイラ引数 `-Xno-new-java-annotation-targets` を使用します。

## 繰り返し可能なアノテーション

[Java](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)と同様に、Kotlinには繰り返し可能なアノテーションがあり、単一のコード要素に複数回適用できます。アノテーションを繰り返し可能にするには、宣言を
[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)
メタアノテーションでマークします。これにより、KotlinとJavaの両方で繰り返し可能になります。Javaの繰り返し可能なアノテーションは、Kotlin側からもサポートされています。

Javaで使用されているスキームとの主な違いは、_コンテナアノテーション_がないことです。コンテナアノテーションはKotlinコンパイラが自動的に事前定義された名前で生成します。以下の例のアノテーションの場合、コンパイラはコンテナアノテーション `@Tag.Container` を生成します。

```kotlin
@Repeatable
annotation class Tag(val name: String)

// コンパイラは@Tag.Containerコンテナアノテーションを生成します
```

[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/)メタアノテーションを適用し、明示的に宣言されたコンテナアノテーションクラスを引数として渡すことで、コンテナアノテーションのカスタム名を設定できます。

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

リフレクションを介してKotlinまたはJavaの繰り返し可能なアノテーションを抽出するには、[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)
関数を使用します。

Kotlinの繰り返し可能なアノテーションの詳細については、[このKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations)を参照してください。