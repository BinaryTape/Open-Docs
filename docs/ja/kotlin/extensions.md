[//]: # (title: 拡張)

Kotlinの *拡張 (extensions)* を使用すると、継承や *Decorator* のようなデザインパターンを使用せずに、クラスやインターフェースを新しい機能で拡張できます。これらは、直接変更できないサードパーティライブラリを扱う際に非常に便利です。一度作成すると、これらの拡張は元のクラスやインターフェースのメンバーであるかのように呼び出すことができます。

拡張の最も一般的な形式は、[拡張関数 (extension functions)](#extension-functions) と [拡張プロパティ (extension properties)](#extension-properties) です。

重要な点として、拡張は拡張対象のクラスやインターフェースを実際に変更するわけではありません。拡張を定義しても、新しいメンバーを追加することにはなりません。同じ構文を使用して、新しい関数を呼び出せるようにしたり、新しいプロパティにアクセスできるようにしたりするだけです。

## レシーバー (Receivers)

拡張は常にレシーバーに対して呼び出されます。レシーバーは、拡張されるクラスまたはインターフェースと同じ型である必要があります。
拡張を使用するには、レシーバーの後に `.` と関数名またはプロパティ名を付けます。

たとえば、標準ライブラリの [`.appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html) 拡張関数は `StringBuilder` クラスを拡張しています。
この場合、レシーバーは `StringBuilder` のインスタンスであり、*レシーバー型 (receiver type)* は `StringBuilder` です。

```kotlin
fun main() { 
//sampleStart
    // builder は StringBuilder のインスタンス
    val builder = StringBuilder()
        // builder に対して .appendLine() 拡張関数を呼び出す
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

## 拡張関数 (Extension functions)

独自の拡張関数を作成する前に、探しているものがすでにKotlinの [標準ライブラリ](https://kotlinlang.org/api/core/kotlin-stdlib/) に用意されていないか確認してください。
標準ライブラリには、以下のような便利な拡張関数が多く提供されています：

* コレクションの操作: [`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html), [`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html), [`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html), [`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html), [`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html)
* 文字列への変換: [`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html)
* null値の処理: [`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html)

独自の拡張関数を作成するには、関数名の前にレシーバー型と `.` を付けます。この例では、`.truncate()` 関数が `String` クラスを拡張しているため、レシーバー型は `String` になります：

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

`.truncate()` 関数は、呼び出された文字列を `maxLength` 引数の数で切り詰め、省略記号 `...` を追加します。
文字列が `maxLength` より短い場合、関数は元の文字列を返します。

次の例では、`.displayInfo()` 関数が `User` インターフェースを拡張しています：

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// User インターフェースを継承し、プロパティを実装
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo()) 
    // User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

`.displayInfo()` 関数は、`RegularUser` インスタンスの `name` と `email` を含む文字列を返します。このようにインターフェースに対して拡張を定義すると、そのインターフェースを実装するすべての型に対して一度に機能を追加したい場合に便利です。

次の例では、`.mostVoted()` 関数が `Map<String, Int>` クラスを拡張しています：

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

`.mostVoted()` 関数は、呼び出されたマップのキーと値のペアを反復処理し、[`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html) 関数を使用して、最も高い値を持つペアのキーを返します。マップが空の場合、`maxByOrNull()` 関数は `null` を返します。`mostVoted()` 関数は安全な呼び出し `?.` を使用して、`maxByOrNull()` 関数が null 以外の値を返したときにのみ `key` プロパティにアクセスします。

### ジェネリックな拡張関数 (Generic extension functions)

ジェネリックな拡張関数を作成するには、レシーバー型の式で利用できるように、関数名の前にジェネリック型パラメータを宣言します。この例では、`.endpoints()` 関数が `List<T>` を拡張しており、`T` は任意の型にすることができます：

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

`.endpoints()` 関数は、呼び出されたリストの最初と最後の要素を含むペアを返します。関数本体の内部では、`first()` と `last()` 関数を呼び出し、それらの戻り値を `to` 中置関数（infix function）を使用して `Pair` に結合しています。

ジェネリクスの詳細については、[ジェネリック関数](generics.md) を参照してください。

### Null許容なレシーバー (Nullable receivers)

Null許容（nullable）なレシーバー型を持つ拡張関数を定義することもできます。これにより、変数の値が null であっても、その変数に対して拡張関数を呼び出すことができます。レシーバーが `null` の場合、`this` も `null` になります。関数内では、null 許容性を正しく処理するようにしてください。たとえば、関数本体の中で `this == null` チェックを行ったり、[安全な呼び出し `?.`](null-safety.md#safe-call-operator) や [Elvis演算子 `?:`](null-safety.md#elvis-operator) を使用したりします。

この例では、拡張関数内部ですでにチェックが行われているため、`null` チェックを事前に行わずに `.toString()` 関数を呼び出すことができます：

```kotlin
fun main() {
    //sampleStart
    // Null許容な Any? に対する拡張関数
    fun Any?.toString(): String {
        if (this == null) return "null"
        // null チェック後、`this` は非 null の Any にスマートキャストされる
        // そのため、この呼び出しは通常の toString() 関数として解決される
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

### 拡張関数かメンバー関数か？

拡張関数とメンバー関数の呼び出しは同じ表記ですが、コンパイラはどちらを使用するかをどのように判断するのでしょうか？
拡張関数は *静的に* ディスパッチされます。つまり、コンパイラはコンパイル時のレシーバー型に基づいて、どの関数を呼び出すかを決定します。例：

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

この例では、パラメータ `shape` が `Shape` 型として宣言されているため、コンパイラは `Shape.getName()` 拡張関数を呼び出します。拡張関数は静的に解決されるため、コンパイラは実際のインスタンスではなく、宣言された型に基づいて関数を選択します。

したがって、例では `Rectangle` インスタンスを渡していますが、変数が `Shape` 型として宣言されているため、`.getName()` 関数は `Shape.getName()` に解決されます。

クラスにメンバー関数があり、同じレシーバー型、同じ名前、および互換性のある引数を持つ拡張関数がある場合、常にメンバー関数が優先されます。例：

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

ただし、拡張関数は、同じ名前でも *異なる* シグネチャを持つメンバー関数をオーバーロードすることができます：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    // 同じ名前だが異なるシグネチャ
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }
    
    Example().printFunctionType(1)
    // Extension function #1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

この例では、`Int` が `.printFunctionType()` 関数に渡されているため、コンパイラはシグネチャが一致する拡張関数を選択します。コンパイラは引数を取らないメンバー関数を無視します。

### 匿名拡張関数 (Anonymous extension functions)

名前を付けずに拡張関数を定義することもできます。これは、グローバルな名前空間を汚したくない場合や、拡張の振る舞いをパラメータとして渡したい場合に便利です。

たとえば、データクラスに対して、名前を付けずに一回限りの配送料計算関数を拡張したいとします：

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

拡張の振る舞いをパラメータとして渡すには、型アノテーションを付けた [ラムダ式](lambdas.md#lambda-expression-syntax) を使用します。
たとえば、名前付き関数を定義せずに、数値が範囲内にあるかどうかを確認したい場合は次のようになります：

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

この例では、`isInRange` 変数は `Int.(min: Int, max: Int) -> Boolean` 型の関数を保持しています。この型は、`min` と `max` パラメータを受け取り、`Boolean` を返す `Int` クラスの拡張関数です。

ラムダ本体 `{ min, max -> this in min..max }` は、関数が呼び出された `Int` 値が `min` パラメータと `max` パラメータの間の範囲に収まるかどうかをチェックします。チェックが成功すると、ラムダは `true` を返します。

詳細については、[ラムダ式と匿名関数](lambdas.md) を参照してください。

## 拡張プロパティ (Extension properties)

Kotlinは拡張プロパティをサポートしています。これは、作業中のクラスを汚すことなく、データ変換を行ったりUI表示ヘルパーを作成したりするのに役立ちます。

拡張プロパティを作成するには、拡張したいクラス名の後に `.` とプロパティ名を記述します。

たとえば、名と姓を持つユーザーを表すデータクラスがあり、アクセスしたときにメール形式のユーザー名を返すプロパティを作成したいとします。コードは以下のようになります：

```kotlin
data class User(val firstName: String, val lastName: String)

// ユーザー名形式のメールハンドルを取得するための拡張プロパティ
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // 拡張プロパティを呼び出す
    println("Generated email username: ${user.emailUsername}")
    // Generated email username: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

拡張は実際にはクラスにメンバーを追加するわけではないため、拡張プロパティが [バッキングフィールド (backing field)](properties.md#backing-fields) を持つ効率的な方法はありません。そのため、拡張プロパティに初期化子（initializer）を使用することは許可されていません。振る舞いは、ゲッター（getter）とセッター（setter）を明示的に提供することによってのみ定義できます。例：

```kotlin
data class House(val streetName: String)

// ゲッターとセッターがないためコンパイルできない
// var House.number = 1
// エラー: 拡張プロパティに初期化子は許可されていません

// 正常にコンパイルされる
val houseNumbers = mutableMapOf<House, Int>()
var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        println("Setting house number for ${this.streetName} to $value")
        houseNumbers[this] = value
    }

fun main() {
    val house = House("Maple Street")

    // デフォルトを表示
    println("Default number: ${house.number} ${house.streetName}") 
    // Default number: 1 Maple Street
    
    house.number = 99
    // Setting house number for Maple Street to 99

    // 更新された番号を表示
    println("Updated number: ${house.number} ${house.streetName}") 
    // Updated number: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

この例では、ゲッターは [Elvis演算子](null-safety.md#elvis-operator) を使用して、`houseNumbers` マップにハウス番号が存在すればそれを返し、存在しなければ `1` を返します。ゲッターとセッターの書き方の詳細については、[カスタムゲッターとセッター](properties.md#custom-getters-and-setters) を参照してください。

## コンパニオンオブジェクトの拡張 (Companion object extensions)

クラスに [コンパニオンオブジェクト](object-declarations.md#companion-objects) が定義されている場合、そのコンパニオンオブジェクトに対しても拡張関数やプロパティを定義できます。コンパニオンオブジェクトの通常のメンバーと同様に、クラス名のみを修飾子として使用して呼び出すことができます。コンパイラはデフォルトでコンパニオンオブジェクトを `Companion` と命名します：

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

## メンバーとしての拡張の宣言 (Declaring extensions as members)

あるクラスの中で別のクラスの拡張を宣言できます。このような拡張には、複数の *暗黙のレシーバー (implicit receivers)* が存在します。暗黙のレシーバーとは、[`this`](this-expressions.md#qualified-this) で修飾しなくてもメンバーにアクセスできるオブジェクトのことです：

* 拡張を宣言しているクラスは *ディスパッチレシーバー (dispatch receiver)* です。
* 拡張関数のレシーバー型は *拡張レシーバー (extension receiver)* です。

`Connection` クラスが `Host` クラスのための `printConnectionString()` という拡張関数を持っている、次の例を考えてみましょう：

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host は拡張レシーバー
    fun Host.printConnectionString() {
        // Host.printHostname() を呼び出す
        printHostname() 
        print(":")
        // Connection.printPort() を呼び出す
        // Connection はディスパッチレシーバー
        printPort()
    }

    fun connect() {
        /*...*/
        // 拡張関数を呼び出す
        host.printConnectionString() 
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // kotl.in:443
    
    // 拡張関数が Connection の外部で利用できないため、エラーが発生する
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

この例では、`printConnectionString()` 関数が `Connection` クラスの内部で宣言されているため、`Connection` クラスがディスパッチレシーバーになります。拡張関数のレシーバー型は `Host` クラスであるため、`Host` クラスが拡張レシーバーになります。

ディスパッチレシーバーと拡張レシーバーの両方が同じ名前のメンバーを持っている場合、拡張レシーバーのメンバーが優先されます。ディスパッチレシーバーに明示的にアクセスするには、[修飾された `this` 構文](this-expressions.md#qualified-this) を使用します：

```kotlin
class Connection {
    fun Host.getConnectionString() {
        // Host.toString() を呼び出す
        toString()
        // Connection.toString() を呼び出す
        this@Connection.toString()
    }
}
```

### メンバー拡張のオーバーライド (Overriding member extensions)

メンバー拡張を `open` として宣言し、サブクラスでオーバーライドすることができます。これは、各サブクラスで拡張の振る舞いをカスタマイズしたい場合に便利です。コンパイラは各レシーバー型を異なる方法で処理します：

| レシーバー型 | 解決タイミング | ディスパッチのタイプ |
|--------------------|-----------------|---------------|
| ディスパッチレシーバー | 実行時 | 仮想的 (Virtual) |
| 拡張レシーバー | コンパイル時 | 静的 (Static) |

`User` クラスが `open` であり、`Admin` クラスがそれを継承している次の例を考えてみましょう。`NotificationSender` クラスは `User` クラスと `Admin` クラスの両方に対して `sendNotification()` 拡張関数を定義しており、`SpecialNotificationSender` クラスはそれらをオーバーライドしています：

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
    // ディスパッチレシーバーは NotificationSender
    // 拡張レシーバーは User
    // NotificationSender の User.sendNotification() に解決される
    NotificationSender().notify(User())
    // Sending user notification from normal sender
    
    // ディスパッチレシーバーは SpecialNotificationSender
    // 拡張レシーバーは User
    // SpecialNotificationSender の User.sendNotification() に解決される
    SpecialNotificationSender().notify(User())
    // Sending user notification from special sender 
    
    // ディスパッチレシーバーは SpecialNotificationSender
    // 拡張レシーバーは Admin ではなく User
    // notify() 関数は user を User 型として宣言している
    // SpecialNotificationSender の User.sendNotification() に静的に解決される
    SpecialNotificationSender().notify(Admin())
    // Sending user notification from special sender 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

ディスパッチレシーバーは仮想ディスパッチを使用して実行時に解決されるため、`main()` 関数内の動作は追いやすくなっています。驚くかもしれないのは、`Admin` インスタンスに対して `notify()` 関数を呼び出したとき、コンパイラが宣言された型 `user: User` に基づいて拡張を選択することです。これは、拡張レシーバーを静的に解決するためです。

## 拡張と可視性修飾子 (Extensions and visibility modifiers)

拡張は、他のクラスのメンバーとして宣言された拡張を含め、同じスコープで宣言された通常の関数と同じ [可視性修飾子 (visibility modifiers)](visibility-modifiers.md) を使用します。

たとえば、ファイルのトップレベルで宣言された拡張は、同じファイル内の他の `private` なトップレベル宣言にアクセスできます：

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

また、拡張がそのレシーバー型の外部で宣言されている場合、レシーバーの `private` または `protected` メンバーにはアクセスできません：

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// クラスの外部で宣言された拡張
fun User.isSecure(): Boolean {
    // password は private なのでアクセスできない:
    // return password.length >= 8

    // 代わりに、公開されているメンバーを利用する:
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}") 
    // Is user secure: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

拡張が `internal` とマークされている場合、その [モジュール (module)](visibility-modifiers.md#modules) 内でのみアクセス可能です：

```kotlin
// Networking モジュール
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

## 拡張のスコープ (Scope of extensions)

ほとんどの場合、拡張はパッケージ直下のトップレベルで定義します：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

宣言されたパッケージの外部で拡張を使用するには、呼び出し側でインポートします：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

詳細については、[インポート](packages.md#imports) を参照してください。