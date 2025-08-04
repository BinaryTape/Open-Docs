[//]: # (title: デリゲーション)

[デリゲーションパターン](https://en.wikipedia.org/wiki/Delegation_pattern)は、実装継承の良い代替手段であることが証明されており、Kotlin はボイラープレートコードを一切必要とせずにこれをネイティブにサポートしています。

`Derived` クラスは、すべてのパブリックメンバーを特定のオブジェクトにデリゲートすることで、`Base` インターフェースを実装できます。

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
{kotlin-runnable="true"}

`Derived` のスーパタイプリストにある `by` 句は、`b` が `Derived` オブジェクトの内部に格納され、コンパイラが `Base` のすべてのメソッドを `b` に転送するように生成することを示しています。

## デリゲーションによって実装されたインターフェースのメンバーをオーバーライドする

[オーバーライド](inheritance.md#overriding-methods)は期待通りに動作します。コンパイラはデリゲートオブジェクトの実装ではなく、あなたの `override` 実装を使用します。`Derived` に `override fun printMessage() { print("abc") }` を追加すると、`printMessage` が呼び出されたときにプログラムは *10* ではなく *abc* を出力します。

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
{kotlin-runnable="true"}

ただし、このようにオーバーライドされたメンバーは、デリゲートオブジェクトのメンバーからは呼び出されないことに注意してください。デリゲートオブジェクトは、インターフェースメンバーの自身の実装にのみアクセスできます。

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
{kotlin-runnable="true"}

[デリゲートプロパティ](delegated-properties.md)について詳しくはこちら。