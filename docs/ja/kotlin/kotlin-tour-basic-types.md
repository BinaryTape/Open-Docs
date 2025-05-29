[//]: # (title: 基本型)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2.svg" width="20" alt="2番目のステップ" /> <strong>基本型</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4-todo.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5-todo.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最後のステップ" /> <a href="kotlin-tour-null-safety.md">null安全性</a></p>
</tldr>

Kotlinのすべての変数とデータ構造には型があります。型は、その変数やデータ構造に対して何ができるか、言い換えれば、どのような関数やプロパティを持っているかをコンパイラに伝えるため、重要です。

前章の例では、Kotlinは`customers`が[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)型であることを認識できました。
Kotlinが型を**推論**する能力は**型推論**と呼ばれます。`customers`には整数値が割り当てられています。ここから、Kotlinは`customers`が数値型`Int`であると推論します。その結果、コンパイラは`customers`に対して算術演算を実行できることを認識します。

```kotlin
fun main() {
//sampleStart
    var customers = 10

    // Some customers leave the queue
    customers = 8

    customers = customers + 3 // Example of addition: 11
    customers += 7            // Example of addition: 18
    customers -= 3            // Example of subtraction: 15
    customers *= 2            // Example of multiplication: 30
    customers /= 3            // Example of division: 10

    println(customers) // 10
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-arithmetic"}

> `+=`、`-=`、`*=`、`/=`、`%=` は複合代入演算子です。詳細については、[複合代入](operator-overloading.md#augmented-assignments)を参照してください。
> 
{style="tip"}

Kotlinには、以下の基本型があります。

| **カテゴリ**           | **基本型**                    | **コード例**                                              |
|------------------------|------------------------------------|---------------------------------------------------------------|
| 整数               | `Byte`、`Short`、`Int`、`Long`     | `val year: Int = 2020`                                        |
| 符号なし整数      | `UByte`、`UShort`、`UInt`、`ULong` | `val score: UInt = 100u`                                      |
| 浮動小数点数 | `Float`、`Double`                  | `val currentTemp: Float = 24.5f`、`val price: Double = 19.99` |
| 論理値               | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| 文字             | `Char`                             | `val separator: Char = ','`                                   |
| 文字列             | `String`                           | `val message: String = "Hello, world!"`                       |

基本型とそのプロパティの詳細については、[基本型](basic-types.md)を参照してください。

この知識があれば、変数を宣言し、後で初期化することができます。Kotlinは、変数が最初の読み取りの前に初期化される限り、これを管理できます。

初期化せずに変数を宣言するには、`:` を使用して型を指定します。例えば、

```kotlin
fun main() {
//sampleStart
    // Variable declared without initialization
    val d: Int
    // Variable initialized
    d = 3

    // Variable explicitly typed and initialized
    val e: String = "hello"

    // Variables can be read because they have been initialized
    println(d) // 3
    println(e) // hello
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-initialization"}

変数が読み取られる前に初期化しない場合、エラーが表示されます。

```kotlin
fun main() {
//sampleStart
    // Variable declared without initialization
    val d: Int
    
    // Triggers an error
    println(d)
    // Variable 'd' must be initialized
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-no-initialization" validate="false"}

基本型の宣言方法がわかったところで、次は[コレクション](kotlin-tour-collections.md)について学びましょう。

## 演習

### 演習 {initial-collapse-state="collapsed" collapsible="true"}

各変数に正しい型を明示的に宣言してください:

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-exercise"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-basic-types-solution"}

## 次のステップ

[コレクション](kotlin-tour-collections.md)