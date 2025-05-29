[//]: # (title: インライン値クラス)

値をクラスでラップして、よりドメイン固有の型を作成すると便利な場合があります。しかし、それは追加のヒープ割り当てのためにランタイムオーバーヘッドを導入します。さらに、ラップされた型がプリミティブ型である場合、プリミティブ型は通常ランタイムによって強く最適化されるのに対し、それらのラッパーは特別な扱いを受けないため、パフォーマンスへの影響は大きくなります。

このような問題を解決するため、Kotlinは_インラインクラス_と呼ばれる特別な種類のクラスを導入しています。インラインクラスは[値ベースクラス](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md)のサブセットです。これらはアイデンティティを持たず、値のみを保持できます。

インラインクラスを宣言するには、クラス名の前に`value`修飾子を使用します。

```kotlin
value class Password(private val s: String)
```

JVMバックエンド用のインラインクラスを宣言するには、クラス宣言の前に`value`修飾子と`@JvmInline`アノテーションを一緒に使用します。

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

インラインクラスは、プライマリコンストラクタで初期化される単一のプロパティを持つ必要があります。ランタイムでは、インラインクラスのインスタンスはこの単一のプロパティを使用して表現されます（ランタイム表現の詳細については[下記](#representation)を参照してください）。

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production")
```

これがインラインクラスの主な機能であり、*インライン*という名前の由来にもなっています。クラスのデータは、その使用箇所に*インライン化*されます（[インライン関数](inline-functions.md)のコンテンツが呼び出し箇所にインライン化されるのと同様です）。

## メンバー

インラインクラスは、通常のクラスの一部の機能をサポートしています。特に、プロパティと関数を宣言したり、`init`ブロックと[セカンダリコンストラクタ](classes.md#secondary-constructors)を持つことが許可されています。

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    init {
        require(fullName.isNotEmpty()) {
            "Full name shouldn't be empty"
        }
    }

    constructor(firstName: String, lastName: String) : this("$firstName $lastName") {
        require(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }

    val length: Int
        get() = fullName.length

    fun greet() {
        println("Hello, $fullName")
    }
}

fun main() {
    val name1 = Person("Kotlin", "Mascot")
    val name2 = Person("Kodee")
    name1.greet() // the `greet()` function is called as a static method
    println(name2.length) // property getter is called as a static method
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

インラインクラスのプロパティは[バッキングフィールド](properties.md#backing-fields)を持つことはできません。これらは単純な計算可能なプロパティのみを持つことができます（`lateinit`/委譲プロパティは不可）。

## 継承

インラインクラスはインターフェースを継承できます。

```kotlin
interface Printable {
    fun prettyPrint(): String
}

@JvmInline
value class Name(val s: String) : Printable {
    override fun prettyPrint(): String = "Let's $s!"
}

fun main() {
    val name = Name("Kotlin")
    println(name.prettyPrint()) // Still called as a static method
}
```

インラインクラスがクラス階層に参加することは禁止されています。これは、インラインクラスが他のクラスを継承できず、常に`final`であることを意味します。

## 表現

生成されたコードでは、Kotlinコンパイラは各インラインクラスの*ラッパー*を保持します。インラインクラスのインスタンスは、ランタイムでラッパーとして、または基となる型として表現できます。これは、`Int`がプリミティブな`int`として、またはラッパーの`Integer`として[表現される](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)のと似ています。

Kotlinコンパイラは、最もパフォーマンスが高く最適化されたコードを生成するために、ラッパーの代わりに基となる型を使用することを優先します。しかし、場合によってはラッパーを維持する必要があります。一般的に、インラインクラスは別の型として使用されると常にボックス化されます。

```kotlin
interface I

@JvmInline
value class Foo(val i: Int) : I

fun asInline(f: Foo) {}
fun <T> asGeneric(x: T) {}
fun asInterface(i: I) {}
fun asNullable(i: Foo?) {}

fun <T> id(x: T): T = x

fun main() {
    val f = Foo(42)

    asInline(f)    // unboxed: used as Foo itself
    asGeneric(f)   // boxed: used as generic type T
    asInterface(f) // boxed: used as type I
    asNullable(f)  // boxed: used as Foo?, which is different from Foo

    // below, 'f' first is boxed (while being passed to 'id') and then unboxed (when returned from 'id')
    // In the end, 'c' contains unboxed representation (just '42'), as 'f'
    val c = id(f)
}
```

インラインクラスは基となる値とラッパーの両方として表現される可能性があるため、[参照等価性](equality.md#referential-equality)はそれらには無意味であり、したがって禁止されています。

インラインクラスは、基となる型としてジェネリック型パラメータを持つこともできます。この場合、コンパイラはそれを`Any?`、または一般的には型パラメータの上限にマッピングします。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

### マングリング

インラインクラスは基となる型にコンパイルされるため、予期しないプラットフォームシグネチャの衝突など、様々な不明瞭なエラーにつながる可能性があります。

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

このような問題を軽減するため、インラインクラスを使用する関数は、関数名に安定したハッシュコードを追加することによって_マングリングされます_。したがって、`fun compute(x: UInt)`は`public final void compute-<hashcode>(int x)`として表現され、衝突問題を解決します。

### Javaコードからの呼び出し

インラインクラスを受け入れる関数をJavaコードから呼び出すことができます。そのためには、手動でマングリングを無効にする必要があります。関数宣言の前に`@JvmName`アノテーションを追加します。

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## インラインクラスと型エイリアス

一見すると、インラインクラスは[型エイリアス](type-aliases.md)と非常によく似ているように見えます。実際、どちらも新しい型を導入するように見え、どちらもランタイムで基となる型として表現されます。

しかし、決定的な違いは、型エイリアスが基となる型（および同じ基となる型を持つ他の型エイリアス）と*代入互換性がある*のに対し、インラインクラスはそうではないという点です。

言い換えれば、インラインクラスは真に_新しい_型を導入します。これは、既存の型に対する別名（エイリアス）を導入するだけの型エイリアスとは対照的です。

```kotlin
typealias NameTypeAlias = String

@JvmInline
value class NameInlineClass(val s: String)

fun acceptString(s: String) {}
fun acceptNameTypeAlias(n: NameTypeAlias) {}
fun acceptNameInlineClass(p: NameInlineClass) {}

fun main() {
    val nameAlias: NameTypeAlias = ""
    val nameInlineClass: NameInlineClass = NameInlineClass("")
    val string: String = ""

    acceptString(nameAlias) // OK: pass alias instead of underlying type
    acceptString(nameInlineClass) // Not OK: can't pass inline class instead of underlying type

    // And vice versa:
    acceptNameTypeAlias(string) // OK: pass underlying type instead of alias
    acceptNameInlineClass(string) // Not OK: can't pass underlying type instead of inline class
}
```

## インラインクラスと委譲

インラインクラスのインライン値への委譲による実装は、インターフェースで許可されています。

```kotlin
interface MyInterface {
    fun bar()
    fun foo() = "foo"
}

@JvmInline
value class MyInterfaceWrapper(val myInterface: MyInterface) : MyInterface by myInterface

fun main() {
    val my = MyInterfaceWrapper(object : MyInterface {
        override fun bar() {
            // body
        }
    })
    println(my.foo()) // prints "foo"
}