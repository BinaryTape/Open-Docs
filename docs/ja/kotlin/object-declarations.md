[//]: # (title: オブジェクト宣言とオブジェクト式)

Kotlinでは、オブジェクトを使用すると、クラスを定義し、そのインスタンスを1ステップで作成できます。
これは、再利用可能なシングルトンインスタンスまたは一回限りのオブジェクトが必要な場合に役立ちます。
これらのシナリオを処理するために、Kotlinは2つの主要なアプローチを提供します。シングルトンを作成するための _オブジェクト宣言_ と、匿名で一回限りのオブジェクトを作成するための _オブジェクト式_ です。

> シングルトンは、クラスがただ1つのインスタンスのみを持つことを保証し、それへのグローバルなアクセスポイントを提供します。
>
{style="tip"}

オブジェクト宣言とオブジェクト式は、以下のようなシナリオで最もよく使われます。

*   **共有リソースにシングルトンを使用する:** アプリケーション全体を通じて、クラスのインスタンスが1つだけ存在することを保証する必要がある場合。
    例えば、データベース接続プールを管理する場合などです。
*   **ファクトリメソッドを作成する:** インスタンスを効率的に作成する便利な方法が必要な場合。
    [コンパニオンオブジェクト](#companion-objects)を使用すると、クラスに紐付けられたクラスレベルの関数とプロパティを定義でき、これらのインスタンスの作成と管理を簡素化します。
*   **既存のクラスの振る舞いを一時的に変更する:** 新しいサブクラスを作成することなく、既存のクラスの振る舞いを変更したい場合。
    例えば、特定の操作のためにオブジェクトに一時的な機能を追加する場合などです。
*   **型安全な設計が求められる:** オブジェクト式を使用して、インターフェースや[抽象クラス](classes.md#abstract-classes)の一回限りの実装が必要な場合。
    これは、ボタンクリックハンドラーのようなシナリオに役立ちます。

## オブジェクト宣言
{id="object-declarations-overview"}

Kotlinでは、`object` キーワードの後に常に名前を持つオブジェクト宣言を使用して、オブジェクトの単一インスタンスを作成できます。
これにより、クラスを定義し、そのインスタンスを1ステップで作成できるため、シングルトンを実装するのに役立ちます。

```kotlin
//sampleStart
// Declares a Singleton object to manage data providers
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // Registers a new data provider
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // Retrieves all registered data providers
    val allDataProviders: Collection<DataProvider>
        get() = providers
}
//sampleEnd

// Example data provider interface
interface DataProvider {
    fun provideData(): String
}

// Example data provider implementation
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // Creates an instance of ExampleDataProvider
    val exampleProvider = ExampleDataProvider()

    // To refer to the object, use its name directly
    DataProviderManager.registerDataProvider(exampleProvider)

    // Retrieves and prints all data providers
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> オブジェクト宣言の初期化はスレッドセーフであり、初回アクセス時に行われます。
>
{style="tip"}

その `object` を参照するには、その名前を直接使用します。

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

オブジェクト宣言もスーパタイプ（親型）を持つことができ、
[匿名オブジェクトが既存のクラスを継承したりインターフェースを実装したりする](#inherit-anonymous-objects-from-supertypes)方法と同様です。

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
}
```

変数宣言と同様に、オブジェクト宣言は式ではないため、代入文の右辺で使用することはできません。

```kotlin
// Syntax error: An object expression cannot bind a name.
val myObject = object MySingleton {
    val name = "Singleton"
}
```
オブジェクト宣言はローカルにはできません。つまり、関数内に直接ネストすることはできません。
ただし、他のオブジェクト宣言または非インナークラス内にネストすることはできます。

### データオブジェクト

Kotlinで通常のオブジェクト宣言をプリントすると、その文字列表現にはその名前と `object` のハッシュコードの両方が含まれます。

```kotlin
object MyObject

fun main() {
    println(MyObject)
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

しかし、オブジェクト宣言を `data` 修飾子でマークすることで、
[データクラス](data-classes.md)と同じように、`toString()` を呼び出したときにオブジェクトの実際の名前を返すようにコンパイラに指示できます。

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject)
    // MyDataObject
}
```
{kotlin-runnable="true" id="object-declaration-dataobject"}

さらに、コンパイラは `data object` のためにいくつかの関数を生成します。

*   `toString()` はデータオブジェクトの名前を返します
*   `equals()`/`hashCode()` は等価性チェックとハッシュベースのコレクションを可能にします

  > `data object` のカスタム `equals` または `hashCode` の実装を提供することはできません。
  >
  {style="note"}

`data object` の `equals()` 関数は、`data object` の型を持つすべてのオブジェクトが等しいとみなされることを保証します。
ほとんどの場合、`data object` はシングルトンを宣言するため、実行時に `data object` の単一のインスタンスしか持ちません。
しかし、同一型の別のオブジェクトが実行時に生成されるようなエッジケース（例えば、`java.lang.reflect` を用いたプラットフォームリフレクションや、このAPIを内部で使用するJVMシリアライゼーションライブラリなど）では、これによりオブジェクトが等しいものとして扱われることが保証されます。

> `data object` は構造的にのみ比較（`==` 演算子を使用）し、参照で比較（`===` 演算子を使用）しないようにしてください。
> これは、`data object` の複数のインスタンスが実行時に存在する場合に落とし穴を避けるのに役立ちます。
>
{style="warning"}

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton)
    // MySingleton

    println(evilTwin)
    // MySingleton

    // Even when a library forcefully creates a second instance of MySingleton,
    // its equals() function returns true:
    println(MySingleton == evilTwin)
    // true

    // Don't compare data objects using ===
    println(MySingleton === evilTwin)
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin reflection does not permit the instantiation of data objects.
    // This creates a new MySingleton instance "by force" (using Java platform reflection)
    // Don't do this yourself!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成された `hashCode()` 関数は `equals()` 関数と一貫した振る舞いをするため、`data object` のすべての実行時インスタンスは同じハッシュコードを持ちます。

#### データオブジェクトとデータクラスの違い

`data object` と `data class` 宣言はしばしば一緒に使用され、いくつかの類似点がありますが、`data object` には生成されない関数がいくつかあります。

*   `copy()` 関数はありません。`data object` 宣言はシングルトンとして使用されることを意図しているため、`copy()` 関数は生成されません。シングルトンはクラスのインスタンス化を単一のインスタンスに制限し、インスタンスのコピー作成を許可することで、この制限が破られることになるでしょう。
*   `componentN()` 関数はありません。`data class` とは異なり、`data object` はデータプロパティを持ちません。データプロパティを持たないそのようなオブジェクトをデコンストラクトしようとしても意味がないため、`componentN()` 関数は生成されません。

#### シールド階層でのデータオブジェクトの使用

データオブジェクト宣言は、[シールドクラスやシールドインターフェース](sealed-classes.md)のようなシールド階層に特に役立ちます。
これにより、オブジェクトと一緒に定義したデータクラスとの対称性を維持できます。

この例では、`EndOfFile` を通常の `object` ではなく `data object` として宣言することによって、
`toString()` 関数を手動でオーバーライドする必要なしに取得できることを意味します。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7))
    // Number(number=7)
    println(EndOfFile)
    // EndOfFile
}
```
{kotlin-runnable="true" id="data-objects-sealed-hierarchies"}

### コンパニオンオブジェクト

_コンパニオンオブジェクト_ を使用すると、クラスレベルの関数とプロパティを定義できます。
これにより、ファクトリメソッドの作成、定数の保持、共有ユーティリティへのアクセスが容易になります。

クラス内のオブジェクト宣言は、`companion` キーワードでマークすることができます。

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object` のメンバーは、クラス名を修飾子として使用するだけで呼び出すことができます。

