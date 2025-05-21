---
title: 委譲
---
[Delegation pattern](https://en.wikipedia.org/wiki/Delegation_pattern)は実装の継承の良い代替手段であることが証明されており、Kotlin はそれをネイティブにサポートしており、ボイラープレートコードは不要です。

クラス`Derived`は、そのすべてのpublic メンバーを指定されたオブジェクトに委譲することにより、インターフェース`Base`を実装できます。

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main() {
    val base = BaseImpl(10)
    Derived(base).print()
}
```

`Derived`のスーパータイプリストの`by`-clauseは、`b`が`Derived`のオブジェクト内に内部的に格納され、コンパイラーが`b`に転送する`Base`のすべてのメソッドを生成することを示します。

## 委譲によって実装されたインターフェースのメンバーのオーバーライド

[Overrides](inheritance#overriding-methods)は期待どおりに機能します。コンパイラーは、デリゲートオブジェクトのメソッドの代わりに、記述した`override`実装を使用します。`override fun printMessage() { print("abc") }`を`Derived`に追加すると、`printMessage`が呼び出されたときに、プログラムは*10*の代わりに*abc*を出力します。

```kotlin
interface Base {
    fun printMessage()
    fun printMessageLine()
}

class BaseImpl(val x: Int) : Base {
    override fun printMessage() { print(x) }
    override fun printMessageLine() { println(x) }
}

class Derived(b: Base) : Base by b {
    override fun printMessage() { print("abc") }
}

fun main() {
    val base = BaseImpl(10)
    Derived(base).printMessage()
    Derived(base).printMessageLine()
}
```

ただし、この方法でオーバーライドされたメンバーは、デリゲートオブジェクトのメンバーからは呼び出されません。デリゲートオブジェクトは、インターフェースメンバーの独自の実装にのみアクセスできます。

```kotlin
interface Base {
    val message: String
    fun print()
}

class BaseImpl(x: Int) : Base {
    override val message = "BaseImpl: x = $x"
    override fun print() { println(message) }
}

class Derived(b: Base) : Base by b {
    // This property is not accessed from b's implementation of `print`
    override val message = "Message of Derived"
}

fun main() {
    val b = BaseImpl(10)
    val derived = Derived(b)
    derived.print()
    println(derived.message)
}
```

詳細については、[delegated properties](delegated-properties)を参照してください。