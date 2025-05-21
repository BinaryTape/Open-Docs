---
title: 関数
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow</a><br />
        <img src="/img/icon-5.svg" width="20" alt="Fifth step" /> <strong>Functions（関数）</strong><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes（クラス）</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety（Null安全性）</a>
</p>

:::

Kotlinでは、`fun`キーワードを使って独自の関数を宣言できます。

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
```

Kotlinでは：

* 関数のパラメータは、括弧 `()` の中に記述します。
* 各パラメータは型を持つ必要があり、複数のパラメータはカンマ `,` で区切る必要があります。
* 戻り値の型は、関数の括弧 `()` の後にコロン `:` で区切って記述します。
* 関数の本体は、波括弧 `{}` の中に記述します。
* `return` キーワードは、関数から抜けたり、何かを返したりするために使用されます。

:::note
関数が何も有用なものを返さない場合、戻り値の型と `return` キーワードは省略できます。詳細については、
[戻り値のない関数](#functions-without-return)を参照してください。

:::

次の例では：

* `x`と`y`は関数のパラメータです。
* `x`と`y`は`Int`型です。
* 関数の戻り値の型は`Int`です。
* この関数は、呼び出されると`x`と`y`の合計を返します。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```

:::note
[コーディング規約](coding-conventions#function-names)では、関数名は小文字で始め、アンダースコアなしのキャメルケースを使用することをお勧めします。

:::

## 名前付き引数

コードを簡潔にするために、関数を呼び出すときにパラメータ名を含める必要はありません。ただし、パラメータ名を含めることで、コードが読みやすくなります。これは**名前付き引数**の使用と呼ばれます。パラメータ名を含める場合は、パラメータを任意の順序で記述できます。

:::note
次の例では、[文字列テンプレート](strings#string-templates)を使用してパラメータ値にアクセスし、`String`型に変換して、印刷用の文字列に連結しています。

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // Uses named arguments with swapped parameter order（パラメータの順序を入れ替えた名前付き引数を使用）
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```

## デフォルトのパラメータ値

関数のパラメータにデフォルト値を定義できます。デフォルト値を持つパラメータは、関数を呼び出すときに省略できます。デフォルト値を宣言するには、型の後に代入演算子 `=` を使用します。

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // Function called with both parameters（両方のパラメータを指定して関数を呼び出す）
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // Function called only with message parameter（messageパラメータのみを指定して関数を呼び出す）
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```

すべてのパラメータを省略するのではなく、デフォルト値を持つ特定のパラメータをスキップできます。ただし、最初にスキップしたパラメータ以降は、後続のすべてのパラメータに名前を付ける必要があります。

:::

## 戻り値のない関数

関数が有用な値を返さない場合、その戻り値の型は `Unit` になります。`Unit` は、1つの値 `Unit` のみを持つ型です。関数本体で `Unit` が明示的に返されることを宣言する必要はありません。つまり、`return` キーワードを使用したり、戻り値の型を宣言したりする必要はありません。

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` or `return` is optional（`return Unit` または `return` は省略可能）
}

fun main() {
    printMessage("Hello")
    // Hello
}
```

## 単一式の関数

コードをより簡潔にするために、単一式の関数を使用できます。たとえば、`sum()` 関数は短縮できます。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```

波括弧 `{}` を削除し、代入演算子 `=` を使用して関数本体を宣言できます。代入演算子 `=` を使用すると、Kotlinは型推論を使用するため、戻り値の型も省略できます。`sum()` 関数は1行になります。

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```

ただし、コードを他の開発者がすぐに理解できるようにするには、代入演算子 `=` を使用する場合でも、戻り値の型を明示的に定義することをお勧めします。

:::note
`{}` 波括弧を使用して関数本体を宣言する場合は、戻り値の型が `Unit` 型でない限り、戻り値の型を宣言する必要があります。

:::

## 関数からの早期リターン

関数内のコードが特定のポイントよりも先に処理されないようにするには、`return` キーワードを使用します。この例では、条件式が真であると判明した場合に、`if`を使用して関数から早期にリターンします。

```kotlin
// A list of registered usernames（登録されたユーザー名のリスト）
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// A list of registered emails（登録されたメールアドレスのリスト）
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // Early return if the username is already taken（ユーザー名が既に使用されている場合は早期リターン）
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // Early return if the email is already registered（メールアドレスが既に登録されている場合は早期リターン）
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // Proceed with the registration if the username and email are not taken（ユーザー名とメールアドレスが使用されていない場合は、登録を続行）
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

## 関数の練習

### 演習1

円の半径を整数形式でパラメータとして受け取り、その円の面積を出力する `circleArea` という名前の関数を作成します。

:::note
この演習では、`PI` を介してpiの値にアクセスできるように、パッケージをインポートします。パッケージのインポートの詳細については、[パッケージとインポート](packages)を参照してください。

:::

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here（ここにコードを記述）

fun main() {
    println(circleArea(2))
}
```

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

### 演習2

前の演習の `circleArea` 関数を単一式の関数として書き換えます。

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here（ここにコードを記述）

fun main() {
    println(circleArea(2))
}
```

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```

### 演習3

時間、分、秒で与えられた時間間隔を秒に変換する関数があります。ほとんどの場合、1つまたは2つの関数パラメータのみを渡し、残りは0に等しくする必要があります。デフォルトのパラメータ値と名前付き引数を使用して関数とそれを呼び出すコードを改善し、コードを読みやすくします。

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

## ラムダ式

Kotlinでは、ラムダ式を使用することで、関数に対してさらに簡潔なコードを記述できます。

たとえば、次の `uppercaseString()` 関数：

```kotlin
fun uppercaseString(text: String): String {
    return text.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```

ラムダ式として記述することもできます。

```kotlin
fun main() {
    val upperCaseString = { text: String `->` text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```

ラムダ式は一見すると理解しにくい場合があるため、分解してみましょう。ラムダ式は波括弧 `{}` の中に記述します。

ラムダ式の中には、次のものを記述します。

* パラメータの後に `->` を記述します。
* `->` の後に関数本体を記述します。

前の例では：

* `text`は関数のパラメータです。
* `text`は`String`型です。
* この関数は、`text`で呼び出された[`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)関数の結果を返します。
* ラムダ式全体は、代入演算子 `=` を使用して `upperCaseString` 変数に割り当てられます。
* ラムダ式は、変数 `upperCaseString` を関数のように使用し、文字列 `"hello"` をパラメータとして使用して呼び出されます。
* `println()` 関数は結果を出力します。

パラメータなしでラムダを宣言する場合、`->`を使用する必要はありません。例：
```kotlin
{ println("Log message") }
```

:::

ラムダ式はさまざまな方法で使用できます。次のことができます。

* [ラムダ式を別の関数のパラメータとして渡す](#pass-to-another-function)
* [関数からラムダ式を返す](#return-from-a-function)
* [ラムダ式を単独で呼び出す](#invoke-separately)

### 別の関数に渡す

ラムダ式を関数に渡すと便利な良い例は、コレクションで[`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)関数を使用することです。

```kotlin
fun main() {

    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    
    val positives = numbers.filter ({ x `->` x > 0 })
    
    val isNegative = { x: Int `->` x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]

}
```

`.filter()` 関数は、述語としてラムダ式を受け入れます。

* `{ x `->` x > 0 }` はリストの各要素を取得し、正の要素のみを返します。
* `{ x `->` x < 0 }` はリストの各要素を取得し、負の要素のみを返します。

この例では、ラムダ式を関数に渡す2つの方法を示します。

* 正の数の場合、例ではラムダ式を `.filter()` 関数に直接追加します。
* 負の数の場合、例ではラムダ式を `isNegative` 変数に割り当てます。次に、`isNegative` 変数を `.filter()` 関数の関数パラメータとして使用します。この場合、ラムダ式で関数パラメータ（`x`）の型を指定する必要があります。

:::note
ラムダ式が唯一の関数パラメータである場合、関数括弧 `()` を省略できます。

```kotlin
val positives = numbers.filter { x `->` x > 0 }
```

これは[後置ラムダ](#trailing-lambdas)の例であり、この章の最後で詳しく説明します。

:::

もう1つの良い例は、[`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)関数を使用してコレクション内のアイテムを変換することです。

```kotlin
fun main() {

    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x `->` x * 2 }
    
    val isTripled = { x: Int `->` x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]

}
```

`.map()` 関数は、変換関数としてラムダ式を受け入れます。

* `{ x `->` x * 2 }` はリストの各要素を取得し、その要素に2を掛けた値を返します。
* `{ x `->` x * 3 }` はリストの各要素を取得し、その要素に3を掛けた値を返します。

### 関数型

関数からラムダ式を返す前に、まず**関数型**を理解する必要があります。

基本的な型については既に学習しましたが、関数自体にも型があります。Kotlinの型推論は、パラメータ型から関数の型を推論できます。ただし、関数型を明示的に指定する必要がある場合があります。コンパイラは、その関数に対して何が許可され、何が許可されないかを知るために、関数型を必要とします。

関数型の構文は次のとおりです。

* 各パラメータの型は括弧 `()` 内に記述し、カンマ `,` で区切ります。
* 戻り値の型は `->` の後に記述します。

例：`(String) `->` String` または `(Int, Int) `->` Int`。

これは、`upperCaseString()` の関数型が定義されている場合のラムダ式の例です。

```kotlin
val upperCaseString: (String) `->` String = { text `->` text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```

ラムダ式にパラメータがない場合、括弧 `()` は空のままにします。例：`() `->` Unit`

パラメータと戻り値の型は、ラムダ式または関数型のいずれかで宣言する必要があります。そうしないと、コンパイラはラムダ式の型を認識できません。

たとえば、次は機能しません。

`val upperCaseString = { str `->` str.uppercase() }`

:::

### 関数からのリターン

ラムダ式は関数から返すことができます。コンパイラが返されるラムダ式の型を理解できるように、関数型を宣言する必要があります。

次の例では、`toSeconds()` 関数は、常に`Int`型のパラメータを受け取り、`Int`値を返すラムダ式を返すため、関数型`(Int) `->` Int`を持ちます。

この例では、`when`式を使用して、`toSeconds()`が呼び出されたときにどのラムダ式が返されるかを判断します。

```kotlin
fun toSeconds(time: String): (Int) `->` Int = when (time) {
    "hour" `->` { value `->` value * 60 * 60 }
    "minute" `->` { value `->` value * 60 }
    "second" `->` { value `->` value }
    else `->` { value `->` value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```

### 単独で呼び出す

ラムダ式は、波括弧 `{}` の後に括弧 `()` を追加し、括弧内にパラメータを含めることで、単独で呼び出すことができます。

```kotlin
fun main() {

    println({ text: String `->` text.uppercase() }("hello"))
    // HELLO

}
```

### 後置ラムダ

既に見たように、ラムダ式が唯一の関数パラメータである場合、関数括弧 `()` を省略できます。ラムダ式が関数の最後のパラメータとして渡される場合、式は関数括弧 `()` の外に記述できます。どちらの場合も、この構文は**後置ラムダ**と呼ばれます。

たとえば、[`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 関数は、初期値と操作を受け入れます。

```kotlin
fun main() {

    // The initial value is zero.（初期値はゼロです。）
    // The operation sums the initial value with every item in the list cumulatively.（この操作は、初期値をリスト内のすべての項目と累積的に合計します。）
    println(listOf(1, 2, 3).fold(0, { x, item `->` x + item })) // 6

    // Alternatively, in the form of a trailing lambda（または、後置ラムダの形式で）
    println(listOf(1, 2, 3).fold(0) { x, item `->` x + item })  // 6

}
```

ラムダ式の詳細については、[ラムダ式と匿名関数](lambdas#lambda-expressions-and-anonymous-functions)を参照してください。

ツアーの次のステップでは、Kotlinの[クラス](kotlin-tour-classes)について学びます。

## ラムダ式の練習

### 演習1

Webサービスでサポートされているアクションのリスト、すべてのリクエストに共通のプレフィックス、および特定のリソースのIDがあります。ID：5のリソースに対してアクション `title` をリクエストするには、次のURLを作成する必要があります：`https://example.com/book-info/5/title`。ラムダ式を使用して、アクションのリストからURLのリストを作成します。

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // Write your code here（ここにコードを記述）
    println(urls)
}
```

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action `->` "$prefix/$id/$action" }
    println(urls)
}
```

### 演習2

`Int` 値とアクション（型 `() `->` Unit` の関数）を受け取り、そのアクションを指定された回数だけ繰り返す関数を作成します。次に、この関数を使用して "Hello" を5回出力します。

|---|---|
```kotlin
fun repeatN(n: Int, action: () `->` Unit) {
    // Write your code here（ここにコードを記述）
}

fun main() {
    // Write your code here（ここにコードを記述）
}
```

|---|---|
```kotlin
fun repeatN(n: Int, action: () `->` Unit) {
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

## 次のステップ

[Classes（クラス）](kotlin-tour-classes)