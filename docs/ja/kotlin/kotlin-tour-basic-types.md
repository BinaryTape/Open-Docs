[//]: # (title: 基本データ型)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>基本データ型</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null安全性</a></p>
</tldr>

Kotlinのすべての変数とデータ構造には型があります。型は、その変数またはデータ構造で何ができるかをコンパイラに伝えるため重要です。言い換えれば、どのような関数とプロパティを持っているかを示します。

前の章で、Kotlinは前の例で`customers`が[`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)型であることを認識できました。
Kotlinが型を**推論**する能力は**型推論**と呼ばれます。`customers`には整数値が代入されています。これにより、Kotlinは`customers`が数値型`Int`であると推論します。結果として、コンパイラは`customers`に対して算術演算を実行できることを認識します。

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

> `+=`、`-=`、`*=`、`/=`、および`%=`は複合代入演算子です。詳細は[複合代入](operator-overloading.md#augmented-assignments)を参照してください。
> 
{style="tip"}

Kotlinには、以下の基本データ型があります。

| **カテゴリ**           | **基本データ型**                   | **コード例**                                              |
|------------------------|------------------------------------|---------------------------------------------------------------|
| 整数型               | `Byte`, `Short`, `Int`, `Long`     | `val year: Int = 2020`                                        |
| 符号なし整数型      | `UByte`, `UShort`, `UInt`, `ULong` | `val score: UInt = 100u`                                      |
| 浮動小数点数型 | `Float`, `Double`                  | `val currentTemp: Float = 24.5f`, `val price: Double = 19.99` |
| 論理型               | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| 文字型             | `Char`                             | `val separator: Char = ','`                                   |
| 文字列型             | `String`                           | `val message: String = "Hello, world!"`                       |

基本データ型とそのプロパティの詳細については、[型概要](types-overview.md)を参照してください。

この知識があれば、変数を宣言し、後で初期化することができます。Kotlinは、変数が最初に読み取られる前に初期化されていれば、これを管理できます。

変数を初期化せずに宣言するには、`:`を使ってその型を指定します。例えば、

```kotlin
fun main() {
//sampleStart
    // 初期化せずに宣言された変数
    val d: Int
    // 初期化された変数
    d = 3

    // 明示的に型指定され初期化された変数
    val e: String = "hello"

    // 変数は初期化されているため読み取り可能
    println(d) // 3
    println(e) // hello
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-initialization"}

変数が読み取られる前に初期化しない場合、エラーが発生します。

```kotlin
fun main() {
//sampleStart
    // 初期化せずに宣言された変数
    val d: Int
    
    // エラーをトリガーします
    println(d)
    // 変数 'd' は初期化する必要があります
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-no-initialization" validate="false"}

基本データ型を宣言する方法がわかったところで、次は[コレクション](kotlin-tour-collections.md)について学びましょう。

## 練習問題

### 演習 {initial-collapse-state="collapsed" collapsible="true"}

各変数に正しい型を明示的に宣言してください。

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