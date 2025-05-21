---
title: オブジェクトの宣言と式
---
Kotlin では、`object` を使用すると、クラスを定義し、そのインスタンスを 1 つのステップで作成できます。
これは、再利用可能なシングルトンインスタンスまたは使い捨ての `object` が必要な場合に便利です。
これらのシナリオを処理するために、Kotlin は、シングルトンを作成するための _オブジェクト宣言_ と、匿名で使い捨ての `object` を作成するための _オブジェクト式_ という 2 つの主要なアプローチを提供します。

:::tip
シングルトンを使用すると、クラスのインスタンスが 1 つだけになるようにし、それへのグローバルなアクセスポイントを提供できます。

:::

オブジェクト宣言とオブジェクト式は、次のようなシナリオで使用するのが最適です。

* **共有リソースにシングルトンを使用する:** アプリケーション全体でクラスのインスタンスが 1 つだけ存在するようにする必要があります。
たとえば、データベース接続プールを管理するなどです。
* **ファクトリメソッドの作成:** インスタンスを効率的に作成するための便利な方法が必要です。
[コンパニオンオブジェクト](#companion-objects)を使用すると、クラスに関連付けられたクラスレベルの関数とプロパティを定義できるため、これらのインスタンスの作成と管理が簡素化されます。
* **既存のクラスの動作を一時的に変更する:** 新しいサブクラスを作成しなくても、既存のクラスの動作を変更したいとします。
たとえば、特定の操作のためにオブジェクトに一時的な機能を追加するなどです。
* **型セーフな設計が必要:** オブジェクト式を使用して、インターフェイスまたは[抽象クラス](classes#abstract-classes)の使い捨ての実装が必要です。
これは、ボタンクリックハンドラーなどのシナリオに役立ちます。

## オブジェクト宣言

Kotlin で `object` の単一のインスタンスを作成するには、`object` 宣言を使用します。`object` 宣言には、常に `object` キーワードの後に名前が続きます。
これにより、クラスを定義し、そのインスタンスを 1 つのステップで作成できます。これは、シングルトンを実装する場合に役立ちます。

```kotlin

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

// データプロバイダーインターフェイスの例
interface DataProvider {
    fun provideData(): String
}

// データプロバイダー実装の例
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // ExampleDataProvider のインスタンスを作成します
    val exampleProvider = ExampleDataProvider()

    // オブジェクトを参照するには、その名前を直接使用します
    DataProviderManager.registerDataProvider(exampleProvider)

    // すべてのデータプロバイダーを取得して出力します
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```

:::tip
オブジェクト宣言の初期化はスレッドセーフで、最初のアクセス時に行われます。

:::

`object` を参照するには、その名前を直接使用します。

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

オブジェクト宣言は、[匿名オブジェクトが既存のクラスから継承したり、インターフェイスを実装したりできる](#inherit-anonymous-objects-from-supertypes)のと同じように、スーパータイプを持つこともできます。

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

変数の宣言と同様に、オブジェクト宣言は式ではないため、代入ステートメントの右辺で使用することはできません。

```kotlin
// 構文エラー: オブジェクト式は名前をバインドできません。
val myObject = object MySingleton {
val name = "Singleton"
}
```
オブジェクト宣言はローカルにできません。つまり、関数内に直接ネストすることはできません。
ただし、他のオブジェクト宣言または非内部クラス内にネストすることはできます。

### データオブジェクト

Kotlin でプレーンなオブジェクト宣言を出力すると、文字列表現には、その `object` の名前とハッシュの両方が含まれます。

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```

ただし、`object` 宣言を `data` 修飾子でマークすることにより、[データクラス](data-classes)の場合と同じように、`toString()` を呼び出すときにオブジェクトの実際の名前を返すようにコンパイラーに指示できます。

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject) 
    // MyDataObject
}
```

さらに、コンパイラーは `data object` に対していくつかの関数を生成します。

* `toString()` はデータオブジェクトの名前を返します
* `equals()`/`hashCode()` は、同等性チェックとハッシュベースのコレクションを有効にします

> `data object` に対してカスタムの `equals` または `hashCode` 実装を提供することはできません。
>
  

`data object` の `equals()` 関数は、`data object` の型を持つすべてのオブジェクトが等しいと見なされるようにします。
ほとんどの場合、`data object` はシングルトンを宣言するため、実行時に `data object` のインスタンスは 1 つだけになります。
ただし、実行時に同じ型の別のオブジェクトが生成されるエッジケース (たとえば、`java.lang.reflect` を使用したプラットフォームリフレクション、またはこの API を内部で使用する JVM シリアル化ライブラリを使用する場合) では、オブジェクトが等しいものとして扱われるようにします。

:::caution
`data objects` を構造的に (`==` 演算子を使用) のみ比較し、参照によって (`===` 演算子を使用) 比較しないようにしてください。
これにより、データオブジェクトの複数のインスタンスが実行時に存在する場合の落とし穴を回避できます。

:::

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) 
    // MySingleton

    println(evilTwin) 
    // MySingleton

    // ライブラリが MySingleton の 2 番目のインスタンスを強制的に作成した場合でも、
    // その equals() 関数は true を返します。
    println(MySingleton == evilTwin) 
    // true

    // === を使用してデータオブジェクトを比較しないでください
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin リフレクションでは、データオブジェクトのインスタンス化は許可されていません。
    // これは、新しい MySingleton インスタンスを「強制的に」(Java プラットフォームリフレクションを使用して) 作成します
    // これを自分でしないでください！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成された `hashCode()` 関数は `equals()` 関数と一貫性のある動作をするため、`data object` のすべてのランタイムインスタンスは同じハッシュコードを持ちます。

#### データオブジェクトとデータクラスの違い

`data object` 宣言と `data class` 宣言は、多くの場合一緒に使用され、いくつかの類似点がありますが、`data object` に対して生成されない関数がいくつかあります。

* `copy()` 関数はありません。`data object` 宣言はシングルトンとして使用することを目的としているため、`copy()` 関数は生成されません。
  シングルトンは、クラスのインスタンス化を単一のインスタンスに制限します。これは、インスタンスのコピーを作成できるようにすることで違反されます。
* `componentN()` 関数はありません。`data class` とは異なり、`data object` にはデータプロパティがありません。
  データプロパティなしでそのようなオブジェクトを分割しようとしても意味がないため、`componentN()` 関数は生成されません。

#### 封印された階層でデータオブジェクトを使用する

データオブジェクト宣言は、[封印されたクラスまたは封印されたインターフェイス](sealed-classes)などの封印された階層に特に役立ちます。
オブジェクトとともに定義したデータクラスとの対称性を維持できます。

この例では、`EndOfFile` をプレーンな `object` ではなく `data object` として宣言すると、手動でオーバーライドしなくても `toString()` 関数が取得されます。

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

### コンパニオンオブジェクト

_コンパニオンオブジェクト_ を使用すると、クラスレベルの関数とプロパティを定義できます。
これにより、ファクトリメソッドの作成、定数の保持、および共有ユーティリティへのアクセスが簡単になります。

クラス内のオブジェクト宣言は、`companion` キーワードでマークできます。

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
    // User インスタンスを作成するためのファクトリとして機能するコンパニオンオブジェクトを定義します
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // クラス名を修飾子として使用して、コンパニオンオブジェクトのファクトリメソッドを呼び出します。
    // 新しい User インスタンスを作成します
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```

`companion object` の名前は省略できます。その場合、名前 `Companion` が使用されます。

```kotlin
class User(val name: String) {
    // 名前なしでコンパニオンオブジェクトを定義します
    companion object { }
}

// コンパニオンオブジェクトにアクセスします
val companionUser = User.Companion
```

クラスメンバーは、対応する `companion object` の `private` メンバーにアクセスできます。

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

クラス名自体で使用すると、コンパニオンオブジェクトが名前付きであるかどうかにかかわらず、クラスのコンパニオンオブジェクトへの参照として機能します。

```kotlin

class User1 {
    // 名前付きのコンパニオンオブジェクトを定義します
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// クラス名を使用して User1 のコンパニオンオブジェクトを参照します
val reference1 = User1

class User2 {
    // 名前なしのコンパニオンオブジェクトを定義します
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// クラス名を使用して User2 のコンパニオンオブジェクトを参照します
val reference2 = User2

fun main() {
    // User1 のコンパニオンオブジェクトから show() 関数を呼び出します
    println(reference1.show()) 
    // User1's Named Companion Object

    // User2 のコンパニオンオブジェクトから show() 関数を呼び出します
    println(reference2.show()) 
    // User2's Companion Object
}
```

Kotlin のコンパニオンオブジェクトのメンバーは、他の言語の静的メンバーのように見えますが、実際にはコンパニオンオブジェクトのインスタンスメンバーであり、オブジェクト自体に属しています。
これにより、コンパニオンオブジェクトはインターフェイスを実装できます。

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // Factory インターフェイスを実装するコンパニオンオブジェクトを定義します
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

ただし、JVM では、`@JvmStatic` アノテーションを使用すると、コンパニオンオブジェクトのメンバーを実際の静的メソッドおよびフィールドとして生成できます。
詳細については、[Java 相互運用](java-to-kotlin-interop#static-fields)セクションを参照してください。

## オブジェクト式

オブジェクト式は、クラスを宣言し、そのクラスのインスタンスを作成しますが、どちらにも名前を付けません。
これらのクラスは、1 回限りの使用に役立ちます。
最初から作成したり、既存のクラスから継承したり、インターフェイスを実装したりできます。
これらのクラスのインスタンスは、名前ではなく式で定義されるため、_匿名オブジェクト_ とも呼ばれます。

### 最初から匿名オブジェクトを作成する

オブジェクト式は、`object` キーワードで始まります。

オブジェクトがクラスを拡張したり、インターフェイスを実装したりしない場合は、`object` キーワードの後の波括弧内にオブジェクトのメンバーを直接定義できます。

```kotlin
fun main() {

    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // オブジェクト式は Any クラスを拡張します。Any クラスには toString() 関数がすでに存在するため、
        // オーバーライドする必要があります
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World

}
```

### スーパータイプから匿名オブジェクトを継承する

ある型 (または複数の型) から継承する匿名オブジェクトを作成するには、`object` の後、コロン `:` の後にこの型を指定します。
次に、[継承](inheritance)する場合と同じように、このクラスのメンバーを実装またはオーバーライドします。

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

スーパータイプにコンストラクターがある場合は、適切なコンストラクターパラメーターを渡します。
複数のスーパータイプは、コロンの後にコンマで区切って指定できます。

```kotlin

// balance プロパティを持つ open クラス BankAccount を作成します
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// execute() 関数を持つインターフェイス Transaction を定義します
interface Transaction {
    fun execute()
}

// BankAccount で特別なトランザクションを実行する関数
fun specialTransaction(account: BankAccount) {
    // BankAccount クラスから継承し、Transaction インターフェイスを実装する匿名オブジェクトを作成します
    // 提供されたアカウントの balance は、BankAccount スーパークラスコンストラクターに渡されます
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 一時ボーナス

        // Transaction インターフェイスから execute() 関数を実装します
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // トランザクションを実行します
    temporaryAccount.execute()
}

fun main() {
    // 初期残高 1000 の BankAccount を作成します
    val myAccount = BankAccount(1000)
    // 作成されたアカウントで特別なトランザクションを実行します
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```

### 匿名オブジェクトを戻り値と値の型として使用する

匿名オブジェクトをローカル関数または [`private`](visibility-modifiers#packages) 関数またはプロパティから返す場合、その匿名オブジェクトのすべてのメンバーは、その関数またはプロパティを介してアクセスできます。

```kotlin

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

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
    // Theme: Dark, Font Size: 14
}
```

これにより、特定のプロパティを持つ匿名オブジェクトを返すことができ、別のクラスを作成せずにデータまたは動作をカプセル化する簡単な方法を提供します。

匿名オブジェクトを返す関数またはプロパティに `public`、`protected`、または `internal` の可視性がある場合、その実際の型は次のようになります。

* 匿名オブジェクトに宣言されたスーパータイプがない場合は `Any`。
* 匿名オブジェクトの宣言されたスーパータイプが 1 つだけ存在する場合は、匿名オブジェクトの宣言されたスーパータイプ。
* 宣言されたスーパータイプが複数ある場合は、明示的に宣言された型。

これらのすべての場合において、匿名オブジェクトに追加されたメンバーはアクセスできません。オーバーライドされたメンバーは、関数またはプロパティの実際の型で宣言されている場合にアクセスできます。
例:

```kotlin

interface Notification {
    // Notification インターフェイスで notifyUser() を宣言します
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 戻り値の型は Any です。message プロパティはアクセスできません。
    // 戻り値の型が Any の場合、Any クラスのメンバーのみがアクセスできます。
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 戻り値の型は Notification です。匿名オブジェクトが 1 つのインターフェイスのみを実装するためです
    // notifyUser() 関数は、Notification インターフェイスの一部であるためアクセスできます
    // message プロパティは、Notification インターフェイスで宣言されていないためアクセスできません
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 戻り値の型は DetailedNotification です。notifyUser() 関数と message プロパティはアクセスできません
    // DetailedNotification インターフェイスで宣言されたメンバーのみがアクセスできます
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}

fun main() {
    // これは何も出力しません
    val notificationManager = NotificationManager()

    // 戻り値の型が Any であるため、message プロパティはここではアクセスできません
    // これは何も出力しません
    val notification = notificationManager.getNotification()

    // notifyUser() 関数はアクセス可能です
    // 戻り値の型が Notification であるため、message プロパティはここではアクセスできません
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // 戻り値の型が DetailedNotification であるため、notifyUser() 関数と message プロパティはここではアクセスできません
    // これは何も出力しません
    val detailedNotification = notificationManager.getDetailedNotification()
}
```

### 匿名オブジェクトから変数にアクセスする

オブジェクト式の本体内のコードは、囲んでいるスコープの変数にアクセスできます。

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter は、マウスイベント関数のデフォルトの実装を提供します
    // MouseAdapter がマウスイベントを処理するのをシミュレートします
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // clickCount 変数と enterCount 変数は、オブジェクト式内でアクセス可能です
}
```

## オブジェクト宣言とオブジェクト式の動作の違い

オブジェクト宣言とオブジェクト式では、初期化の動作に違いがあります。

* オブジェクト式は、使用されている場所で _すぐに_ 実行 (および初期化) されます。
* オブジェクト宣言は、最初にアクセスされたときに _遅延して_ 初期化されます。
* コンパニオンオブジェクトは、Java の静的イニシャライザーのセマンティクスに一致する対応するクラスがロード (解決) されるときに初期化されます。

  ```