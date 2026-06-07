[//]: # (title: プロパティ)

Kotlin では、プロパティを使用することで、データへのアクセスや変更のための関数を記述することなく、データを保存および管理できます。
プロパティは、[クラス](classes.md)、[インターフェース](interfaces.md)、[オブジェクト](object-declarations.md)、[コンパニオンオブジェクト](object-declarations.md#companion-objects)内で使用できるほか、これらの構造の外でトップレベルプロパティとしても使用できます。

すべてのプロパティには、名前、型、そしてゲッター（getter）と呼ばれる自動生成された `get()` 関数があります。ゲッターを使用することで、プロパティの値を読み取ることができます。プロパティがミュータブル（可変）である場合は、セッター（setter）と呼ばれる `set()` 関数も持ち、これを使用してプロパティの値を変更できます。

> ゲッターとセッターは *アクセサ（accessors）* と呼ばれます。
> 
{style="tip"}

## プロパティの宣言

プロパティは、ミュータブル（`var`）または読み取り専用（`val`）にできます。
これらは `.kt` ファイル内のトップレベルプロパティとして宣言できます。トップレベルプロパティは、特定のパッケージに属するグローバル変数のようなものだと考えてください。

```kotlin
// ファイル: Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

また、クラス、インターフェース、またはオブジェクトの内部でプロパティを宣言することもできます。

```kotlin
// プロパティを持つクラス
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// プロパティを持つインターフェース
interface ContactInfo {
    val email: String
}

// プロパティを持つオブジェクト
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// インターフェースを実装するクラス
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
    // result インスタンスのプロパティにアクセスする
    result.name = address.name
    result.street = address.street
    result.city = address.city
    return result
}

fun main() {
    val sherlockAddress = Address()
    val copy = copyAddress(sherlockAddress)
    // copy インスタンスのプロパティにアクセスする
    println("Copied address: ${copy.name}, ${copy.street}, ${copy.city}")
    // Copied address: Holmes, Sherlock, Baker, London

    // Company オブジェクトのプロパティにアクセスする
    println("Company: ${Company.name} in ${Company.country}")
    // Company: Detective Inc. in UK
    
    val contact = PersonContact()
    // contact インスタンスのプロパティにアクセスする
    println("Email: ${contact.email}")
    // Email: sherlock@email.com
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-access-properties"}

Kotlin では、コードの安全性と読みやすさを保つために、宣言時にプロパティを初期化することをお勧めします。ただし、特別な場合には[後で初期化する](#late-initialized-properties-and-variables)こともできます。

コンパイラが初期化子（initializer）またはゲッターの戻り値の型から型を推論できる場合、プロパティ型の宣言は省略可能です。

```kotlin
var initialized = 1 // 推論される型は Int
var allByDefault    // エラー: プロパティは初期化される必要があります。
```
{validate="false"}

## カスタムゲッターとカスタムセッター

デフォルトでは、Kotlin は自動的にゲッターとセッターを生成します。バリデーション、フォーマット、または他のプロパティに基づいた計算など、追加のロジックが必要な場合は、独自のカスタムアクセサを定義できます。

カスタムゲッターは、プロパティがアクセスされるたびに実行されます。

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

コンパイラがゲッターから型を推論できる場合は、型を省略できます。

```kotlin
val area get() = this.width * this.height
```

カスタムセッターは、初期化時を除き、プロパティに値が代入されるたびに実行されます。
慣習としてセッターのパラメータ名は `value` ですが、別の名前を選択することもできます。

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

### 可視性の変更やアノテーションの追加

Kotlin では、デフォルトの実装を置き換えることなく、アクセサの可視性を変更したり[アノテーション](annotations.md)を追加したりできます。これらの変更のためにボディ `{}` を記述する必要はありません。

アクセサの可視性を変更するには、`get` または `set` キーワードの前に修飾子を使用します。

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // クラス内からのみ残高を変更できる
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
    // エラー: セッターが private であるため代入できません
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

アクセサにアノテーションを付けるには、`get` または `set` キーワードの前にアノテーションを使用します。

```kotlin
// ゲッターに適用可能なアノテーションを定義
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // ゲッターにアノテーションを付ける
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

この例では、[リフレクション](reflection.md)を使用して、ゲッターとセッターにどのアノテーションが存在するかを示しています。

## バッキングフィールド

コンパイラは、値をメモリに格納する必要がある場合に、プロパティのバッキングフィールド（backing fields）を自動的に生成します。

例えば、デフォルトの `get()` および `set()` 関数を使用する場合、これらは格納された値を読み書きするため、コンパイラはバッキングフィールドを作成します。

```kotlin
var count = 0
```

[カスタム `get()` または `set()` 関数](#custom-getters-and-setters) 内で `field` キーワードを使用することで、バッキングフィールドにアクセスできます。例えば、ゲッターやセッターに追加のロジックを加えたり、プロパティが変更された際に追加のアクションをトリガーしたりできます。

以下の例では、`score` プロパティの `set()` 関数内でバッキングフィールドを使用しており、値を更新する際にログイベントもトリガーされるようにしています。

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // 値の更新時にログを追加
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

すべてのプロパティでバッキングフィールドが作成されるわけではありません。必要ない場合があるからです。例えば、以下の `isEmpty` プロパティは、アクセスされるたびに `size` プロパティから値が計算されるため、バッキングフィールドを持ちません。

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 明示的なバッキングフィールド

より柔軟な制御が必要な場合があります。例えば、プロパティを内部的には変更可能にし、外部からは変更不可にしたい API がある場合です。このような場合、*明示的なバッキングフィールド（explicit backing field）* を使用できます。

以下の例では、`ShoppingCart` クラスにショッピングカート内のすべての項目を表す `items` プロパティがあります。このクラスは `items` プロパティを文字列の読み取り専用リストとして公開していますが、内部的には明示的なバッキングフィールドを使用してミュータブル（可変）なリストにデータを保存しています。

```kotlin
class ShoppingCart {
    // 明示的なバッキングフィールドを持つ公開読み取り専用ビュー
    val items: List<String>
        field = mutableListOf()
    
    fun addItem(item: String) {
        items.add(item)
    }

    fun removeItem(item: String) {
        items.remove(item)
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
{kotlin-runnable="true" kotlin-min-compiler-version="2.4" id="kotlin-explicit-backing-field"}

この例では、コンパイラは `mutableListOf()` の呼び出しからバッキングフィールドの型を `MutableList<String>` と推論します。また、バッキングフィールドの型を明示的に宣言することもできます。

```kotlin
val items: List<String>
    // 明示的な型を持つ明示的なバッキングフィールド
    field: MutableList<String> = mutableListOf()
```
{validate="false"}

`ShoppingCart` クラスの例では、コンパイラが `items` プロパティを `MutableList<String>` 型にスマートキャストするため、クラス内では `add()` や `remove()` 関数を通じてカートに項目を追加したり削除したりできます。クラス外部では、コンパイラは公開プロパティの型である `List<String>` を使用するため、API の利用者は `items` リストの内容を読み取ることしかできません。

#### 制限事項

明示的なバッキングフィールドを使用するには、そのプロパティとバッキングフィールド自体が特定のルールに従う必要があります。プロパティが明示的なバッキングフィールドを持てるのは、以下の条件を満たす場合に限られます。

* カスタムゲッターを持たないこと。
* 読み取り専用（`val`）であること。
* `open` でないこと。
* [委譲プロパティ](delegated-properties.md)でないこと。
* [コンパイル時定数](#compile-time-constants)でないこと。

さらに、バッキングフィールドの型はプロパティの型のサブタイプである必要があり、[`private` 可視性](visibility-modifiers.md)を持つ必要があります。

これらの制限を回避する必要がある場合は、代わりにバッキングプロパティを使用できます。

### バッキングプロパティ

明示的なバッキングフィールドがユースケースに合わない場合は、*バッキングプロパティ（backing property）* と呼ばれるコーディングパターンを使用できます。

例えば、プロパティにカスタムゲッターが必要な場合などです。

```kotlin
class UserDirectory {
    private val _users = mutableListOf(
        "sarah",
        "mike",
        "emma"
    )

    val users: List<String>
        get() = _users.sorted()

    fun addUser(username: String) {
        _users.add(username)
    }
}

fun main() {
    val directory = UserDirectory()

    directory.addUser("alex")
    println(directory.users)
    // [alex, emma, mike, sarah]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-custom-getter"}

> バッキングプロパティを命名する際は、Kotlin の [コーディング規約](coding-conventions.md#names-for-backing-properties) に従い、先頭にアンダースコアを使用してください。
>
{style="tip"}

この例では、`UserDirectory` クラスにディレクトリ内のすべてのユーザーをリストする読み取り専用の `users` プロパティがあります。`_users` 変数は実際のリストを保持するプライベートなバッキングプロパティです。公開プロパティ `users` のゲッターは、エントリをソートしてから返します。

## コンパイル時定数

読み取り専用プロパティの値がコンパイル時に判明している場合は、`const` 修飾子を使用して *コンパイル時定数（compile-time constant）* としてマークします。コンパイル時定数はコンパイル時にインライン化されるため、各参照はその実際の値に置き換えられます。ゲッターが呼び出されないため、より効率的にアクセスされます。

```kotlin
// ファイル: AppConfig.kt
package com.example

// コンパイル時定数
const val MAX_LOGIN_ATTEMPTS = 3
```

コンパイル時定数は、以下の要件を満たす必要があります。

* トップレベルプロパティであるか、[`object` 宣言](object-declarations.md#object-declarations-overview) または [コンパニオンオブジェクト](object-declarations.md#companion-objects) のメンバーであること。
* `String` 型または [プリミティブ型](types-overview.md) の値で初期化されていること。
* カスタムゲッターを持たないこと。

コンパイル時定数は依然としてバッキングフィールドを持つため、[リフレクション](reflection.md)を使用して対話することができます。

これらのプロパティはアノテーションでも使用できます。

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## 遅延初期化プロパティと変数

通常、プロパティはコンストラクタで初期化する必要があります。
しかし、これが常に都合が良いわけではありません。例えば、依存関係注入（Dependency Injection）を介してプロパティを初期化したり、ユニットテストのセットアップメソッド内で初期化したりする場合などです。

このような状況を処理するには、プロパティを `lateinit` 修飾子でマークします。

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // null や初期化のチェックをせずに直接 orderService を呼び出す
        orderService.processOrder()  
    }
}
```

`lateinit` 修飾子は、以下のように宣言された `var` プロパティで使用できます。

* トップレベルプロパティ。
* ローカル変数。
* クラスのボディ内のプロパティ。

クラスプロパティの場合：

* プライマリコンストラクタで宣言することはできません。
* カスタムゲッターまたはセッターを持ってはいけません。

いずれの場合も、プロパティまたは変数は非 null 型である必要があり、[プリミティブ型](types-overview.md)であってはいけません。

初期化前に `lateinit` プロパティにアクセスすると、Kotlin はアクセスされた未初期化のプロパティを特定する特定の例外をスローします。

```kotlin
class ReportGenerator {
    lateinit var report: String

    fun printReport() {
        // 初期化前にアクセスされるため例外をスローする
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

`lateinit var` が既に初期化されているかどうかを確認するには、その[プロパティへの参照](reflection.md#property-references)に対して [`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html) プロパティを使用します。

```kotlin
class WeatherStation {
    lateinit var latestReading: String

    fun printReading() {
        // プロパティが初期化されているか確認
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

`isInitialized` を使用できるのは、そのプロパティにコード内で既にアクセス可能な場合に限られます。プロパティは同じクラス内、外部クラス内、または同じファイル内のトップレベルプロパティとして宣言されている必要があります。

## プロパティのオーバーライド

[プロパティのオーバーライド](inheritance.md#overriding-properties) を参照してください。

## 委譲プロパティ

ロジックを再利用し、コードの重複を減らすために、プロパティの取得と設定の責任を別のオブジェクトに委譲することができます。

アクセサの動作を委譲することで、プロパティのアクセサロジックが一箇所に集約され、再利用しやすくなります。このアプローチは、以下のような動作を実装する場合に役立ちます。

* 値を遅延（lazy）計算する。
* 指定されたキーでマップから読み取る。
* データベースにアクセスする。
* プロパティがアクセスされたときにリスナーに通知する。

これらの一般的な動作は、ライブラリで自分で実装することも、外部ライブラリが提供する既存のデリゲートを使用することもできます。
詳細については、[委譲プロパティ](delegated-properties.md)を参照してください。