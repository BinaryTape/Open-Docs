---
title: 拡張機能
---
Kotlin では、クラスから継承したり、_Decorator_などのデザインパターンを使用したりしなくても、クラスまたはインターフェースに新しい機能を追加する機能が提供されています。これは _extensions_(拡張) と呼ばれる特別な宣言によって行われます。

たとえば、変更できないサードパーティライブラリのクラスまたはインターフェースに対して、新しい関数を作成できます。そのような関数は、元のクラスのメソッドであるかのように、通常の方法で呼び出すことができます。このメカニズムは _extension function_(拡張関数) と呼ばれます。既存のクラスに新しいプロパティを定義できる _extension properties_(拡張プロパティ) もあります。

## Extension functions(拡張関数)

拡張関数を宣言するには、その名前の前に _receiver type_(レシーバー型) を付けます。これは、拡張される型を指します。以下は、`MutableList<Int>` に `swap` 関数を追加します。

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' はリストに対応します
    this[index1] = this[index2]
    this[index2] = tmp
}
```

拡張関数内の `this` キーワードは、レシーバーオブジェクト (ドットの前に渡されるもの) に対応します。これで、任意の `MutableList<Int>` でそのような関数を呼び出すことができます。

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()' 内の 'this' は 'list' の値を保持します
```

この関数は、任意の `MutableList<T>` に対して意味があるため、ジェネリックにすることができます。

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' はリストに対応します
    this[index1] = this[index2]
    this[index2] = tmp
}
```

レシーバー型の式で使用できるようにするには、関数名の前にジェネリック型パラメータを宣言する必要があります。ジェネリクスの詳細については、[generic functions](generics) を参照してください。

## Extensions are resolved _statically_(拡張は _静的に_ 解決される)

拡張は、拡張するクラスを実際に変更するわけではありません。拡張を定義しても、クラスに新しいメンバーを挿入するのではなく、この型の変数でドット表記を使用して新しい関数を呼び出せるようにするだけです。

拡張関数は _statically_(静的に) ディスパッチされます。したがって、どの拡張関数が呼び出されるかは、コンパイル時にレシーバー型に基づいて既にわかっています。例：

```kotlin
fun main() {

    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())

}
```

この例では、呼び出される拡張関数はパラメータ `s` の宣言された型 (つまり `Shape` クラス) にのみ依存するため、_Shape_ が出力されます。

クラスにメンバー関数があり、同じレシーバー型、同じ名前を持ち、指定された引数に適用できる拡張関数が定義されている場合、_メンバーが常に優先されます_。例：

```kotlin
fun main() {

    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()

}
```

このコードは _Class method_ を出力します。

ただし、拡張関数が同じ名前で異なるシグネチャを持つメンバー関数をオーバーロードすることは問題ありません。

```kotlin
fun main() {

    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)

}
```

## Nullable receiver(Nullable レシーバー)

拡張機能は、nullable レシーバー型で定義できることに注意してください。これらの拡張機能は、その値が null であっても、オブジェクト変数で呼び出すことができます。レシーバーが `null` の場合、`this` も `null` になります。したがって、nullable レシーバー型で拡張機能を定義する場合は、コンパイラエラーを回避するために、関数本体内で `this == null` チェックを実行することをお勧めします。

Kotlin では、`null` のチェックは拡張関数内ですでに行われるため、`null` をチェックせずに `toString()` を呼び出すことができます。

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // After the null check, 'this' is autocast to a non-nullable type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```

## Extension properties(拡張プロパティ)

Kotlin は、関数と同様に拡張プロパティをサポートしています。

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

:::note
拡張機能は実際にメンバーをクラスに挿入しないため、拡張プロパティが [backing field](properties#backing-fields)(バッキングフィールド) を持つ効率的な方法はありません。これが、_extension properties(拡張プロパティ) で initializers(初期化子) が許可されていない_ 理由です。それらの動作は、getter/setter を明示的に提供することによってのみ定義できます。

:::

例：

```kotlin
val House.number = 1 // error: initializers are not allowed for extension properties
```

## Companion object extensions(コンパニオンオブジェクトの拡張)

クラスに [companion object](object-declarations#companion-objects)(コンパニオンオブジェクト) が定義されている場合、コンパニオンオブジェクトの拡張関数とプロパティも定義できます。コンパニオンオブジェクトの通常のメンバーと同様に、クラス名を修飾子として使用するだけで呼び出すことができます。

```kotlin
class MyClass {
    companion object { }  // will be called "Companion"
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```

## Scope of extensions(拡張のスコープ)

ほとんどの場合、パッケージの直下のトップレベルで拡張を定義します。

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

宣言パッケージの外で拡張を使用するには、呼び出しサイトでインポートします。

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

詳細については、[Imports](packages#imports)(インポート) を参照してください。

## Declaring extensions as members(メンバーとして拡張を宣言する)

あるクラスの拡張機能を別のクラス内で宣言できます。このような拡張機能内には、複数の _implicit receivers_(暗黙的なレシーバー) があります。これらは、修飾子なしでメンバーにアクセスできるオブジェクトです。拡張機能が宣言されているクラスのインスタンスは _dispatch receiver_(ディスパッチレシーバー) と呼ばれ、拡張メソッドのレシーバー型のインスタンスは _extension receiver_(拡張レシーバー) と呼ばれます。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // calls Host.printHostname()
        print(":")
        printPort()   // calls Connection.printPort()
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // calls the extension function
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // error, the extension function is unavailable outside Connection
}
```

ディスパッチレシーバーのメンバーと拡張レシーバーのメンバーの間で名前の競合が発生した場合、拡張レシーバーが優先されます。ディスパッチレシーバーのメンバーを参照するには、[qualified `this` syntax](this-expressions#qualified-this)(修飾された `this` 構文) を使用できます。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // calls Host.toString()
        this@Connection.toString()  // calls Connection.toString()
    }
}
```

メンバーとして宣言された拡張は、`open` として宣言し、サブクラスでオーバーライドできます。これは、このような関数のディスパッチが、ディスパッチレシーバー型に関して仮想的であり、拡張レシーバー型に関して静的であることを意味します。

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
        b.printFunctionInfo()   // call the extension function
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
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - dispatch receiver is resolved virtually
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - extension receiver is resolved statically
}
```

## Note on visibility(可視性に関する注意)

拡張機能は、同じスコープで宣言された通常の関数と同じ [visibility modifiers](visibility-modifiers)(可視性修飾子) を利用します。 例：

* ファイルのトップレベルで宣言された拡張機能は、同じファイル内の他の `private` トップレベル宣言にアクセスできます。
* 拡張機能がそのレシーバータイプの外で宣言されている場合、レシーバーの `private` または `protected` メンバーにアクセスできません。