```kotlin
class User(val name: String) {
    // Defines a companion object that acts as a factory for creating User instances
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // Calls the companion object's factory method using the class name as the qualifier.
    // Creates a new User instance
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object` の名前は省略できます。その場合、`Companion` という名前が使用されます。

```kotlin
class User(val name: String) {
    // Defines a companion object without a name
    companion object { }
}

// Accesses the companion object
val companionUser = User.Companion
```

クラスのメンバーは、それに対応する `companion object` の `private` メンバーにアクセスできます。

```kotlin
class User(val name: String) {
    companion object {
        private val defaultGreeting = "Hello"
    }

    fun sayHi() {
        println(defaultGreeting)
    }
}
User("Nick").sayHi()
// Hello
```

クラス名が単独で使用される場合、コンパニオンオブジェクトに名前があるかどうかに関わらず、そのクラスのコンパニオンオブジェクトへの参照として機能します。

```kotlin
//sampleStart
class User1 {
    // Defines a named companion object
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// References the companion object of User1 using the class name
val reference1 = User1

class User2 {
    // Defines an unnamed companion object
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// References the companion object of User2 using the class name
val reference2 = User2
//sampleEnd

fun main() {
    // Calls the show() function from the companion object of User1
    println(reference1.show())
    // User1's Named Companion Object

    // Calls the show() function from the companion object of User2
    println(reference2.show())
    // User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

Kotlinのコンパニオンオブジェクトのメンバーは、他の言語の静的メンバーのように見えますが、
実際にはコンパニオンオブジェクトのインスタンスメンバーであり、それら自身がオブジェクトに属しています。
これにより、コンパニオンオブジェクトがインターフェースを実装することが可能になります。

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // Defines a companion object that implements the Factory interface
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // Uses the companion object as a Factory
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

ただし、JVM上では、`@JvmStatic` アノテーションを使用すると、コンパニオンオブジェクトのメンバーを実際の静的メソッドおよびフィールドとして生成できます。
詳細については、[Java相互運用性](java-to-kotlin-interop.md#static-fields)セクションを参照してください。

## オブジェクト式

オブジェクト式はクラスを宣言し、そのクラスのインスタンスを作成しますが、どちらにも名前を付けません。
これらのクラスは一回限りの使用に役立ちます。それらはゼロから作成されるか、既存のクラスを継承したり、インターフェースを実装したりできます。これらのクラスのインスタンスは、名前ではなく、式によって定義されるため、_匿名オブジェクト_ とも呼ばれます。

### ゼロから匿名オブジェクトを作成する

オブジェクト式は `object` キーワードで始まります。

オブジェクトがいかなるクラスも拡張せず、いかなるインターフェースも実装しない場合、`object` キーワードの後の波括弧内にオブジェクトのメンバーを直接定義できます。

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // Object expressions extend the Any class, which already has a toString() function,
        // so it must be overridden
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### スーパタイプから匿名オブジェクトを継承する

何らかの型（または複数の型）を継承する匿名オブジェクトを作成するには、`object` の後にコロン `:` とその型を指定します。
そして、まるでそこから[継承](inheritance.md)するかのように、そのクラスのメンバーを実装またはオーバーライドします。

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

スーパタイプ（親型）にコンストラクタがある場合、適切なコンストラクタパラメータをそれに渡します。
複数のスーパタイプは、コロンの後にコンマで区切って指定できます。

```kotlin
//sampleStart
// Creates an open class BankAccount with a balance property
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// Defines an interface Transaction with an execute() function
interface Transaction {
    fun execute()
}

