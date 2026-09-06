[//]: # (title: オブジェクト)

<no-index/>

この章では、オブジェクト宣言について学習し、クラスへの理解を深めます。この知識は、プロジェクト全体で振る舞いを効率的に管理するのに役立ちます。

## オブジェクト宣言

Kotlinでは、**オブジェクト宣言（object declarations）**を使用して、単一のインスタンスを持つクラスを宣言できます。ある意味で、クラスを宣言すると同時に、その単一のインスタンスを生成していることになります。オブジェクト宣言は、プログラム全体で単一の参照ポイントとして使用するクラスを作成したり、システム全体の動作を調整したりする場合に役立ちます。

> 簡単にアクセスできるインスタンスを1つだけ持つクラスは、**シングルトン（singleton）**と呼ばれます。
>
{style="tip"}

Kotlinのオブジェクトは**遅延生成（lazy）**されます。つまり、最初にアクセスされたときにのみ作成されます。また、Kotlinはすべてのオブジェクトがスレッドセーフな方法で作成されることを保証するため、手動でチェックする必要はありません。

オブジェクト宣言を作成するには、`object`キーワードを使用します：

```kotlin
object DoAuth {}
```

`object`の名前の後に、波括弧 `{}` で定義されたオブジェクト本体の中にプロパティやメンバー関数を追加します。

> オブジェクトはコンストラクタを持つことができないため、クラスのようなヘッダーはありません。
>
{style="note"}

たとえば、認証を担当する `DoAuth` というオブジェクトを作成したいとします：

```kotlin
object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main(){
    // takeParams() 関数が呼び出されたときにオブジェクトが作成されます
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
    // input Auth parameters = coding_ninja:N1njaC0ding!
}
```
{kotlin-runnable="true" id="kotlin-tour-object-declarations"}

このオブジェクトには、`username` と `password` 変数をパラメータとして受け取り、文字列をコンソールに出力する `takeParams` というメンバー関数があります。`DoAuth` オブジェクトは、この関数が初めて呼び出されたときにのみ作成されます。

> オブジェクトはクラスやインターフェースを継承できます。例：
> 
> ```kotlin
> interface Auth {
>     fun takeParams(username: String, password: String)
> }
>
> object DoAuth : Auth {
>     override fun takeParams(username: String, password: String) {
>         println("input Auth parameters = $username:$password")
>     }
> }
> ```
>
{style="note"}

#### データオブジェクト

オブジェクト宣言の内容を簡単に表示（print）できるように、Kotlinには**データオブジェクト（data objects）**があります。初級ツアーで学んだデータクラスと同様に、データオブジェクトには `toString()` と `equals()` という追加のメンバー関数が自動的に付属します。

> データクラスとは異なり、データオブジェクトには `copy()` メンバー関数は自動的に付属しません。なぜなら、コピーできない単一のインスタンスしか持たないためです。
>
{type ="note"}

データオブジェクトを作成するには、オブジェクト宣言と同じ構文を使用しますが、前に `data` キーワードを付けます：

```kotlin
data object AppConfig {}
```

例：

```kotlin
data object AppConfig {
    var appName: String = "My Application"
    var version: String = "1.0.0"
}

fun main() {
    println(AppConfig)
    // AppConfig
    
    println(AppConfig.appName)
    // My Application
}
```
{kotlin-runnable="true" id="kotlin-tour-data-objects"}

データオブジェクトの詳細については、[](object-declarations.md#data-objects) を参照してください。

#### コンパニオンオブジェクト

Kotlinでは、クラスの中にオブジェクト、すなわち**コンパニオンオブジェクト（companion object）**を持たせることができます。コンパニオンオブジェクトは、1つのクラスにつき**1つ**だけ持つことができます。コンパニオンオブジェクトは、そのクラスが初めて参照されたときにのみ作成されます。

コンパニオンオブジェクト内で宣言されたプロパティや関数は、そのクラスのすべてのインスタンスで共有されます。

クラス内にコンパニオンオブジェクトを作成するには、オブジェクト宣言と同じ構文を使用しますが、前に `companion` キーワードを付けます：

```kotlin
companion object Bonger {}
```

> コンパニオンオブジェクトに名前を付ける必要はありません。名前を定義しない場合、デフォルトの名前は `Companion` になります。
> 
{style="note"}

コンパニオンオブジェクトのプロパティや関数にアクセスするには、クラス名を参照します。例：

```kotlin
class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG ") }
            }
        }
    }

fun main() {
    // クラスが初めて参照されたときに、コンパニオンオブジェクトが作成されます。
    BigBen.getBongs(12)
    // BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-companion-object"}

この例では、`Bonger` というコンパニオンオブジェクトを含む `BigBen` というクラスを作成しています。コンパニオンオブジェクトには `getBongs()` というメンバー関数があり、整数を受け取ってその回数分 `"BONG"` をコンソールに出力します。

`main()` 関数では、クラス名を参照することで `getBongs()` 関数が呼び出されています。この時点でコンパニオンオブジェクトが作成されます。`getBongs()` 関数は引数 `12` で呼び出されます。

詳細については、[](object-declarations.md#companion-objects) を参照してください。

## 練習問題 {completion-point="true"}

### 練習問題 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

あなたはコーヒーショップを経営しており、顧客の注文を追跡するシステムを持っています。以下のコードを検討し、`main()` 関数のコードが正常に実行されるように、2つ目のデータオブジェクトの宣言を完成させてください。

|---|---|

```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object // ここにコードを書いてください

fun main() {
    // 各データオブジェクトの名前を出力
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // 注文が同一かどうかをチェック
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-1"}

|---|---|
```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object OrderTwo: Order {
    override val orderId = "002"
    override val customerName = "Bob"
    override val orderTotal = 12.75
}

fun main() {
    // 各データオブジェクトの名前を出力
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // 注文が同一かどうかをチェック
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-objects-solution-1"}

### 練習問題 2 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-2"}

`Vehicle` インターフェースを継承するオブジェクト宣言を作成し、ユニークな乗り物タイプ `FlyingSkateboard` を作成してください。`main()` 関数のコードが正常に動作するように、オブジェクト内に `name` プロパティと `move()` 関数を実装してください。

|---|---|

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // ここにコードを書いてください

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-2"}

|---|---|
```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object FlyingSkateboard : Vehicle {
    override val name = "Flying Skateboard"
    override fun move() = "Glides through the air with a hover engine"

   fun fly(): String = "Woooooooo"
}

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-objects-solution-2"}

### 練習問題 3 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-3"}

アプリのユーザー登録モジュールを作成しています。メールアドレスのバリデーション（検証）を `User` クラスに関連付けたいと考えていますが、メールアドレスが無効な場合に不要な `User` インスタンスを作成したくありません。

この練習問題では、メールアドレスに `@` と `.` の両方が含まれている場合に有効であるとみなします。`main()` 関数のコードが正常に実行されるように、データクラスを完成させてください。

<deflist collapsible="true">
    <def title="ヒント">
        `User` クラスのコンパニオンオブジェクトにメールバリデーション関数を追加することで、`User` に対して直接関数を呼び出せるようにしてください。
    </def>
</deflist>

|---|---|
```kotlin
data class User(val name: String, val email: String) {
    // ここにコードを書いてください
}

fun main() {
    val candidates = listOf(
        Pair("Alice", "alice@example.com"),
        Pair("Bob", "bob2example-com")
    )

    for ((name, email) in candidates) {
        if (User.isValidEmail(email)) {
            val user = User(name, email)
            println("Registered: ${user.name}, ${user.email}")
            // Registered: Alice, alice@example.com
        } else {
            println("Error: '${email}' is not valid. The email should contain '@' and '.'")
            // Error: 'bob2example-com' is not valid. The email should contain '@' and '.'
        }
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-3"}

|---|---|
```kotlin
data class User(val name: String, val email: String) {
    companion object {
        fun isValidEmail(email: String): Boolean =
            email.contains('@') && email.contains('.')
    }
}

fun main() {
    val candidates = listOf(
        Pair("Alice", "alice@example.com"),
        Pair("Bob", "bob2example-com")
    )

    for ((name, email) in candidates) {
        if (User.isValidEmail(email)) {
            val user = User(name, email)
            println("Registered: ${user.name}, ${user.email}")
            // Registered: Alice, alice@example.com
        } else {
            println("Error: '${email}' is not valid. The email should contain '@' and '.'")
            // Error: 'bob2example-com' is not valid. The email should contain '@' and '.'
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-objects-solution-3"}

> この練習問題の発展として、コンパニオンオブジェクト内の関数を、クラスのインスタンスを構築するためのファクトリメソッドとして使用してみてください。このパターンの例と詳細については、[](object-declarations.md#companion-objects) を参照してください。
>
{style="tip"}

<seealso></seealso>

<list columns="2" id="tour-nav">
  <li>
    <a as="button" href="kotlin-tour-intermediate-classes-interfaces.md" mode="outline" icon="arrow-left" icon-position="left">前のステップ</a>
  </li>
  <li>
    <a as="button" href="kotlin-tour-intermediate-open-special-classes.md" mode="classic" icon="arrow-right" icon-position="right">次のステップ</a>
  </li>
</list>