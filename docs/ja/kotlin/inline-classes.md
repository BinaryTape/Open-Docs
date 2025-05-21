---
title: インライン値クラス
---
時には、よりドメイン固有の型を作成するために、値をクラスでラップすると便利なことがあります。しかし、追加のヒープ割り当てにより、ランタイムのオーバーヘッドが発生します。さらに、ラップされた型がプリミティブ型である場合、パフォーマンスの低下は著しくなります。なぜなら、プリミティブ型は通常ランタイムによって高度に最適化されていますが、そのラッパーは特別な扱いを受けないためです。

このような問題を解決するために、Kotlinは _インラインクラス_(inline class)と呼ばれる特別な種類のクラスを導入しました。インラインクラスは、[value-based classes](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes)のサブセットです。これらはアイデンティティを持たず、値のみを保持できます。

インラインクラスを宣言するには、クラス名の前に `value` 修飾子を使用します。

```kotlin
value class Password(private val s: String)
```

JVMバックエンド用のインラインクラスを宣言するには、クラス宣言の前に `@JvmInline` アノテーションとともに `value` 修飾子を使用します。

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

インラインクラスは、プライマリコンストラクタで初期化される単一のプロパティを持つ必要があります。実行時には、インラインクラスのインスタンスは、この単一のプロパティを使用して表現されます（ランタイム表現の詳細については[下記](#representation)を参照）。

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

これがインラインクラスの主な機能であり、名前の由来である *インライン* (inline) につながっています。クラスのデータは、その使用箇所に*インライン化* (inlined) されます（[インライン関数](inline-functions)の内容が呼び出しサイトにインライン化されるのと同様です）。

## メンバー (Members)

インラインクラスは、通常のクラスの一部の機能をサポートしています。特に、プロパティと関数を宣言したり、`init` ブロックと[セカンダリコンストラクタ](classes#secondary-constructors)を持つことができます。

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

インラインクラスのプロパティは、[backing fields](properties#backing-fields)を持つことができません。これらは、単純な計算可能なプロパティ（`lateinit`/委譲プロパティなし）のみを持つことができます。

## 継承 (Inheritance)

インラインクラスは、インターフェースから継承できます。

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

インラインクラスがクラス階層に参加することは禁止されています。これは、インラインクラスが他のクラスを拡張できず、常に `final` であることを意味します。

## 表現 (Representation)

生成されたコードでは、Kotlinコンパイラは各インラインクラスの*ラッパー* (wrapper)を保持します。インラインクラスのインスタンスは、実行時にラッパーまたは基になる型として表現できます。これは、`Int` がプリミティブな `int` またはラッパー `Integer` として[表現](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)できるのと同様です。

Kotlinコンパイラは、最もパフォーマンスが高く最適化されたコードを生成するために、ラッパーの代わりに基になる型を使用することを優先します。ただし、場合によってはラッパーを保持する必要があります。経験則として、インラインクラスが別の型として使用される場合は常にボックス化されます。

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

インラインクラスは基になる値とラッパーの両方として表現される可能性があるため、[参照の等価性](equality#referential-equality)はそれらには無意味であり、禁止されています。

インラインクラスは、基になる型としてジェネリック型パラメータを持つこともできます。この場合、コンパイラはそれを `Any?` 、または一般に型パラメータの上限にマップします。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

### マングリング (Mangling)

インラインクラスは基になる型にコンパイルされるため、予期しないプラットフォームシグネチャの衝突など、さまざまなわかりにくいエラーが発生する可能性があります。

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

このような問題を軽減するために、インラインクラスを使用する関数は、関数名に安定したハッシュコードを追加することによって*マングル* (mangled)されます。したがって、`fun compute(x: UInt)` は `public final void compute-<hashcode>(int x)` として表現され、競合の問題が解決されます。

### Javaコードからの呼び出し (Calling from Java code)

Javaコードからインラインクラスを受け入れる関数を呼び出すことができます。これを行うには、手動でマングリングを無効にする必要があります。関数宣言の前に `@JvmName` アノテーションを追加します。

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## インラインクラス vs 型エイリアス (Inline classes vs type aliases)

一見すると、インラインクラスは[型エイリアス](type-aliases)と非常によく似ています。実際、どちらも新しい型を導入するように見え、どちらも実行時には基になる型として表現されます。

ただし、重要な違いは、型エイリアスが基になる型（および同じ基になる型を持つ他の型エイリアス）と*代入互換性* (assignment-compatible)があるのに対し、インラインクラスはそうではないことです。

言い換えれば、インラインクラスは真に _新しい_ 型を導入しますが、型エイリアスは既存の型の代替名（エイリアス）のみを導入します。

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

## インラインクラスと委譲 (Inline classes and delegation)

インターフェースを使用すると、インラインクラスのインライン化された値への委譲による実装が可能です。

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
```