// A function to perform a special transaction on a BankAccount
fun specialTransaction(account: BankAccount) {
    // Creates an anonymous object that inherits from the BankAccount class and implements the Transaction interface
    // The balance of the provided account is passed to the BankAccount superclass constructor
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // Temporary bonus

        // Implements the execute() function from the Transaction interface
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // Executes the transaction
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // Creates a BankAccount with an initial balance of 1000
    val myAccount = BankAccount(1000)
    // Performs a special transaction on the created account
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 戻り値の型と値の型として匿名オブジェクトを使用する

ローカルまたは [`private`](visibility-modifiers.md#packages) 関数やプロパティから匿名オブジェクトを返す場合、
その匿名オブジェクトのすべてのメンバーは、その関数またはプロパティを通じてアクセス可能です。

```kotlin
//sampleStart
class UserPreferences {
    private fun getPreferences() = object {
        val theme: String = "Dark"
        val fontSize: Int = 14
    }

    fun printPreferences() {
        val preferences = getPreferences()
        println("Theme: ${preferences.theme}, Font Size: ${preferences.fontSize}")
    }
}
//sampleEnd

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
    // Theme: Dark, Font Size: 14
}
```
{kotlin-runnable="true" id="object-expression-object-return"}

これにより、特定のプロパティを持つ匿名オブジェクトを返すことができ、
個別のクラスを作成することなく、データや振る舞いをカプセル化する簡単な方法を提供します。

匿名オブジェクトを返す関数またはプロパティが `public`、`protected`、または `internal` の可視性を持つ場合、その実際の型は以下のようになります。

*   匿名オブジェクトが宣言されたスーパタイプ（親型）を持たない場合は `Any`。
*   匿名オブジェクトの宣言されたスーパタイプがちょうど1つだけある場合は、そのスーパタイプ。
*   宣言されたスーパタイプが複数ある場合は、明示的に宣言された型。

これらすべての場合において、匿名オブジェクトに追加されたメンバーはアクセスできません。オーバーライドされたメンバーは、関数またはプロパティの実際の型で宣言されていればアクセス可能です。例:

```kotlin
//sampleStart
interface Notification {
    // Declares notifyUser() in the Notification interface
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // The return type is Any. The message property is not accessible.
    // When the return type is Any, only members of the Any class are accessible.
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // The return type is Notification because the anonymous object implements only one interface
    // The notifyUser() function is accessible because it is part of the Notification interface
    // The message property is not accessible because it is not declared in the Notification interface
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // The return type is DetailedNotification. The notifyUser() function and the message property are not accessible
    // Only members declared in the DetailedNotification interface are accessible
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // This produces no output
    val notificationManager = NotificationManager()

    // The message property is not accessible here because the return type is Any
    // This produces no output
    val notification = notificationManager.getNotification()

    // The notifyUser() function is accessible
    // The message property is not accessible here because the return type is Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // The notifyUser() function and message property are not accessible here because the return type is DetailedNotification
    // This produces no output
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 匿名オブジェクトから変数にアクセスする

オブジェクト式の本体内のコードは、囲んでいるスコープの変数にアクセスできます。

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter provides default implementations for mouse event functions
    // Simulates MouseAdapter handling mouse events
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // The clickCount and enterCount variables are accessible within the object expression
}
```

## オブジェクト宣言と式の振る舞いの違い

オブジェクト宣言とオブジェクト式の間には、初期化の振る舞いに違いがあります。

*   オブジェクト式は、使用された場所で _即座に_ 実行（および初期化）されます。
*   オブジェクト宣言は、初回アクセス時に _遅延して_ 初期化されます。
*   コンパニオンオブジェクトは、対応するクラスがロード（解決）されたときに初期化され、これはJavaの静的初期化子のセマンティクスに合致します。