[//]: # (title: オブジェクト宣言とオブジェクト式)

Kotlinでは、オブジェクトを使用することで、クラスの定義とそのインスタンスの作成を単一のステップで行うことができます。
これは、再利用可能なシングルトンインスタンス、または一回限りのオブジェクトが必要な場合に便利です。
これらのシナリオを処理するために、Kotlinは2つの主要なアプローチを提供しています。シングルトンを作成するための「オブジェクト宣言（object declarations）」と、匿名の一回限りのオブジェクトを作成するための「オブジェクト式（object expressions）」です。

> シングルトンは、クラスがインスタンスを1つしか持たないことを保証し、それへのグローバルなアクセスポイントを提供します。
> 
{style="tip"}

オブジェクト宣言とオブジェクト式は、以下のようなシナリオで最適に使用されます：

* **共有リソースにシングルトンを使用する場合：** アプリケーション全体でクラスのインスタンスが1つだけ存在することを保証する必要がある場合。例えば、データベース接続プールの管理などです。
* **ファクトリメソッドを作成する場合：** インスタンスを効率的に作成する便利な方法が必要な場合。[コンパニオンオブジェクト](#companion-objects)を使用すると、クラスに紐付いたクラスレベルの関数やプロパティを定義でき、これらのインスタンスの作成と管理を簡素化できます。
* **既存のクラスの振る舞いを一時的に変更する場合：** 新しいサブクラスを作成することなく、既存のクラスの振る舞いを変更したい場合。例えば、特定の操作のためにオブジェクトに一時的な機能を追加する場合などです。
* **型安全な設計が必要な場合：** オブジェクト式を使用して、インターフェースや[抽象クラス](classes.md#abstract-classes)の一回限りの実装が必要な場合。これは、ボタンのクリックハンドラーなどのシナリオで役立ちます。

## オブジェクト宣言
{id="object-declarations-overview"}

Kotlinでは、オブジェクト宣言を使用してオブジェクトの単一のインスタンスを作成できます。オブジェクト宣言には常に `object` キーワードの後に名前が続きます。これにより、クラスの定義とインスタンスの作成を単一のステップで行うことができ、シングルトンの実装に役立ちます：

```kotlin
//sampleStart
// データプロバイダーを管理するためのシングルトンオブジェクトを宣言します
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 新しいデータプロバイダーを登録します
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 登録されているすべてのデータプロバイダーを取得します
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// データプロバイダーのインターフェース例
interface DataProvider {
    fun provideData(): String
}

// データプロバイダーの実装例
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

    // すべてのデータプロバイダーを取得して出力します
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> オブジェクト宣言の初期化はスレッドセーフであり、最初のアクセス時に行われます。
>
{style="tip"}

`object` を参照するには、その名前を直接使用します：

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

オブジェクト宣言は、[既存のクラスを継承したりインターフェースを実装したりする匿名オブジェクト](#inherit-anonymous-objects-from-supertypes)と同様に、スーパータイプを持つこともできます：

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

変数宣言とは異なり、オブジェクト宣言は「式」ではないため、代入文の右辺で使用することはできません：

```kotlin
// 構文エラー：オブジェクト式には名前を付けることができません。
val myObject = object MySingleton {
    val name = "Singleton"
}
```
オブジェクト宣言はローカル（つまり、関数の中に直接ネストすること）にすることはできません。ただし、他のオブジェクト宣言や非インナークラスの中にネストすることは可能です。

### データオブジェクト

Kotlinで通常のオブジェクト宣言をプリントすると、その文字列表現にはオブジェクトの名前とハッシュの両方が含まれます：

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

しかし、オブジェクト宣言に `data` 修飾子を付けることで、[データクラス](data-classes.md)と同じように、`toString()` を呼び出したときにオブジェクトの実際の名前を返すようコンパイラに指示できます：

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

さらに、コンパイラは `data object` に対して以下のいくつかの関数を生成します：

* `toString()`：データオブジェクトの名前を返します
* `equals()`/`hashCode()`：等価性チェックとハッシュベースのコレクションを有効にします

  > `data object` に対してカスタムの `equals` や `hashCode` の実装を提供することはできません。
  >
  {style="note"}

`data object` の `equals()` 関数は、その `data object` の型を持つすべてのオブジェクトが等しいと見なされることを保証します。
ほとんどの場合、`data object` はシングルトンを宣言するため、実行時には `data object` のインスタンスは1つしか存在しません。
しかし、実行時に同じ型の別のオブジェクトが生成されるというエッジケース（例えば、`java.lang.reflect` によるプラットフォームのリフレクションや、このAPIを内部で使用するJVMシリアライズライブラリを使用する場合など）において、これらのオブジェクトが等しいものとして扱われることを保証します。

> `data object` は、必ず構造的に（`==` 演算子を使用して）比較し、決して参照（`===` 演算子を使用して）で比較しないようにしてください。
> これにより、実行時にデータオブジェクトのインスタンスが複数存在する場合の落とし穴を避けることができます。
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

    // ライブラリが強制的にMySingletonの2つ目のインスタンスを作成したとしても、
    // そのequals()関数はtrueを返します：
    println(MySingleton == evilTwin) 
    // true

    // データオブジェクトを === で比較しないでください
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlinのリフレクションはデータオブジェクトのインスタンス化を許可しません。
    // これはJavaプラットフォームのリフレクションを使用して「強制的に」新しいMySingletonインスタンスを作成します。
    // 自分でこのようなことはしないでください！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成された `hashCode()` 関数は `equals()` 関数と一貫した振る舞いをするため、`data object` のすべての実行時インスタンスは同じハッシュコードを持ちます。

#### データオブジェクトとデータクラスの違い

`data object` と `data class` の宣言はしばしば一緒に使用され、いくつかの類似点がありますが、`data object` では生成されない関数があります：

* `copy()` 関数はありません。`data object` 宣言はシングルトンとして使用されることを意図しているため、`copy()` 関数は生成されません。シングルトンはクラスのインスタンス化を単一のインスタンスに制限するものですが、コピーの作成を許可するとその原則に違反するためです。
* `componentN()` 関数はありません。`data class` とは異なり、`data object` にはデータプロパティがありません。データプロパティのないオブジェクトをデストラクト（構造分解）しようとしても意味がないため、`componentN()` 関数は生成されません。

#### sealed階層でのデータオブジェクトの使用

データオブジェクト宣言は、[sealedクラスやsealedインターフェース](sealed-classes.md)のようなsealed階層において特に有用です。
これらを使用すると、オブジェクトと一緒に定義したデータクラスとの対称性を維持できます。

この例では、`EndOfFile` を通常の `object` ではなく `data object` として宣言することで、手動でオーバーライドすることなく `toString()` 関数を取得できることを意味します：

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

*コンパニオンオブジェクト（Companion objects）*を使用すると、クラスレベルの関数やプロパティを定義できます。
これにより、ファクトリメソッドの作成、定数の保持、共有ユーティリティへのアクセスが容易になります。

クラス内のオブジェクト宣言に `companion` キーワードを付けることができます：

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object` のメンバーは、クラス名を修飾子として使用するだけで呼び出すことができます：

```kotlin
class User(val name: String) {
    // Userインスタンスを作成するためのファクトリとして機能するコンパニオンオブジェクトを定義します
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // クラス名を修飾子として使用してコンパニオンオブジェクトのファクトリメソッドを呼び出します。
    // 新しいUserインスタンスを作成します
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object` の名前は省略できます。その場合、`Companion` という名前が使用されます：

```kotlin
class User(val name: String) {
    // 名前なしのコンパニオンオブジェクトを定義します
    companion object { }
}

// コンパニオンオブジェクトにアクセスします
val companionUser = User.Companion
```

クラスのメンバーは、対応する `companion object` の `private` メンバーにアクセスできます：

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

クラス名が単独で使用される場合、そのコンパニオンオブジェクトに名前が付いているかどうかにかかわらず、そのクラスのコンパニオンオブジェクトへの参照として機能します：

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

Kotlinのコンパニオンオブジェクトのメンバーは、他の言語の静的（static）メンバーのように見えますが、実際にはコンパニオンオブジェクトのインスタンスメンバーであり、オブジェクト自体に属しています。
これにより、コンパニオンオブジェクトでインターフェースを実装することも可能です：

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
    // コンパニオンオブジェクトをFactoryとして使用します
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

ただし、JVM上では、`@JvmStatic` アノテーションを使用すると、コンパニオンオブジェクトのメンバーを実際の静的メソッドやフィールドとして生成させることができます。詳細は [Javaとの相互運用性](java-to-kotlin-interop.md#static-fields) のセクションを参照してください。

## オブジェクト式

オブジェクト式はクラスを宣言し、そのクラスのインスタンスを作成しますが、どちらにも名前を付けません。
これらのクラスは一回限りの使用に便利です。これらはゼロから作成することも、既存のクラスを継承したり、インターフェースを実装したりすることもできます。これらのクラスのインスタンスは、名前ではなく式によって定義されるため、「匿名オブジェクト（anonymous objects）」とも呼ばれます。

### ゼロから匿名オブジェクトを作成する

オブジェクト式は `object` キーワードで始まります。

オブジェクトがいかなるクラスも継承せず、インターフェースも実装しない場合は、`object` キーワードの後の波括弧の中に直接メンバーを定義できます：

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // オブジェクト式はAnyクラスを継承しており、AnyにはすでにtoString()関数があるため、
        // オーバーライドする必要があります
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### スーパータイプから匿名オブジェクトを継承する

何らかの型（または複数の型）を継承する匿名オブジェクトを作成するには、`object` とコロン `:` の後にその型を指定します。
次に、そのクラスを[継承](inheritance.md)する場合と同じように、そのクラスのメンバーを実装またはオーバーライドします：

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

スーパータイプにコンストラクタがある場合は、適切なコンストラクタ引数を渡します。
コロンの後にカンマで区切って、複数のスーパータイプを指定できます：

```kotlin
//sampleStart
// balanceプロパティを持つopenクラスBankAccountを作成します
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// execute()関数を持つインターフェースTransactionを定義します
interface Transaction {
    fun execute()
}

// BankAccountに対して特別なトランザクションを実行する関数
fun specialTransaction(account: BankAccount) {
    // BankAccountクラスを継承し、Transactionインターフェースを実装する匿名オブジェクトを作成します
    // 提供されたaccountのbalanceがBankAccountのスーパークラスコンストラクタに渡されます
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
    // 初期残高1000でBankAccountを作成します
    val myAccount = BankAccount(1000)
    // 作成したアカウントに対して特別なトランザクションを実行します
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 戻り値および値の型として匿名オブジェクトを使用する

ローカル関数、または [`private`](visibility-modifiers.md#packages) な関数やプロパティから匿名オブジェクトを返す場合、その匿名オブジェクトのすべてのメンバーはその関数やプロパティを通じてアクセス可能です：

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

これにより、特定のプロパティを持つ匿名オブジェクトを返すことができ、別のクラスを作成することなくデータや動作をカプセル化する簡単な方法が提供されます。

匿名オブジェクトを返す関数やプロパティの可視性が `public`、`protected`、または `internal` である場合、その実際の型は以下のようになります：

* 匿名オブジェクトに宣言されたスーパータイプがない場合は `Any`。
* 匿名オブジェクトに宣言されたスーパータイプがちょうど1つある場合は、その宣言されたスーパータイプ。
* 宣言されたスーパータイプが複数ある場合は、明示的に宣言された型。

これらすべての場合において、匿名オブジェクトに追加されたメンバーにはアクセスできません。オーバーライドされたメンバーは、関数やプロパティの実際の型で宣言されている場合にのみアクセス可能です。例：

```kotlin
//sampleStart
interface Notification {
    // NotificationインターフェースでnotifyUser()を宣言します
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 戻り値の型はAnyです。messageプロパティにはアクセスできません。
    // 戻り値の型がAnyの場合、Anyクラスのメンバーにのみアクセス可能です。
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 匿名オブジェクトがインターフェースを1つだけ実装しているため、戻り値の型はNotificationです
    // notifyUser()関数はNotificationインターフェースの一部であるためアクセス可能です
    // messageプロパティはNotificationインターフェースで宣言されていないためアクセスできません
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 戻り値の型はDetailedNotificationです。notifyUser()関数とmessageプロパティにはアクセスできません
    // DetailedNotificationインターフェースで宣言されているメンバーにのみアクセス可能です
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // これは何も出力しません
    val notificationManager = NotificationManager()

    // 戻り値の型がAnyであるため、ここではmessageプロパティにアクセスできません
    // これは何も出力しません
    val notification = notificationManager.getNotification()

    // notifyUser()関数はアクセス可能です
    // 戻り値の型がNotificationであるため、ここではmessageプロパティにアクセスできません
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // 戻り値の型がDetailedNotificationであるため、ここではnotifyUser()関数とmessageプロパティにアクセスできません
    // これは何も出力しません
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 匿名オブジェクトから変数にアクセスする

オブジェクト式の本体内のコードは、囲んでいるスコープの変数にアクセスできます：

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapterはマウスイベント関数のデフォルト実装を提供します
    // MouseAdapterがマウスイベントを処理する様子をシミュレートします
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // clickCount変数とenterCount変数は、オブジェクト式内からアクセス可能です
}
```

## オブジェクト宣言とオブジェクト式の動作の違い

オブジェクト宣言とオブジェクト式の初期化動作には違いがあります：

* オブジェクト式は、それらが使用される場所で *直ちに* 実行（および初期化）されます。
* オブジェクト宣言は、最初にアクセスされたときに *遅延（lazy）* 初期化されます。
* コンパニオンオブジェクトは、対応するクラスがロード（解決）されたときに初期化されます。これはJavaの静的初期化子（static initializer）のセマンティクスと一致します。