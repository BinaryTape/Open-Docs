[//]: # (title: アノテーション)

アノテーションはコードにメタデータを付加する手段です。アノテーションを宣言するには、クラスの前に `annotation` 修飾子を置きます。

```kotlin
annotation class Fancy
```

アノテーションの追加の属性は、アノテーションクラスにメタアノテーションを付加することで指定できます。

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html): そのアノテーションを付加できる可能な要素の種類 (クラス、関数、プロパティ、式など) を指定します。
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html): アノテーションがコンパイルされたクラスファイルに格納されるかどうか、および実行時にリフレクションを通じて可視であるかどうかを指定します (デフォルトでは両方とも `true` です)。
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html): 単一の要素に同じアノテーションを複数回使用することを許可します。
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html): アノテーションが公開APIの一部であり、生成されたAPIドキュメントに表示されるクラスまたはメソッドのシグネチャに含めるべきであることを指定します。

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER, 
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 使用方法

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

クラスのプライマリコンストラクタにアノテーションを付加する必要がある場合、コンストラクタ宣言に `constructor` キーワードを追加し、その前にアノテーションを追加する必要があります。

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

プロパティアクセサにもアノテーションを付加できます。

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## コンストラクタ

アノテーションはパラメータを取るコンストラクタを持つことができます。

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

許可されるパラメータ型は次のとおりです。

 * Javaプリミティブ型に対応する型 (Int, Long など)
 * 文字列
 * クラス (`Foo::class`)
 * 列挙型
 * 他のアノテーション
 * 上記に挙げられた型の配列

アノテーションのパラメータはnull許容型を持つことはできません。これは、JVMがアノテーション属性の値として `null` を格納することをサポートしていないためです。

あるアノテーションが他のアノテーションのパラメータとして使用される場合、その名前には `@` 文字が前に付加されません。

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

クラスをアノテーションの引数として指定する必要がある場合、Kotlinのクラス ([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)) を使用します。Kotlinコンパイラはそれを自動的にJavaクラスに変換するため、Javaコードはアノテーションと引数に通常通りアクセスできます。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## インスタンス化

Javaでは、アノテーション型はインターフェースの一種であるため、それを実装してインスタンスを使用できます。このメカニズムの代替として、Kotlinでは、任意のコードでアノテーションクラスのコンストラクタを呼び出し、同様に結果のインスタンスを使用できます。

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

アノテーションクラスのインスタンス化については、[このKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)で詳しく学ぶことができます。

## ラムダ

アノテーションはラムダでも使用できます。それらは、ラムダの本体が生成される `invoke()` メソッドに適用されます。これは、コンカレンシー制御にアノテーションを使用する[Quasar](https://docs.paralleluniverse.co/quasar/)のようなフレームワークで役立ちます。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## アノテーションのユースサイトターゲット

プロパティまたはプライマリコンストラクタのパラメータにアノテーションを付加する場合、対応するKotlin要素から複数のJava要素が生成されるため、生成されたJavaバイトコードにはアノテーションの可能な複数の場所が存在します。アノテーションがどのように正確に生成されるべきかを指定するには、以下の構文を使用します。

```kotlin
class Example(@field:Ann val foo,    // annotate Java field
              @get:Ann val bar,      // annotate Java getter
              @param:Ann val quux)   // annotate Java constructor parameter
```

同じ構文を使用してファイル全体にアノテーションを付加できます。これを行うには、`file` ターゲットを持つアノテーションをファイルのトップレベルに、パッケージディレクティブの前、またはファイルがデフォルトパッケージにある場合はすべてのimport文の前に配置します。

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

同じターゲットを持つ複数のアノテーションがある場合、ターゲットの後に角括弧を追加し、すべてのアノテーションを角括弧内に配置することで、ターゲットの繰り返しを避けることができます。

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

サポートされているユースサイトターゲットの全リストは次のとおりです。

  * `file`
  * `property` (このターゲットを持つアノテーションはJavaから可視ではありません)
  * `field`
  * `get` (プロパティゲッター)
  * `set` (プロパティセッター)
  * `receiver` (拡張関数またはプロパティのレシーバパラメータ)
  * `param` (コンストラクタパラメータ)
  * `setparam` (プロパティセッターパラメータ)
  * `delegate` (委譲されたプロパティの委譲インスタンスを格納するフィールド)

拡張関数のレシーバパラメータにアノテーションを付加するには、以下の構文を使用します。

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

ユースサイトターゲットを指定しない場合、使用されているアノテーションの `@Target` アノテーションに従ってターゲットが選択されます。複数の適用可能なターゲットがある場合、以下のリストから最初の適用可能なターゲットが使用されます。

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
    // apply @Rule annotation to property getter
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

Javaで書かれたアノテーションのパラメータの順序は定義されていないため、引数を渡すのに通常の関数呼び出し構文を使用することはできません。代わりに、名前付き引数構文を使用する必要があります。

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

Javaと同様に、`value` パラメータは特殊なケースであり、その値は明示的な名前なしで指定できます。

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

Javaの `value` 引数が配列型を持つ場合、Kotlinでは `vararg` パラメータになります。

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

配列型を持つ他の引数については、配列リテラル構文または `arrayOf(...)` を使用する必要があります。

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

アノテーションインスタンスの値は、Kotlinコードに対してプロパティとして公開されます。

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

KotlinアノテーションがそのKotlinターゲットに `TYPE` を持つ場合、そのアノテーションは、Javaアノテーションターゲットのリストで `java.lang.annotation.ElementType.TYPE_USE` にマップされます。これは、`TYPE_PARAMETER` Kotlinターゲットが `java.lang.annotation.ElementType.TYPE_PARAMETER` Javaターゲットにマップされるのと同様です。これは、これらのターゲットがAPIに存在しないAPIレベル26未満のAndroidクライアントにとって問題となります。

`TYPE_USE` および `TYPE_PARAMETER` アノテーションターゲットの生成を避けるには、新しいコンパイラ引数 `-Xno-new-java-annotation-targets` を使用します。

## 繰り返し可能なアノテーション

[Java](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)と同様に、Kotlinには繰り返し可能なアノテーションがあり、これらは単一のコード要素に複数回適用できます。アノテーションを繰り返し可能にするには、その宣言を [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) メタアノテーションでマークします。これにより、KotlinとJavaの両方で繰り返し可能になります。Javaの繰り返し可能なアノテーションもKotlin側からサポートされています。

Javaで使用されているスキームとの主な違いは、_コンテイニングアノテーション_ の不在です。これはKotlinコンパイラが所定の名前で自動的に生成します。以下の例のアノテーションの場合、コンテイニングアノテーション `@Tag.Container` を生成します。

```kotlin
@Repeatable
annotation class Tag(val name: String)

// コンパイラは @Tag.Container コンテイニングアノテーションを生成します
```

[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) メタアノテーションを適用し、明示的に宣言されたコンテイニングアノテーションクラスを引数として渡すことで、コンテイニングアノテーションのカスタム名を設定できます。

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

リフレクションを介してKotlinまたはJavaの繰り返し可能なアノテーションを抽出するには、[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 関数を使用します。

Kotlinの繰り返し可能なアノテーションについては、[このKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md)で詳しく学ぶことができます。