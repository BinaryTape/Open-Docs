[//]: # (title: null安全性)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-basic-types.md">基本型</a><br />
        <img src="icon-3-done.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4-done.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5-done.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-done.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7.svg" width="20" alt="最後のステップ" /> <strong>null安全性</strong><br /></p>
</tldr>

Kotlinでは、`null`値を持つことが可能です。Kotlinは、何かが欠けている場合やまだ設定されていない場合に`null`値を使用します。
[コレクション](kotlin-tour-collections.md#kotlin-tour-map-no-key)の章で、マップに存在しないキーを持つキーと値のペアにアクセスしようとしたときに、Kotlinが`null`値を返す例をすでに見てきました。このように`null`値を使用することは便利ですが、コードがそれらを処理する準備ができていない場合、問題が発生する可能性があります。

プログラムでの`null`値に関する問題を防止するために、Kotlinにはnull安全性（null safety）が導入されています。null安全性は、`null`値に関する潜在的な問題を、実行時ではなくコンパイル時に検出します。

null安全性は、以下のことを可能にする機能の組み合わせです。

* プログラム内で`null`値が許可される場合を明示的に宣言する。
* `null`値をチェックする。
* `null`値を含む可能性のあるプロパティや関数に対して安全な呼び出しを使用する。
* `null`値が検出された場合に実行するアクションを宣言する。

## ヌル許容型

Kotlinはヌル許容型（nullable types）をサポートしており、宣言された型が`null`値を持つ可能性を許容します。デフォルトでは、型は`null`値を受け入れることは**できません**。ヌル許容型は、型宣言の後に明示的に`?`を追加することによって宣言されます。

例:

```kotlin
fun main() {
    // neverNull has String type
    var neverNull: String = "This can't be null"

    // Throws a compiler error
    neverNull = null

    // nullable has nullable String type
    var nullable: String? = "You can keep a null here"

    // This is OK
    nullable = null

    // By default, null values aren't accepted
    var inferredNonNull = "The compiler assumes non-nullable"

    // Throws a compiler error
    inferredNonNull = null

    // notNull doesn't accept null values
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // Throws a compiler error
}
```
{kotlin-runnable="true" validate="false" kotlin-min-compiler-version="1.3" id="kotlin-tour-nullable-type"}

> `length`は、文字列内の文字数を含む[String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)クラスのプロパティです。
>
{style="tip"}

## null値のチェック

条件式内で`null`値の存在をチェックできます。次の例では、`describeString()`関数は、`maybeString`が`null`で**なく**、その`length`がゼロよりも大きいかどうかをチェックする`if`文を持っています。

```kotlin
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length ${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}

fun main() {
    val nullString: String? = null
    println(describeString(nullString))
    // Empty or null string
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-check-nulls"}

## セーフコール（Safe calls）の使用

`null`値を含む可能性のあるオブジェクトのプロパティに安全にアクセスするには、セーフコール演算子（safe call operator）`?.`を使用します。セーフコール演算子は、オブジェクトまたはアクセスされたプロパティのいずれかが`null`の場合に`null`を返します。これは、`null`値の存在によってコード内でエラーがトリガーされるのを避けたい場合に役立ちます。

次の例では、`lengthString()`関数は、文字列の長さまたは`null`を返すためにセーフコールを使用しています。

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-property"}

> セーフコールは連鎖させることができ、オブジェクトのいずれかのプロパティが`null`値を含んでいる場合、エラーがスローされずに`null`が返されます。例:
>
> ```kotlin
>   person.company?.address?.country
> ```
>
{style="tip"}

セーフコール演算子は、拡張関数やメンバー関数を安全に呼び出すためにも使用できます。この場合、関数が呼び出される前にnullチェックが実行されます。チェックが`null`値を検出した場合、その呼び出しはスキップされ、`null`が返されます。

次の例では、`nullString`が`null`であるため、[`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)の呼び出しはスキップされ、`null`が返されます。

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-function"}

## エルビス演算子（Elvis operator）の使用

`null`値が検出された場合に返すデフォルト値を提供するには、**エルビス演算子（Elvis operator）**`?:`を使用します。

エルビス演算子の左側には、`null`値をチェックする対象を記述します。
エルビス演算子の右側には、`null`値が検出された場合に何を返すかを記述します。

次の例では、`nullString`が`null`であるため、`length`プロパティにアクセスするためのセーフコールは`null`値を返します。
その結果、エルビス演算子は`0`を返します。

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-elvis-operator"}

Kotlinのnull安全性に関する詳細については、[Null safety](null-safety.md)を参照してください。

## 練習

### 練習問題 {initial-collapse-state="collapsed" collapsible="true"}

会社の従業員のデータベースにアクセスできる`employeeById`関数があります。残念ながら、この関数は`Employee?`型の値を返すため、結果は`null`になる可能性があります。あなたの目標は、従業員の`id`が提供されたときにその従業員の給与を返す関数、またはデータベースに従業員が存在しない場合は`0`を返す関数を作成することです。

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = // Write your code here

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise"}

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-null-safety-solution"}

## 次のステップ

おめでとうございます！初級ツアーを完了したところで、中級ツアーでKotlinの理解をさらに深めましょう:

<a href="kotlin-tour-intermediate-extension-functions.md"><img src="start-intermediate-tour.svg" width="700" alt="中級Kotlinツアーを開始する" style="block"/></a>