[//]: # (title: プロパティ)

Kotlinでは、プロパティを使用すると、データにアクセスしたり変更したりするための関数を記述することなく、データを保存および管理できます。
プロパティは、[クラス](classes.md)、[インターフェース](interfaces.md)、[オブジェクト](object-declarations.md)、[コンパニオンオブジェクト](object-declarations.md#companion-objects)内、
さらにはこれらの構造の外部でトップレベルプロパティとして使用できます。

すべてのプロパティには名前、型、そしてgetterと呼ばれる自動生成された`get()`関数があります。getterを使用してプロパティの値を読み取ることができます。プロパティが可変の場合、setterと呼ばれる`set()`関数も持ち、プロパティの値を変更することができます。

> Getterとsetterは_アクセサー_と呼ばれます。
>
{style="tip"}

## プロパティの宣言

プロパティは可変 (`var`) または読み取り専用 (`val`) にできます。
これらは`.kt`ファイル内でトップレベルプロパティとして宣言できます。トップレベルプロパティは、パッケージに属するグローバル変数と考えることができます。

```kotlin
// File: Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

クラス、インターフェース、またはオブジェクト内でプロパティを宣言することもできます。

```kotlin
// Class with properties
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// Interface with a property
interface ContactInfo {
    val email: String
}

// Object with properties
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// Class implementing the interface
class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}
```

プロパティを使用するには、その名前で参照します。

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

interface ContactInfo {
    val email: String
}

object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}

//sampleStart
fun copyAddress(address: Address): Address {
    val result = Address()
    // Accesses properties in the result instance
    result.name = address.name
    result.street = address.street
    result.city = address.city
    return result
}

fun main() {
    val sherlockAddress = Address()
    val copy = copyAddress(sherlockAddress)
    // Accesses properties in the copy instance
    println("Copied address: ${copy.name}, ${copy.street}, ${copy.city}")
    // Copied address: Holmes, Sherlock, Baker, London

    // Accesses properties in the Company object
    println("Company: ${Company.name} in ${Company.country}")
    // Company: Detective Inc. in UK
    
    val contact = PersonContact()
    // Access properties in the contact instance
    println("Email: ${contact.email}")
    // Email: sherlock@email.com
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-access-properties"}

Kotlinでは、コードを安全で読みやすく保つために、プロパティを宣言時に初期化することをお勧めします。ただし、特別な場合には、[後で初期化する](#late-initialized-properties-and-variables)こともできます。

コンパイラが初期化子またはgetterの戻り値の型から型を推論できる場合は、プロパティの型を宣言することはオプションです。

```kotlin
var initialized = 1 // The inferred type is Int
var allByDefault    // ERROR: Property must be initialized.
```
{validate="false"}

## カスタムgetterとsetter

デフォルトでは、Kotlinはgetterとsetterを自動的に生成します。バリデーション、フォーマット、または他のプロパティに基づく計算など、追加のロジックが必要な場合は、独自のカスタムアクセサーを定義できます。

カスタムgetterは、プロパティがアクセスされるたびに実行されます。

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-getter"}

コンパイラがgetterから型を推論できる場合は、型を省略できます。

```kotlin
val area get() = this.width * this.height
```

カスタムsetterは、初期化時を除き、プロパティに値を代入するたびに実行されます。慣例により、setterパラメーターの名前は`value`ですが、別の名前を選択できます。

```kotlin
class Point(var x: Int, var y: Int) {
    var coordinates: String
        get() = "$x,$y"
        set(value) {
            val parts = value.split(",")
            x = parts[0].toInt()
            y = parts[1].toInt()
        }
}

fun main() {
    val location = Point(1, 2)
    println(location.coordinates) 
    // 1,2

    location.coordinates = "10,20"
    println("${location.x}, ${location.y}") 
    // 10, 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-setter"}

### 可視性の変更またはアノテーションの追加

Kotlinでは、デフォルトの実装を置き換えることなく、アクセサーの可視性を変更したり、[アノテーション](annotations.md)を追加したりできます。これらの変更を本体`{}`内で行う必要はありません。

アクセサーの可視性を変更するには、`get`または`set`キーワードの前に修飾子を使用します。

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // Only the class can modify the balance
        private set 

    fun deposit(amount: Int) {
        if (amount > 0) balance += amount
    }

    fun withdraw(amount: Int) {
        if (amount > 0 && amount <= balance) balance -= amount
    }
}

fun main() {
    val account = BankAccount(100)
    println("Initial balance: ${account.balance}") 
    // 100

    account.deposit(50)
    println("After deposit: ${account.balance}") 
    // 150

    account.withdraw(70)
    println("After withdrawal: ${account.balance}") 
    // 80

    // account.balance = 1000  
    // Error: cannot assign because setter is private
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

アクセサーにアノテーションを付けるには、`get`または`set`キーワードの前にアノテーションを使用します。

```kotlin
// Defines an annotation that can be applied to a getter
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // Annotates the getter
        @Inject get 
}

fun main() {
    val service = Service()
    println(service.dependency)
    // Default service
    println(service::dependency.getter.annotations)
    // [@Inject()]
    println(service::dependency.setter.annotations)
    // []
}
```
{validate="false"}

この例では、[リフレクション](reflection.md)を使用して、getterとsetterにどのアノテーションが存在するかを示しています。

### バッキングフィールド

Kotlinでは、アクセサーはプロパティの値をメモリに保存するためにバッキングフィールドを使用します。バッキングフィールドは、getterやsetterに追加のロジックを追加したい場合、またはプロパティが変更されるたびに追加のアクションをトリガーしたい場合に役立ちます。

バッキングフィールドを直接宣言することはできません。Kotlinは必要な場合にのみそれらを生成します。アクセサー内で`field`キーワードを使用してバッキングフィールドを参照できます。

Kotlinは、デフォルトのgetterまたはsetterを使用する場合、または少なくとも1つのカスタムアクセサーで`field`を使用する場合にのみ、バッキングフィールドを生成します。

たとえば、`isEmpty`プロパティは、`field`キーワードを使用しないカスタムgetterを使用しているため、バッキングフィールドを持ちません。

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

この例では、`score`プロパティはsetterが`field`キーワードを使用しているため、バッキングフィールドを持っています。

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // Adds logging when updating the value
            println("Score updated to $field")
        }
}

