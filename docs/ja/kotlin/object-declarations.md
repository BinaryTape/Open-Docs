[//]: # (title: オブジェクト宣言とオブジェクト式)

Kotlinでは、オブジェクトを使用することで、クラスを定義し、そのインスタンスを単一のステップで作成できます。
これは、再利用可能なシングルトンインスタンス、または一度限りのオブジェクトが必要な場合に役立ちます。
これらのシナリオに対応するため、Kotlinは2つの主要なアプローチを提供します。シングルトンを作成するための_オブジェクト宣言_と、匿名で一度限りのオブジェクトを作成するための_オブジェクト式_です。

> シングルトンは、クラスのインスタンスが1つだけであることを保証し、それへのグローバルなアクセスポイントを提供します。
>
{style="tip"}

オブジェクト宣言とオブジェクト式は、次のようなシナリオで最もよく使用されます。

*   **共有リソースにシングルトンを使用する場合:** アプリケーション全体でクラスのインスタンスが1つだけ存在するようにする必要がある場合。
    例えば、データベース接続プールを管理する場合などです。
*   **ファクトリメソッドを作成する場合:** インスタンスを効率的に作成するための便利な方法が必要な場合。
    [コンパニオンオブジェクト](#companion-objects)を使用すると、クラスに結び付けられたクラスレベルの関数とプロパティを定義でき、これらのインスタンスの作成と管理を簡素化できます。
*   **既存のクラスの振る舞いを一時的に変更する場合:** 新しいサブクラスを作成することなく、既存のクラスの振る舞いを変更したい場合。
    例えば、特定の操作のためにオブジェクトに一時的な機能を追加する場合などです。
*   **型安全な設計が必要な場合:** オブジェクト式を使用して、インターフェースまたは[抽象クラス](classes.md#abstract-classes)の一度限りの実装が必要な場合。
    これは、ボタンクリックハンドラーのようなシナリオで役立ちます。

## オブジェクト宣言
{id="object-declarations-overview"}

Kotlinでは、`object`キーワードの後に常に名前が続くオブジェクト宣言を使用して、オブジェクトの単一インスタンスを作成できます。
これにより、クラスを定義し、そのインスタンスを単一のステップで作成できるため、シングルトンの実装に役立ちます。

```kotlin
//sampleStart
// データプロバイダを管理するシングルトンオブジェクトを宣言します
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 新しいデータプロバイダを登録します
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 登録されているすべてのデータプロバイダを取得します
    val allDataProviders: Collection<DataProvider>
        get() = providers
}
//sampleEnd

// データプロバイダインターフェースの例
interface DataProvider {
    fun provideData(): String
}

// データプロバイダ実装の例
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // ExampleDataProviderのインスタンスを作成します
    val exampleProvider = ExampleDataProvider()

    // オブジェクトを参照するには、その名前を直接使用します
    DataProviderManager.registerDataProvider(exampleProvider)

    // すべてのデータプロバイダを取得して表示します
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> オブジェクト宣言の初期化はスレッドセーフであり、初回アクセス時に行われます。
>
{style="tip"}

`object`を参照するには、その名前を直接使用します。

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

オブジェクト宣言もスーパークラスを持つことができます。
これは、[匿名オブジェクトが既存のクラスを継承したりインターフェースを実装したりできる](#inherit-anonymous-objects-from-supertypes)のと似ています。

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
}
```

変数宣言と同様に、オブジェクト宣言は式ではないため、
代入文の右辺で使用することはできません。

```kotlin
// 構文エラー: オブジェクト式は名前をバインドできません。
val myObject = object MySingleton {
    val name = "Singleton"
}
```
オブジェクト宣言はローカルにすることはできません。つまり、関数内に直接ネストすることはできません。
ただし、他のオブジェクト宣言内や非インナークラス内にはネストできます。

### データオブジェクト

Kotlinで通常のオブジェクト宣言を表示すると、文字列表現にはその名前と`object`のハッシュの両方が含まれます。

```kotlin
object MyObject

fun main() {
    println(MyObject)
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

しかし、オブジェクト宣言を`data`修飾子でマークすることにより、
コンパイラに`toString()`を呼び出したときにオブジェクトの実際の名前を返すように指示できます。これは[データクラス](data-classes.md)の場合と同じように機能します。

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

さらに、コンパイラは`data object`のためにいくつかの関数を生成します。

*   `toString()` はデータオブジェクトの名前を返します
*   `equals()`/`hashCode()` は等価性チェックとハッシュベースのコレクションを可能にします

  > `data object`に対してカスタムの`equals`または`hashCode`の実装を提供することはできません。
  >
  {style="note"}

`data object`の`equals()`関数は、`data object`の型を持つすべてのオブジェクトが等しいとみなされることを保証します。
ほとんどの場合、`data object`はシングルトンを宣言するため、実行時には`data object`の単一インスタンスしかありません。
しかし、実行時に同じ型の別のオブジェクトが生成されるというエッジケース（例えば、`java.lang.reflect`を使用したプラットフォームリフレクション、またはこのAPIを内部で使用するJVMシリアライゼーションライブラリなど）では、これによりオブジェクトが等しいものとして扱われることが保証されます。

> `data object`を構造的に（`==`演算子を使用して）のみ比較し、参照で（`===`演算子を使用して）比較しないようにしてください。
> これにより、実行時にデータオブジェクトのインスタンスが複数存在する際の落とし穴を回避できます。
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

    // ライブラリがMySingletonの2番目のインスタンスを強制的に作成した場合でも、
    // そのequals()関数はtrueを返します。
    println(MySingleton == evilTwin)
    // true

    // data objectを === を使って比較しないでください
    println(MySingleton === evilTwin)
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlinのリフレクションはデータオブジェクトのインスタンス化を許可しません。
    // これは、(Javaプラットフォームリフレクションを使用して) "強制的に" 新しいMySingletonインスタンスを作成します。
    // 自分ではこれをしないでください！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成される`hashCode()`関数は`equals()`関数と一貫した振る舞いを持ち、`data object`のすべてのランタイムインスタンスが同じハッシュコードを持つようにします。

#### データオブジェクトとデータクラスの違い

`data object`と`data class`の宣言はしばしば一緒に使用され、いくつかの類似点がありますが、
`data object`では生成されない関数がいくつかあります。

*   `copy()`関数なし。`data object`宣言はシングルトンとして使用されることを意図しているため、`copy()`関数は生成されません。シングルトンはクラスのインスタンス化を単一のインスタンスに制限するため、インスタンスのコピーの作成を許可するとそれに違反します。
*   `componentN()`関数なし。`data class`とは異なり、`data object`にはデータプロパティがありません。
    そのようなデータプロパティのないオブジェクトを分解しようとしても意味がないため、`componentN()`関数は生成されません。

#### シールドされた階層でのデータオブジェクトの使用

データオブジェクト宣言は、[シールドクラスまたはシールドインターフェース](sealed-classes.md)のようなシールドされた階層に特に役立ちます。
これにより、オブジェクトとともに定義したデータクラスとの対称性を維持できます。

この例では、`EndOfFile`を通常の`object`ではなく`data object`として宣言すると、
`toString()`関数を手動でオーバーライドする必要なく取得できます。

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

_コンパニオンオブジェクト_は、クラスレベルの関数とプロパティを定義できるようにします。
これにより、ファクトリメソッドの作成、定数の保持、共有ユーティリティへのアクセスが容易になります。

クラス内のオブジェクト宣言は、`companion`キーワードでマークできます。

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object`のメンバーは、クラス名を修飾子として使用するだけで呼び出すことができます。

```kotlin
class User(val name: String) {
    // Userインスタンスを作成するためのファクトリとして機能するコンパニオンオブジェクトを定義します
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // クラス名を修飾子として使用して、コンパニオンオブジェクトのファクトリメソッドを呼び出します。
    // 新しいUserインスタンスを作成します
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object`の名前は省略でき、その場合、名前は`Companion`が使用されます。

```kotlin
class User(val name: String) {
    // 名前なしコンパニオンオブジェクトを定義します
    companion object { }
}

// コンパニオンオブジェクトにアクセスします
val companionUser = User.Companion
```

クラスメンバーは、対応する`companion object`の`private`メンバーにアクセスできます。

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

クラス名が単独で使用される場合、そのクラスのコンパニオンオブジェクトへの参照として機能します。
コンパニオンオブジェクトに名前が付けられているかどうかは関係ありません。

```kotlin
//sampleStart
class User1 {
    // 名前付きコンパニオンオブジェクトを定義します
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// クラス名を使用してUser1のコンパニオンオブジェクトを参照します
val reference1 = User1

class User2 {
    // 名前なしコンパニオンオブジェクトを定義します
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// クラス名を使用してUser2のコンパニオンオブジェクトを参照します
val reference2 = User2
//sampleEnd

fun main() {
    // User1のコンパニオンオブジェクトからshow()関数を呼び出します
    println(reference1.show())
    // User1's Named Companion Object

    // User2のコンパニオンオブジェクトからshow()関数を呼び出します
    println(reference2.show())
    // User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

Kotlinのコンパニオンオブジェクトのメンバーは他の言語の静的メンバーのように見えますが、
実際にはコンパニオンオブジェクトのインスタンスメンバーであり、オブジェクト自体に属しています。
これにより、コンパニオンオブジェクトはインターフェースを実装できます。

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // Factoryインターフェースを実装するコンパニオンオブジェクトを定義します
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // コンパニオンオブジェクトをファクトリとして使用します
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

ただし、JVMでは、`@JvmStatic`アノテーションを使用すると、コンパニオンオブジェクトのメンバーを実際の静的メソッドおよびフィールドとして生成できます。
詳細については、[Javaとの相互運用性](java-to-kotlin-interop.md#static-fields)セクションを参照してください。

## オブジェクト式

オブジェクト式はクラスを宣言し、そのクラスのインスタンスを作成しますが、どちらにも名前を付けません。
これらのクラスは一度限りの使用に役立ちます。ゼロから作成することも、既存のクラスを継承することも、インターフェースを実装することもできます。これらのクラスのインスタンスは、式によって定義され、名前ではないため、_匿名オブジェクト_とも呼ばれます。

### ゼロから匿名オブジェクトを作成する

オブジェクト式は`object`キーワードで始まります。

オブジェクトがクラスを継承したりインターフェースを実装したりしない場合、`object`キーワードの後に波括弧内に直接オブジェクトのメンバーを定義できます。

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // オブジェクト式はAnyクラスを拡張し、AnyクラスにはすでにtoString()関数があるため、
        // それをオーバーライドする必要があります
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### スーパークラスから匿名オブジェクトを継承する

ある型（または複数の型）を継承する匿名オブジェクトを作成するには、`object`とコロン`:`の後にその型を指定します。
そして、[継承](inheritance.md)する場合と同じように、このクラスのメンバーを実装またはオーバーライドします。

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

スーパークラスにコンストラクタがある場合、適切なコンストラクタパラメータを渡します。
複数のスーパークラスは、コロンの後にカンマで区切って指定できます。

```kotlin
//sampleStart
// balanceプロパティを持つオープンクラスBankAccountを作成します
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// execute()関数を持つインターフェースTransactionを定義します
interface Transaction {
    fun execute()
}

// BankAccountで特別なトランザクションを実行する関数
fun specialTransaction(account: BankAccount) {
    // BankAccountクラスを継承し、Transactionインターフェースを実装する匿名オブジェクトを作成します
    // 提供されたアカウントの残高はBankAccountスーパークラスのコンストラクタに渡されます
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 一時的なボーナス

        // Transactionインターフェースからexecute()関数を実装します
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // トランザクションを実行します
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // 初期残高1000のBankAccountを作成します
    val myAccount = BankAccount(1000)
    // 作成したアカウントに対して特別なトランザクションを実行します
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 戻り値と値の型として匿名オブジェクトを使用する

ローカル関数または[`private`](visibility-modifiers.md#packages)関数またはプロパティから匿名オブジェクトを返す場合、
その匿名オブジェクトのすべてのメンバーは、その関数またはプロパティを介してアクセスできます。

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

これにより、特定のプロパティを持つ匿名オブジェクトを返すことができるため、
別途クラスを作成せずにデータや振る舞いをカプセル化する簡単な方法を提供します。

匿名オブジェクトを返す関数またはプロパティが`public`、`protected`、または`internal`の可視性を持つ場合、その実際の型は次のようになります。

*   匿名オブジェクトに宣言されたスーパークラスがない場合は`Any`。
*   そのような型が1つだけ存在する場合は、匿名オブジェクトの宣言されたスーパークラス。
*   宣言されたスーパークラスが複数ある場合は、明示的に宣言された型。

これらのすべての場合において、匿名オブジェクトに追加されたメンバーはアクセスできません。オーバーライドされたメンバーは、関数またはプロパティの実際の型で宣言されている場合にアクセスできます。例：

```kotlin
//sampleStart
interface Notification {
    // NotificationインターフェースでnotifyUser()を宣言します
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 戻り値の型はAnyです。messageプロパティにはアクセスできません。
    // 戻り値の型がAnyの場合、Anyクラスのメンバーのみがアクセス可能です。
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 匿名オブジェクトが1つのインターフェースのみを実装しているため、戻り値の型はNotificationです
    // notifyUser()関数はNotificationインターフェースの一部であるためアクセス可能です
    // messageプロパティはNotificationインターフェースで宣言されていないためアクセスできません
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 戻り値の型はDetailedNotificationです。notifyUser()関数とmessageプロパティにはアクセスできません
    // DetailedNotificationインターフェースで宣言されたメンバーのみがアクセス可能です
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // これは出力なし
    val notificationManager = NotificationManager()

    // 戻り値の型がAnyであるため、ここでmessageプロパティにはアクセスできません。
    // これは出力なし
    val notification = notificationManager.getNotification()

    // notifyUser()関数はアクセス可能です
    // 戻り値の型がNotificationであるため、ここでmessageプロパティにはアクセスできません。
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // 戻り値の型がDetailedNotificationであるため、ここでnotifyUser()関数とmessageプロパティにはアクセスできません。
    // これは出力なし
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 匿名オブジェクトから変数にアクセスする

オブジェクト式の本体内のコードは、囲むスコープの変数にアクセスできます。

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapterはマウスイベント関数のデフォルト実装を提供します
    // MouseAdapterがマウスイベントを処理するのをシミュレートします
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // clickCount変数とenterCount変数はオブジェクト式内でアクセス可能です
}
```

## オブジェクト宣言とオブジェクト式の振る舞いの違い

オブジェクト宣言とオブジェクト式には、初期化の振る舞いに違いがあります。

*   オブジェクト式は、使用される場所で_すぐに_実行（初期化）されます。
*   オブジェクト宣言は、初回アクセス時に_遅延初期化_されます。
*   コンパニオンオブジェクトは、対応するクラスがロード（解決）されたときに初期化され、Javaの静的初期化子のセマンティクスに合致します。