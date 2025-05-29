[//]: # (title: 拡張機能)

Kotlinは、クラスを継承したり_Decorator_のようなデザインパターンを使用したりすることなく、既存のクラスやインターフェースに新しい機能を追加する機能を提供します。これは_拡張機能_と呼ばれる特別な宣言によって行われます。

例えば、修正できないサードパーティライブラリのクラスやインターフェースのために新しい関数を作成できます。このような関数は、元のクラスのメソッドであるかのように、通常の方法で呼び出すことができます。この仕組みは_拡張関数_と呼ばれます。既存のクラスに新しいプロパティを定義できる_拡張プロパティ_もあります。

## 拡張関数

拡張関数を宣言するには、その名前の前に、拡張される型を指す_レシーバ型_をプレフィックスとして付けます。
以下は`MutableList<Int>`に`swap`関数を追加します。

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' はリストに対応します
    this[index1] = this[index2]
    this[index2] = tmp
}
```

拡張関数内の`this`キーワードは、レシーバオブジェクト（ドットの前に渡されるもの）に対応します。
これで、任意の`MutableList<Int>`でこのような関数を呼び出すことができます。

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()' 内の 'this' は 'list' の値を保持します
```

この関数は任意の`MutableList<T>`に対して意味があり、ジェネリックにすることもできます。

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' はリストに対応します
    this[index1] = this[index2]
    this[index2] = tmp
}
```

レシーバ型式でジェネリック型パラメータを利用可能にするには、関数名の前にジェネリック型パラメータを宣言する必要があります。
ジェネリクスに関する詳細については、[ジェネリック関数](generics.md)を参照してください。

## 拡張機能は**静的に**解決される

拡張機能は、実際に拡張するクラスを変更するわけではありません。拡張機能を定義しても、クラスに新しいメンバーが挿入されるわけではなく、この型の変数に対してドット表記で新しい関数を呼び出せるようになるだけです。

拡張関数は**静的に**ディスパッチされます。そのため、どの拡張関数が呼び出されるかは、レシーバ型に基づいてコンパイル時にすでにわかっています。例えば：

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

この例では、呼び出される拡張関数がパラメータ`s`の宣言された型（`Shape`クラス）にのみ依存するため、_Shape_と出力されます。

クラスにメンバー関数があり、同じレシーバ型、同じ名前を持ち、指定された引数に適用可能な拡張関数が定義されている場合、_メンバーが常に優先されます_。例えば：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

このコードは_Class method_と出力します。

ただし、拡張関数が同じ名前だが異なるシグネチャを持つメンバー関数をオーバーロードすることは全く問題ありません。

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Nullableレシーバ

拡張機能はNullableレシーバ型で定義できることに注意してください。これらの拡張機能は、オブジェクト変数の値が`null`であっても呼び出すことができます。レシーバが`null`の場合、`this`も`null`になります。したがって、Nullableレシーバ型で拡張機能を定義する際は、コンパイラエラーを避けるために関数本体内で`this == null`チェックを実行することをお勧めします。

Kotlinでは`null`チェックなしで`toString()`を呼び出すことができます。これは、チェックがすでに拡張関数内で行われるためです。

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // nullチェックの後、'this' は非Nullable型に自動キャストされるため、以下のtoString()
    // はAnyクラスのメンバー関数として解決されます
    return toString()
}
```

## 拡張プロパティ

Kotlinは、関数をサポートするのと同様に、拡張プロパティもサポートします。

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> 拡張機能は実際にクラスにメンバーを挿入しないため、拡張プロパティが[バッキングフィールド](properties.md#backing-fields)を持つ効率的な方法はありません。このため、_拡張プロパティには初期化子が許可されません_。その動作は、明示的にゲッター/セッターを提供することによってのみ定義できます。
>
{style="note"}

例：

```kotlin
val House.number = 1 // error: initializers are not allowed for extension properties
```

## コンパニオンオブジェクトの拡張

クラスに[コンパニオンオブジェクト](object-declarations.md#companion-objects)が定義されている場合、そのコンパニオンオブジェクトに対して拡張関数や拡張プロパティを定義することもできます。コンパニオンオブジェクトの通常のメンバーと同様に、クラス名のみを修飾子として使用して呼び出すことができます。

```kotlin
class MyClass {
    companion object { }  // "Companion" と呼ばれます
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 拡張のスコープ

ほとんどの場合、拡張はトップレベル、つまりパッケージ直下に定義します。

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

拡張をその宣言パッケージの外部で使用するには、呼び出しサイトでインポートします。

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

詳細については、[インポート](packages.md#imports)を参照してください。

## メンバーとしての拡張の宣言

あるクラスの内部に別のクラスのための拡張を宣言することができます。このような拡張内部には、複数の_暗黙のレシーバ_、つまり修飾子なしでメンバーにアクセスできるオブジェクトが存在します。拡張が宣言されているクラスのインスタンスは_ディスパッチレシーバ_と呼ばれ、拡張メソッドのレシーバ型のインスタンスは_拡張レシーバ_と呼ばれます。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // Host.printHostname() を呼び出します
        print(":")
        printPort()   // Connection.printPort() を呼び出します
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // 拡張関数を呼び出します
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // エラー、Connectionの外部では拡張関数は利用できません
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ディスパッチレシーバと拡張レシーバのメンバー間で名前衝突が発生した場合、拡張レシーバが優先されます。ディスパッチレシーバのメンバーを参照するには、[修飾された `this` 構文](this-expressions.md#qualified-this)を使用できます。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // Host.toString() を呼び出します
        this@Connection.toString()  // Connection.toString() を呼び出します
    }
}
```

メンバーとして宣言された拡張は`open`として宣言し、サブクラスでオーバーライドできます。これは、そのような関数のディスパッチが、ディスパッチレシーバ型に関しては仮想的ですが、拡張レシーバ型に関しては静的であることを意味します。

```kotlin
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("Base extension function in BaseCaller")
    }

    open fun Derived.printFunctionInfo() {
        println("Derived extension function in BaseCaller")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // 拡張関数を呼び出します
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("Base extension function in DerivedCaller")
    }

    override fun Derived.printFunctionInfo() {
        println("Derived extension function in DerivedCaller")
    }
}

fun main() {
    BaseCaller().call(Base())   // "Base extension function in BaseCaller"
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - ディスパッチレシーバは仮想的に解決されます
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - 拡張レシーバは静的に解決されます
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 可視性に関する注意点

拡張機能は、同じスコープで宣言された通常の関数と同様に、同じ[可視性修飾子](visibility-modifiers.md)を利用します。
例えば：

*   ファイルのトップレベルで宣言された拡張は、同じファイルの他の`private`トップレベル宣言にアクセスできます。
*   拡張がそのレシーバ型の外部で宣言された場合、レシーバの`private`または`protected`メンバーにアクセスできません。