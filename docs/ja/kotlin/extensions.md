[//]: # (title: 拡張)

Kotlinは、クラスを継承したり、_Decorator_のようなデザインパターンを使用したりすることなく、クラスやインターフェースに新しい機能を追加する機能を提供します。これは、_拡張_と呼ばれる特別な宣言を通じて行われます。

例えば、変更できないサードパーティ製ライブラリのクラスやインターフェースに対して、新しい関数を記述できます。これらの関数は、あたかも元のクラスのメソッドであるかのように、通常の方法で呼び出すことができます。このメカニズムは_拡張関数_と呼ばれます。既存のクラスに新しいプロパティを定義できる_拡張プロパティ_もあります。

## 拡張関数

拡張関数を宣言するには、その名前に_レシーバー型_（拡張される型を指す）をプレフィックスとして付けます。
以下の例は、`MutableList<Int>`に`swap`関数を追加します。

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this'はリストに対応します
    this[index1] = this[index2]
    this[index2] = tmp
}
```

拡張関数内の`this`キーワードは、レシーバーオブジェクト（ドットの前に渡されるもの）に対応します。
これで、任意の`MutableList<Int>`に対してこのような関数を呼び出すことができます。

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()'内の'this'は'list'の値を保持します
```

この関数は任意の`MutableList<T>`に対して意味を持ち、ジェネリックにすることもできます。

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this'はリストに対応します
    this[index1] = this[index2]
    this[index2] = tmp
}
```

レシーバー型式でジェネリック型パラメータを利用できるようにするには、関数名の前にその宣言が必要です。
ジェネリクスに関する詳細については、[ジェネリック関数](generics.md)を参照してください。

## 拡張は_静的に_解決される

拡張は、実際に拡張するクラスを変更しません。拡張を定義することで、クラスに新しいメンバーを挿入するのではなく、この型の変数でドット記法を使って新しい関数を呼び出せるようにするだけです。

拡張関数は_静的に_ディスパッチされます。したがって、どの拡張関数が呼び出されるかは、レシーバー型に基づいてコンパイル時にすでに決定されます。例：

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

この例では_Shape_が出力されます。これは、呼び出される拡張関数が、`Shape`クラスであるパラメータ`s`の宣言された型にのみ依存するためです。

あるクラスがメンバー関数を持ち、かつ、同じレシーバー型、同じ名前で、指定された引数に適用可能な拡張関数が定義されている場合、_常にメンバーが優先されます_。例：

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

このコードは_Class method_を出力します。

ただし、拡張関数が同じ名前で異なるシグネチャを持つメンバー関数をオーバーロードすることはまったく問題ありません。

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

## Null許容レシーバー

拡張は、null許容レシーバー型で定義できることに注意してください。これらの拡張は、その値がnullであってもオブジェクト変数に対して呼び出すことができます。レシーバーが`null`の場合、`this`も`null`になります。したがって、null許容レシーバー型で拡張を定義する場合、コンパイラエラーを避けるために、関数本体内で`this == null`チェックを実行することをお勧めします。

Kotlinでは`toString()`をnullチェックなしで呼び出すことができます。なぜなら、そのチェックはすでに拡張関数内で実行されているからです。

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // nullチェックの後、'this'は非null許容型に自動キャストされるため、以下のtoString()は
    // Anyクラスのメンバー関数として解決されます
    return toString()
}
```

## 拡張プロパティ

Kotlinは関数と同様に拡張プロパティもサポートしています。

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> 拡張は実際にはクラスにメンバーを挿入しないため、拡張プロパティが[バッキングフィールド](properties.md#backing-fields)を持つ効率的な方法はありません。このため、_拡張プロパティには初期化子を許可していません_。その動作は、明示的にゲッター/セッターを提供することによってのみ定義できます。
>
{style="note"}

例：

```kotlin
val House.number = 1 // エラー: 拡張プロパティに初期化子は許可されていません
```

## コンパニオンオブジェクト拡張

クラスに[コンパニオンオブジェクト](object-declarations.md#companion-objects)が定義されている場合、そのコンパニオンオブジェクトに対して拡張関数やプロパティを定義することもできます。コンパニオンオブジェクトの通常のメンバーと同様に、クラス名を修飾子として使用するだけで呼び出すことができます。

```kotlin
class MyClass {
    companion object { }  // "Companion"と名付けられます
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 拡張のスコープ

ほとんどの場合、拡張はパッケージ直下のトップレベルで定義します。

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

宣言パッケージの外で拡張を使用するには、呼び出し側でインポートします。

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

あるクラスの内部で、別のクラスの拡張を宣言することができます。このような拡張の内部では、複数の_暗黙のレシーバー_、つまり修飾子なしでメンバーにアクセスできるオブジェクトが存在します。拡張が宣言されているクラスのインスタンスは_ディスパッチレシーバー_と呼ばれ、拡張メソッドのレシーバー型のインスタンスは_拡張レシーバー_と呼ばれます。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // Host.printHostname()を呼び出す
        print(":")
        printPort()   // Connection.printPort()を呼び出す
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // 拡張関数を呼び出す
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // エラー、拡張関数はConnectionの外部では利用できません
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ディスパッチレシーバーと拡張レシーバーのメンバー間で名前の競合が発生した場合、拡張レシーバーが優先されます。ディスパッチレシーバーのメンバーを参照するには、[修飾`this`構文](this-expressions.md#qualified-this)を使用できます。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // Host.toString()を呼び出す
        this@Connection.toString()  // Connection.toString()を呼び出す
    }
}
```

メンバーとして宣言された拡張は`open`として宣言でき、サブクラスでオーバーライドできます。これは、これらの関数のディスパッチはディスパッチレシーバー型に関しては仮想的ですが、拡張レシーバー型に関しては静的であることを意味します。

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
        b.printFunctionInfo()   // 拡張関数を呼び出す
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
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - ディスパッチレシーバーは仮想的に解決される
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - 拡張レシーバーは静的に解決される
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 可視性に関する注意

拡張は、同じスコープで宣言された通常の関数と同じ[可視性修飾子](visibility-modifiers.md)を利用します。例えば：

*   ファイルのトップレベルで宣言された拡張は、同じファイル内の他の`private`トップレベル宣言にアクセスできます。
*   拡張がそのレシーバー型の外部で宣言されている場合、レシーバーの`private`または`protected`メンバーにアクセスできません。