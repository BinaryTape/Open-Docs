[//]: # (title: 関数)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-basic-types.md">基本型</a><br />
        <img src="icon-3-done.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4-done.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5.svg" width="20" alt="5番目のステップ" /> <strong>関数</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最後のステップ" /> <a href="kotlin-tour-null-safety.md">Null安全</a></p>
</tldr>

Kotlinでは、`fun`キーワードを使用して独自の関数を宣言できます。

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-demo"}

Kotlinでは：

*   関数のパラメータは括弧 `()` 内に記述します。
*   各パラメータには型が必要であり、複数のパラメータはカンマ `,` で区切る必要があります。
*   戻り値の型は関数の括弧 `()` の後に、コロン `:` で区切って記述します。
*   関数の本体は波括弧 `{}` 内に記述します。
*   `return`キーワードは、関数を終了したり、関数から何かを返したりするために使用されます。

> 関数が有用な値を何も返さない場合、戻り値の型と`return`キーワードは省略できます。詳細については、[戻り値のない関数](#functions-without-return)を参照してください。
>
{style="note"}

以下の例では：

*   `x`と`y`は関数のパラメータです。
*   `x`と`y`は`Int`型です。
*   関数の戻り値の型は`Int`です。
*   関数が呼び出されると、`x`と`y`の合計を返します。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function"}

> [コーディング規約](coding-conventions.md#function-names)では、関数名を小文字で始め、アンダースコアなしのキャメルケースを使用することを推奨しています。
>
{style="note"}

## 名前付き引数

簡潔なコードの場合、関数を呼び出す際にパラメータ名を含める必要はありません。ただし、パラメータ名を含めることでコードが読みやすくなります。これは**名前付き引数**の使用と呼ばれます。パラメータ名を含める場合、パラメータを任意の順序で記述できます。

> 以下の例では、[文字列テンプレート](strings.md#string-templates) (` `) を使用して、パラメータ値にアクセスし、それらを`String`型に変換し、結合して文字列として出力しています。
>
{style="tip"}

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // Uses named arguments with swapped parameter order
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-named-arguments-function"}

## デフォルト引数値

関数のパラメータにデフォルト値を定義できます。デフォルト値を持つパラメータは、関数を呼び出す際に省略できます。デフォルト値を宣言するには、型の後に代入演算子 `=` を使用します。

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // Function called with both parameters
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // Function called only with message parameter
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-default-param-function"}

> デフォルト値を持つ特定のパラメータを、すべて省略するのではなく、スキップすることができます。ただし、最初のスキップしたパラメータの後ろにあるすべてのパラメータは、名前を指定する必要があります。
>
{style="note"}

## 戻り値のない関数

関数が有用な値を何も返さない場合、その戻り値の型は`Unit`になります。`Unit`は、唯一の値である`Unit`を持つ型です。関数の本体で`Unit`が明示的に返されることを宣言する必要はありません。これは、`return`キーワードを使用したり、戻り値の型を宣言したりする必要がないことを意味します。

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` or `return` is optional
}

fun main() {
    printMessage("Hello")
    // Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-unit-function"}

## 単一式関数

コードをより簡潔にするために、単一式関数を使用できます。例えば、`sum()`関数は短縮できます。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-before"}

波括弧 `{}` を削除し、代入演算子 `=` を使用して関数本体を宣言できます。代入演算子 `=` を使用すると、Kotlinは型推論を使用するため、戻り値の型も省略できます。これにより、`sum()`関数は1行になります。

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

ただし、他の開発者がコードを素早く理解できるようにしたい場合は、代入演算子 `=` を使用している場合でも、戻り値の型を明示的に定義することをお勧めします。

> 関数本体を宣言するために`{}`波括弧を使用する場合、`Unit`型でない限り、戻り値の型を宣言する必要があります。
>
{style="note"}

## 関数での早期リターン

関数内のコードが特定の点を超えて処理されるのを停止するには、`return`キーワードを使用します。この例では、条件式が`true`と評価された場合に、`if`を使用して関数から早期にリターンしています。

```kotlin
// A list of registered usernames
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// A list of registered emails
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // Early return if the username is already taken
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // Early return if the email is already registered
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // Proceed with the registration if the username and email are not taken
    registeredUsernames.add(username)
    registeredEmails.add(email)

    return "User registered successfully: $username"
}

fun main() {
    println(registerUser("john_doe", "newjohn@example.com"))
    // Username already taken. Please choose a different username.
    println(registerUser("new_user", "newuser@example.com"))
    // User registered successfully: new_user
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-early-return"}

## 関数の演習

### 演習 1 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-1"}

`circleArea`という関数を記述してください。この関数は、円の半径を整数形式でパラメータとして受け取り、その円の面積を出力します。

> この演習では、`PI`を介して円周率の値にアクセスできるように、パッケージをインポートします。パッケージのインポートに関する詳細については、[パッケージとインポート](packages.md)を参照してください。
>
{style="tip"}

|---|---|
```kotlin
import kotlin.math.PI

// ここにコードを記述

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-1"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-functions-solution-1"}

### 演習 2 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-2"}

前の演習の`circleArea`関数を単一式関数として書き直してください。

|---|---|
```kotlin
import kotlin.math.PI

// ここにコードを記述

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-2"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-functions-solution-2"}

### 演習 3 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-3"}

時間、分、秒で与えられた時間間隔を秒に変換する関数があります。ほとんどの場合、1つか2つの関数パラメータのみを渡し、残りは0に等しくなります。コードが読みやすくなるように、デフォルト引数値と名前付き引数を使用して、この関数とその関数を呼び出すコードを改善してください。

|---|---|
```kotlin
fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-3"}

|---|---|
```kotlin
fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-functions-solution-3"}

## ラムダ式

Kotlinでは、ラムダ式を使用することで、関数に対してさらに簡潔なコードを記述できます。

例えば、以下の`uppercaseString()`関数：

```kotlin
fun uppercaseString(text: String): String {
    return text.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-before"}

ラムダ式として記述することもできます：

```kotlin
fun main() {
    val upperCaseString = { text: String -> text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

ラムダ式は一見すると理解しにくいかもしれませんが、分解して見てみましょう。ラムダ式は波括弧 `{}` 内に記述します。

ラムダ式内では、以下を記述します：

*   パラメータの後に`->`。
*   `->`の後に続く関数本体。

前の例では：

*   `text`は関数パラメータです。
*   `text`は`String`型です。
*   関数は、`text`に対して呼び出された[`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)関数の結果を返します。
*   ラムダ式全体は、代入演算子 `=` を使用して`upperCaseString`変数に代入されます。
*   ラムダ式は、`upperCaseString`変数を関数のように使用し、文字列`"hello"`をパラメータとして呼び出されます。
*   `println()`関数が結果を出力します。

> パラメータなしでラムダを宣言する場合、`->`を使用する必要はありません。例：
> ```kotlin
> { println("Log message") }
> ```
>
{style="note"}

ラムダ式は、さまざまな方法で使用できます。以下のような使い方ができます。

*   [ラムダ式を別の関数にパラメータとして渡す](#pass-to-another-function)
*   [関数からラムダ式を返す](#return-from-a-function)
*   [ラムダ式を単独で呼び出す](#invoke-separately)

### 別の関数に渡す

ラムダ式を関数に渡すのが有用な好例は、コレクションで[`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)関数を使用する場合です。

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    val positives = numbers.filter ({ x -> x > 0 })
    
    val isNegative = { x: Int -> x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-filter"}

`.filter()`関数は、ラムダ式を述語として受け入れ、リストの各要素に適用します。この関数は、述語が`true`を返す場合にのみ要素を保持します。

*   `{ x -> x > 0 }`は、要素が正の場合に`true`を返します。
*   `{ x -> x < 0 }`は、要素が負の場合に`true`を返します。

この例は、ラムダ式を関数に渡す2つの方法を示しています。

*   正の数の場合、例ではラムダ式を直接`.filter()`関数に追加しています。
*   負の数の場合、例ではラムダ式を`isNegative`変数に代入しています。そして、`isNegative`変数は`.filter()`関数の関数パラメータとして使用されます。この場合、ラムダ式で関数パラメータ（`x`）の型を指定する必要があります。

> ラムダ式が唯一の関数パラメータである場合、関数の括弧 `()` を省略できます。
>
> ```kotlin
> val positives = numbers.filter { x -> x > 0 }
> ```
>
> これは[末尾ラムダ](#trailing-lambdas)の一例であり、この章の最後で詳しく説明します。
>
{style="note"}

もう1つの良い例は、コレクション内のアイテムを変換するために[`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)関数を使用することです。

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x -> x * 2 }
    
    val isTripled = { x: Int -> x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-map"}

`.map()`関数は、ラムダ式を変換関数として受け入れます。

*   `{ x -> x * 2 }`はリストの各要素を受け取り、その要素を2倍した値を返します。
*   `{ x -> x * 3 }`はリストの各要素を受け取り、その要素を3倍した値を返します。

### 関数型

関数からラムダ式を返す前に、まず**関数型**を理解する必要があります。

すでに基本型については学びましたが、関数自体も型を持っています。Kotlinの型推論は、パラメータの型から関数の型を推論できます。しかし、関数型を明示的に指定する必要がある場合もあります。コンパイラはその関数に何が許可され、何が許可されないかを知るために関数型を必要とします。

関数型の構文は以下の通りです。

*   各パラメータの型が括弧 `()` 内に記述され、カンマ `,` で区切られます。
*   `->`の後に戻り値の型が記述されます。

例：`(String) -> String` または `(Int, Int) -> Int`。

`upperCaseString()`の関数型が定義されている場合、ラムダ式は次のようになります。

```kotlin
val upperCaseString: (String) -> String = { text -> text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

ラムダ式にパラメータがない場合、括弧 `()` は空のままになります。例：`() -> Unit`

> パラメータと戻り値の型は、ラムダ式内または関数型として宣言する必要があります。そうしないと、コンパイラはラムダ式の型を認識できません。
>
> 例えば、以下は動作しません：
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{style="note"}

### 関数から返す

ラムダ式は関数から返すことができます。コンパイラが返されるラムダ式の型を理解できるように、関数型を宣言する必要があります。

以下の例では、`toSeconds()`関数は関数型`(Int) -> Int`を持っています。これは、常に`Int`型のパラメータを受け取り、`Int`値を返すラムダ式を返すためです。

この例では、`when`式を使用して、`toSeconds()`が呼び出されたときにどのラムダ式が返されるかを決定しています。

```kotlin
fun toSeconds(time: String): (Int) -> Int = when (time) {
    "hour" -> { value -> value * 60 * 60 }
    "minute" -> { value -> value * 60 }
    "second" -> { value -> value }
    else -> { value -> value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-return-from-function"}

### 単独で呼び出す

ラムダ式は、波括弧 `{}` の後に括弧 `()` を追加し、その括弧内に任意のパラメータを含めることで、単独で呼び出すことができます。

```kotlin
fun main() {
    //sampleStart
    println({ text: String -> text.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### 末尾ラムダ

すでに見たように、ラムダ式が唯一の関数パラメータである場合、関数の括弧 `()` を省略できます。ラムダ式が関数の最後のパラメータとして渡される場合、その式は関数の括弧 `()` の外に記述できます。どちらの場合も、この構文は**末尾ラムダ**と呼ばれます。

例えば、[`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html)関数は初期値と演算を受け入れます。

```kotlin
fun main() {
    //sampleStart
    // The initial value is zero. 
    // The operation sums the initial value with every item in the list cumulatively.
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // Alternatively, in the form of a trailing lambda
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

ラムダ式の詳細については、[ラムダ式と匿名関数](lambdas.md#lambda-expressions-and-anonymous-functions)を参照してください。

ツアーの次のステップでは、Kotlinの[クラス](kotlin-tour-classes.md)について学びます。

## ラムダ式の演習

### 演習 1 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-1"}

Webサービスがサポートするアクションのリスト、すべてのリクエストに共通のプレフィックス、および特定の資源のIDがあります。ID: 5の資源に対してアクション`title`をリクエストするには、`https://example.com/book-info/5/title`のようなURLを作成する必要があります。ラムダ式を使用して、アクションのリストからURLのリストを作成してください。

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // ここにコードを記述
    println(urls)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-1"}

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-lambdas-solution-1"}

### 演習 2 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-2"}

`Int`値とアクション（`() -> Unit`型の関数）を受け取り、そのアクションを指定された回数だけ繰り返す関数を記述してください。そして、この関数を使用して「Hello」を5回出力してください。

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // ここにコードを記述
}

fun main() {
    // ここにコードを記述
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-2"}

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-lambdas-solution-2"}

## 次のステップ

[クラス](kotlin-tour-classes.md)