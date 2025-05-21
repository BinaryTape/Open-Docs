---
title: 基本型
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2.svg" width="20" alt="Second step" /> <strong>Basic types (基本型)</strong><br />
        <img src="/img/icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections (コレクション)</a><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow (制御フロー)</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions (関数)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes (クラス)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety (Null安全性)</a>
</p>

:::

Kotlin のすべての変数とデータ構造には型があります。型は、コンパイラーがその変数またはデータ構造で何ができるかを判断するために重要です。つまり、どのような関数とプロパティを持っているかということです。

前の章では、Kotlin は前の例で `customers` が [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/) 型であると判断できました。
Kotlin の型を**推論**する能力は、**型推論**と呼ばれます。`customers` には整数の値が割り当てられています。
このことから、Kotlin は `customers` が数値型 `Int` であると推論します。その結果、コンパイラーは `customers` で算術演算を実行できることを認識します。

```kotlin
fun main() {

    var customers = 10

    // Some customers leave the queue
    customers = 8

    customers = customers + 3 // Example of addition: 11
    customers += 7            // Example of addition: 18
    customers -= 3            // Example of subtraction: 15
    customers *= 2            // Example of multiplication: 30
    customers /= 3            // Example of division: 10

    println(customers) // 10

}
```

:::tip
`+=`、`-=`、`*=`、`/=`、および `%=` は拡張代入演算子です。詳細については、[Augmented assignments](operator-overloading#augmented-assignments)を参照してください。

:::

Kotlin には、次の基本型があります。

| **Category (カテゴリー)**           | **Basic types (基本型)**                    | **Example code (コード例)**                                              |
|------------------------|------------------------------------|---------------------------------------------------------------|
| Integers (整数)               | `Byte`, `Short`, `Int`, `Long`     | `val year: Int = 2020`                                        |
| Unsigned integers (符号なし整数)      | `UByte`, `UShort`, `UInt`, `ULong` | `val score: UInt = 100u`                                      |
| Floating-point numbers (浮動小数点数) | `Float`, `Double`                  | `val currentTemp: Float = 24.5f`, `val price: Double = 19.99` |
| Booleans (ブール値)               | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| Characters (文字)             | `Char`                             | `val separator: Char = ','`                                   |
| Strings (文字列)                | `String`                           | `val message: String = "Hello, world!"`                       |

基本型とそのプロパティの詳細については、[Basic types](basic-types)を参照してください。

この知識があれば、変数を宣言して後で初期化することができます。Kotlin は、変数が最初に読み取られる前に初期化されていれば、これを管理できます。

初期化せずに変数を宣言するには、`:` を使用して型を指定します。例：

```kotlin
fun main() {

    // Variable declared without initialization
    val d: Int
    // Variable initialized
    d = 3

    // Variable explicitly typed and initialized
    val e: String = "hello"

    // Variables can be read because they have been initialized
    println(d) // 3
    println(e) // hello

}
```

変数を読み取る前に初期化しないと、エラーが表示されます。

```kotlin
fun main() {

    // Variable declared without initialization
    val d: Int
    
    // Triggers an error
    println(d)
    // Variable 'd' must be initialized

}
```

基本型を宣言する方法がわかったので、次は[collections](kotlin-tour-collections)について学びましょう。

## Practice (練習)

### Exercise (演習)

各変数に対して正しい型を明示的に宣言してください。

|---|---|
```kotlin
fun main() {
    val a: Int = 1000 
    val b = "log message"
    val c = 3.14
    val d = 100_000_000_000_000
    val e = false
    val f = '
'
}
```

|---|---|
```kotlin
fun main() {
    val a: Int = 1000
    val b: String = "log message"
    val c: Double = 3.14
    val d: Long = 100_000_000_000_000
    val e: Boolean = false
    val f: Char = '
'
}
```

## Next step (次のステップ)

[Collections](kotlin-tour-collections)