fun main() {
    val board = Scoreboard()
    board.score = 10  
    // Score updated to 10
    board.score = 20  
    // Score updated to 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-field"}

### バッキングプロパティ

[バッキングフィールド](#backing-fields)が提供できる以上の柔軟性が必要になる場合があります。たとえば、プロパティを内部で変更できるが、外部からは変更できないAPIがある場合などです。そのような場合、_バッキングプロパティ_と呼ばれるコーディングパターンを使用できます。

以下の例では、`ShoppingCart`クラスはショッピングカート内のすべてを表す`items`プロパティを持っています。`items`プロパティはクラスの外部からは読み取り専用にしたいが、ユーザーが`items`プロパティを直接変更できる「承認された」方法を1つだけ許可したいと考えています。これを実現するには、`_items`というプライベートなバッキングプロパティと、そのバッキングプロパティの値に委譲する`items`というパブリックなプロパティを定義できます。

```kotlin
class ShoppingCart {
    // Backing property
    private val _items = mutableListOf<String>()

    // Public read-only view
    val items: List<String>
        get() = _items

    fun addItem(item: String) {
        _items.add(item)
    }

    fun removeItem(item: String) {
        _items.remove(item)
    }
}

fun main() {
    val cart = ShoppingCart()
    cart.addItem("Apple")
    cart.addItem("Banana")

    println(cart.items) 
    // [Apple, Banana]
    
    cart.removeItem("Apple")
    println(cart.items) 
    // [Banana]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property"}

この例では、ユーザーは`addItem()`関数を介してのみカートにアイテムを追加できますが、`items`プロパティにアクセスして中身を確認することはできます。

> Kotlinの[コーディング規約](coding-conventions.md#names-for-backing-properties)に従うには、バッキングプロパティの命名時に先頭にアンダースコアを使用します。
>
{style="tip"}

JVMでは、コンパイラはデフォルトのアクセサーを持つプライベートプロパティへのアクセスを最適化し、関数呼び出しのオーバーヘッドを回避します。

バッキングプロパティは、複数のパブリックプロパティが状態を共有したい場合にも役立ちます。例：

```kotlin
class Temperature {
    // Backing property storing temperature in Celsius
    private var _celsius: Double = 0.0

    var celsius: Double
        get() = _celsius
        set(value) { _celsius = value }

    var fahrenheit: Double
        get() = _celsius * 9 / 5 + 32
        set(value) { _celsius = (value - 32) * 5 / 9 }
}

fun main() {
    val temp = Temperature()
    temp.celsius = 25.0
    println("${temp.celsius}°C = ${temp.fahrenheit}°F") 
    // 25.0°C = 77.0°F

    temp.fahrenheit = 212.0
    println("${temp.celsius}°C = ${temp.fahrenheit}°F") 
    // 100.0°C = 212.0°F
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-multiple-properties"}

この例では、`_celsius`バッキングプロパティは`celsius`プロパティと`fahrenheit`プロパティの両方からアクセスされます。この設定は、2つのパブリックビューを持つ単一の信頼できる情報源を提供します。

## コンパイル時定数

読み取り専用プロパティの値がコンパイル時に既知である場合、`const`修飾子を使用して_コンパイル時定数_としてマークします。コンパイル時定数はコンパイル時にインライン化されるため、各参照はその実際の値に置き換えられます。getterが呼び出されないため、より効率的にアクセスされます。

```kotlin
// File: AppConfig.kt
package com.example

// Compile-time constant
const val MAX_LOGIN_ATTEMPTS = 3
```

コンパイル時定数は、次の要件を満たす必要があります。

*   トップレベルプロパティであるか、[`object`宣言](object-declarations.md#object-declarations-overview)または[コンパニオンオブジェクト](object-declarations.md#companion-objects)のメンバーであること。
*   `String`型または[プリミティブ型](basic-types.md)の値で初期化されていること。
*   カスタムgetterを持つことはできない。

コンパイル時定数にはバッキングフィールドがまだ存在するため、[リフレクション](reflection.md)を使用してそれらを操作できます。

これらのプロパティをアノテーションでも使用できます。

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## 遅延初期化プロパティと変数

通常、プロパティはコンストラクタで初期化する必要があります。しかし、これは常に都合が良いとは限りません。たとえば、プロパティを依存性注入を介して、または単体テストのセットアップメソッド内で初期化する場合があります。

これらの状況を処理するには、プロパティを`lateinit`修飾子でマークします。

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // Calls orderService directly without checking for null
        // or initialization
        orderService.processOrder()  
    }
}
```

`lateinit`修飾子は、次のように宣言された`var`プロパティで使用できます。

*   トップレベルプロパティ。
*   ローカル変数。
*   クラスの本体内のプロパティ。

クラスプロパティの場合：

*   プライマリコンストラクタで宣言することはできません。
*   カスタムgetterまたはsetterを持つことはできません。

すべての場合において、プロパティまたは変数は非NULL許容である必要があり、[プリミティブ型](basic-types.md)であってはなりません。

`lateinit`プロパティが初期化される前にアクセスすると、Kotlinはアクセスされた初期化されていないプロパティを明確に識別する特定の例外をスローします。

```kotlin
class ReportGenerator {
    lateinit var report: String

    fun printReport() {
        // Throws an exception as it's accessed before
        // initialization
        println(report)
    }
}

fun main() {
    val generator = ReportGenerator()
    generator.printReport()
    // Exception in thread "main" kotlin.UninitializedPropertyAccessException: lateinit property report has not been initialized
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property" validate="false"}

`lateinit var`がすでに初期化されているかどうかを確認するには、[そのプロパティへの参照](reflection.md#property-references)に対して[`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html)プロパティを使用します。

```kotlin
class WeatherStation {
    lateinit var latestReading: String

    fun printReading() {
        // Checks whether the property is initialized
        if (this::latestReading.isInitialized) {
            println("Latest reading: $latestReading")
        } else {
            println("No reading available")
        }
    }
}

fun main() {
    val station = WeatherStation()

    station.printReading()
    // No reading available
    station.latestReading = "22°C, sunny"
    station.printReading()
    // Latest reading: 22°C, sunny
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property-check-initialization"}

`isInitialized`は、コード内で既にアクセスできるプロパティに対してのみ使用できます。プロパティは、同じクラス内、外側のクラス内、または同じファイル内のトップレベルプロパティとして宣言されている必要があります。

## プロパティのオーバーライド

[プロパティのオーバーライド](inheritance.md#overriding-properties)を参照してください。

## 委譲プロパティ

ロジックを再利用し、コードの重複を減らすために、プロパティの取得と設定の責任を別のオブジェクトに委譲できます。

アクセサーの振る舞いを委譲することで、プロパティのアクセサーロジックが一元化され、再利用が容易になります。このアプローチは、次のような振る舞いを実装する場合に役立ちます。

*   値を遅延して計算する。
*   特定のキーによるマップからの読み取り。
*   データベースへのアクセス。
*   プロパティがアクセスされたときにリスナーに通知する。

これらの一般的な振る舞いは、ライブラリ内で自分で実装することも、外部ライブラリによって提供される既存のデリゲートを使用することもできます。詳細については、[委譲プロパティ](delegated-properties.md)を参照してください。