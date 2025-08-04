[//]: # (title: インライン値クラス)

値をクラスでラップして、よりドメイン固有の型を作成すると便利な場合があります。しかし、これにより追加のヒープ割り当てが発生し、実行時のオーバーヘッドが生じます。さらに、ラップされる型がプリミティブ型の場合、そのパフォーマンスへの影響は大きくなります。なぜなら、プリミティブ型は通常ランタイムによって高度に最適化されるのに対し、そのラッパーは特別な扱いを受けないためです。

このような問題を解決するため、Kotlinは_インラインクラス_と呼ばれる特別な種類のクラスを導入しています。インラインクラスは、[値ベースのクラス](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md)のサブセットです。これらはアイデンティティを持たず、値のみを保持できます。

インラインクラスを宣言するには、クラス名の前に`value`修飾子を使用します。

```kotlin
value class Password(private val s: String)
```

JVMバックエンド用のインラインクラスを宣言するには、クラス宣言の前に`value`修飾子と`@JvmInline`アノテーションを併用します。

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

インラインクラスは、プライマリコンストラクタで初期化される単一のプロパティを持たなければなりません。実行時には、インラインクラスのインスタンスはこの単一のプロパティを使用して表現されます（実行時表現の詳細については[以下](#representation)を参照してください）。

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

これがインラインクラスの主要な特徴であり、その名前である_inline_の由来となっています。クラスのデータは、その使用箇所に_インライン化_されます（[インライン関数](inline-functions.md)のコンテンツが呼び出しサイトにインライン化されるのと同様です）。

## メンバー

インラインクラスは、通常のクラスの一部の機能をサポートしています。特に、プロパティと関数を宣言したり、`init`ブロックや[セカンダリコンストラクタ](classes.md#secondary-constructors)を持つことが許されています。

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

インラインクラスのプロパティは[バッキングフィールド](properties.md#backing-fields)を持つことはできません。単純な計算可能プロパティのみを持つことができます（`lateinit`やデリゲートプロパティは不可）。

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

インラインクラスがクラス階層に参加することは禁止されています。これは、インラインクラスが他のクラスを拡張できず、常に`final`であることを意味します。

## 表現

生成されたコードでは、Kotlinコンパイラは各インラインクラスの_ラッパー_を保持します。インラインクラスのインスタンスは、実行時にラッパーとして、または基底型として表現されます。これは、`Int`がプリミティブな`int`として、またはラッパー`Integer`として[表現される](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)のと同様です。

Kotlinコンパイラは、最も高性能で最適化されたコードを生成するために、ラッパーではなく基底型を使用することを優先します。しかし、時にはラッパーを保持する必要がある場合もあります。経験則として、インラインクラスが別の型として使用されるたびにボックス化されます。

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

インラインクラスは基底値としてもラッパーとしても表現されうるため、それらに対する[参照等価性](equality.md#referential-equality)は無意味であり、したがって禁止されています。

インラインクラスは、基底型として総称型パラメータを持つこともできます。この場合、コンパイラはそれを`Any?`、または一般的には型パラメータの上限にマッピングします。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

### マングリング

インラインクラスは基底型にコンパイルされるため、予期せぬプラットフォームシグネチャの衝突など、様々な不可解なエラーにつながる可能性があります。

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

このような問題を軽減するために、インラインクラスを使用する関数は、関数名に安定したハッシュコードを追加することで_マングリング_されます。したがって、`fun compute(x: UInt)`は`public final void compute-<hashcode>(int x)`として表現され、衝突の問題が解決されます。

### Javaコードからの呼び出し

インラインクラスを受け入れる関数をJavaコードから呼び出すことができます。そのためには、手動でマングリングを無効にする必要があります。関数宣言の前に`@JvmName`アノテーションを追加します。

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

デフォルトでは、Kotlinはインラインクラスを**アンボックス化された表現**でコンパイルするため、Javaからのアクセスが困難になります。
Javaからアクセス可能な**ボックス化された表現**にインラインクラスをコンパイルする方法については、[JavaからKotlinを呼び出す](java-to-kotlin-interop.md#inline-value-classes)ガイドを参照してください。

## インラインクラスと型エイリアス

一見すると、インラインクラスは[型エイリアス](type-aliases.md)と非常によく似ています。確かに、どちらも新しい型を導入しているように見え、どちらも実行時には基底型として表現されます。

しかし、決定的な違いは、型エイリアスがその基底型（および同じ基底型を持つ他の型エイリアス）と_代入互換_であるのに対し、インラインクラスはそうではないという点です。

言い換えれば、インラインクラスは真に_新しい_型を導入しますが、型エイリアスは既存の型に対する別名（エイリアス）を導入するに過ぎません。

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

## インラインクラスとデリゲート

インライン化されたクラスのインライン化された値へのデリゲートによる実装は、インターフェースで許可されています。

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