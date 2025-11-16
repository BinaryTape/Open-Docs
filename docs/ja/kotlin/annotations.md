[//]: # (title: アノテーション)

アノテーションは、コードにメタデータを付加する手段です。アノテーションを宣言するには、クラスの前に `annotation` 修飾子を付けます。

```kotlin
annotation class Fancy
```

アノテーションの追加属性は、アノテーションクラスにメタアノテーションを付加することで指定できます。

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) は、アノテーションを付加できる要素の種類 (クラス、関数、プロパティ、式など) を指定します。
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) は、コンパイルされたクラスファイルにアノテーションが保存されるか、および実行時にリフレクションを通じて参照できるか (デフォルトでは両方とも `true`) を指定します。
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) は、同じアノテーションを単一の要素に複数回使用することを許可します。
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) は、そのアノテーションが公開APIの一部であり、生成されるAPIドキュメントに表示されるクラスまたはメソッドのシグネチャに含めるべきであることを指定します。

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

クラスのプライマリコンストラクタにアノテーションを付加する必要がある場合は、コンストラクタ宣言に `constructor` キーワードを追加し、その前にアノテーションを追加する必要があります。

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

プロパティアクセサーにもアノテーションを付加できます。

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

許可されるパラメータの型は以下の通りです。

 * Javaのプリミティブ型に対応する型 (Int、Longなど)
 * 文字列
 * クラス (`Foo::class`)
 * 列挙型
 * その他のアノテーション
 * 上記リストの型の配列

アノテーションのパラメータはNull許容型にできません。なぜなら、JVMは`null`をアノテーション属性の値として格納することをサポートしていないためです。

アノテーションが別の型のアノテーションのパラメータとして使用される場合、その名前には`@`文字が接頭辞として付きません。

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

アノテーションの引数としてクラスを指定する必要がある場合は、Kotlinクラス ([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)) を使用します。Kotlinコンパイラはそれを自動的にJavaクラスに変換するため、Javaコードはアノテーションと引数に通常通りアクセスできます。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## インスタンス化

Javaでは、アノテーション型はインターフェースの一種であるため、それを実装してインスタンスを使用できます。このメカニズムの代替として、Kotlinではアノテーションクラスのコンストラクタを任意のコードで呼び出し、結果として得られるインスタンスを同様に使用できます。

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

アノテーションクラスのインスタンス化に関する詳細は、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)で学ぶことができます。

## ラムダ

