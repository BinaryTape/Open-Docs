[//]: # (title: 拡張)

Kotlinの_拡張_は、継承や_Decorator_のようなデザインパターンを使用することなく、クラスやインターフェースに新しい機能を追加できます。これらは、直接変更できないサードパーティ製ライブラリを扱う際に役立ちます。一度作成すれば、これらの拡張は、あたかも元のクラスやインターフェースのメンバーであるかのように呼び出すことができます。

拡張の最も一般的な形式は、[_拡張関数_](#extension-functions)と[_拡張プロパティ_](#extension-properties)です。

重要なこととして、拡張は拡張するクラスやインターフェースを変更しません。拡張を定義しても、新しいメンバーを追加するわけではありません。同じ構文を使って、新しい関数を呼び出したり、新しいプロパティにアクセスできるようにするだけです。

## レシーバー

拡張は常にレシーバーで呼び出されます。レシーバーは、拡張されるクラスまたはインターフェースと同じ型を持つ必要があります。拡張を使用するには、レシーバーの後に` .`と関数またはプロパティ名を付けてプレフィックスとして付けます。

例えば、標準ライブラリの[`appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html)拡張関数は`StringBuilder`クラスを拡張します。したがって、この場合、レシーバーは`StringBuilder`インスタンスであり、_レシーバー型_は`StringBuilder`です。

```kotlin
fun main() { 
//sampleStart
    // builder is an instance of StringBuilder
    val builder = StringBuilder()
        // Calls .appendLine() extension function on builder
        .appendLine("Hello")
        .appendLine()
        .appendLine("World")
    println(builder.toString())
    // Hello
    //
    // World
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-stringbuilder"}

## 拡張関数

独自の拡張関数を作成する前に、Kotlinの[標準ライブラリ](https://kotlinlang.org/api/core/kotlin-stdlib/)に既に探しているものがあるかどうかを確認してください。
標準ライブラリは、以下のような多くの便利な拡張関数を提供します。

*   コレクションの操作: [`map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html)、[`filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html)、[`reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html)、[`fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html)、[`groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html)。
*   文字列への変換: [`joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html)。
*   null値の操作: [`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html)。

独自の拡張関数を作成するには、その名前にレシーバー型と` .`をプレフィックスとして付けます。この例では、`.truncate()`関数は`String`クラスを拡張するため、レシーバー型は`String`です。

```kotlin
fun String.truncate(maxLength: Int): String {
    return if (this.length <= maxLength) this else take(maxLength - 3) + "..."
}

fun main() {
    val shortUsername = "KotlinFan42"
    val longUsername = "JetBrainsLoverForever"

    println("Short username: ${shortUsername.truncate(15)}") 
    // KotlinFan42
    println("Long username:  ${longUsername.truncate(15)}")
    // JetBrainsLov...
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-truncate"}

`.truncate()`関数は、呼び出された文字列を指定された`maxLength`で切り詰め、省略記号`...`を追加します。文字列が`maxLength`より短い場合、関数は元の文字列を返します。

この例では、`.displayInfo()`関数は`User`インターフェースを拡張します。

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// Inherits from and implements the properties of the User interface
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo()) 
    // User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

`.displayInfo()`関数は、`RegularUser`インスタンスの`name`と`email`を含む文字列を返します。このようにインターフェースに拡張を定義することは、インターフェースを実装するすべての型に一度だけ機能を追加したい場合に便利です。

この例では、`.mostVoted()`関数は`Map<String, Int>`クラスを拡張します。

```kotlin
fun Map<String, Int>.mostVoted(): String? {
    return maxByOrNull { (key, value) -> value }?.key
}

fun main() {
    val poll = mapOf(
        "Cats" to 37,
        "Dogs" to 58,
        "Birds" to 22
    )

    println("Top choice: ${poll.mostVoted()}") 
    // Dogs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-mostvoted"}

`.mostVoted()`関数は、呼び出されたマップのキーと値のペアを反復処理し、[`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html)関数を使用して最大値を含むペアのキーを返します。マップが空の場合、`maxByOrNull()`関数は`null`を返します。`mostVoted()`関数は、`maxByOrNull()`関数が非null値を返す場合にのみ`key`プロパティにアクセスするために、セーフコール`?.`を使用します。

### ジェネリックな拡張関数

ジェネリックな拡張関数を作成するには、関数名の前にジェネリック型パラメータを宣言して、レシーバー型式で利用できるようにします。この例では、`.endpoints()`関数は`List<T>`を拡張しており、`T`は任意の型です。

```kotlin
fun <T> List<T>.endpoints(): Pair<T, T> {
    return first() to last()
}

fun main() {
    val cities = listOf("Paris", "London", "Berlin", "Prague")
    val temperatures = listOf(21.0, 19.5, 22.3)

    val cityEndpoints = cities.endpoints()
    val tempEndpoints = temperatures.endpoints()

    println("First and last cities: $cityEndpoints")
    // (Paris, Prague)
    println("First and last temperatures: $tempEndpoints") 
    // (21.0, 22.3)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-endpoints"}

`.endpoints()`関数は、呼び出されたリストの最初と最後の要素を含むペアを返します。関数本体内では、`first()`関数と`last()`関数を呼び出し、`to`中置関数を使用して返された値を`Pair`に結合します。

ジェネリクスに関する詳細については、[ジェネリック関数](generics.md)を参照してください。

### Null許容レシーバー

null許容レシーバー型で拡張関数を定義できます。これにより、その値がnullであっても変数に対して呼び出すことができます。レシーバーが`null`の場合、`this`も`null`になります。関数内でnull許容性を正しく処理するようにしてください。例えば、関数本体内で`this == null`チェック、[セーフコール`?.`](null-safety.md#safe-call-operator)、または[エルビス演算子`?:`](null-safety.md#elvis-operator)を使用します。

この例では、`toString()`関数をnullチェックなしで呼び出すことができます。なぜなら、そのチェックは既に拡張関数内で実行されているからです。

```kotlin
fun main() {
    //sampleStart
    // Extension function on nullable Any
    fun Any?.toString(): String {
        if (this == null) return "null"
        // After null check, `this` is smart-cast to non-nullable Any
        // So this call resolves to the regular toString() function
        return toString()
    }
    
    val number: Int? = 42
    val nothing: Any? = null
    
    println(number.toString())
    // 42
    println(nothing.toString()) 
    // null
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-nullable-receiver"}

### 拡張関数とメンバー関数

拡張関数とメンバー関数の呼び出しは同じ表記であるため、コンパイラはどちらを使用すべきかをどのように判断するのでしょうか？
拡張関数は_静的に_ディスパッチされます。つまり、コンパイラはコンパイル時にレシーバー型に基づいてどの関数を呼び出すかを決定します。例えば：

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(shape: Shape) {
        println(shape.getName())
    }
    
    printClassName(Rectangle())
    // Shape
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-shape"}

この例では、パラメータ`shape`が`Shape`型として宣言されているため、コンパイラは`Shape.getName()`拡張関数を呼び出します。拡張関数は静的に解決されるため、コンパイラは実際のインスタンスではなく、宣言された型に基づいて関数を選択します。

したがって、例では`Rectangle`インスタンスを渡していますが、変数が`Shape`型として宣言されているため、`.getName()`関数は`Shape.getName()`に解決されます。

あるクラスがメンバー関数を持ち、かつ、同じレシーバー型、同じ名前で、互換性のある引数を持つ拡張関数が定義されている場合、メンバー関数が優先されます。例えば：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
    // Member function
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function"}

ただし、拡張関数は、同じ名前でも_異なる_シグネチャを持つメンバー関数をオーバーロードできます。

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    // Same name but different signature
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }
    
    Example().printFunctionType(1)
    // Extension function #1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

この例では、`.printFunctionType()`関数に`Int`が渡されるため、コンパイラはシグネチャに一致する拡張関数を選択します。コンパイラは引数を取らないメンバー関数を無視します。

### 匿名拡張関数

拡張関数に名前を付けずに定義できます。これは、グローバルな名前空間を汚染したくない場合や、拡張動作をパラメータとして渡す必要がある場合に役立ちます。

例えば、名前を付けずに、データクラスを1回限りの関数で拡張して送料を計算したいとします。

```kotlin
fun main() {
    //sampleStart
    data class Order(val weight: Double)
    val calculateShipping = fun Order.(rate: Double): Double = this.weight * rate
    
    val order = Order(2.5)
    val cost = order.calculateShipping(3.0)
    println("Shipping cost: $cost") 
    // Shipping cost: 7.5
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous"}

拡張動作をパラメータとして渡すには、型アノテーション付きの[ラムダ式](lambdas.md#lambda-expression-syntax)を使用します。例えば、名前付き関数を定義せずに、数値が範囲内にあるかどうかをチェックしたいとします。

```kotlin
fun main() {
    val isInRange: Int.(min: Int, max: Int) -> Boolean = { min, max -> this in min..max }

    println(5.isInRange(1, 10))
    // true
    println(20.isInRange(1, 10))
    // false
}
```
 {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous-lambda"}

この例では、`isInRange`変数は`Int.(min: Int, max: Int) -> Boolean`型の関数を保持しています。この型は、`min`と`max`パラメータを取り`Boolean`を返す`Int`クラスの拡張関数です。

ラムダ本体`{ min, max -> this in min..max }`は、関数が呼び出される`Int`値が`min`と`max`パラメータ間の範囲内にあるかどうかをチェックします。チェックが成功した場合、ラムダは`true`を返します。

詳細については、[ラムダ式と匿名関数](lambdas.md)を参照してください。

## 拡張プロパティ

Kotlinは拡張プロパティをサポートしており、これは、作業しているクラスを汚染することなく、データ変換を実行したり、UI表示ヘルパーを作成したりするのに役立ちます。

拡張プロパティを作成するには、拡張したいクラスの名前の後に` .`とプロパティ名を記述します。

例えば、名と姓を持つユーザーを表すデータクラスがあり、アクセス時にメール形式のユーザー名を返すプロパティを作成したいとします。コードは次のようになります。

```kotlin
data class User(val firstName: String, val lastName: String)

// An extension property to get a username-style email handle
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // Calls extension property
    println("Generated email username: ${user.emailUsername}")
    // Generated email username: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

拡張は実際にクラスにメンバーを追加しないため、拡張プロパティが[バッキングフィールド](properties.md#backing-fields)を持つ効率的な方法はありません。そのため、拡張プロパティには初期化子は許可されていません。その動作は、明示的にゲッターとセッターを提供することによってのみ定義できます。例えば：

```kotlin
data class House(val streetName: String)

// Doesn't compile because there is no getter and setter
// var House.number = 1
// Error: Initializers are not allowed for extension properties

// Compiles successfully
val houseNumbers = mutableMapOf<House, Int>()
var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        println("Setting house number for ${this.streetName} to $value")
        houseNumbers[this] = value
    }

fun main() {
    val house = House("Maple Street")

    // Shows the default
    println("Default number: ${house.number} ${house.streetName}") 
    // Default number: 1 Maple Street
    
    house.number = 99
    // Setting house number for Maple Street to 99

    // Shows the updated number
    println("Updated number: ${house.number} ${house.streetName}") 
    // Updated number: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

この例では、ゲッターは[エルビス演算子](null-safety.md#elvis-operator)を使用して、`houseNumbers`マップに家の番号が存在する場合はその番号を返し、そうでない場合は`1`を返します。ゲッターとセッターの書き方について詳しく知るには、[カスタムゲッターとセッター](properties.md#custom-getters-and-setters)を参照してください。

## コンパニオンオブジェクト拡張

クラスが[コンパニオンオブジェクト](object-declarations.md#companion-objects)を定義している場合、そのコンパニオンオブジェクトに対して拡張関数やプロパティを定義することもできます。コンパニオンオブジェクトの通常のメンバーと同様に、クラス名を修飾子として使用するだけで呼び出すことができます。コンパイラはデフォルトでコンパニオンオブジェクトを`Companion`と名付けます。

```kotlin
class Logger {
    companion object { }
}

fun Logger.Companion.logStartupMessage() {
    println("Application started.")
}

fun main() {
    Logger.logStartupMessage()
    // Application started.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-companion-object"}

## メンバーとしての拡張の宣言

あるクラスの内部で、別のクラスの拡張を宣言することができます。このような拡張には複数の_暗黙のレシーバー_があります。暗黙のレシーバーとは、[`this`](this-expressions.md#qualified-this)で修飾することなくメンバーにアクセスできるオブジェクトのことです。

*   拡張を宣言するクラスが_ディスパッチレシーバー_です。
*   拡張関数のレシーバー型が_拡張レシーバー_です。

`Connection`クラスに`Host`クラスの拡張関数`printConnectionString()`がある次の例を考えてみましょう。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host is the extension receiver
    fun Host.printConnectionString() {
        // Calls Host.printHostname()
        printHostname() 
        print(":")
        // Calls Connection.printPort()
        // Connection is the dispatch receiver
        printPort()
    }

    fun connect() {
        /*...*/
        // Calls the extension function
        host.printConnectionString() 
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // kotl.in:443
    
    // Triggers an error because the extension function isn't available outside Connection
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

この例では、`printConnectionString()`関数を`Connection`クラスの内部で宣言しているため、`Connection`クラスがディスパッチレシーバーです。拡張関数のレシーバー型は`Host`クラスであるため、`Host`クラスが拡張レシーバーです。

ディスパッチレシーバーと拡張レシーバーに同じ名前のメンバーがある場合、拡張レシーバーのメンバーが優先されます。ディスパッチレシーバーに明示的にアクセスするには、[修飾`this`構文](this-expressions.md#qualified-this)を使用します。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        // Calls Host.toString()
        toString()
        // Calls Connection.toString()
        this@Connection.toString()
    }
}
```

### メンバー拡張のオーバーライド

メンバー拡張を`open`として宣言し、サブクラスでオーバーライドできます。これは、各サブクラスで拡張の動作をカスタマイズしたい場合に役立ちます。コンパイラは各レシーバー型を異なる方法で処理します。

| レシーバー型 | 解決時間 | ディスパッチ型 |
|---|---|---|
| ディスパッチレシーバー | 実行時 | 仮想 |
| 拡張レシーバー | コンパイル時 | 静的 |

`User`クラスが`open`で、`Admin`クラスがそれを継承している次の例を考えてみましょう。`NotificationSender`クラスは`User`と`Admin`クラスの両方に`sendNotification()`拡張関数を定義し、`SpecialNotificationSender`クラスはそれらをオーバーライドします。

```kotlin
open class User

class Admin : User()

open class NotificationSender {
    open fun User.sendNotification() {
        println("Sending user notification from normal sender")
    }

    open fun Admin.sendNotification() {
        println("Sending admin notification from normal sender")
    }

    fun notify(user: User) {
        user.sendNotification()
    }
}

class SpecialNotificationSender : NotificationSender() {
    override fun User.sendNotification() {
        println("Sending user notification from special sender")
    }

    override fun Admin.sendNotification() {
        println("Sending admin notification from special sender")
    }
}

fun main() {
    // Dispatch receiver is NotificationSender
    // Extension receiver is User
    // Resolves to User.sendNotification() in NotificationSender
    NotificationSender().notify(User())
    // Sending user notification from normal sender
    
    // Dispatch receiver is SpecialNotificationSender
    // Extension receiver is User
    // Resolves to User.sendNotification() in SpecialNotificationSender
    SpecialNotificationSender().notify(User())
    // Sending user notification from special sender 
    
    // Dispatch receiver is SpecialNotificationSender
    // Extension receiver is User NOT Admin
    // The notify() function declares user as type User
    // Statically resolves to User.sendNotification() in SpecialNotificationSender
    SpecialNotificationSender().notify(Admin())
    // Sending user notification from special sender 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

ディスパッチレシーバーは仮想ディスパッチを使用して実行時に解決されるため、`main()`関数の動作を理解しやすくなります。驚くかもしれませんが、`Admin`インスタンスで`notify()`関数を呼び出す際、コンパイラは宣言された型である`user: User`に基づいて拡張を選択します。これは、拡張レシーバーを静的に解決するためです。

## 拡張と可視性修飾子

拡張は、他のクラスのメンバーとして宣言された拡張を含め、同じスコープで宣言された通常の関数と同じ[可視性修飾子](visibility-modifiers.md)を使用します。

例えば、ファイルのトップレベルで宣言された拡張は、同じファイル内の他の`private`トップレベル宣言にアクセスできます。

```kotlin
// File: StringUtils.kt

private fun removeWhitespace(input: String): String {
    return input.replace("\\s".toRegex(), "")
}

fun String.cleaned(): String {
    return removeWhitespace(this)
}

fun main() {
    val rawEmail = "  user @example. com  "
    val cleaned = rawEmail.cleaned()
    println("Raw:     '$rawEmail'")
    // Raw:     '  user @example. com  '
    println("Cleaned: '$cleaned'")
    // Cleaned: 'user@example.com'
    println("Looks like an email: ${cleaned.contains("@") && cleaned.contains(".")}") 
    // Looks like an email: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-top-level"}

また、拡張がそのレシーバー型の外部で宣言されている場合、レシーバーの`private`または`protected`メンバーにアクセスできません。

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// Extension declared outside the class
fun User.isSecure(): Boolean {
    // Can't access password because it's private:
    // return password.length >= 8

    // Instead, we rely on public members:
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}") 
    // Is user secure: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

拡張が`internal`とマークされている場合、その[モジュール](visibility-modifiers.md#modules)内でのみアクセス可能です。

```kotlin
// Networking module
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

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