アノテーションはラムダにも使用できます。これらは、ラムダの本体が生成される`invoke()`メソッドに適用されます。これは、並行性制御にアノテーションを使用する[Quasar](https://docs.paralleluniverse.co/quasar/)のようなフレームワークに役立ちます。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## アノテーションのユースサイトターゲット

プロパティまたはプライマリコンストラクタのパラメータにアノテーションを付加する場合、対応するKotlin要素から複数のJava要素が生成され、それゆえに生成されたJavaバイトコードにアノテーションを配置できる場所が複数存在します。アノテーションを正確にどのように生成するかを指定するには、以下の構文を使用します。

```kotlin
class Example(@field:Ann val foo,    // Javaフィールドのみにアノテーションを付加
              @get:Ann val bar,      // Javaゲッターのみにアノテーションを付加
              @param:Ann val quux)   // Javaコンストラクタパラメータのみにアノテーションを付加
```

同じ構文を使用してファイル全体にアノテーションを付加することもできます。これを行うには、ファイルのトップレベル、パッケージディレクティブの前、またはファイルがデフォルトパッケージにある場合はすべてのインポートの前に、`file`ターゲットを持つアノテーションを配置します。

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

同じターゲットを持つ複数のアノテーションがある場合、ターゲットの後ろに角括弧を追加し、すべてのアノテーションを角括弧の中に入れることで (例外として`all`メタターゲットを除く)、ターゲットの繰り返しを避けることができます。

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

サポートされているユースサイトターゲットの完全なリストは以下の通りです。

  * `file`
  * `field`
  * `property` (このターゲットを持つアノテーションはJavaからは見えません)
  * `get` (プロパティのゲッター)
  * `set` (プロパティのセッター)
  * `all` (プロパティ用の実験的なメタターゲット。その目的と使用法については[以下](#all-meta-target)を参照)
  * `receiver` (拡張関数またはプロパティのレシーバーパラメータ)

    拡張関数のレシーバーパラメータにアノテーションを付加するには、以下の構文を使用します。

    ```kotlin
    fun @receiver:Fancy String.myExtension() { ... }
    ```

  * `param` (コンストラクタパラメータ)
  * `setparam` (プロパティセッターパラメータ)
  * `delegate` (委譲プロパティの委譲インスタンスを格納するフィールド)

### ユースサイトターゲットが指定されていない場合のデフォルト

ユースサイトターゲットを指定しない場合、使用されるアノテーションの`@Target`アノテーションに従ってターゲットが選択されます。
複数の適用可能なターゲットがある場合、以下のリストから最初の適用可能なターゲットが使用されます。

* `param`
* `property`
* `field`

[Jakarta Bean Validationの`@Email`アノテーション](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email)を例にとってみましょう。

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

このアノテーションを使用して、以下の例を考えてみましょう。

```kotlin
data class User(val username: String,
                // @Email は @param:Email と同等
                @Email val email: String) {
    // @Email は @field:Email と同等
    @Email val secondaryEmail: String? = null
}
```

Kotlin 2.2.0では、アノテーションをパラメータ、フィールド、プロパティに伝播させることをより予測可能にするための実験的なデフォルトルールが導入されました。

新しいルールでは、複数の適用可能なターゲットがある場合、1つまたは複数が次のように選択されます。

* コンストラクタパラメータターゲット (`param`) が適用可能な場合、それが使用されます。
* プロパティターゲット (`property`) が適用可能な場合、それが使用されます。
* フィールドターゲット (`field`) が適用可能で`property`が適用可能でない場合、`field`が使用されます。

同じ例を使用します。

```kotlin
data class User(val username: String,
                // @Email は @param:Email @field:Email と同等になりました
                @Email val email: String) {
    // @Email は依然として @field:Email と同等です
    @Email val secondaryEmail: String? = null
}
```

複数のターゲットがあり、`param`、`property`、`field`のいずれも適用できない場合、アノテーションは無効になります。

新しいデフォルトルールを有効にするには、Gradle設定に次の行を追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

従来の動作を使用したい場合は、次のいずれかの方法で行うことができます。

* 特定のケースでは、`@Annotation`の代わりに`@param:Annotation`を使用するなど、必要なターゲットを明示的に指定します。
* プロジェクト全体では、Gradleビルドファイルでこのフラグを使用します。

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

### `all` メタターゲット

<primary-label ref="experimental-opt-in"/>

`all`ターゲットを使用すると、同じアノテーションをパラメータ、プロパティ、またはフィールドだけでなく、対応するゲッターとセッターにも簡単に適用できます。

具体的には、`all`でマークされたアノテーションは、適用可能な場合、以下に伝播されます。

* プロパティがプライマリコンストラクタで定義されている場合、コンストラクタパラメータ (`param`) へ。
* プロパティ自体 (`property`) へ。
* プロパティがバッキングフィールドを持つ場合、バッキングフィールド (`field`) へ。
* ゲッター (`get`) へ。
* プロパティが`var`として定義されている場合、セッターパラメータ (`setparam`) へ。
* クラスが`@JvmRecord`アノテーションを持つ場合、Javaのみのターゲットである`RECORD_COMPONENT`へ。

[Jakarta Bean Validationの`@Email`アノテーション](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email)を例にとってみましょう。これは以下のように定義されています。

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

以下の例では、この`@Email`アノテーションはすべての関連ターゲットに適用されます。

```kotlin
data class User(
    val username: String,
    // @Emailをparam、field、getに適用
    @all:Email val email: String,
    // @Emailをparam、field、get、setparamに適用
    @all:Email var name: String,
) {
    // @Emailをfieldとgetterに適用 (コンストラクタ内ではないためparamはなし)
    @all:Email val secondaryEmail: String? = null
}
```

`all`メタターゲットは、プライマリコンストラクタの内外にかかわらず、任意のプロパティで使用できます。

#### 制限事項

`all`ターゲットにはいくつかの制限があります。

* 型、潜在的な拡張レシーバー、またはコンテキストレシーバーやパラメータにアノテーションを伝播しません。
* 複数のアノテーションと一緒に使用することはできません。
    ```kotlin
    @all:[A B] // 禁止、@all:A @all:B を使用してください
    val x: Int = 5
    ```
* [委譲プロパティ](delegated-properties.md)と一緒に使用することはできません。

#### 有効化方法

プロジェクトで`all`メタターゲットを有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

```Bash
-Xannotation-target-all
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

## Javaアノテーション

JavaアノテーションはKotlinと100%互換性があります。

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // @Rule アノテーションをプロパティゲッターに適用
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

Javaで記述されたアノテーションのパラメータの順序は定義されていないため、引数を渡すのに通常の関数呼び出し構文は使用できません。代わりに、名前付き引数構文を使用する必要があります。

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

Javaと同様に、`value`パラメータは特殊なケースであり、その値は明示的な名前なしで指定できます。

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

Javaの`value`引数が配列型の場合、Kotlinでは`vararg`パラメータになります。

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

配列型を持つ他の引数については、配列リテラル構文または`arrayOf(...)`を使用する必要があります。

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

### JVM 1.8以降のアノテーションターゲットを生成しない機能

KotlinアノテーションがKotlinターゲットに`TYPE`を持つ場合、そのアノテーションはJavaアノテーションターゲットのリストで`java.lang.annotation.ElementType.TYPE_USE`にマッピングされます。これは、`TYPE_PARAMETER` Kotlinターゲットが`java.lang.annotation.ElementType.TYPE_PARAMETER` Javaターゲットにマッピングされるのと同様です。これは、APIレベルが26未満のAndroidクライアントにとって問題となります。これらのAPIレベルでは、これらのターゲットがAPIに含まれていないためです。

`TYPE_USE`および`TYPE_PARAMETER`アノテーションターゲットの生成を回避するには、新しいコンパイラ引数`-Xno-new-java-annotation-targets`を使用します。

## 繰り返し可能なアノテーション

[Javaと同様に](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)、Kotlinには繰り返し可能なアノテーションがあり、単一のコード要素に複数回適用できます。アノテーションを繰り返し可能にするには、その宣言を[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)メタアノテーションでマークします。これにより、KotlinとJavaの両方で繰り返し可能になります。Javaの繰り返し可能なアノテーションもKotlin側からサポートされています。

Javaで使用されるスキームとの主な違いは、_コンテナアノテーション_がないことです。これはKotlinコンパイラが事前定義された名前で自動的に生成します。以下の例のアノテーションの場合、コンパイラはコンテナアノテーション`@Tag.Container`を生成します。

```kotlin
@Repeatable
annotation class Tag(val name: String)

// コンパイラは@Tag.Container コンテナアノテーションを生成します
```

コンテナアノテーションのカスタム名を設定するには、[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-repeatable/)メタアノテーションを適用し、引数として明示的に宣言されたコンテナアノテーションクラスを渡します。

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

リフレクション経由でKotlinまたはJavaの繰り返し可能なアノテーションを抽出するには、[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)関数を使用します。

Kotlinの繰り返し可能なアノテーションに関する詳細は、[こちらのKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md)で学ぶことができます。